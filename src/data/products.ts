import type { Product } from '@/types';

/**
 * Omada 一体机产品型号数据
 *
 * 数据来源：实际产品规格表
 * 注意：CPU 容量已按建议减半处理
 */
export const PRODUCTS: Product[] = [
  // Fusion Pro Wi-Fi 7
  {
    id: 'fusion-pro-wifi7',
    name: 'Fusion Pro Wi-Fi 7',
    series: 'Small Network',
    supportedServices: 'network+guard',
    cpu: {
      capacity: 19460,
      cores: 4,
      model: 'IPQ5424 Quad A53 1.8GHz',
    },
    memory: {
      capacity: 4096, // 4GB DDR
    },
    storage: {
      type: 'sd',
      maxCapacity: 1024, // SD卡最大1TB
      slots: 1,
    },
    specifications: {
      maxClients: 300,
      maxDevices: 30,
      maxCameras: {
        hd: 10,
        '2k': 4,
        '4k': 2,
      },
      ports: '2×10G, 4×2.5G PoE+ / WiFi7 2+2+2',
    },
    image: '/images/express7.png',
    storeUrl: 'https://www.tp-link.com/',
  },

  // Fusion G+ (Network Only)
  {
    id: 'fusion-g-plus',
    name: 'Fusion G+',
    series: 'Small Network',
    supportedServices: 'network',
    cpu: {
      capacity: 13800,
      cores: 4,
      model: 'IPQ5322 Quad A53 1.5GHz',
    },
    memory: {
      capacity: 3072, // 3GB DDR
    },
    storage: {
      type: 'none',
      maxCapacity: 0,
    },
    specifications: {
      maxClients: 300,
      maxDevices: 30,
      ports: '2×2.5G / WiFi7 2+2',
    },
    image: '/images/ucg-ultra.png',
    storeUrl: 'https://www.tp-link.com/',
  },

  // Fusion 2.5G (Network Only)
  {
    id: 'fusion-2.5g',
    name: 'Fusion 2.5G',
    series: 'Small Network',
    supportedServices: 'network',
    cpu: {
      capacity: 18400,
      cores: 4,
      model: 'MT7987A Quad A53 2.0GHz',
    },
    memory: {
      capacity: 2048, // 2GB DDR
    },
    storage: {
      type: 'none',
      maxCapacity: 0,
    },
    specifications: {
      maxClients: 300,
      maxDevices: 30,
      ports: '5×2.5G',
    },
    image: '/images/ucg-max.png',
    storeUrl: 'https://www.tp-link.com/',
  },

  // Fusion Pro 2.5G
  {
    id: 'fusion-pro-2.5g',
    name: 'Fusion Pro 2.5G',
    series: 'Small Network',
    supportedServices: 'network+guard',
    cpu: {
      capacity: 34560,
      cores: 4,
      model: 'MT7988A Quad A73 1.8GHz',
    },
    memory: {
      capacity: 4096, // 4GB DDR
    },
    storage: {
      type: 'ssd',
      maxCapacity: 4096, // 单盘位SSD最大4TB
      slots: 1,
    },
    specifications: {
      maxClients: 300,
      maxDevices: 30,
      maxCameras: {
        hd: 15,
        '2k': 8,
        '4k': 5,
      },
      ports: '5×2.5G',
    },
    image: '/images/ucg-max.png',
    storeUrl: 'https://www.tp-link.com/',
  },

  // Fusion Pro 2.5G PoE
  {
    id: 'fusion-pro-2.5g-poe',
    name: 'Fusion Pro 2.5G PoE',
    series: 'Small Network',
    supportedServices: 'network+guard',
    cpu: {
      capacity: 34560,
      cores: 4,
      model: 'MT7988A Quad A73 1.8GHz',
    },
    memory: {
      capacity: 4096, // 4GB DDR
    },
    storage: {
      type: 'ssd',
      maxCapacity: 4096, // 单盘位SSD最大4TB
      slots: 1,
    },
    specifications: {
      maxClients: 300,
      maxDevices: 30,
      maxCameras: {
        hd: 15,
        '2k': 8,
        '4k': 5,
      },
      ports: '1×2.5G, 8×2.5G PoE+',
    },
    image: '/images/ucg-max.png',
    storeUrl: 'https://www.tp-link.com/',
  },

  // Fusion Pro 10G
  {
    id: 'fusion-pro-10g',
    name: 'Fusion Pro 10G',
    series: 'Medium Network',
    supportedServices: 'network+guard',
    cpu: {
      capacity: 42240,
      cores: 4,
      model: 'IPQ9570 Quad A73 2.2GHz',
    },
    memory: {
      capacity: 4096, // 4GB DDR
    },
    storage: {
      type: 'ssd',
      maxCapacity: 4096, // 单盘位SSD最大4TB
      slots: 1,
    },
    specifications: {
      maxClients: 500,
      maxDevices: 50,
      maxCameras: {
        hd: 15,
        '2k': 8,
        '4k': 5,
      },
      ports: '3×10G, 4×2.5G PoE+',
    },
    image: '/images/ucg-fiber.png',
    storeUrl: 'https://www.tp-link.com/',
  },

  // Fusion Max 10G
  {
    id: 'fusion-max-10g',
    name: 'Fusion Max 10G',
    series: 'Large Network',
    supportedServices: 'network+guard',
    cpu: {
      capacity: 50960, // CN9130 (41360) + SSR931G (9600)
      cores: 8,
      model: 'CN9130 Quad A72 2.2GHz + SSR931G Quad A55 1.2GHz',
    },
    memory: {
      capacity: 8192, // 8GB DDR
    },
    storage: {
      type: 'hdd',
      maxCapacity: 49152, // 双盘位HDD最大24TB×2=48TB
      slots: 2,
    },
    specifications: {
      maxClients: 2000,
      maxDevices: 200,
      maxCameras: {
        hd: 50,
        '2k': 25,
        '4k': 15,
      },
      ports: '3×10GE, 8×2.5GE / HDMI, 1×eSATA',
    },
    image: '/images/udm-pro-max.png',
    storeUrl: 'https://www.tp-link.com/',
  },

  // Fusion Max 10G PoE
  {
    id: 'fusion-max-10g-poe',
    name: 'Fusion Max 10G PoE',
    series: 'Large Network',
    supportedServices: 'network+guard',
    cpu: {
      capacity: 50960, // CN9130 (41360) + SSR931G (9600)
      cores: 8,
      model: 'CN9130 Quad A72 2.2GHz + SSR931G Quad A55 1.2GHz',
    },
    memory: {
      capacity: 8192, // 8GB DDR
    },
    storage: {
      type: 'hdd',
      maxCapacity: 49152, // 双盘位HDD最大24TB×2=48TB
      slots: 2,
    },
    specifications: {
      maxClients: 2000,
      maxDevices: 200,
      maxCameras: {
        hd: 50,
        '2k': 25,
        '4k': 15,
      },
      ports: '3×10GE, 8×2.5GE PoE+ / HDMI, 1×eSATA',
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
