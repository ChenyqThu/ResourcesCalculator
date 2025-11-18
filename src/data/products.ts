import type { Product } from '@/types';

/**
 * Omada 一体机产品型号数据
 *
 * 数据来源：实际产品规格表 (portfolio.png)
 * 注意：CPU 容量已按建议减半处理
 */
export const PRODUCTS: Product[] = [
  {
    id: 'fusion-pro-wifi7',
    name: 'Fusion Pro Wi-Fi 7',
    series: 'Small Network',
    cpu: {
      capacity: 19460, 
      cores: 4,
      model: 'IPQ5424 Quad A53 1.8GHz',
    },
    memory: {
      capacity: 4096, // 4GB DDR
    },
    storage: {
      capacity: 32, // 16/32GB EMMC + SD Card
    },
    specifications: {
      maxAPs: 30,
      maxSwitches: 30,
      maxCameras: 10, // 10*HD or 4*2K or 2*4K
      ports: '2×10G, 4×2.5G PoE+ / WiFi7 2+2+2',
    },
    image: '/images/express7.png',
    storeUrl: 'https://www.tp-link.com/',
  },
  {
    id: 'fusion-pro-2.5g',
    name: 'Fusion Pro 2.5G',
    series: 'Small Network',
    cpu: {
      capacity: 34560, 
      cores: 4,
      model: 'MT7988A Quad A73 1.8GHz',
    },
    memory: {
      capacity: 4096, // 4GB DDR
    },
    storage: {
      capacity: 32, // 32GB EMMC + SSD
    },
    specifications: {
      maxAPs: 30,
      maxSwitches: 30,
      maxCameras: 15, // 15*HD or 8*2K or 4*4K
      ports: '5×2.5G',
    },
    image: '/images/ucg-max.png',
    storeUrl: 'https://www.tp-link.com/',
  },
  {
    id: 'fusion-pro-2.5g-poe',
    name: 'Fusion Pro 2.5G PoE',
    series: 'Small Network',
    cpu: {
      capacity: 34560, 
      cores: 4,
      model: 'MT7988A Quad A73 1.8GHz',
    },
    memory: {
      capacity: 4096, // 4GB DDR
    },
    storage: {
      capacity: 32, // 32GB EMMC + SSD
    },
    specifications: {
      maxAPs: 30,
      maxSwitches: 30,
      maxCameras: 15, // 15*HD or 8*2K or 5*4K
      ports: '1×2.5G, 8×2.5G PoE+',
    },
    image: '/images/ucg-max.png',
    storeUrl: 'https://www.tp-link.com/',
  },
  {
    id: 'fusion-pro-10g',
    name: 'Fusion Pro 10G',
    series: 'Small Network',
    cpu: {
      capacity: 42240, 
      cores: 4,
      model: 'IPQ9570 Quad A73 2.2GHz',
    },
    memory: {
      capacity: 4096, // 4GB DDR
    },
    storage: {
      capacity: 32, // 32GB EMMC + SSD
    },
    specifications: {
      maxAPs: 50,
      maxSwitches: 50,
      maxCameras: 15, // 15*HD or 8*2K or 5*4K
      ports: '3×10G, 4×2.5G PoE+',
    },
    image: '/images/ucg-fiber.png',
    storeUrl: 'https://www.tp-link.com/',
  },
  {
    id: 'fusion-max-10g',
    name: 'Fusion Max 10G',
    series: 'Large Network',
    cpu: {
      capacity: 41360, 
      cores: 8,
      model: 'CN9130 Quad A72 2.2GHz + S5R931G Quad A55 1.2GHz',
    },
    memory: {
      capacity: 8192, // 8GB DDR
    },
    storage: {
      capacity: 256, // 256GB EMMC
    },
    specifications: {
      maxAPs: 200,
      maxSwitches: 200,
      maxCameras: 50, // 50*HD or 25*2K or 15*4K
      ports: '3×10GE, 8×2.5GE',
    },
    image: '/images/udm-pro-max.png',
    storeUrl: 'https://www.tp-link.com/',
  },
  {
    id: 'fusion-max-10g-poe',
    name: 'Fusion Max 10G PoE',
    series: 'Large Network',
    cpu: {
      capacity: 41360, 
      cores: 8,
      model: 'CN9130 Quad A72 2.2GHz + S5R931G Quad A55 1.2GHz',
    },
    memory: {
      capacity: 8192, // 8GB DDR
    },
    storage: {
      capacity: 256, // 256GB EMMC
    },
    specifications: {
      maxAPs: 200,
      maxSwitches: 200,
      maxCameras: 50, // Max 50*HD or 25*2K or 15*4K
      ports: '3×10GE, 8×2.5GE PoE+',
    },
    image: '/images/udm-se.png',
    storeUrl: 'https://www.tp-link.com/',
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
