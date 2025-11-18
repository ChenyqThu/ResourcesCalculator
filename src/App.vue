<script setup lang="ts">
import { useCalculator } from './composables/useCalculator';
import { useRecommendation } from './composables/useRecommendation';
import RecommendationInput from './components/calculator/RecommendationInput.vue';
import RecommendationResults from './components/calculator/RecommendationResults.vue';

// 使用计算器
const { params, result } = useCalculator();

// 使用推荐引擎
const { productsWithUsage, recommendedProducts, isOverloaded } = useRecommendation(result, params);

// 更新参数的处理函数
const updateParams = (newParams: typeof params.value) => {
  params.value = newParams;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Omada AIO 智能推荐</h1>
            <p class="text-sm text-gray-500 mt-1">输入您的需求，为您推荐最合适的一体机型号</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-6 space-y-6">
      <!-- 输入表单 -->
      <section>
        <h2 class="text-lg font-semibold text-gray-700 mb-4">请输入您的需求</h2>
        <RecommendationInput :params="params" @update:params="updateParams" />
      </section>

      <!-- 推荐结果 -->
      <section class="mt-8">
        <RecommendationResults
          :recommendedProducts="recommendedProducts"
          :allProducts="productsWithUsage"
          :params="params"
        />
      </section>

      <!-- Warning Messages -->
      <section v-if="isOverloaded" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-sm text-red-800">
          <strong>⚠️ 警告:</strong> 所有型号都无法满足您的配置需求。请适当降低配置要求。
        </p>
      </section>

      <!-- 免责声明 -->
      <section class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p class="text-xs text-yellow-800">
          <strong>⚠️ 注意:</strong> 带有 ⚠️ 标记的功能（IPS、VPN、QoS）的资源消耗为预估值，实际值需要研发实测确认。
          本计算器提供的数据仅供参考，具体配置请以实际测试为准。
        </p>
      </section>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t mt-8">
      <div class="container mx-auto px-6 py-4 text-center text-sm text-gray-500">
        <p>© 2025 TP-Link Systems Inc. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
