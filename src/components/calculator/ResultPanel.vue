<template>
  <div class="space-y-6">
    <!-- 总资源消耗摘要 -->
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <h3 class="text-lg font-semibold mb-4">总资源需求</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Controller</p>
          <p class="text-xl font-bold">
            {{ formatResource(result.controller.cpu, 'DMIPS') }}
          </p>
          <p class="text-sm">{{ formatMemory(result.controller.memory) }} RAM</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Gateway</p>
          <p class="text-xl font-bold">
            {{ formatResource(result.gateway.cpu, 'DMIPS') }}
          </p>
          <p class="text-sm">{{ formatMemory(result.gateway.memory) }} RAM</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Protect (安防)</p>
          <p class="text-xl font-bold">
            {{ formatResource(result.protect.cpu, 'DMIPS') }}
          </p>
          <p class="text-sm">{{ formatMemory(result.protect.memory) }} RAM</p>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-blue-200">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium">总计</span>
          <div class="text-right">
            <p class="text-2xl font-bold text-primary">
              {{ formatResource(result.total.cpu, 'DMIPS') }}
            </p>
            <p class="text-sm text-muted-foreground">
              {{ formatMemory(result.total.memory) }} RAM
            </p>
          </div>
        </div>
      </div>
    </Card>

    <!-- 提示信息 -->
    <div v-if="isOverloaded" class="p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-800">
        ⚠️ <strong>警告：</strong>您的需求超出当前所有产品的支持范围，建议联系销售团队咨询定制方案。
      </p>
    </div>

    <div v-if="isUnderUtilized" class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-blue-800">
        ℹ️ <strong>提示：</strong>当前配置可能过高，您可以选择更具性价比的型号。
      </p>
    </div>

    <!-- 推荐产品 -->
    <div v-if="recommendedProducts.length > 0">
      <h3 class="text-2xl font-bold mb-4">推荐型号</h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ProductCard
          v-for="product in recommendedProducts"
          :key="product.id"
          :product="product"
          :totalResources="result.total"
        />
      </div>
    </div>

    <!-- 所有产品（折叠） -->
    <div v-if="otherProducts.length > 0">
      <button
        @click="showAllProducts = !showAllProducts"
        class="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <span>{{ showAllProducts ? '隐藏' : '显示' }}其他型号</span>
        <svg
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': showAllProducts }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div v-if="showAllProducts" class="mt-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <ProductCard
          v-for="product in otherProducts"
          :key="product.id"
          :product="product"
          :totalResources="result.total"
        />
      </div>
    </div>

    <!-- 免责声明 -->
    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p class="text-xs text-yellow-800">
        <strong>⚠️ 注意：</strong>
        标记为"预估值"的功能（IPS、VPN、QoS）的资源消耗数据待研发实测，实际使用率可能有 ±15% 的误差。
        请预留合理余量，避免选择使用率接近 100% 的型号。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CalculationResult, ProductWithUsage } from '@/types';
import Card from '@/components/ui/Card.vue';
import ProductCard from './ProductCard.vue';
import { formatResource } from '@/utils/calculator';

const props = defineProps<{
  result: CalculationResult;
  recommendedProducts: ProductWithUsage[];
  allProducts: ProductWithUsage[];
  isOverloaded: boolean;
  isUnderUtilized: boolean;
}>();

const showAllProducts = ref(false);

const otherProducts = computed(() => {
  const recommendedIds = new Set(props.recommendedProducts.map((p) => p.id));
  return props.allProducts.filter((p) => !recommendedIds.has(p.id));
});

const formatMemory = (mb: number): string => {
  if (mb >= 1024) {
    return `${(mb / 1024).toFixed(1)} GB`;
  }
  return `${mb.toFixed(1)} MB`;
};
</script>
