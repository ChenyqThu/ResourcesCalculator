import type { InputParams, ModuleResources, CalculationResult } from '@/types';
import { CALCULATION_CONSTANTS } from '@/data/constants';

/**
 * 计算 Controller 资源消耗
 *
 * 公式：
 * - CPU: 933 + 42 × (AP数量 + Switch数量)
 * - Memory: 1172 + 1.78 × (AP数量 + Switch数量)
 */
export function calculateController(params: InputParams): ModuleResources {
  const deviceCount = params.apCount + params.switchCount;

  const cpu =
    CALCULATION_CONSTANTS.CONTROLLER_BASE_CPU +
    CALCULATION_CONSTANTS.CONTROLLER_PER_DEVICE_CPU * deviceCount;

  const memory =
    CALCULATION_CONSTANTS.CONTROLLER_BASE_MEMORY +
    CALCULATION_CONSTANTS.CONTROLLER_PER_DEVICE_MEMORY * deviceCount;

  return {
    cpu: Math.round(cpu),
    memory: Math.round(memory * 10) / 10, // 保留一位小数
  };
}

/**
 * 计算 Gateway 资源消耗
 *
 * 公式：
 * - CPU: 920 + (IPS ? IPS_CPU : 0) + (VPN ? VPN_CPU : 0) + (QoS ? QOS_CPU : 0)
 * - Memory: 150 + (DPI ? 60 : 0) + (IPS ? 215 : 0) + (ContentFilter ? 50 : 0) + (VPN ? VPN_MEMORY : 0)
 */
export function calculateGateway(params: InputParams): ModuleResources {
  let cpu = CALCULATION_CONSTANTS.GATEWAY_BASE_CPU;
  let memory = CALCULATION_CONSTANTS.GATEWAY_BASE_MEMORY;

  // CPU 消耗
  if (params.enableIPS) {
    cpu += CALCULATION_CONSTANTS.IPS_CPU;
  }
  if (params.enableVPN) {
    cpu += CALCULATION_CONSTANTS.VPN_CPU;
  }
  if (params.enableQoS) {
    cpu += CALCULATION_CONSTANTS.QOS_CPU;
  }

  // 内存消耗
  if (params.enableDPI) {
    memory += CALCULATION_CONSTANTS.DPI_MEMORY;
  }
  if (params.enableIPS) {
    memory += CALCULATION_CONSTANTS.IPS_MEMORY;
  }
  if (params.enableContentFilter) {
    memory += CALCULATION_CONSTANTS.CONTENT_FILTER_MEMORY;
  }
  if (params.enableVPN) {
    memory += CALCULATION_CONSTANTS.VPN_MEMORY;
  }

  return {
    cpu: Math.round(cpu),
    memory: Math.round(memory),
  };
}

/**
 * 计算 Protect (安防) 资源消耗
 *
 * 公式（开启 AI - 人形车形检测）：
 * - CPU: 360 + 129600 × n1 + 265225 × n2
 * - Memory: 928 + 14.5 × n1 + 22 × n2
 *
 * 公式（开启 People Count）：
 * - CPU: 360 + 183600 × n1 + 342725 × n2
 * - Memory: 928 + 14.5 × n1 + 22 × n2
 *
 * 其中：
 * - n1 = 内置NVR下的IPC数量
 * - n2 = 外置NVR下的IPC数量
 */
export function calculateProtect(params: InputParams): ModuleResources {
  if (params.ipcCount === 0) {
    return { cpu: 0, memory: 0 };
  }

  let cpu = CALCULATION_CONSTANTS.PROTECT_BASE_CPU;
  let memory = CALCULATION_CONSTANTS.PROTECT_BASE_MEMORY;

  const n1 = params.nvrType === 'builtin' ? params.ipcCount : 0;
  const n2 = params.nvrType === 'external' ? params.ipcCount : 0;

  if (params.enableAI) {
    if (params.aiMode === 'detection') {
      // 人形车形检测
      cpu +=
        CALCULATION_CONSTANTS.PROTECT_AI_DETECTION_BUILTIN_CPU * n1 +
        CALCULATION_CONSTANTS.PROTECT_AI_DETECTION_EXTERNAL_CPU * n2;
    } else if (params.aiMode === 'peopleCount') {
      // 人头计数
      cpu +=
        CALCULATION_CONSTANTS.PROTECT_PEOPLE_COUNT_BUILTIN_CPU * n1 +
        CALCULATION_CONSTANTS.PROTECT_PEOPLE_COUNT_EXTERNAL_CPU * n2;
    }
  }

  memory +=
    CALCULATION_CONSTANTS.PROTECT_BUILTIN_MEMORY_PER_IPC * n1 +
    CALCULATION_CONSTANTS.PROTECT_EXTERNAL_MEMORY_PER_IPC * n2;

  return {
    cpu: Math.round(cpu),
    memory: Math.round(memory * 10) / 10, // 保留一位小数
  };
}

/**
 * 计算总资源消耗
 */
export function calculateTotal(params: InputParams): CalculationResult {
  const controller = calculateController(params);
  const gateway = calculateGateway(params);
  const protect = calculateProtect(params);

  return {
    controller,
    gateway,
    protect,
    total: {
      cpu: controller.cpu + gateway.cpu + protect.cpu,
      memory: controller.memory + gateway.memory + protect.memory,
    },
  };
}

/**
 * 计算资源使用率
 */
export function calculateUsagePercentage(
  used: number,
  capacity: number
): number {
  if (capacity === 0) return 0;
  return Math.round((used / capacity) * 1000) / 10; // 保留一位小数
}

/**
 * 格式化资源数值
 */
export function formatResource(value: number, unit: string): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M ${unit}`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K ${unit}`;
  }
  return `${value.toFixed(1)} ${unit}`;
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
