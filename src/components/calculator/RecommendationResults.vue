<script setup lang="ts">
import type { ProductWithUsage } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
  recommendedProducts: ProductWithUsage[];
  allProducts: ProductWithUsage[];
}>();

// 推荐产品按综合使用率排序（已在 useRecommendation 中排序）
const sortedRecommendations = computed(() => props.recommendedProducts);

// 获取状态颜色
const getStatusColor = (status: string) => {
  switch (status) {
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'optimal':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'overload':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// 获取推荐类型标签
const getRecommendationLabel = (type?: string) => {
  switch (type) {
    case 'recommended':
      return { text: '推荐', class: 'bg-green-100 text-green-700 border-green-300' };
    case 'value':
      return { text: '性价比', class: 'bg-blue-100 text-blue-700 border-blue-300' };
    case 'advanced':
      return { text: '高性能', class: 'bg-purple-100 text-purple-700 border-purple-300' };
    default:
      return null;
  }
};

// 获取进度条颜色
const getProgressColor = (usage: number) => {
  if (usage < 60) return 'bg-green-500';
  if (usage < 80) return 'bg-yellow-500';
  if (usage < 90) return 'bg-orange-500';
  return 'bg-red-500';
};
</script>

<template>
  <div class="space-y-4">
    <!-- 推荐结果标题 -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900">推荐机型</h2>
      <span class="text-sm text-gray-500">{{ sortedRecommendations.length }} 个推荐</span>
    </div>

    <!-- 无推荐结果提示 -->
    <div v-if="sortedRecommendations.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <p class="text-yellow-800 font-medium">暂无推荐机型</p>
      <p class="text-sm text-yellow-600 mt-2">请调整您的需求配置</p>
    </div>

    <!-- 推荐产品列表（左右布局） -->
    <div v-else class="space-y-4">
      <div
        v-for="(product, index) in sortedRecommendations"
        :key="product.id"
        class="bg-white rounded-lg shadow-md border-2 transition-shadow hover:shadow-lg"
        :class="{
          'border-green-500': product.recommendationType === 'recommended',
          'border-blue-400': product.recommendationType === 'value',
          'border-purple-400': product.recommendationType === 'advanced',
          'border-gray-300': !product.recommendationType
        }"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          <!-- 左侧：产品信息 -->
          <div class="space-y-3">
            <!-- 推荐排名 -->
            <div class="flex items-start justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-full font-bold text-white"
                  :class="{
                    'bg-yellow-500': index === 0,
                    'bg-gray-400': index === 1,
                    'bg-orange-600': index === 2,
                    'bg-gray-300': index > 2
                  }"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ product.name }}</h3>
                  <p class="text-sm text-gray-500">{{ product.series }}</p>
                </div>
              </div>

              <!-- 推荐标签 -->
              <div v-if="product.recommendationType">
                <span
                  :class="[
                    'px-3 py-1 text-xs font-bold rounded-full border',
                    getRecommendationLabel(product.recommendationType)?.class
                  ]"
                >
                  {{ getRecommendationLabel(product.recommendationType)?.text }}
                </span>
              </div>
            </div>

            <!-- 产品规格 -->
            <div class="grid grid-cols-2 gap-3 pt-3 border-t">
              <div class="bg-gray-50 rounded-md p-3">
                <p class="text-xs text-gray-500 mb-1">CPU</p>
                <p class="text-sm font-semibold text-gray-900">
                  {{ (product.cpu.capacity / 1000).toFixed(1) }}K DMIPS
                </p>
                <p class="text-xs text-gray-500">{{ product.cpu.cores }} cores</p>
              </div>
              <div class="bg-gray-50 rounded-md p-3">
                <p class="text-xs text-gray-500 mb-1">Memory</p>
                <p class="text-sm font-semibold text-gray-900">
                  {{ (product.memory.capacity / 1024).toFixed(1) }} GB
                </p>
              </div>
            </div>

            <!-- 推荐硬盘大小 -->
            <div v-if="product.recommendedStorageSize" class="bg-blue-50 border border-blue-200 rounded-md p-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-blue-900">推荐硬盘大小</span>
                <span class="text-lg font-bold text-blue-700">{{ product.recommendedStorageSize }} TB</span>
              </div>
              <p v-if="product.requiredStorageGB" class="text-xs text-blue-600 mt-1">
                需要 {{ (product.requiredStorageGB / 1024).toFixed(2) }} TB ({{ product.requiredStorageGB }} GB)
              </p>
            </div>

            <!-- 了解更多按钮 -->
            <a
              v-if="product.storeUrl"
              :href="product.storeUrl"
              target="_blank"
              class="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
            >
              了解更多 →
            </a>
          </div>

          <!-- 右侧：资源占用情况 -->
          <div class="space-y-4">
            <h4 class="text-sm font-semibold text-gray-700">资源占用情况</h4>

            <!-- CPU 使用率 -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">CPU 占用</span>
                <span class="text-sm font-semibold text-gray-900">{{ product.cpuUsage.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all', getProgressColor(product.cpuUsage)]"
                  :style="{ width: `${Math.min(product.cpuUsage, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Memory 使用率 -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Memory 占用</span>
                <span class="text-sm font-semibold text-gray-900">{{ product.memoryUsage.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all', getProgressColor(product.memoryUsage)]"
                  :style="{ width: `${Math.min(product.memoryUsage, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- 综合使用率 -->
            <div class="pt-3 border-t">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">综合使用率</span>
                <span class="text-lg font-bold text-gray-900">{{ product.overallUsage.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  :class="['h-full rounded-full transition-all', getProgressColor(product.overallUsage)]"
                  :style="{ width: `${Math.min(product.overallUsage, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- 状态标签 -->
            <div class="pt-3">
              <span
                :class="[
                  'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border',
                  getStatusColor(product.status)
                ]"
              >
                状态:
                {{
                  product.status === 'low' ? '低负载' :
                  product.status === 'optimal' ? '适中' :
                  product.status === 'high' ? '较高' :
                  '超载'
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
