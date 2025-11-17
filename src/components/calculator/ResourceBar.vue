<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium">{{ label }}</span>
      <span :class="statusTextClass">{{ usage.toFixed(1) }}%</span>
    </div>
    <Progress :value="usage" :variant="status" />
    <div class="flex items-center justify-between text-xs text-muted-foreground">
      <span>{{ formatResource(used, unit) }}</span>
      <span>/ {{ formatResource(capacity, unit) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ResourceStatus } from '@/types';
import Progress from '@/components/ui/Progress.vue';
import { formatResource } from '@/utils/calculator';

const props = defineProps<{
  label: string;
  used: number;
  capacity: number;
  usage: number;
  status: ResourceStatus;
  unit: string;
}>();

const statusTextClass = computed(() => {
  const classes = {
    low: 'text-green-600',
    optimal: 'text-yellow-600',
    high: 'text-orange-600',
    overload: 'text-red-600',
  };
  return classes[props.status];
});
</script>
