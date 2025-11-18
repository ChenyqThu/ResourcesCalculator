<script setup lang="ts">
import type { InputParams } from '@/types';
import { computed } from 'vue';

const props = defineProps<{
  params: InputParams;
}>();

const emit = defineEmits<{
  'update:params': [value: InputParams];
}>();

const updateParam = <K extends keyof InputParams>(key: K, value: InputParams[K]) => {
  emit('update:params', { ...props.params, [key]: value });
};

// 计算摄像头总数
const totalCameras = computed(() =>
  props.params.hdCameras + props.params['2kCameras'] + props.params['4kCameras']
);

// Guard 启用状态
const guardEnabled = computed(() => totalCameras.value > 0);
</script>

<template>
  <div class="space-y-6">
    <!-- 网络部分 -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">网络设备</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Switch 数量 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Switch 数量
          </label>
          <input
            type="number"
            :value="params.switchCount"
            @input="updateParam('switchCount', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="1000"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <!-- AP 数量 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            AP 数量
          </label>
          <input
            type="number"
            :value="params.apCount"
            @input="updateParam('apCount', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="500"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <!-- Clients 数量 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Clients 数量
          </label>
          <input
            type="number"
            :value="params.clientsCount"
            @input="updateParam('clientsCount', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="10000"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <!-- Gateway Features -->
      <div class="mt-4 pt-4 border-t">
        <h4 class="text-sm font-semibold text-gray-700 mb-3">Gateway 功能</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="params.enableIPS"
              @change="updateParam('enableIPS', ($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span class="text-sm">IPS <span class="text-xs text-orange-500">⚠️</span></span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="params.enableDPI"
              @change="updateParam('enableDPI', ($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span class="text-sm">DPI</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="params.enableContentFilter"
              @change="updateParam('enableContentFilter', ($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span class="text-sm">Content Filter</span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="params.enableVPN"
              @change="updateParam('enableVPN', ($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span class="text-sm">VPN <span class="text-xs text-orange-500">⚠️</span></span>
          </label>
          <label class="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              :checked="params.enableQoS"
              @change="updateParam('enableQoS', ($event.target as HTMLInputElement).checked)"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span class="text-sm">QoS <span class="text-xs text-orange-500">⚠️</span></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Guard 部分 -->
    <div class="bg-white rounded-lg shadow-sm border p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Guard (安防)</h3>

      <!-- Camera 数量 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            HD Cameras
          </label>
          <input
            type="number"
            :value="params.hdCameras"
            @input="updateParam('hdCameras', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            2K Cameras
          </label>
          <input
            type="number"
            :value="params['2kCameras']"
            @input="updateParam('2kCameras', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            4K Cameras
          </label>
          <input
            type="number"
            :value="params['4kCameras']"
            @input="updateParam('4kCameras', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="100"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <!-- Guard 相关配置（仅在有 Camera 时显示） -->
      <template v-if="guardEnabled">
        <!-- 存储时长 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">期望保存时长</label>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              v-for="duration in ([7, 14, 30, 90, 180] as const)"
              :key="duration"
              @click="updateParam('storageDuration', duration)"
              :class="[
                'px-4 py-2.5 text-sm font-bold rounded-md transition-colors border-2',
                params.storageDuration === duration
                  ? 'bg-[#00B050] border-[#00B050] text-white shadow-md'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              ]"
            >
              {{ duration === 7 ? '1周' : duration === 14 ? '2周' : duration === 30 ? '1月' : duration === 90 ? '3月' : '6月' }}
            </button>
          </div>
        </div>

        <!-- NVR Type -->
        <div class="mb-4 pt-4 border-t">
          <label class="block text-sm font-medium text-gray-700 mb-2">NVR 类型</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="nvrType"
                value="builtin"
                :checked="params.nvrType === 'builtin'"
                @change="updateParam('nvrType', 'builtin')"
                class="h-4 w-4 text-primary focus:ring-primary"
              />
              <span class="text-sm">内置 NVR</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="nvrType"
                value="external"
                :checked="params.nvrType === 'external'"
                @change="updateParam('nvrType', 'external')"
                class="h-4 w-4 text-primary focus:ring-primary"
              />
              <span class="text-sm">外置 NVR</span>
            </label>
          </div>
        </div>

        <!-- AI Features -->
        <div class="pt-4 border-t">
          <h4 class="text-sm font-semibold text-gray-700 mb-3">AI 功能</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="params.enableAIDetection"
                @change="updateParam('enableAIDetection', ($event.target as HTMLInputElement).checked)"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span class="text-sm">人形车形检测</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                :checked="params.enablePeopleCount"
                @change="updateParam('enablePeopleCount', ($event.target as HTMLInputElement).checked)"
                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span class="text-sm">People Count</span>
            </label>
          </div>
        </div>
      </template>

      <!-- 未启用 Guard 的提示 -->
      <div v-else class="text-center py-8 text-gray-500">
        <p class="text-sm">请输入摄像头数量以启用 Guard 功能</p>
      </div>
    </div>
  </div>
</template>
