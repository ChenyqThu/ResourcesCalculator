<template>
  <div class="flex items-center space-x-2">
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      :class="
        cn(
          'h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2',
          className
        )
      "
    />
    <Label v-if="$slots.default" :for="id" class="cursor-pointer">
      <slot />
    </Label>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/utils/cn';
import Label from './Label.vue';

defineProps<{
  id?: string;
  modelValue?: boolean;
  className?: string;
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>
