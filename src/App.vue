<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCalculator } from './composables/useCalculator';
import { useRecommendation } from './composables/useRecommendation';
import { PRODUCTS } from './data/products';
import ModelSelector from './components/calculator/ModelSelector.vue';
import ResourceBars from './components/calculator/ResourceBars.vue';
import ApplicationCard from './components/calculator/ApplicationCard.vue';

// 使用计算器
const { params, result } = useCalculator();

// 使用推荐引擎
const { productsWithUsage, isOverloaded } = useRecommendation(result);

// 选中的产品
const selectedProductId = ref(PRODUCTS[1]?.id || PRODUCTS[0]?.id || 'fusion-g-plus'); // 默认选择 Fusion G+

// 应用启用状态
const controllerEnabled = ref(true);
const protectEnabled = ref(true);

// 获取选中产品的资源信息
const selectedProduct = computed(() => {
  const product = productsWithUsage.value.find(p => p.id === selectedProductId.value);
  return product || productsWithUsage.value[0];
});

// 资源条数据
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
    {
      label: 'Storage',
      used: 0, // V2 功能
      capacity: product.storage.capacity * 1024, // 转换为 MB
      usage: 0,
      unit: 'MB',
    },
  ];
});

// 监听启用状态，自动重置对应的参数
watch(controllerEnabled, (enabled) => {
  if (!enabled) {
    params.value.apCount = 0;
    params.value.switchCount = 0;
  }
});

watch(protectEnabled, (enabled) => {
  if (!enabled) {
    params.value.ipcCount = 0;
    params.value.enableAI = false;
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
          <!-- Omada Controller -->
          <ApplicationCard
            id="controller"
            title="Omada Controller"
            :enabled="controllerEnabled"
            @update:enabled="controllerEnabled = $event"
          >
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">
                  Network Devices (AP + Switch)
                </label>
                <input
                  type="number"
                  v-model.number="params.apCount"
                  min="0"
                  max="500"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0"
                />
                <p class="text-xs text-gray-500 mt-1">Total number of access points and switches</p>
              </div>
            </div>
          </ApplicationCard>

          <!-- Protect (Security) -->
          <ApplicationCard
            id="protect"
            title="Protect (Security)"
            :enabled="protectEnabled"
            @update:enabled="protectEnabled = $event"
          >
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-700 mb-1 block">
                  IP Cameras
                </label>
                <input
                  type="number"
                  v-model.number="params.ipcCount"
                  min="0"
                  max="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0"
                />
              </div>

              <div v-if="params.ipcCount > 0">
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

              <div v-if="params.ipcCount > 0" class="pt-2 border-t">
                <label class="flex items-center space-x-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    v-model="params.enableAI"
                    class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span class="text-sm font-medium">Enable AI Features</span>
                </label>

                <div v-if="params.enableAI" class="ml-6 space-y-2">
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="aiMode"
                      value="detection"
                      :checked="params.aiMode === 'detection'"
                      @change="params.aiMode = 'detection'"
                      class="h-4 w-4 text-primary"
                    />
                    <span class="text-sm">人形车形检测</span>
                  </label>
                  <label class="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="aiMode"
                      value="peopleCount"
                      :checked="params.aiMode === 'peopleCount'"
                      @change="params.aiMode = 'peopleCount'"
                      class="h-4 w-4 text-primary"
                    />
                    <span class="text-sm">People Count</span>
                  </label>
                </div>
              </div>
            </div>
          </ApplicationCard>
        </div>

        <!-- Gateway Features -->
        <div class="mt-6 bg-white p-6 rounded-lg border">
          <h3 class="font-semibold text-lg mb-4">Gateway Features</h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
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
