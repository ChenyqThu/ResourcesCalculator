<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold">{{ title }}</h3>
    <div class="space-y-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
