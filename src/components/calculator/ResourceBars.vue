<template>
  <div class="space-y-4">
    <div
      v-for="resource in resources"
      :key="resource.label"
      class="bg-white p-4 rounded-lg border"
    >
      <div class="flex items-center justify-between mb-2">
        <span class="font-semibold text-sm">{{ resource.label }}</span>
        <div class="flex items-center space-x-3">
          <span class="text-xs text-muted-foreground">
            {{ formatValue(resource.used, resource.unit) }} /
            {{ formatValue(resource.capacity, resource.unit) }}
          </span>
          <span
            :class="[
              'text-sm font-bold min-w-[60px] text-right',
              getUsageColor(resource.usage)
            ]"
          >
            {{ resource.usage.toFixed(1) }}%
          </span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="relative h-6 bg-gray-100 rounded-full overflow-hidden">
        <div
          class="absolute inset-0 transition-all duration-300 rounded-full"
          :class="getBarColor(resource.usage)"
          :style="{ width: `${Math.min(resource.usage, 100)}%` }"
        />
        <!-- Overflow indicator -->
        <div
          v-if="resource.usage > 100"
          class="absolute inset-0 bg-red-500/20 animate-pulse rounded-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ResourceInfo {
  label: string;
  used: number;
  capacity: number;
  usage: number;
  unit: string;
}

defineProps<{
  resources: ResourceInfo[];
}>();

const formatValue = (value: number, unit: string): string => {
  if (unit === 'DMIPS' && value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  if (unit === 'MB' && value >= 1024) {
    return `${(value / 1024).toFixed(1)}GB`;
  }
  if (unit === 'GB' && value >= 1024) {
    return `${(value / 1024).toFixed(1)}TB`;
  }
  return value.toFixed(0);
};

const getUsageColor = (usage: number): string => {
  if (usage > 100) return 'text-red-600';
  if (usage >= 90) return 'text-red-500';
  if (usage >= 80) return 'text-orange-500';
  if (usage >= 60) return 'text-yellow-600';
  return 'text-green-600';
};

const getBarColor = (usage: number): string => {
  if (usage > 100) return 'bg-gradient-to-r from-red-500 to-red-600';
  if (usage >= 90) return 'bg-red-500';
  if (usage >= 80) return 'bg-orange-500';
  if (usage >= 60) return 'bg-yellow-500';
  return 'bg-green-500';
};
</script>
