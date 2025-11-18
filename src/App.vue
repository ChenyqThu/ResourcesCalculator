<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCalculator } from './composables/useCalculator';
import { useRecommendation } from './composables/useRecommendation';
import { calculateStorageDays } from './utils/calculator';
import { PRODUCTS } from './data/products';
import ModelSelector from './components/calculator/ModelSelector.vue';
import ResourceBars from './components/calculator/ResourceBars.vue';
import ApplicationCard from './components/calculator/ApplicationCard.vue';

// 使用计算器
const { params, result } = useCalculator();

// 使用推荐引擎
const { productsWithUsage, isOverloaded } = useRecommendation(result);

// 选中的产品（默认选择第一个）
const selectedProductId = ref(PRODUCTS[0]?.id || 'small-wired-2.5g-max');

// 当前选中机型的配置上限
const currentProductLimits = computed(() => {
  const product = PRODUCTS.find(p => p.id === selectedProductId.value);
  return {
    maxAPs: product?.specifications?.maxAPs || 500,
    maxCameras: product?.specifications?.maxCameras || 100,
  };
});

// 应用启用状态
const networkEnabled = ref(true);
const guardEnabled = ref(true);

// 计算存储天数
const storageDays = computed(() => calculateStorageDays(params.value));

// 获取选中产品的资源信息
const selectedProduct = computed(() => {
  const product = productsWithUsage.value.find(p => p.id === selectedProductId.value);
  return product || productsWithUsage.value[0];
});

// 资源条数据（移除 Storage，只保留 CPU 和 Memory）
const resourceBars = computed(() => {
  const product = selectedProduct.value;
  if (!product) {
    return [];
  }
  return [
    {
      label: 'CPU',
      used: result.value.total.cpu,
      capacity: product.cpu.capacity,
      usage: product.cpuUsage,
      unit: 'DMIPS',
    },
    {
      label: 'Memory',
      used: result.value.total.memory,
      capacity: product.memory.capacity,
      usage: product.memoryUsage,
      unit: 'MB',
    },
  ];
});

// 监听启用状态，自动重置对应的参数
watch(networkEnabled, (enabled) => {
  if (!enabled) {
    params.value.apCount = 0;
    params.value.switchCount = 0;
    params.value.enableIPS = false;
    params.value.enableDPI = false;
    params.value.enableContentFilter = false;
    params.value.enableVPN = false;
    params.value.enableQoS = false;
  }
});

watch(guardEnabled, (enabled) => {
  if (!enabled) {
    params.value.hdCameras = 0;
    params.value['2kCameras'] = 0;
    params.value['4kCameras'] = 0;
    params.value.enableAIDetection = false;
    params.value.enablePeopleCount = false;
  }
});

// 监听机型切换，自动调整超出上限的参数
watch(currentProductLimits, (limits) => {
  if (params.value.apCount > limits.maxAPs) {
    params.value.apCount = limits.maxAPs;
  }
  if (params.value.hdCameras > limits.maxCameras) {
    params.value.hdCameras = limits.maxCameras;
  }
  if (params.value['2kCameras'] > limits.maxCameras) {
    params.value['2kCameras'] = limits.maxCameras;
  }
  if (params.value['4kCameras'] > limits.maxCameras) {
    params.value['4kCameras'] = limits.maxCameras;
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Omada AIO Resource Calculator</h1>
            <p class="text-sm text-gray-500 mt-1">智能计算资源需求，选择合适的一体机型号</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-6 space-y-6">
      <!-- Model Selector -->
      <section>
        <h2 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Select Model
        </h2>
        <ModelSelector :selectedId="selectedProductId" @select="selectedProductId = $event" />
      </section>

      <!-- Resource Bars -->
      <section>
        <h2 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Resource Usage
        </h2>
        <ResourceBars :resources="resourceBars" />
      </section>

      <!-- Applications & Settings -->
      <section>
        <h2 class="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Applications & Settings
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Network (原 Omada Controller) -->
          <ApplicationCard
            id="network"
            title="Network"
            :enabled="networkEnabled"
            :disableToggle="true"
            @update:enabled="networkEnabled = $event"
          >
            <div class="space-y-4">
              <!-- 网络设备 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-700">
                    Access Points
                  </label>
                  <span class="text-sm font-semibold text-gray-900">{{ params.apCount }} / {{ currentProductLimits.maxAPs }}</span>
                </div>
                <input
                  type="range"
                  v-model.number="params.apCount"
                  min="0"
                  :max="currentProductLimits.maxAPs"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <!-- Gateway Features -->
              <div class="pt-3 border-t">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Gateway Features</h4>
                <div class="grid grid-cols-1 gap-2">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="params.enableIPS"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">IPS <span class="text-xs text-orange-500">⚠️</span></span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="params.enableDPI"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">DPI</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="params.enableContentFilter"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">Content Filter</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="params.enableVPN"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">VPN <span class="text-xs text-orange-500">⚠️</span></span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="params.enableQoS"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">QoS <span class="text-xs text-orange-500">⚠️</span></span>
                  </label>
                </div>
              </div>
            </div>
          </ApplicationCard>

          <!-- Guard (原 Protect) -->
          <ApplicationCard
            id="guard"
            title="Guard"
            :enabled="guardEnabled"
            @update:enabled="guardEnabled = $event"
          >
            <div class="space-y-3">
              <!-- 摄像头配置 -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-700">
                    HD Cameras
                  </label>
                  <span class="text-sm font-semibold text-gray-900">{{ params.hdCameras }} / {{ currentProductLimits.maxCameras }}</span>
                </div>
                <input
                  type="range"
                  v-model.number="params.hdCameras"
                  min="0"
                  :max="currentProductLimits.maxCameras"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-700">
                    2K Cameras
                  </label>
                  <span class="text-sm font-semibold text-gray-900">{{ params['2kCameras'] }} / {{ currentProductLimits.maxCameras }}</span>
                </div>
                <input
                  type="range"
                  v-model.number="params['2kCameras']"
                  min="0"
                  :max="currentProductLimits.maxCameras"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="text-sm font-medium text-gray-700">
                    4K Cameras
                  </label>
                  <span class="text-sm font-semibold text-gray-900">{{ params['4kCameras'] }} / {{ currentProductLimits.maxCameras }}</span>
                </div>
                <input
                  type="range"
                  v-model.number="params['4kCameras']"
                  min="0"
                  :max="currentProductLimits.maxCameras"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <!-- Storage Drive Size -->
              <div>
                <label class="text-sm font-medium text-gray-700 mb-2 block">Storage Drive Size</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="size in [1, 8, 16, 28]"
                    :key="size"
                    @click="params.storageDriveSize = size"
                    :class="[
                      'px-4 py-2.5 text-sm font-bold rounded-md transition-colors border-2',
                      params.storageDriveSize === size
                        ? 'bg-[#00B050] border-[#00B050] text-white shadow-md'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                    ]"
                  >
                    {{ size }}TB
                  </button>
                </div>
              </div>

              <!-- 存储天数显示 -->
              <div v-if="storageDays > 0" class="bg-gray-50 rounded-md p-3">
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Days:</span>
                  <span class="ml-2 text-lg font-semibold text-gray-900">{{ storageDays }}</span>
                </div>
              </div>

              <!-- NVR Type -->
              <div v-if="params.hdCameras + params['2kCameras'] + params['4kCameras'] > 0" class="pt-2 border-t">
                <label class="text-sm font-medium text-gray-700 mb-2 block">NVR Type</label>
                <div class="flex space-x-4">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="nvrType"
                      value="builtin"
                      :checked="params.nvrType === 'builtin'"
                      @change="params.nvrType = 'builtin'"
                      class="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">Built-in NVR</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="nvrType"
                      value="external"
                      :checked="params.nvrType === 'external'"
                      @change="params.nvrType = 'external'"
                      class="h-4 w-4 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">External NVR</span>
                  </label>
                </div>
              </div>

              <!-- AI Features -->
              <div v-if="params.hdCameras + params['2kCameras'] + params['4kCameras'] > 0" class="pt-2 border-t">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">AI Features</h4>
                <div class="space-y-2">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="params.enableAIDetection"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">人形车形检测</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="params.enablePeopleCount"
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="text-sm">People Count</span>
                  </label>
                </div>
              </div>
            </div>
          </ApplicationCard>
        </div>
      </section>

      <!-- Warning Messages -->
      <section v-if="isOverloaded" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-sm text-red-800">
          <strong>⚠️ Warning:</strong> The selected model does not have sufficient resources for your configuration.
          Please select a higher-tier model or reduce your requirements.
        </p>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-8">
      <div class="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
        <p>© 2025 TP-Link Systems Inc. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
