import type { Product } from '@/types';

/**
 * Omada 一体机产品型号数据
 *
 * 注意：以下产品规格为示例数据，实际规格需要从产品团队获取
 */
export const PRODUCTS: Product[] = [
  {
    id: 'fusion-g-plus',
    name: 'Omada Fusion G+',
    series: 'Fusion',
    cpu: {
      capacity: 50000, // DMIPS - 待确认实际值
      cores: 4,
      model: 'Quad-Core ARM',
    },
    memory: {
      capacity: 8192, // 8GB = 8192MB
    },
    storage: {
      capacity: 256, // GB
    },
    specifications: {
      maxAPs: 100,
      maxSwitches: 50,
      maxCameras: 32,
      ports: '8× Gigabit Ethernet Ports',
    },
    image: '/images/fusion-g-plus.png',
    storeUrl: 'https://www.tp-link.com/store/fusion-g-plus',
  },
  {
    id: 'fusion-2.5g',
    name: 'Omada Fusion 2.5G',
    series: 'Fusion',
    cpu: {
      capacity: 80000, // DMIPS - 待确认实际值
      cores: 8,
      model: 'Octa-Core ARM',
    },
    memory: {
      capacity: 16384, // 16GB = 16384MB
    },
    storage: {
      capacity: 512, // GB
    },
    specifications: {
      maxAPs: 200,
      maxSwitches: 100,
      maxCameras: 64,
      ports: '8× 2.5G Ethernet Ports + 2× 10G SFP+',
    },
    image: '/images/fusion-2.5g.png',
    storeUrl: 'https://www.tp-link.com/store/fusion-2.5g',
  },
  {
    id: 'fusion-entry',
    name: 'Omada Fusion Entry',
    series: 'Fusion',
    cpu: {
      capacity: 30000, // DMIPS - 待确认实际值
      cores: 2,
      model: 'Dual-Core ARM',
    },
    memory: {
      capacity: 4096, // 4GB = 4096MB
    },
    storage: {
      capacity: 128, // GB
    },
    specifications: {
      maxAPs: 50,
      maxSwitches: 25,
      maxCameras: 16,
      ports: '5× Gigabit Ethernet Ports',
    },
    image: '/images/fusion-entry.png',
    storeUrl: 'https://www.tp-link.com/store/fusion-entry',
  },
  {
    id: 'fusion-pro',
    name: 'Omada Fusion Pro',
    series: 'Fusion',
    cpu: {
      capacity: 120000, // DMIPS - 待确认实际值
      cores: 12,
      model: '12-Core ARM',
    },
    memory: {
      capacity: 32768, // 32GB = 32768MB
    },
    storage: {
      capacity: 1024, // 1TB = 1024GB
    },
    specifications: {
      maxAPs: 500,
      maxSwitches: 200,
      maxCameras: 128,
      ports: '8× 10G SFP+ + 4× 25G SFP28',
    },
    image: '/images/fusion-pro.png',
    storeUrl: 'https://www.tp-link.com/store/fusion-pro',
  },
];

/**
 * 根据 ID 获取产品信息
 */
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * 根据系列获取产品列表
 */
export function getProductsBySeries(series: string): Product[] {
  return PRODUCTS.filter((p) => p.series === series);
}
