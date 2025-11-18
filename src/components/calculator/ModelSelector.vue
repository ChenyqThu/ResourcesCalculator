<template>
  <div class="relative">
    <!-- Left scroll button -->
    <button
      v-if="canScrollLeft"
      @click="scrollLeft"
      class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:bg-gray-50 flex items-center justify-center"
    >
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Scrollable container -->
    <div
      ref="scrollContainer"
      @scroll="updateScrollButtons"
      class="overflow-x-auto scrollbar-hide scroll-smooth"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      <div class="flex gap-4 pb-2">
        <button
          v-for="product in products"
          :key="product.id"
          @click="$emit('select', product.id)"
          :class="[
            'flex-shrink-0 w-[200px] h-[140px] p-4 rounded-lg border-2 transition-all hover:shadow-md',
            selectedId === product.id
              ? 'border-[#00B050] bg-[#00B050]/5'
              : 'border-gray-200 bg-white hover:border-[#00B050]/50'
          ]"
        >
          <div class="h-full flex flex-col justify-center text-center">
            <h3 class="font-bold text-base mb-2 line-clamp-2">{{ product.name }}</h3>
            <div class="text-xs text-gray-600 space-y-1">
              <p>{{ product.cpu.cores }} Cores</p>
              <p>{{ formatMemory(product.memory.capacity) }}</p>
              <p>{{ product.storage.maxCapacity }}GB Storage</p>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- Right scroll button -->
    <button
      v-if="canScrollRight"
      @click="scrollRight"
      class="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border-2 border-gray-300 rounded-full shadow-lg hover:bg-gray-50 flex items-center justify-center"
    >
      <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PRODUCTS } from '@/data/products';

defineProps<{
  selectedId?: string;
}>();

defineEmits<{
  select: [id: string];
}>();

const products = PRODUCTS;
const scrollContainer = ref<HTMLElement | null>(null);
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const formatMemory = (mb: number): string => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(0)}GB RAM`;
  }
  return `${mb}MB RAM`;
};

const updateScrollButtons = () => {
  if (!scrollContainer.value) return;

  const container = scrollContainer.value;
  canScrollLeft.value = container.scrollLeft > 0;
  canScrollRight.value =
    container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
};

const scrollLeft = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({ left: -400, behavior: 'smooth' });
};

const scrollRight = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({ left: 400, behavior: 'smooth' });
};

onMounted(() => {
  updateScrollButtons();
  window.addEventListener('resize', updateScrollButtons);
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
