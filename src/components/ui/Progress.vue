<template>
  <div :class="cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)">
    <div
      class="h-full transition-all duration-300 ease-in-out"
      :class="progressColorClass"
      :style="{ width: `${Math.min(value, 100)}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/utils/cn';

const props = defineProps<{
  value: number; // 0-100
  className?: string;
  variant?: 'low' | 'optimal' | 'high' | 'overload';
}>();

const progressColorClass = computed(() => {
  if (props.variant) {
    const variants = {
      low: 'bg-green-500',
      optimal: 'bg-yellow-500',
      high: 'bg-orange-500',
      overload: 'bg-red-500',
    };
    return variants[props.variant];
  }

  // 自动根据值确定颜色
  if (props.value < 60) return 'bg-green-500';
  if (props.value < 80) return 'bg-yellow-500';
  if (props.value < 90) return 'bg-orange-500';
  return 'bg-red-500';
});
</script>
