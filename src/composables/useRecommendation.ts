import { computed, type ComputedRef, type Ref } from 'vue';
import type { CalculationResult, ProductWithUsage, ResourceStatus, InputParams } from '@/types';
import { PRODUCTS } from '@/data/products';
import { USAGE_THRESHOLDS, RECOMMENDATION_RANGES } from '@/data/constants';
import { calculateUsagePercentage, calculateRecommendedStorage } from '@/utils/calculator';

/**
 * 产品推荐引擎 Composable
 * 根据计算结果推荐合适的产品型号
 */
export function useRecommendation(
  result: ComputedRef<CalculationResult>,
  params: Ref<InputParams>
) {
  /**
   * 判断资源使用状态
   */
  const getResourceStatus = (usage: number): ResourceStatus => {
    if (usage < USAGE_THRESHOLDS.LOW) return 'low';
    if (usage < USAGE_THRESHOLDS.OPTIMAL) return 'optimal';
    if (usage < USAGE_THRESHOLDS.HIGH) return 'high';
    return 'overload';
  };

  /**
   * 检查产品是否超过规格限制
   */
  const checkSpecificationLimits = (product: typeof PRODUCTS[0], params: InputParams): boolean => {
    // 检查 Clients 数量
    if (params.clientsCount > product.specifications.maxClients) {
      return false;
    }

    // 检查设备数量 (AP + Switch)
    const totalDevices = params.apCount + params.switchCount;
    if (totalDevices > product.specifications.maxDevices) {
      return false;
    }

    // 如果需要 Guard 功能
    if (params.guardEnabled) {
      // 检查产品是否支持 Guard
      if (product.supportedServices === 'network') {
        return false; // 纯网络产品不支持 Guard
      }

      // 检查摄像头数量限制
      if (product.specifications.maxCameras) {
        // 检查各类型摄像头是否超限
        if (params.hdCameras > product.specifications.maxCameras.hd) return false;
        if (params['2kCameras'] > product.specifications.maxCameras['2k']) return false;
        if (params['4kCameras'] > product.specifications.maxCameras['4k']) return false;
      }
    }

    return true;
  };

  /**
   * 计算所有产品的资源使用情况
   */
  const productsWithUsage = computed<ProductWithUsage[]>(() => {
    // 计算推荐的硬盘大小（仅在启用 Guard 时）
    const storageRecommendation = params.value.guardEnabled
      ? calculateRecommendedStorage(params.value)
      : { recommendedSize: 1 as const, requiredGB: 0 };

    return PRODUCTS.map((product) => {
      const cpuUsage = calculateUsagePercentage(
        result.value.total.cpu,
        product.cpu.capacity
      );
      const memoryUsage = calculateUsagePercentage(
        result.value.total.memory,
        product.memory.capacity
      );

      // 综合使用率（取 CPU 和内存的最大值）
      let overallUsage = Math.max(cpuUsage, memoryUsage);

      // 检查规格限制
      const meetsSpecifications = checkSpecificationLimits(product, params.value);

      // 如果不满足规格限制，大幅降低推荐度
      if (!meetsSpecifications) {
        overallUsage = 150; // 设置为超载状态
      }

      // 状态判断
      const status = getResourceStatus(overallUsage);

      // 推荐类型判断
      let recommendationType: ProductWithUsage['recommendationType'];

      if (meetsSpecifications && status !== 'overload') {
        // 如果不需要 Guard，优先推荐 network-only 产品
        const isPreferred = !params.value.guardEnabled && product.supportedServices === 'network';

        if (
          overallUsage >= RECOMMENDATION_RANGES.RECOMMENDED.min &&
          overallUsage <= RECOMMENDATION_RANGES.RECOMMENDED.max
        ) {
          recommendationType = 'recommended';
        } else if (
          overallUsage >= RECOMMENDATION_RANGES.VALUE.min &&
          overallUsage < RECOMMENDATION_RANGES.VALUE.max
        ) {
          recommendationType = 'value';
        } else if (overallUsage < RECOMMENDATION_RANGES.ADVANCED.max && status === 'low') {
          recommendationType = 'advanced';
        }

        // 如果是 network-only 且不需要 Guard，提升推荐优先级
        if (isPreferred && recommendationType) {
          // 保持原有推荐类型，但在排序时会优先
        }
      }

      return {
        ...product,
        cpuUsage,
        memoryUsage,
        overallUsage,
        status,
        recommendationType,
        recommendedStorageSize: params.value.guardEnabled ? storageRecommendation.recommendedSize : undefined,
        requiredStorageGB: params.value.guardEnabled ? storageRecommendation.requiredGB : undefined,
      };
    });
  });

  /**
   * 推荐的产品列表（已过滤和排序）
   * 排序规则：
   * 1. 如果不需要 Guard，network-only 产品优先
   * 2. 按推荐类型：recommended > value > advanced
   * 3. 同类型内按综合使用率排序（从高到低，越接近最佳使用率越好）
   */
  const recommendedProducts = computed(() => {
    const filtered = productsWithUsage.value.filter(
      (p) => p.recommendationType !== undefined
    );

    // 定义推荐类型优先级
    const typeOrder: Record<string, number> = {
      recommended: 1,  // 最推荐
      value: 2,        // 性价比
      advanced: 3,     // 高性能
    };

    return filtered.sort((a, b) => {
      // 如果不需要 Guard，优先推荐 network-only 产品
      if (!params.value.guardEnabled) {
        const aIsNetworkOnly = a.supportedServices === 'network';
        const bIsNetworkOnly = b.supportedServices === 'network';

        if (aIsNetworkOnly && !bIsNetworkOnly) return -1;
        if (!aIsNetworkOnly && bIsNetworkOnly) return 1;
      }

      // 首先按推荐类型排序
      const typeA = typeOrder[a.recommendationType || ''] || 999;
      const typeB = typeOrder[b.recommendationType || ''] || 999;

      if (typeA !== typeB) {
        return typeA - typeB;
      }

      // 同类型内按使用率排序
      // recommended 类型：越接近 80% 越好
      if (a.recommendationType === 'recommended') {
        const idealUsage = 80;
        return Math.abs(b.overallUsage - idealUsage) - Math.abs(a.overallUsage - idealUsage);
      }

      // value 类型：使用率从高到低（越接近 75% 越好）
      if (a.recommendationType === 'value') {
        return b.overallUsage - a.overallUsage;
      }

      // advanced 类型：使用率从低到高（留有更多余量）
      return a.overallUsage - b.overallUsage;
    });
  });

  /**
   * 最佳推荐产品（推荐型号中的第一个）
   */
  const bestRecommendation = computed(() => {
    return recommendedProducts.value.find((p) => p.recommendationType === 'recommended');
  });

  /**
   * 是否有任何产品满足需求
   */
  const hasValidProducts = computed(() => {
    return productsWithUsage.value.some((p) => p.status !== 'overload');
  });

  /**
   * 是否所有产品都超载
   */
  const isOverloaded = computed(() => {
    return productsWithUsage.value.every((p) => p.status === 'overload');
  });

  /**
   * 是否配置过低（所有产品使用率都低于30%）
   */
  const isUnderUtilized = computed(() => {
    return productsWithUsage.value.every((p) => p.overallUsage < 30);
  });

  return {
    productsWithUsage,
    recommendedProducts,
    bestRecommendation,
    hasValidProducts,
    isOverloaded,
    isUnderUtilized,
  };
}
