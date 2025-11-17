<script setup lang="ts">
import { useCalculator } from './composables/useCalculator';
import { useRecommendation } from './composables/useRecommendation';
import InputPanel from './components/calculator/InputPanel.vue';
import ResultPanel from './components/calculator/ResultPanel.vue';

// 使用计算器
const { params, result, reset } = useCalculator();

// 使用推荐引擎
const {
  productsWithUsage,
  recommendedProducts,
  isOverloaded,
  isUnderUtilized,
} = useRecommendation(result);
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b bg-white">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-primary">Omada AIO 资源计算器</h1>
            <p class="text-sm text-muted-foreground mt-1">
              智能推荐合适的一体机型号，助您轻松选型
            </p>
          </div>
          <div class="text-sm text-muted-foreground">
            <span>v1.0</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left Panel: Input -->
        <div class="lg:col-span-4">
          <div class="sticky top-4">
            <InputPanel :params="params" @reset="reset" />
          </div>
        </div>

        <!-- Right Panel: Results -->
        <div class="lg:col-span-8">
          <ResultPanel
            :result="result"
            :recommendedProducts="recommendedProducts"
            :allProducts="productsWithUsage"
            :isOverloaded="isOverloaded"
            :isUnderUtilized="isUnderUtilized"
          />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t bg-white mt-12">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-sm text-muted-foreground">
          <p>© 2025 TP-Link Systems Inc. All rights reserved.</p>
          <p class="mt-2">
            <a href="https://www.tp-link.com" target="_blank" class="hover:text-primary">
              www.tp-link.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
