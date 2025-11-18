import type { CalculationConstants } from '@/types';

/**
 * 资源计算常量
 *
 * ⚠️ 注意：标记为"预估值"的常量待研发实测后更新
 */
export const CALCULATION_CONSTANTS: CalculationConstants = {
  // ==================== Controller ====================
  CONTROLLER_BASE_CPU: 933,
  CONTROLLER_PER_DEVICE_CPU: 42,
  CONTROLLER_BASE_MEMORY: 1172,
  CONTROLLER_PER_DEVICE_MEMORY: 1.78,

  // ==================== Gateway ====================
  GATEWAY_BASE_CPU: 920,
  GATEWAY_BASE_MEMORY: 150,
  DPI_MEMORY: 60,
  IPS_MEMORY: 215,
  CONTENT_FILTER_MEMORY: 50,

  // ⚠️ 以下为预估值，待研发实测
  IPS_CPU: 200, // ⚠️ 预估值
  VPN_CPU: 300, // ⚠️ 预估值
  VPN_MEMORY: 100, // ⚠️ 预估值
  QOS_CPU: 150, // ⚠️ 预估值

  // ==================== Protect ====================
  PROTECT_BASE_CPU: 360,
  PROTECT_BASE_MEMORY: 928,

  // 基础 CPU 成本（每个摄像头，不包含 AI）
  // 公式：150(连接+无图事件+巡店) + 170(内置NVR事件+播放+AI数据流推送)
  PROTECT_BASE_BUILTIN_CPU_PER_IPC: 320,
  // 公式：150(连接+无图事件+巡店) + 325(Relay推拉流)
  PROTECT_BASE_EXTERNAL_CPU_PER_IPC: 475,

  // AI 增量 CPU 成本（每个摄像头）
  PROTECT_AI_DETECTION_CPU_PER_IPC: 40,    // 人形车形检测
  PROTECT_PEOPLE_COUNT_CPU_PER_IPC: 190,   // 人头计数

  // Memory per IPC
  // 公式：4.5（管理端）+ 10（内置NVR）= 14.5
  PROTECT_BUILTIN_MEMORY_PER_IPC: 14.5,
  PROTECT_EXTERNAL_MEMORY_PER_IPC: 22,

  // ==================== Storage ====================
  // 存储需求：每个摄像头每天的存储需求 (GB/天)
  // 基于 H.264/H.265 编码，24小时连续录制
  STORAGE_HD_PER_DAY: 12,      // HD (1080p) 摄像头每天约 12GB
  STORAGE_2K_PER_DAY: 22,      // 2K 摄像头每天约 22GB
  STORAGE_4K_PER_DAY: 45,      // 4K 摄像头每天约 45GB
} as const;

/**
 * 资源使用率阈值
 */
export const USAGE_THRESHOLDS = {
  LOW: 60, // 低负载：0-60%
  OPTIMAL: 80, // 适中：60-80%
  HIGH: 90, // 较高：80-90%
  // 超载：90-100%+
} as const;

/**
 * 推荐型号的使用率范围
 */
export const RECOMMENDATION_RANGES = {
  VALUE: { min: 60, max: 75 }, // 性价比型号
  RECOMMENDED: { min: 75, max: 85 }, // 推荐型号
  ADVANCED: { min: 0, max: 60 }, // 进阶型号（预留扩展空间）
} as const;
