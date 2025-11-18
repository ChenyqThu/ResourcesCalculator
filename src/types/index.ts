/**
 * 产品型号数据结构
 */
export interface Product {
  id: string;
  name: string;
  series: string;
  cpu: {
    capacity: number; // DMIPS
    cores: number;
    model: string;
  };
  memory: {
    capacity: number; // MB
  };
  storage: {
    capacity: number; // GB
  };
  price?: number;
  image?: string;
  storeUrl?: string;
  specifications?: {
    maxAPs?: number;
    maxSwitches?: number;
    maxCameras?: number;
    ports?: string;
    [key: string]: string | number | undefined;
  };
}

/**
 * 用户输入参数
 */
export interface InputParams {
  // 网络设备
  apCount: number;
  switchCount: number;

  // 安防设备 - 按清晰度区分
  hdCameras: number;      // HD (1080p) 摄像头数量
  '2kCameras': number;    // 2K 摄像头数量
  '4kCameras': number;    // 4K 摄像头数量
  nvrType: 'builtin' | 'external';

  // 存储配置
  storageDriveSize: 1 | 8 | 16 | 28; // TB

  // AI 功能选项（可多选）
  enableAIDetection: boolean;    // 人形车形检测
  enablePeopleCount: boolean;     // 人头计数
  enableIPS: boolean;
  enableDPI: boolean;
  enableContentFilter: boolean;
  enableVPN: boolean;
  enableQoS: boolean;
}

/**
 * 模块资源消耗
 */
export interface ModuleResources {
  cpu: number; // DMIPS
  memory: number; // MB
}

/**
 * 计算结果
 */
export interface CalculationResult {
  controller: ModuleResources;
  gateway: ModuleResources;
  protect: ModuleResources;
  total: ModuleResources & {
    storage?: number; // GB (V2)
  };
}

/**
 * 资源使用状态
 */
export type ResourceStatus = 'low' | 'optimal' | 'high' | 'overload';

/**
 * 推荐类型
 */
export type RecommendationType = 'value' | 'recommended' | 'advanced';

/**
 * 带使用率的产品信息
 */
export interface ProductWithUsage extends Product {
  cpuUsage: number; // CPU 使用率 (%)
  memoryUsage: number; // 内存使用率 (%)
  storageUsage?: number; // 存储使用率 (%) [V2]
  overallUsage: number; // 综合使用率 (%)
  status: ResourceStatus;
  recommendationType?: RecommendationType;
}

/**
 * 计算常量配置
 */
export interface CalculationConstants {
  // Controller
  CONTROLLER_BASE_CPU: number;
  CONTROLLER_PER_DEVICE_CPU: number;
  CONTROLLER_BASE_MEMORY: number;
  CONTROLLER_PER_DEVICE_MEMORY: number;

  // Gateway
  GATEWAY_BASE_CPU: number;
  GATEWAY_BASE_MEMORY: number;
  DPI_MEMORY: number;
  IPS_MEMORY: number;
  CONTENT_FILTER_MEMORY: number;

  // 预估值（待研发实测）
  IPS_CPU: number;
  VPN_CPU: number;
  VPN_MEMORY: number;
  QOS_CPU: number;

  // Protect
  PROTECT_BASE_CPU: number;
  PROTECT_BASE_MEMORY: number;

  // 基础 CPU 成本（每个摄像头，不包含 AI）
  PROTECT_BASE_BUILTIN_CPU_PER_IPC: number;
  PROTECT_BASE_EXTERNAL_CPU_PER_IPC: number;

  // AI 增量 CPU 成本
  PROTECT_AI_DETECTION_CPU_PER_IPC: number;
  PROTECT_PEOPLE_COUNT_CPU_PER_IPC: number;

  // Memory per IPC
  PROTECT_BUILTIN_MEMORY_PER_IPC: number;
  PROTECT_EXTERNAL_MEMORY_PER_IPC: number;

  // Storage
  STORAGE_HD_PER_DAY: number;
  STORAGE_2K_PER_DAY: number;
  STORAGE_4K_PER_DAY: number;
}
