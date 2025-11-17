import { computed, type ComputedRef } from 'vue';
import type { CalculationResult, ProductWithUsage, ResourceStatus } from '@/types';
import { PRODUCTS } from '@/data/products';
import { USAGE_THRESHOLDS, RECOMMENDATION_RANGES } from '@/data/constants';
import { calculateUsagePercentage } from '@/utils/calculator';

/**
 * 产品推荐引擎 Composable
 * 根据计算结果推荐合适的产品型号
 */
export function useRecommendation(result: ComputedRef<CalculationResult>) {
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
      };
    });
  });

  /**
   * 推荐的产品列表（已过滤和排序）
   */
  const recommendedProducts = computed(() => {
    const filtered = productsWithUsage.value.filter(
      (p) => p.recommendationType !== undefined
    );

    // 按使用率排序（从低到高）
    return filtered.sort((a, b) => a.overallUsage - b.overallUsage);
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
