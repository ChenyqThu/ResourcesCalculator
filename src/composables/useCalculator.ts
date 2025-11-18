import { ref, computed } from 'vue';
import type { InputParams, CalculationResult } from '@/types';
import { calculateTotal } from '@/utils/calculator';

/**
 * 资源计算器 Composable
 * 管理输入参数和计算结果
 */
export function useCalculator() {
  // 输入参数
  const params = ref<InputParams>({
    // 网络设备
    apCount: 0,
    switchCount: 0,
    clientsCount: 0,

    // 安防设备 - 按清晰度区分
    hdCameras: 0,
    '2kCameras': 0,
    '4kCameras': 0,
    nvrType: 'builtin',

    // 存储配置
    storageDuration: 30, // 默认 1 个月

    // AI 功能选项
    enableAIDetection: false,
    enablePeopleCount: false,

    // Gateway 功能选项
    enableIPS: false,
    enableDPI: false,
    enableContentFilter: false,
    enableVPN: false,
    enableQoS: false,
  });

  // 计算结果（响应式）
  const result = computed<CalculationResult>(() => calculateTotal(params.value));

  // 重置参数
  const reset = () => {
    params.value = {
      apCount: 0,
      switchCount: 0,
      clientsCount: 0,
      hdCameras: 0,
      '2kCameras': 0,
      '4kCameras': 0,
      nvrType: 'builtin',
      storageDuration: 30,
      enableAIDetection: false,
      enablePeopleCount: false,
      enableIPS: false,
      enableDPI: false,
      enableContentFilter: false,
      enableVPN: false,
      enableQoS: false,
    };
  };

  // 导出配置为 JSON
  const exportConfig = () => {
    return JSON.stringify(params.value, null, 2);
  };

  // 导入配置
  const importConfig = (config: string) => {
    try {
      const parsed = JSON.parse(config);
      params.value = { ...params.value, ...parsed };
      return true;
    } catch (error) {
      console.error('Failed to import config:', error);
      return false;
    }
  };

  return {
    params,
    result,
    reset,
    exportConfig,
    importConfig,
  };
}
