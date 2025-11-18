<script setup lang="ts">
import type { InputParams } from '@/types';
import { computed } from 'vue';
import ApplicationCard from './ApplicationCard.vue';

const props = defineProps<{
  params: InputParams;
}>();

const emit = defineEmits<{
  'update:params': [value: InputParams];
}>();

const updateParam = <K extends keyof InputParams>(key: K, value: InputParams[K]) => {
  emit('update:params', { ...props.params, [key]: value });
};

// 格式化显示函数
const formatSwitchCount = (value: number) => {
  if (value >= 5) return '5+';
  return value.toString();
};

const formatAPCount = (value: number) => {
  if (value >= 30) return '30+';
  return value.toString();
};

const formatClientsCount = (value: number) => {
  if (value >= 500) return '500+';
  return value.toString();
};

// Network 启用状态（总是启用）
const networkEnabled = computed({
  get: () => true,
  set: () => {} // Network 不可禁用
});

// Guard 启用状态
const guardEnabled = computed({
  get: () => props.params.guardEnabled,
  set: (value: boolean) => {
    // 如果禁用 Guard，一次性清空所有相关参数
    if (!value) {
      emit('update:params', {
        ...props.params,
        guardEnabled: false,
        hdCameras: 0,
        '2kCameras': 0,
        '4kCameras': 0,
        enableAIDetection: false,
        enablePeopleCount: false,
      });
    } else {
      updateParam('guardEnabled', value);
    }
  }
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Network 卡片 -->
    <ApplicationCard
      id="network"
      title="Network"
      :enabled="networkEnabled"
      :disableToggle="true"
      @update:enabled="networkEnabled = $event"
    >
      <div class="space-y-4">
        <!-- Switch 数量 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">Switch 数量</label>
            <span class="text-sm font-semibold text-gray-900">{{ formatSwitchCount(params.switchCount) }}</span>
          </div>
          <input
            type="range"
            :value="params.switchCount"
            @input="updateParam('switchCount', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="6"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- AP 数量 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">AP 数量</label>
            <span class="text-sm font-semibold text-gray-900">{{ formatAPCount(params.apCount) }}</span>
          </div>
          <input
            type="range"
            :value="params.apCount"
            @input="updateParam('apCount', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="31"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- Clients 数量 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">Clients 数量</label>
            <span class="text-sm font-semibold text-gray-900">{{ formatClientsCount(params.clientsCount) }}</span>
          </div>
          <input
            type="range"
            :value="params.clientsCount"
            @input="updateParam('clientsCount', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="510"
            step="10"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- Gateway 功能 -->
        <div class="pt-3 border-t">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Gateway 功能</h4>
          <div class="grid grid-cols-1 gap-2">
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
    </ApplicationCard>

    <!-- Guard 卡片 -->
    <ApplicationCard
      id="guard"
      title="Guard"
      :enabled="guardEnabled"
      @update:enabled="guardEnabled = $event"
    >
      <div v-if="guardEnabled" class="space-y-4">
        <!-- HD Cameras -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">HD Cameras</label>
            <span class="text-sm font-semibold text-gray-900">{{ params.hdCameras }}</span>
          </div>
          <input
            type="range"
            :value="params.hdCameras"
            @input="updateParam('hdCameras', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="50"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- 2K Cameras -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">2K Cameras</label>
            <span class="text-sm font-semibold text-gray-900">{{ params['2kCameras'] }}</span>
          </div>
          <input
            type="range"
            :value="params['2kCameras']"
            @input="updateParam('2kCameras', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="25"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- 4K Cameras -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-700">4K Cameras</label>
            <span class="text-sm font-semibold text-gray-900">{{ params['4kCameras'] }}</span>
          </div>
          <input
            type="range"
            :value="params['4kCameras']"
            @input="updateParam('4kCameras', Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="15"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <!-- 存储时长 -->
        <div class="pt-3 border-t">
          <label class="text-sm font-medium text-gray-700 mb-2 block">期望保存时长</label>
          <div class="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              v-for="duration in ([7, 14, 30, 90, 180] as const)"
              :key="duration"
              @click="updateParam('storageDuration', duration)"
              :class="[
                'px-3 py-2 text-sm font-bold rounded-md transition-colors border-2',
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
        <div class="pt-3 border-t">
          <label class="text-sm font-medium text-gray-700 mb-2 block">NVR 类型</label>
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
        <div class="pt-3 border-t">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">AI 功能</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
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
      </div>

      <!-- 未启用 Guard 的提示 -->
      <div v-else class="text-center py-8 text-gray-500">
        <p class="text-sm">启用 Guard 以配置摄像头监控功能</p>
      </div>
    </ApplicationCard>
  </div>
</template>
