<template>
  <div class="bg-white p-6 rounded-lg border relative">
    <!-- Header with Enable Toggle in top-right corner -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-lg">{{ title }}</h3>

      <!-- Enable Toggle (hidden if disabled) -->
      <input
        v-if="!disableToggle"
        type="checkbox"
        :id="`enable-${id}`"
        :checked="enabled"
        @change="$emit('update:enabled', ($event.target as HTMLInputElement).checked)"
        class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
      />
    </div>

    <!-- Content (shown when enabled or toggle is disabled) -->
    <div v-if="enabled || disableToggle" class="space-y-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  title: string;
  enabled: boolean;
  disableToggle?: boolean; // 是否禁用 toggle（Network 模块使用）
}>();

defineEmits<{
  'update:enabled': [value: boolean];
}>();
</script>
