<template>
  <div class="space-y-4">
    <div
      v-for="resource in resources"
      :key="resource.label"
      class="bg-white p-4 rounded-lg border"
    >
      <div class="flex items-center justify-between mb-3">
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

      <!-- Segmented Progress Bar -->
      <div class="flex gap-[2px] h-5">
        <div
          v-for="(_, index) in segments"
          :key="index"
          class="flex-1 rounded-sm transition-all duration-200"
          :class="getSegmentColor(index, resource.usage)"
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

// 定义分段数量（总共100个方格，对应100%）
const segments = Array.from({ length: 100 }, (_, i) => i);

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

/**
 * 根据方格位置和使用率获取方格颜色
 * @param index 方格索引 (0-99，对应 0%-100%)
 * @param usage 使用率 (0-100+)
 */
const getSegmentColor = (index: number, usage: number): string => {
  // 100个格子，index 就代表百分比 (0-99 对应 0%-99%)
  const segmentPercentage = index;
  const isFilled = index < usage;

  if (!isFilled) {
    // 未填充的方格显示为浅灰色背景
    return 'bg-gray-200';
  }

  // 填充的方格根据位置显示不同颜色（渐变效果）
  if (segmentPercentage >= 90) {
    // 90-100%: 红色
    return 'bg-red-500';
  } else if (segmentPercentage >= 80) {
    // 80-90%: 橙色
    return 'bg-orange-500';
  } else if (segmentPercentage >= 60) {
    // 60-80%: 黄色
    return 'bg-yellow-400';
  } else {
    // 0-60%: 绿色（Omada绿）
    return 'bg-[#00B050]';
  }
};
</script>
