<template>
  <Card :className="cn('p-6 transition-all hover:shadow-md', cardBorderClass)">
    <div class="space-y-4">
      <!-- 推荐标签 -->
      <div v-if="product.recommendationType" class="flex items-center justify-between">
        <span :class="recommendationBadgeClass">{{ recommendationLabel }}</span>
        <span :class="statusBadgeClass">{{ statusLabel }}</span>
      </div>

      <!-- 产品信息 -->
      <div class="space-y-2">
        <h3 class="text-xl font-bold">{{ product.name }}</h3>
        <div class="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div>
            <span class="font-medium">CPU:</span> {{ product.cpu.cores }} Cores
          </div>
          <div>
            <span class="font-medium">内存:</span> {{ formatMemory(product.memory.capacity) }}
          </div>
          <div>
            <span class="font-medium">存储:</span> {{ product.storage.maxCapacity }} GB
          </div>
          <div v-if="product.specifications?.maxCameras">
            <span class="font-medium">摄像头:</span> 最多 {{ product.specifications.maxCameras }}
          </div>
        </div>
      </div>

      <!-- 资源使用率 -->
      <div class="space-y-3">
        <ResourceBar
          label="CPU 使用率"
          :used="totalResources.cpu"
          :capacity="product.cpu.capacity"
          :usage="product.cpuUsage"
          :status="getResourceStatus(product.cpuUsage)"
          unit="DMIPS"
        />
        <ResourceBar
          label="内存使用率"
          :used="totalResources.memory"
          :capacity="product.memory.capacity"
          :usage="product.memoryUsage"
          :status="getResourceStatus(product.memoryUsage)"
          unit="MB"
        />
      </div>

      <!-- 综合状态 -->
      <div class="pt-4 border-t">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">综合使用率</span>
          <span class="text-lg font-bold" :class="statusTextClass">
            {{ product.overallUsage.toFixed(1) }}%
          </span>
        </div>
      </div>

      <!-- 操作按钮（可选） -->
      <a
        v-if="product.storeUrl"
        :href="product.storeUrl"
        target="_blank"
        class="block w-full px-4 py-2 text-sm font-medium text-center text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        了解更多
      </a>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProductWithUsage, ResourceStatus } from '@/types';
import { USAGE_THRESHOLDS } from '@/data/constants';
import Card from '@/components/ui/Card.vue';
import ResourceBar from './ResourceBar.vue';
import { cn } from '@/utils/cn';

const props = defineProps<{
  product: ProductWithUsage;
  totalResources: {
    cpu: number;
    memory: number;
  };
}>();

const getResourceStatus = (usage: number): ResourceStatus => {
  if (usage < USAGE_THRESHOLDS.LOW) return 'low';
  if (usage < USAGE_THRESHOLDS.OPTIMAL) return 'optimal';
  if (usage < USAGE_THRESHOLDS.HIGH) return 'high';
  return 'overload';
};

const formatMemory = (mb: number): string => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(0)} GB`;
  }
  return `${mb} MB`;
};

const recommendationLabel = computed(() => {
  const labels = {
    value: '性价比',
    recommended: '推荐',
    advanced: '进阶',
  };
  return props.product.recommendationType ? labels[props.product.recommendationType] : '';
});

const recommendationBadgeClass = computed(() => {
  const classes = {
    value: 'px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full',
    recommended: 'px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full',
    advanced: 'px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full',
  };
  return props.product.recommendationType ? classes[props.product.recommendationType] : '';
});

const statusLabel = computed(() => {
  const labels = {
    low: '低负载',
    optimal: '适中',
    high: '较高',
    overload: '超载',
  };
  return labels[props.product.status];
});

const statusBadgeClass = computed(() => {
  const classes = {
    low: 'px-2 py-1 text-xs font-semibold text-green-700 bg-green-50 rounded-full',
    optimal: 'px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-50 rounded-full',
    high: 'px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-50 rounded-full',
    overload: 'px-2 py-1 text-xs font-semibold text-red-700 bg-red-50 rounded-full',
  };
  return classes[props.product.status];
});

const statusTextClass = computed(() => {
  const classes = {
    low: 'text-green-600',
    optimal: 'text-yellow-600',
    high: 'text-orange-600',
    overload: 'text-red-600',
  };
  return classes[props.product.status];
});

const cardBorderClass = computed(() => {
  if (props.product.recommendationType === 'recommended') {
    return 'border-2 border-green-500';
  }
  return '';
});
</script>
