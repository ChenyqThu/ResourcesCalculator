<template>
  <div class="space-y-2">
    <Label :for="id">
      {{ label }}
      <span v-if="tooltip" class="ml-1 text-muted-foreground" :title="tooltip">ⓘ</span>
    </Label>
    <Input
      :id="id"
      :type="type"
      :modelValue="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      :min="min"
      :max="max"
      :step="step"
      :placeholder="placeholder"
    />
    <p v-if="description" class="text-xs text-muted-foreground">{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import Label from '@/components/ui/Label.vue';
import Input from '@/components/ui/Input.vue';

defineProps<{
  id: string;
  label: string;
  modelValue: string | number;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  tooltip?: string;
  description?: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
