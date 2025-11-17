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

  // 安防设备
  ipcCount: number;
  nvrType: 'builtin' | 'external';

  // 功能选项
  enableAI: boolean;
  aiMode: 'detection' | 'peopleCount';
  enableIPS: boolean;
  enableDPI: boolean;
  enableContentFilter: boolean;
  enableVPN: boolean;
  enableQoS: boolean;

  // V2 功能
  cameraResolution?: '1080p' | '4K' | '8K';
  storageDays?: number;
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

  // AI Detection Mode
  PROTECT_AI_DETECTION_BUILTIN_CPU: number;
  PROTECT_AI_DETECTION_EXTERNAL_CPU: number;

  // People Count Mode
  PROTECT_PEOPLE_COUNT_BUILTIN_CPU: number;
  PROTECT_PEOPLE_COUNT_EXTERNAL_CPU: number;

  // Memory per IPC
  PROTECT_BUILTIN_MEMORY_PER_IPC: number;
  PROTECT_EXTERNAL_MEMORY_PER_IPC: number;
}
