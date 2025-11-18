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
 * CPU 成本构成（每个摄像头）：
 * - 基础成本：150(连接+无图事件+巡店) + NVR成本
 *   - 内置NVR：170(内置NVR事件+播放+AI数据流推送)
 *   - 外置NVR：325(Relay推拉流)
 * - AI 增量成本（可选，可多选）：
 *   - 人形车形检测：40
 *   - 人头计数：190
 *
 * 公式：
 * - 只开人形车形：360 + (320 + 40) * n1 + (475 + 40) * n2 = 360 + 360 * n1 + 515 * n2
 * - 只开 People Count：360 + (320 + 190) * n1 + (475 + 190) * n2 = 360 + 510 * n1 + 665 * n2
 * - 两个都开：360 + (320 + 40 + 190) * n1 + (475 + 40 + 190) * n2 = 360 + 550 * n1 + 705 * n2
 * - Memory: 928 + 14.5 × n1 + 22 × n2
 *
 * 其中：
 * - n1 = 内置NVR下的IPC数量
 * - n2 = 外置NVR下的IPC数量
 *
 * 注意：CPU/内存消耗与摄像头清晰度无关，主要取决于摄像头总数
 */
export function calculateProtect(params: InputParams): ModuleResources {
  // 计算摄像头总数
  const totalCameras = params.hdCameras + params['2kCameras'] + params['4kCameras'];

  if (totalCameras === 0) {
    return { cpu: 0, memory: 0 };
  }

  let cpu = CALCULATION_CONSTANTS.PROTECT_BASE_CPU;
  let memory = CALCULATION_CONSTANTS.PROTECT_BASE_MEMORY;

  const n1 = params.nvrType === 'builtin' ? totalCameras : 0;
  const n2 = params.nvrType === 'external' ? totalCameras : 0;

  // 计算每个摄像头的 CPU 成本
  let cpuPerBuiltinIPC = CALCULATION_CONSTANTS.PROTECT_BASE_BUILTIN_CPU_PER_IPC;
  let cpuPerExternalIPC = CALCULATION_CONSTANTS.PROTECT_BASE_EXTERNAL_CPU_PER_IPC;

  // 添加 AI 增量成本
  if (params.enableAIDetection) {
    cpuPerBuiltinIPC += CALCULATION_CONSTANTS.PROTECT_AI_DETECTION_CPU_PER_IPC;
    cpuPerExternalIPC += CALCULATION_CONSTANTS.PROTECT_AI_DETECTION_CPU_PER_IPC;
  }

  if (params.enablePeopleCount) {
    cpuPerBuiltinIPC += CALCULATION_CONSTANTS.PROTECT_PEOPLE_COUNT_CPU_PER_IPC;
    cpuPerExternalIPC += CALCULATION_CONSTANTS.PROTECT_PEOPLE_COUNT_CPU_PER_IPC;
  }

  // 计算总 CPU
  cpu += cpuPerBuiltinIPC * n1 + cpuPerExternalIPC * n2;

  // 计算总 Memory
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

/**
 * 计算每天的总存储需求 (GB/天)
 */
export function calculateDailyStorage(params: InputParams): number {
  const hdStorage = params.hdCameras * CALCULATION_CONSTANTS.STORAGE_HD_PER_DAY;
  const twoKStorage = params['2kCameras'] * CALCULATION_CONSTANTS.STORAGE_2K_PER_DAY;
  const fourKStorage = params['4kCameras'] * CALCULATION_CONSTANTS.STORAGE_4K_PER_DAY;

  return hdStorage + twoKStorage + fourKStorage;
}

/**
 * 计算可存储天数
 * @param params 输入参数
 * @returns 可存储的天数（向下取整）
 */
export function calculateStorageDays(params: InputParams): number {
  const dailyStorageGB = calculateDailyStorage(params);

  if (dailyStorageGB === 0) {
    return 0;
  }

  const availableStorageGB = (params.storageDriveSize || 1) * 1024; // 转换 TB 到 GB
  const days = Math.floor(availableStorageGB / dailyStorageGB);

  return days;
}

/**
 * 计算推荐的硬盘大小 (TB)
 * 根据摄像头数量、类型和期望保存时长，按市面规格向上推荐
 *
 * @param params 输入参数
 * @returns 推荐的硬盘大小（1/8/16/28 TB）和需要的存储空间（GB）
 */
export function calculateRecommendedStorage(params: InputParams): {
  recommendedSize: 1 | 8 | 16 | 28;
  requiredGB: number;
} {
  const dailyStorageGB = calculateDailyStorage(params);
  const requiredGB = dailyStorageGB * params.storageDuration;

  // 如果没有摄像头，返回最小规格
  if (requiredGB === 0) {
    return { recommendedSize: 1, requiredGB: 0 };
  }

  // 可用规格（TB）
  const availableSizes: (1 | 8 | 16 | 28)[] = [1, 8, 16, 28];
  const requiredTB = requiredGB / 1024;

  // 向上查找满足需求的最小规格
  for (const size of availableSizes) {
    if (size >= requiredTB) {
      return { recommendedSize: size, requiredGB: Math.round(requiredGB) };
    }
  }

  // 如果所有规格都不够，返回最大规格并提示
  return { recommendedSize: 28, requiredGB: Math.round(requiredGB) };
}
