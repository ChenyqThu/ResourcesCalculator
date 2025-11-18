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
   * 计算所有产品的资源使用情况
   */
  const productsWithUsage = computed<ProductWithUsage[]>(() => {
    // 计算推荐的硬盘大小
    const storageRecommendation = calculateRecommendedStorage(params.value);

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
      const overallUsage = Math.max(cpuUsage, memoryUsage);

      // 状态判断
      const status = getResourceStatus(overallUsage);

      // 推荐类型判断
      let recommendationType: ProductWithUsage['recommendationType'];
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

      return {
        ...product,
        cpuUsage,
        memoryUsage,
        overallUsage,
        status,
        recommendationType,
        recommendedStorageSize: storageRecommendation.recommendedSize,
        requiredStorageGB: storageRecommendation.requiredGB,
      };
    });
  });

  /**
   * 推荐的产品列表（已过滤和排序）
   * 排序规则：
   * 1. 优先按推荐类型：recommended > value > advanced
   * 2. 同类型内按综合使用率排序（从高到低，越接近最佳使用率越好）
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
