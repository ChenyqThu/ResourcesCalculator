# Omada AIO 资源计算器 - 系统架构设计

## 1. 架构概览

### 1.1 整体架构
本项目采用 **纯前端单页应用（SPA）** 架构，无需后端服务器，所有计算逻辑在浏览器端完成。

```
┌─────────────────────────────────────────────────────────┐
│                     用户浏览器                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Vue 3 Application                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         Presentation Layer                  │  │  │
│  │  │  - InputPanel Component                     │  │  │
│  │  │  - ResultCard Component                     │  │  │
│  │  │  - ResourceChart Component                  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         Business Logic Layer                │  │  │
│  │  │  - useCalculator (计算逻辑)                  │  │  │
│  │  │  - useProducts (产品数据)                    │  │  │
│  │  │  - useRecommendation (推荐逻辑)             │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         Data Layer                          │  │  │
│  │  │  - Product Models (产品型号数据)             │  │  │
│  │  │  - Calculation Constants (计算常量)         │  │  │
│  │  │  - Configuration (配置文件)                  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.2 技术选型理由

| 技术 | 选型理由 |
|------|----------|
| **Vue 3** | - Composition API 提供更好的逻辑复用和类型支持<br>- 响应式系统适合实时计算场景<br>- 轻量级，性能优秀<br>- 学习曲线平缓 |
| **Vite** | - 极快的冷启动和热更新<br>- 原生 ESM 支持<br>- 开箱即用的 TypeScript 支持<br>- 简洁的配置 |
| **Tailwind CSS** | - 实用优先的 CSS 框架<br>- 快速开发，无需编写自定义 CSS<br>- 响应式设计简单<br>- 文件体积小（PurgeCSS） |
| **Shadcn Vue** | - 高质量的 UI 组件<br>- 完全可定制<br>- 无缝集成 Tailwind<br>- 提供表单、卡片、进度条等必需组件 |
| **TypeScript** | - 类型安全，减少运行时错误<br>- 更好的开发体验（智能提示）<br>- 代码可维护性高 |

## 2. 模块设计

### 2.1 组件层次结构

```
App.vue
├── Header.vue                    # 页面头部
│   ├── Logo
│   └── Title
├── CalculatorLayout.vue          # 主布局
│   ├── InputPanel.vue            # 左侧输入面板
│   │   ├── NetworkSection.vue    # 网络设备输入
│   │   │   ├── Input (AP数量)
│   │   │   └── Input (Switch数量)
│   │   ├── SecuritySection.vue   # 安防设备输入
│   │   │   ├── Input (IPC数量)
│   │   │   ├── Select (NVR类型)
│   │   │   └── Slider (存储时长) [V2]
│   │   └── FeaturesSection.vue   # 功能选项
│   │       ├── Checkbox (AI)
│   │       ├── Checkbox (IPS)
│   │       ├── Checkbox (DPI)
│   │       ├── Checkbox (Content Filter)
│   │       ├── Checkbox (VPN)
│   │       └── Checkbox (QoS)
│   └── ResultPanel.vue           # 右侧结果面板
│       ├── SummaryCard.vue       # 总资源消耗摘要
│       └── ProductGrid.vue       # 产品网格
│           └── ProductCard.vue   # 产品卡片 (×N)
│               ├── ProductImage
│               ├── ProductInfo
│               ├── ResourceBar.vue  # 资源使用率条
│               │   ├── CPUBar
│               │   ├── MemoryBar
│               │   └── StorageBar [V2]
│               └── ActionButton
└── Footer.vue                    # 页面底部
```

### 2.2 数据流设计

采用 **单向数据流** 模式：

```
User Input → Input Components → Composables (State) → Calculation Logic → Computed Results → Result Components → UI Update
```

```typescript
// 数据流示例
┌──────────────┐
│ User Input   │  用户修改参数
└──────┬───────┘
       │
       ↓
┌──────────────────┐
│ inputParams (ref)│  响应式状态
└──────┬───────────┘
       │
       ↓
┌────────────────────┐
│ calculationResults │  计算属性（computed）
│ (自动计算)          │  - totalCPU
└──────┬─────────────┘  - totalMemory
       │                - resourceUsage
       │
       ↓
┌───────────────────┐
│ recommendedModels │  派生状态
│ (computed)        │  - 筛选和排序
└──────┬────────────┘
       │
       ↓
┌──────────────┐
│ UI Update    │  自动更新视图
└──────────────┘
```

## 3. 核心模块详细设计

### 3.1 计算引擎 (useCalculator)

```typescript
// composables/useCalculator.ts
interface InputParams {
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
}

interface CalculationResult {
  controller: {
    cpu: number;
    memory: number;
  };
  gateway: {
    cpu: number;
    memory: number;
  };
  protect: {
    cpu: number;
    memory: number;
  };
  total: {
    cpu: number;
    memory: number;
    storage?: number; // V2
  };
}

export function useCalculator() {
  const params = ref<InputParams>({
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
  });

  // 计算 Controller 资源
  const controllerResources = computed(() =>
    calculateController(params.value)
  );

  // 计算 Gateway 资源
  const gatewayResources = computed(() =>
    calculateGateway(params.value)
  );

  // 计算 Protect 资源
  const protectResources = computed(() =>
    calculateProtect(params.value)
  );

  // 总资源消耗
  const totalResources = computed(() => ({
    cpu: controllerResources.value.cpu +
         gatewayResources.value.cpu +
         protectResources.value.cpu,
    memory: controllerResources.value.memory +
            gatewayResources.value.memory +
            protectResources.value.memory,
  }));

  return {
    params,
    controllerResources,
    gatewayResources,
    protectResources,
    totalResources,
  };
}
```

### 3.2 产品推荐引擎 (useRecommendation)

```typescript
// composables/useRecommendation.ts
interface ProductWithUsage extends Product {
  cpuUsage: number;      // CPU 使用率 (%)
  memoryUsage: number;   // 内存使用率 (%)
  storageUsage?: number; // 存储使用率 (%) [V2]
  overallUsage: number;  // 综合使用率 (%)
  status: 'low' | 'optimal' | 'high' | 'overload';
  recommendationType?: 'value' | 'recommended' | 'advanced';
}

export function useRecommendation(
  totalResources: ComputedRef<CalculationResult['total']>
) {
  const products = ref<Product[]>(PRODUCTS);

  // 计算每个产品的资源使用率
  const productsWithUsage = computed<ProductWithUsage[]>(() => {
    return products.value.map(product => {
      const cpuUsage = (totalResources.value.cpu / product.cpu.capacity) * 100;
      const memoryUsage = (totalResources.value.memory / product.memory.capacity) * 100;

      // 综合使用率（CPU和内存的最大值）
      const overallUsage = Math.max(cpuUsage, memoryUsage);

      // 状态判断
      let status: ProductWithUsage['status'];
      if (overallUsage < 60) status = 'low';
      else if (overallUsage < 80) status = 'optimal';
      else if (overallUsage < 90) status = 'high';
      else status = 'overload';

      return {
        ...product,
        cpuUsage,
        memoryUsage,
        overallUsage,
        status,
      };
    });
  });

  // 推荐产品（筛选和排序）
  const recommendedProducts = computed(() => {
    const sorted = [...productsWithUsage.value]
      .sort((a, b) => a.overallUsage - b.overallUsage);

    // 找到第一个非超载的产品
    const firstValid = sorted.find(p => p.status !== 'overload');
    if (!firstValid) {
      return sorted; // 所有产品都超载，返回全部
    }

    const result = sorted.map(product => {
      let recommendationType: ProductWithUsage['recommendationType'];

      if (product.overallUsage >= 75 && product.overallUsage <= 85) {
        recommendationType = 'recommended'; // 推荐
      } else if (product.overallUsage >= 60 && product.overallUsage < 75) {
        recommendationType = 'value'; // 性价比
      } else if (product.overallUsage < 60 && product.status === 'low') {
        recommendationType = 'advanced'; // 进阶
      }

      return {
        ...product,
        recommendationType,
      };
    });

    return result.filter(p => p.recommendationType !== undefined);
  });

  return {
    products,
    productsWithUsage,
    recommendedProducts,
  };
}
```

### 3.3 数据层设计

```typescript
// data/products.ts
export const PRODUCTS: Product[] = [
  {
    id: 'fusion-g-plus',
    name: 'Omada Fusion G+',
    series: 'Fusion',
    cpu: {
      capacity: 50000,      // DMIPS (示例值，待确认)
      cores: 4,
      model: 'ARM Cortex-A53',
    },
    memory: {
      capacity: 8192,       // MB (8GB)
    },
    storage: {
      capacity: 256,        // GB
    },
    specifications: {
      maxAPs: 100,
      maxSwitches: 50,
      maxCameras: 32,
      ports: '8× Gigabit Ethernet',
    },
    image: '/images/fusion-g-plus.png',
    storeUrl: 'https://www.tp-link.com/store/fusion-g-plus',
  },
  {
    id: 'fusion-2.5g',
    name: 'Omada Fusion 2.5G',
    series: 'Fusion',
    cpu: {
      capacity: 80000,      // DMIPS (示例值，待确认)
      cores: 8,
      model: 'ARM Cortex-A72',
    },
    memory: {
      capacity: 16384,      // MB (16GB)
    },
    storage: {
      capacity: 512,        // GB
    },
    specifications: {
      maxAPs: 200,
      maxSwitches: 100,
      maxCameras: 64,
      ports: '8× 2.5G Ethernet',
    },
    image: '/images/fusion-2.5g.png',
    storeUrl: 'https://www.tp-link.com/store/fusion-2.5g',
  },
  // 更多产品型号...
];

// data/constants.ts
export const CALCULATION_CONSTANTS = {
  // Controller
  CONTROLLER_BASE_CPU: 933,
  CONTROLLER_PER_DEVICE_CPU: 42,
  CONTROLLER_BASE_MEMORY: 1172,
  CONTROLLER_PER_DEVICE_MEMORY: 1.78,

  // Gateway
  GATEWAY_BASE_CPU: 920,
  GATEWAY_BASE_MEMORY: 150,
  DPI_MEMORY: 60,
  IPS_MEMORY: 215,
  CONTENT_FILTER_MEMORY: 50,

  // 预估值（待研发实测）
  IPS_CPU: 200,          // ⚠️ 预估值
  VPN_CPU: 300,          // ⚠️ 预估值
  VPN_MEMORY: 100,       // ⚠️ 预估值
  QOS_CPU: 150,          // ⚠️ 预估值

  // Protect
  PROTECT_BASE_CPU: 360,
  PROTECT_BASE_MEMORY: 928,

  // AI Detection Mode
  PROTECT_AI_DETECTION_BUILTIN_CPU: 129600,
  PROTECT_AI_DETECTION_EXTERNAL_CPU: 265225,

  // People Count Mode
  PROTECT_PEOPLE_COUNT_BUILTIN_CPU: 183600,
  PROTECT_PEOPLE_COUNT_EXTERNAL_CPU: 342725,

  // Memory per IPC
  PROTECT_BUILTIN_MEMORY_PER_IPC: 14.5,
  PROTECT_EXTERNAL_MEMORY_PER_IPC: 22,
} as const;
```

## 4. 状态管理策略

### 4.1 状态分类

采用 **Composition API + Reactive State** 模式，无需引入 Pinia（除非后续需要复杂状态管理）。

```typescript
// 局部状态（组件内）
const localState = ref(...);

// 共享状态（Composable）
const { params, totalResources } = useCalculator();
const { recommendedProducts } = useRecommendation(totalResources);

// 全局配置（只读）
import { PRODUCTS, CALCULATION_CONSTANTS } from '@/data';
```

### 4.2 状态更新流程

```
User Action → Update params → Auto Compute (computed) → UI Re-render
```

性能优化：
- 使用 `computed` 缓存计算结果
- 使用 `watchDebounced` 防抖处理输入
- 使用 `shallowRef` 减少深层响应式开销（如适用）

## 5. UI/UX 设计

### 5.1 响应式布局

```css
/* Tailwind 断点 */
sm: 640px   /* 小屏手机 */
md: 768px   /* 平板 */
lg: 1024px  /* 小桌面 */
xl: 1280px  /* 大桌面 */
2xl: 1536px /* 超大屏 */
```

布局策略：
- **移动端 (< 768px)**: 单列布局，输入面板和结果面板垂直堆叠
- **平板端 (768px - 1024px)**: 两列布局，输入面板固定宽度，结果面板占剩余空间
- **桌面端 (> 1024px)**: 左侧输入面板 (30%)，右侧结果面板 (70%)

### 5.2 资源使用率可视化

使用 **进度条 + 百分比** 组合：

```
CPU Usage    ████████████████░░░░  78%  🟡 Optimal
Memory       ███████████░░░░░░░░░  65%  🟢 Low
Storage      ██████████████░░░░░░  72%  🟡 Optimal (V2)
```

颜色方案：
- 🟢 绿色 (0-60%): `bg-green-500`
- 🟡 黄色 (60-80%): `bg-yellow-500`
- 🟠 橙色 (80-90%): `bg-orange-500`
- 🔴 红色 (90-100%+): `bg-red-500`

### 5.3 交互设计

**实时计算反馈**
- 输入变化后 300ms 触发计算（防抖）
- 显示微妙的加载动画
- 高亮显示变化的数值

**提示和帮助**
- 功能选项旁显示 ⓘ 图标，悬停显示详细说明
- 预估值旁显示 ⚠️ 图标，提示"待实测"
- 超载时显示警告横幅

## 6. 性能优化策略

### 6.1 计算性能
- 使用 `computed` 缓存计算结果
- 避免不必要的重复计算
- 使用 `watchDebounced` 防抖用户输入

### 6.2 渲染性能
- 使用 `v-memo` 优化列表渲染（如适用）
- 懒加载图片（`loading="lazy"`）
- 按需加载图表库（动态 import）

### 6.3 构建优化
- Vite 自动进行 Tree Shaking
- 配置 Tailwind PurgeCSS
- 启用 Gzip/Brotli 压缩
- 图片优化（WebP 格式）

## 7. 可扩展性设计

### 7.1 配置化
所有产品型号和计算常量都存储在独立的数据文件中，易于更新。

```typescript
// 未来可从 API 加载
const products = await fetchProducts();
const constants = await fetchConstants();
```

### 7.2 插件化
使用 Composable 模式，易于添加新功能模块。

```typescript
// 新增功能示例
export function useExport() {
  function exportToPDF() { /* ... */ }
  function exportToImage() { /* ... */ }
  return { exportToPDF, exportToImage };
}
```

### 7.3 国际化 (i18n)
预留国际化支持，使用 Vue I18n。

```typescript
// locales/en.json
{
  "calculator.title": "Resource Calculator",
  "calculator.apCount": "Number of APs"
}

// locales/zh-CN.json
{
  "calculator.title": "资源计算器",
  "calculator.apCount": "AP 数量"
}
```

## 8. 部署方案

### 8.1 静态托管
构建后生成纯静态文件，可部署到：
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages
- 公司官网服务器

### 8.2 构建流程
```bash
npm run build
# 生成 dist/ 目录
# 包含优化后的 HTML、CSS、JS 和资源文件
```

### 8.3 CDN 加速
- 静态资源上传至 CDN
- 配置缓存策略
- 启用 HTTP/2 和 Brotli 压缩

## 9. 测试策略

### 9.1 单元测试
使用 Vitest 测试核心计算逻辑。

```typescript
// tests/calculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateController } from '@/utils/calculator';

describe('calculateController', () => {
  it('should calculate correct CPU usage', () => {
    const result = calculateController({
      apCount: 10,
      switchCount: 5,
    });
    expect(result.cpu).toBe(933 + 42 * 15); // 1563
  });
});
```

### 9.2 集成测试
使用 Playwright 或 Cypress 测试完整用户流程。

```typescript
// e2e/calculator.spec.ts
test('should recommend correct model', async ({ page }) => {
  await page.goto('/');
  await page.fill('[name="apCount"]', '50');
  await page.fill('[name="switchCount"]', '20');
  await expect(page.locator('.recommended-badge')).toBeVisible();
});
```

### 9.3 性能测试
- Lighthouse 评分 > 90
- Core Web Vitals 达标
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

## 10. 安全考虑

### 10.1 输入验证
- 所有数字输入限制范围
- 防止 XSS 攻击（Vue 默认转义）
- 防止 CSRF（纯前端无需处理）

### 10.2 数据隐私
- 不收集用户个人信息
- 计算在本地完成，不发送数据到服务器

## 11. 未来迭代方向

### Phase 2 (V2)
- 存储容量计算
- 结果导出功能
- 分享链接（URL Params）
- 更多产品型号

### Phase 3 (V3)
- 后台管理系统
- 用户保存方案
- 与 Store 集成
- 高级场景模板

### Phase 4 (未来)
- AI 智能推荐
- 成本预算计算
- 性能压力测试模拟
- 3D 可视化

---

**文档版本**: v1.0
**最后更新**: 2025-11-17
**状态**: Draft
