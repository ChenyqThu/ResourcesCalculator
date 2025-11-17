<template>
  <div class="bg-white p-6 rounded-lg border">
    <h3 class="font-semibold text-lg mb-4">{{ title }}</h3>

    <div class="space-y-4">
      <!-- Enable Toggle -->
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center space-x-3">
          <input
            type="checkbox"
            :id="`enable-${id}`"
            :checked="enabled"
            @change="$emit('update:enabled', ($event.target as HTMLInputElement).checked)"
            class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
          />
          <label :for="`enable-${id}`" class="font-medium cursor-pointer">
            Enable {{ title }}
          </label>
        </div>
      </div>

      <!-- Content (shown when enabled) -->
      <div v-if="enabled" class="space-y-3 pl-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id: string;
  title: string;
  enabled: boolean;
}>();

defineEmits<{
  'update:enabled': [value: boolean];
}>();
</script>
