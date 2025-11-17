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

    // 安防设备
    ipcCount: 0,
    nvrType: 'builtin',

    // 功能选项
    enableAI: false,
    aiMode: 'detection',
    enableIPS: false,
    enableDPI: false,
    enableContentFilter: false,
    enableVPN: false,
    enableQoS: false,

    // V2 功能
    cameraResolution: '1080p',
    storageDays: 30,
  });

  // 计算结果（响应式）
  const result = computed<CalculationResult>(() => calculateTotal(params.value));

  // 重置参数
  const reset = () => {
    params.value = {
      apCount: 0,
      switchCount: 0,
      ipcCount: 0,
      nvrType: 'builtin',
      enableAI: false,
      aiMode: 'detection',
      enableIPS: false,
      enableDPI: false,
      enableContentFilter: false,
      enableVPN: false,
      enableQoS: false,
      cameraResolution: '1080p',
      storageDays: 30,
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
