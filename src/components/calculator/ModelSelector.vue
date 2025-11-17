<template>
  <div class="flex items-center space-x-4">
    <button
      v-for="product in products"
      :key="product.id"
      @click="$emit('select', product.id)"
      :class="[
        'flex-1 p-4 rounded-lg border-2 transition-all hover:shadow-md',
        selectedId === product.id
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 bg-white hover:border-primary/50'
      ]"
    >
      <div class="text-center">
        <h3 class="font-bold text-lg mb-1">{{ product.name }}</h3>
        <div class="text-xs text-muted-foreground space-y-0.5">
          <p>{{ product.cpu.cores }} Cores</p>
          <p>{{ formatMemory(product.memory.capacity) }}</p>
          <p>{{ product.storage.capacity }}GB</p>
        </div>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PRODUCTS } from '@/data/products';

defineProps<{
  selectedId?: string;
}>();

defineEmits<{
  select: [id: string];
}>();

const products = PRODUCTS;

const formatMemory = (mb: number): string => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(0)}GB RAM`;
  }
  return `${mb}MB RAM`;
};
</script>
