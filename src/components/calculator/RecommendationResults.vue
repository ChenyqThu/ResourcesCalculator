<script setup lang="ts">
import type { ProductWithUsage, InputParams } from '@/types';
import { ref, watch } from 'vue';

const props = defineProps<{
  recommendedProducts: ProductWithUsage[];
  allProducts: ProductWithUsage[];
  params: InputParams;
}>();

// 选中的产品（默认选中第一个推荐产品）
const selectedProduct = ref<ProductWithUsage | null>(null);

// 监听推荐产品变化，自动选中第一个
watch(
  () => props.recommendedProducts,
  (newProducts) => {
    if (newProducts.length > 0) {
      // 如果没有选中或选中的不在列表中，选中第一个
      const isCurrentInList = selectedProduct.value
        ? newProducts.some(p => p.id === selectedProduct.value?.id)
        : false;

      if (!isCurrentInList) {
        selectedProduct.value = newProducts[0] || null;
      }
    } else {
      selectedProduct.value = null;
    }
  },
  { immediate: true }
);

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

// 获取存储类型描述
const getStorageTypeLabel = (type: string) => {
  switch (type) {
    case 'hdd': return 'HDD';
    case 'ssd': return 'SSD';
    case 'sd': return 'SD 卡';
    case 'none': return '无';
    default: return '-';
  }
};

// 选择产品
const selectProduct = (product: ProductWithUsage) => {
  selectedProduct.value = product;
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <h2 class="text-xl font-bold text-gray-900 mb-4">推荐结果</h2>

    <!-- 无推荐结果提示 -->
    <div v-if="recommendedProducts.length === 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
      <p class="text-yellow-800 font-medium">暂无推荐机型</p>
      <p class="text-sm text-yellow-600 mt-2">请调整您的需求配置</p>
    </div>

    <!-- 左右布局 -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：推荐列表 -->
      <div class="lg:col-span-1 space-y-2">
        <h3 class="text-sm font-semibold text-gray-700 mb-3">推荐机型列表</h3>
        <div class="space-y-2 max-h-[600px] overflow-y-auto">
          <button
            v-for="(product, index) in recommendedProducts"
            :key="product.id"
            @click="selectProduct(product)"
            :class="[
              'w-full text-left p-4 rounded-lg border-2 transition-all',
              selectedProduct?.id === product.id
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-start justify-between mb-2">
              <!-- 排名标识 -->
              <div
                class="flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs text-white mr-2 flex-shrink-0"
                :class="{
                  'bg-yellow-500': index === 0,
                  'bg-gray-400': index === 1,
                  'bg-orange-600': index === 2,
                  'bg-gray-300': index > 2
                }"
              >
                {{ index + 1 }}
              </div>

              <!-- 推荐标签 -->
              <div v-if="product.recommendationType" class="ml-auto">
                <span
                  :class="[
                    'px-2 py-0.5 text-xs font-bold rounded-full border',
                    getRecommendationLabel(product.recommendationType)?.class
                  ]"
                >
                  {{ getRecommendationLabel(product.recommendationType)?.text }}
                </span>
              </div>
            </div>

            <!-- 产品名称 -->
            <h4 class="font-semibold text-gray-900 text-sm mb-1">{{ product.name }}</h4>
            <p class="text-xs text-gray-500 mb-2">{{ product.series }}</p>

            <!-- 综合使用率 -->
            <div class="flex items-center space-x-2">
              <div class="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  :class="['h-full rounded-full transition-all', getProgressColor(product.overallUsage)]"
                  :style="{ width: `${Math.min(product.overallUsage, 100)}%` }"
                ></div>
              </div>
              <span class="text-xs font-semibold text-gray-700">{{ product.overallUsage.toFixed(0) }}%</span>
            </div>
          </button>
        </div>
      </div>

      <!-- 右侧：选中产品详情 -->
      <div v-if="selectedProduct" class="lg:col-span-2">
        <div class="bg-gray-50 rounded-lg p-6 border-2" :class="{
          'border-green-500': selectedProduct.recommendationType === 'recommended',
          'border-blue-400': selectedProduct.recommendationType === 'value',
          'border-purple-400': selectedProduct.recommendationType === 'advanced',
          'border-gray-300': !selectedProduct.recommendationType
        }">
          <!-- 产品标题 -->
          <div class="flex items-start justify-between mb-6">
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ selectedProduct.name }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ selectedProduct.series }}</p>
            </div>
            <!-- 推荐标签 -->
            <div v-if="selectedProduct.recommendationType">
              <span
                :class="[
                  'px-4 py-2 text-sm font-bold rounded-full border',
                  getRecommendationLabel(selectedProduct.recommendationType)?.class
                ]"
              >
                {{ getRecommendationLabel(selectedProduct.recommendationType)?.text }}
              </span>
            </div>
          </div>

          <!-- 硬件规格 -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-white rounded-lg p-4 border">
              <p class="text-xs text-gray-500 mb-1">CPU</p>
              <p class="text-lg font-bold text-gray-900">
                {{ (selectedProduct.cpu.capacity / 1000).toFixed(1) }}K DMIPS
              </p>
              <p class="text-xs text-gray-600 mt-1">{{ selectedProduct.cpu.cores }} cores</p>
              <p class="text-xs text-gray-500 mt-1">{{ selectedProduct.cpu.model }}</p>
            </div>

            <div class="bg-white rounded-lg p-4 border">
              <p class="text-xs text-gray-500 mb-1">Memory</p>
              <p class="text-lg font-bold text-gray-900">
                {{ (selectedProduct.memory.capacity / 1024).toFixed(1) }} GB
              </p>
            </div>
          </div>

          <!-- 管理规模 -->
          <div class="bg-white rounded-lg p-4 border mb-6">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">管理规模</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span class="text-gray-500">Clients:</span>
                <span class="ml-2 font-semibold text-gray-900">{{ selectedProduct.specifications.maxClients }}</span>
              </div>
              <div>
                <span class="text-gray-500">Devices:</span>
                <span class="ml-2 font-semibold text-gray-900">{{ selectedProduct.specifications.maxDevices }}</span>
              </div>
              <div v-if="selectedProduct.specifications.maxCameras">
                <span class="text-gray-500">Cameras:</span>
                <span class="ml-2 font-semibold text-gray-900">
                  {{ selectedProduct.specifications.maxCameras.hd }}*HD /
                  {{ selectedProduct.specifications.maxCameras['2k'] }}*2K /
                  {{ selectedProduct.specifications.maxCameras['4k'] }}*4K
                </span>
              </div>
            </div>
          </div>

          <!-- 存储配置 -->
          <div class="bg-white rounded-lg p-4 border mb-6">
            <h4 class="text-sm font-semibold text-gray-700 mb-3">存储配置</h4>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-500">存储类型:</span>
                <span class="ml-2 font-semibold text-gray-900">{{ getStorageTypeLabel(selectedProduct.storage.type) }}</span>
                <span v-if="selectedProduct.storage.slots" class="text-gray-500 ml-1">
                  ({{ selectedProduct.storage.slots }} 盘位)
                </span>
              </div>
              <div>
                <span class="text-gray-500">最大容量:</span>
                <span class="ml-2 font-semibold text-gray-900">
                  {{ selectedProduct.storage.maxCapacity > 0 ? (selectedProduct.storage.maxCapacity / 1024).toFixed(0) + ' TB' : '-' }}
                </span>
              </div>
            </div>

            <!-- 推荐硬盘大小（仅在启用 Guard 时显示） -->
            <div v-if="params.guardEnabled && selectedProduct.recommendedStorageSize" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-blue-900">根据您的需求，推荐硬盘:</span>
                <span class="text-xl font-bold text-blue-700">{{ selectedProduct.recommendedStorageSize }} TB</span>
              </div>
              <p v-if="selectedProduct.requiredStorageGB" class="text-xs text-blue-600 mt-1">
                需要 {{ (selectedProduct.requiredStorageGB / 1024).toFixed(2) }} TB ({{ selectedProduct.requiredStorageGB }} GB)
              </p>
            </div>
          </div>

          <!-- 资源占用情况 -->
          <div class="bg-white rounded-lg p-4 border mb-4">
            <h4 class="text-sm font-semibold text-gray-700 mb-4">资源占用情况</h4>

            <!-- CPU 使用率 -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">CPU 占用</span>
                <span class="text-sm font-semibold text-gray-900">{{ selectedProduct.cpuUsage.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  :class="['h-full rounded-full transition-all', getProgressColor(selectedProduct.cpuUsage)]"
                  :style="{ width: `${Math.min(selectedProduct.cpuUsage, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- Memory 使用率 -->
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">Memory 占用</span>
                <span class="text-sm font-semibold text-gray-900">{{ selectedProduct.memoryUsage.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-3">
                <div
                  :class="['h-full rounded-full transition-all', getProgressColor(selectedProduct.memoryUsage)]"
                  :style="{ width: `${Math.min(selectedProduct.memoryUsage, 100)}%` }"
                ></div>
              </div>
            </div>

            <!-- 综合使用率 -->
            <div class="pt-3 border-t">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700">综合使用率</span>
                <span class="text-xl font-bold text-gray-900">{{ selectedProduct.overallUsage.toFixed(1) }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div
                  :class="['h-full rounded-full transition-all', getProgressColor(selectedProduct.overallUsage)]"
                  :style="{ width: `${Math.min(selectedProduct.overallUsage, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 了解更多按钮 -->
          <a
            v-if="selectedProduct.storeUrl"
            :href="selectedProduct.storeUrl"
            target="_blank"
            class="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
          >
            了解更多 →
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
