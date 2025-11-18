# Omada AIO 资源计算器 PRD (Product Requirements Document)

## 1. 项目概述

### 1.1 项目背景
为帮助用户根据业务规模和应用场景快速选择合适的 Omada 一体机（Fusion 系列）型号，开发官网资源计算器工具，实现从"产品介绍 → 参数输入 → 自动推荐 → Store 下单"的完整购买闭环。

### 1.2 项目目标
- 提供直观的**需求驱动**资源计算工具，帮助用户进行产品选型
- 根据用户输入的网络规模、安防需求和功能选项，智能推荐合适的一体机型号
- **自动检查规格限制**，过滤不符合需求的产品
- **智能推荐硬盘大小**，根据存储时长和摄像头数量
- 可视化展示 CPU、内存、存储资源使用情况
- 提高用户购买决策效率，降低选型门槛

### 1.3 目标用户
- 企业网络管理员
- 系统集成商
- IT 采购决策者
- 中小企业主

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 参数输入模块
用户可输入以下参数来描述其业务需求：

**网络设备规模**
- Switch 数量（交换机）
  - 类型：滑动条
  - 范围：0-200
  - 默认值：0
  - 必填：否

- AP 数量（接入点）
  - 类型：滑动条
  - 范围：0-200
  - 默认值：0
  - 必填：否

- Clients 数量（客户端）
  - 类型：滑动条
  - 范围：0-2000（步长 10）
  - 默认值：0
  - 必填：否
  - **新增字段**

**安防设备规模（Guard 功能）**
- Guard 启用开关
  - 类型：开关按钮
  - 默认值：关闭
  - 说明：控制是否启用 Guard 功能
  - **新增功能**

- HD Cameras (1080p)
  - 类型：滑动条
  - 范围：0-50
  - 默认值：0
  - 显示条件：Guard 已启用

- 2K Cameras
  - 类型：滑动条
  - 范围：0-25
  - 默认值：0
  - 显示条件：Guard 已启用

- 4K Cameras
  - 类型：滑动条
  - 范围：0-15
  - 默认值：0
  - 显示条件：Guard 已启用

- NVR 类型
  - 类型：单选
  - 选项：内置 NVR / 外置 NVR
  - 默认值：内置 NVR
  - 显示条件：Guard 已启用

- 期望保存时长
  - 类型：按钮组
  - 选项：1周 / 2周 / 1月 / 3月 / 6月
  - 对应天数：7 / 14 / 30 / 90 / 180
  - 默认值：30 天（1月）
  - 显示条件：Guard 已启用
  - **新增功能**

**功能选项（可选功能项）**
- AI 功能
  - 类型：复选框（全局开关）
  - 默认值：关闭
  - 子选项：
    - 人形车形检测
    - People Count（人头计数）
  - 说明：AI 功能会显著增加 CPU 和内存消耗

- Security 功能
  - IPS (入侵防御系统)
    - 类型：复选框
    - 默认值：关闭
    - 资源影响：增加 CPU 算力消耗和内存消耗（215MB）

  - DPI (深度包检测)
    - 类型：复选框
    - 默认值：关闭
    - 资源影响：增加内存消耗（60MB）

  - Content Filter (内容过滤)
    - 类型：复选框
    - 默认值：关闭
    - 资源影响：增加内存消耗（50MB）

- VPN 功能
  - 类型：复选框
  - 默认值：关闭
  - 资源影响：增加 CPU 算力消耗和内存消耗（待研发实测）
  - 备注：当前版本使用预估值

- QoS 功能
  - 类型：复选框
  - 默认值：关闭
  - 资源影响：增加 CPU 算力消耗（待研发实测）
  - 备注：当前版本使用预估值

#### 2.1.2 计算逻辑模块

**Controller 资源计算**
```
算力消耗 (DMIPS) = 933 + 42 × (AP数量 + Switch数量)
内存消耗 (MB) = 1172 + 1.78 × (AP数量 + Switch数量)
```

**Gateway 资源计算**
```
算力消耗 (DMIPS) = 920
  + (IPS启用 ? IPS算力消耗 : 0)
  + (VPN启用 ? VPN算力消耗 : 0)
  + (QoS启用 ? QoS算力消耗 : 0)

内存消耗 (MB) = 150
  + (DPI启用 ? 60 : 0)
  + (IPS启用 ? 215 : 0)
  + (Content Filter启用 ? 50 : 0)
  + (VPN启用 ? VPN内存消耗 : 0)
```

**安防系统资源计算（开启 AI - 人形车形）**
```
n1 = 内置NVR下的IPC数量
n2 = 外置NVR下的IPC数量

基础算力消耗 = 360
内置NVR算力 = 360 × [150 + 40 + 170] × n1 = 129600 × n1
外置NVR算力 = 515 × [150 + 40 + 325] × n2 = 265225 × n2

算力消耗 (DMIPS) = 360 + 129600 × n1 + 265225 × n2

基础内存消耗 = 928 [820(管理端) + 108(内置NVR)]
内存消耗 (MB) = 928 + 14.5 × n1 + 22 × n2
```

**安防系统资源计算（开启 People Count）**
```
算力消耗 (DMIPS) = 360 + 183600 × n1 + 342725 × n2
内存消耗 (MB) = 928 + 14.5 × n1 + 22 × n2
```

**总资源消耗**
```
总CPU消耗 = Controller算力 + Gateway算力 + 安防算力
总内存消耗 = Controller内存 + Gateway内存 + 安防内存
```

**资源使用率计算**
```
CPU使用率 = (总CPU消耗 / 机型CPU容量) × 100%
内存使用率 = (总内存消耗 / 机型内存容量) × 100%
存储使用率 = (存储需求 / 机型存储容量) × 100%  // V2功能
```

#### 2.1.3 结果展示模块

**机型推荐逻辑**

1. **规格限制检查**（优先级最高）
   - 检查 Clients 数量是否超过产品上限
   - 检查设备数量（AP + Switch）是否超过产品上限
   - 检查摄像头数量（HD/2K/4K）是否超过产品规格
   - 如果需要 Guard，过滤掉 Network Only 产品
   - **超限处理**：超过规格限制的产品标记为超载状态，推荐度大幅下滑

2. **Guard 需求匹配**
   - 如果用户**未启用 Guard**：优先推荐 Network Only 产品
   - 如果用户**启用 Guard**：过滤掉不支持 Guard 的产品

3. **推荐类型分类**（基于资源使用率）
   - **推荐型号** (Recommended)：资源使用率 75%-85%，资源利用充分且留有余量
   - **性价比型号** (Value)：资源使用率 60%-75%，性价比较高
   - **高性能型号** (Advanced)：资源使用率 < 60%，性能冗余，适合未来扩展

4. **排序规则**
   - Guard 需求匹配优先（Network Only 在无 Guard 需求时优先）
   - 按推荐类型：Recommended > Value > Advanced
   - 同类型内按最佳使用率排序

5. **硬盘推荐**（仅 Guard 模式）
   - 根据摄像头数量、类型和保存时长计算存储需求
   - 按市面规格向上推荐：1TB / 8TB / 16TB / 28TB
   - 检查推荐硬盘是否在产品支持的存储范围内

**资源使用状态分级**
- 🟢 低负载：0%-60%（绿色，安全）
- 🟡 适中：60%-80%（黄色，推荐）
- 🟠 较高：80%-90%（橙色，警告）
- 🔴 超载：90%-100%+（红色，不推荐）

**展示内容**
- 机型名称和图片
- 规格参数（CPU、内存、存储容量）
- 资源使用率可视化（进度条）
  - CPU 使用率
  - 内存使用率
  - 存储使用率（V2）
- 状态标签（推荐/性价比/进阶）
- 价格信息（可选）
- 购买链接

#### 2.1.4 交互设计

**布局方案 V2.0**
- **输入表单**：左右卡片布局
  - 左侧卡片：Network（Switch、AP、Clients、Gateway 功能）
  - 右侧卡片：Guard（摄像头、存储时长、NVR 类型、AI 功能）
- **推荐结果**：左右布局
  - 左侧：推荐机型列表（带排名标识）
  - 右侧：选中机型的详细信息（硬件规格、管理规模、存储配置、资源占用）

**实时计算**
- 用户修改任何参数后，立即重新计算并更新结果
- 使用防抖（debounce）优化性能

**特殊提示**
- 当所有机型都超载时，显示"您的需求超出当前产品线支持范围，建议联系销售团队"
- 当资源使用率过低（<30%）时，提示"当前配置可能过高，建议选择性价比型号"
- 当某项功能待实测时，显示"⚠️ 此数据为预估值，实际以产品规格为准"

### 2.2 非功能需求

#### 2.2.1 性能要求
- 页面加载时间 < 2s
- 计算响应时间 < 100ms
- 支持主流浏览器（Chrome、Firefox、Safari、Edge）

#### 2.2.2 精度要求
- 资源计算精度误差 ±15%
- 预留合理余量，避免推荐不足配置

#### 2.2.3 可维护性
- 机型参数和计算公式可配置化
- 支持后台数据更新，无需重新部署

## 3. 产品型号数据

### 3.1 产品列表

| 型号 | 服务类型 | CPU | Memory | 存储 | 管理规模 |
|------|---------|-----|--------|------|---------|
| **Fusion Pro Wi-Fi 7** | Network + Guard | IPQ5424 Quad A53 1.8GHz<br>19.5K DMIPS (4 cores) | 4GB DDR | SD 卡<br>最大 1TB | 300 clients<br>30 devices<br>10*HD / 4*2K / 2*4K cameras |
| **Fusion G+** | Network Only | IPQ5322 Quad A53 1.5GHz<br>13.8K DMIPS (4 cores) | 3GB DDR | 无额外存储 | 300 clients<br>30 devices |
| **Fusion 2.5G** | Network Only | MT7987A Quad A53 2.0GHz<br>18.4K DMIPS (4 cores) | 2GB DDR | 无额外存储 | 300 clients<br>30 devices |
| **Fusion Pro 2.5G** | Network + Guard | MT7988A Quad A73 1.8GHz<br>34.6K DMIPS (4 cores) | 4GB DDR | SSD 单盘位<br>最大 4TB | 300 clients<br>30 devices<br>15*HD / 8*2K / 5*4K cameras |
| **Fusion Pro 2.5G PoE** | Network + Guard | MT7988A Quad A73 1.8GHz<br>34.6K DMIPS (4 cores) | 4GB DDR | SSD 单盘位<br>最大 4TB | 300 clients<br>30 devices<br>15*HD / 8*2K / 5*4K cameras |
| **Fusion Pro 10G** | Network + Guard | IPQ9570 Quad A73 2.2GHz<br>42.2K DMIPS (4 cores) | 4GB DDR | SSD 单盘位<br>最大 4TB | 500 clients<br>50 devices<br>15*HD / 8*2K / 5*4K cameras |
| **Fusion Max 10G** | Network + Guard | CN9130 + SSR931G<br>51.0K DMIPS (8 cores) | 8GB DDR | HDD 双盘位<br>最大 48TB | 2000 clients<br>200 devices<br>50*HD / 25*2K / 15*4K cameras |
| **Fusion Max 10G PoE** | Network + Guard | CN9130 + SSR931G<br>51.0K DMIPS (8 cores) | 8GB DDR | HDD 双盘位<br>最大 48TB | 2000 clients<br>200 devices<br>50*HD / 25*2K / 15*4K cameras |

### 3.2 服务类型说明

- **Network Only**: 仅支持网络功能（Controller + Gateway），不支持 Guard（安防）
- **Network + Guard**: 支持完整功能（Controller + Gateway + Guard）

### 3.3 存储类型说明

- **SD 卡**: 最大容量 1TB，适合小规模存储需求
- **SSD**: 单盘位，最大容量 4TB，适合中等规模存储
- **HDD**: 双盘位，最大容量 48TB（24TB × 2），适合大规模长期存储

### 3.4 数据结构（TypeScript）

```typescript
export type StorageType = 'none' | 'sd' | 'ssd' | 'hdd';
export type ServiceType = 'network' | 'network+guard';

interface Product {
  id: string;
  name: string;
  series: string;
  supportedServices: ServiceType;  // 支持的服务
  cpu: {
    capacity: number;               // CPU 容量（DMIPS）
    cores: number;                  // 核心数
    model: string;                  // 型号
  };
  memory: {
    capacity: number;               // 内存容量（MB）
  };
  storage: {
    type: StorageType;              // 存储类型
    maxCapacity: number;            // 最大存储容量（GB）
    slots?: number;                 // 盘位数量
  };
  specifications: {
    maxClients: number;             // 最大客户端数
    maxDevices: number;             // 最大设备数（AP + Switch）
    maxCameras?: {                  // 最大摄像头数（按分辨率）
      hd: number;
      '2k': number;
      '4k': number;
    };
    ports?: string;
  };
  price?: number;
  image?: string;
  storeUrl?: string;
}
```

## 4. 数据字典

### 4.1 输入参数
| 字段 | 类型 | 说明 | 默认值 | 范围 |
|------|------|------|--------|------|
| apCount | number | AP 数量 | 0 | 0-500 |
| switchCount | number | Switch 数量 | 0 | 0-200 |
| ipcCount | number | IPC 数量 | 0 | 0-100 |
| nvrType | enum | NVR 类型 | 'builtin' | builtin/external |
| enableAI | boolean | 启用 AI | false | - |
| aiMode | enum | AI 模式 | 'detection' | detection/peopleCount |
| enableIPS | boolean | 启用 IPS | false | - |
| enableDPI | boolean | 启用 DPI | false | - |
| enableContentFilter | boolean | 启用内容过滤 | false | - |
| enableVPN | boolean | 启用 VPN | false | - |
| enableQoS | boolean | 启用 QoS | false | - |

### 4.2 计算常量
| 常量名 | 值 | 单位 | 说明 |
|--------|---|------|------|
| CONTROLLER_BASE_CPU | 933 | DMIPS | Controller 基础 CPU |
| CONTROLLER_PER_DEVICE_CPU | 42 | DMIPS | 每设备 CPU 增量 |
| CONTROLLER_BASE_MEMORY | 1172 | MB | Controller 基础内存 |
| CONTROLLER_PER_DEVICE_MEMORY | 1.78 | MB | 每设备内存增量 |
| GATEWAY_BASE_CPU | 920 | DMIPS | Gateway 基础 CPU |
| GATEWAY_BASE_MEMORY | 150 | MB | Gateway 基础内存 |
| DPI_MEMORY | 60 | MB | DPI 内存消耗 |
| IPS_MEMORY | 215 | MB | IPS 内存消耗 |
| CONTENT_FILTER_MEMORY | 50 | MB | 内容过滤内存消耗 |
| IPS_CPU | 200 | DMIPS | IPS CPU 消耗（预估值）⚠️ |
| VPN_CPU | 300 | DMIPS | VPN CPU 消耗（预估值）⚠️ |
| VPN_MEMORY | 100 | MB | VPN 内存消耗（预估值）⚠️ |
| QOS_CPU | 150 | DMIPS | QoS CPU 消耗（预估值）⚠️ |
| PROTECT_BASE_CPU | 360 | DMIPS | 安防基础 CPU |
| PROTECT_BASE_MEMORY | 928 | MB | 安防基础内存 |
| PROTECT_AI_BUILTIN_CPU | 129600 | DMIPS | 内置NVR+AI CPU（单个IPC）|
| PROTECT_AI_EXTERNAL_CPU | 265225 | DMIPS | 外置NVR+AI CPU（单个IPC）|
| PROTECT_PC_BUILTIN_CPU | 183600 | DMIPS | 内置NVR+PC CPU（单个IPC）|
| PROTECT_PC_EXTERNAL_CPU | 342725 | DMIPS | 外置NVR+PC CPU（单个IPC）|
| PROTECT_BUILTIN_MEMORY | 14.5 | MB | 内置NVR 内存（单个IPC）|
| PROTECT_EXTERNAL_MEMORY | 22 | MB | 外置NVR 内存（单个IPC）|

⚠️ 标记的值为预估值，待研发实测后更新

## 5. 技术方案

### 5.1 技术栈
- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 框架**: Tailwind CSS
- **组件库**: Shadcn Vue
- **状态管理**: Pinia（如需要）
- **表单验证**: Vee-Validate / Zod
- **图表库**: Chart.js / ECharts（用于资源可视化）

### 5.2 项目结构
```
src/
├── components/          # 组件
│   ├── InputPanel/     # 参数输入面板
│   ├── ResultCard/     # 结果卡片
│   └── ui/             # Shadcn UI 组件
├── composables/        # 组合式函数
│   ├── useCalculator.ts   # 计算逻辑
│   └── useProducts.ts     # 产品数据
├── data/               # 数据文件
│   ├── products.ts     # 产品型号数据
│   └── constants.ts    # 计算常量
├── types/              # TypeScript 类型
│   └── index.ts
├── utils/              # 工具函数
│   └── calculator.ts   # 计算工具
└── App.vue             # 主应用

```

### 5.3 核心算法流程
1. 用户输入参数 → 表单验证
2. 触发计算函数（防抖处理）
3. 根据公式计算各模块资源消耗
4. 汇总总资源消耗
5. 遍历产品列表，计算每个型号的资源使用率
6. 筛选和排序推荐型号
7. 更新 UI 展示结果

## 6. 开发计划

### V1 版本（MVP）- 优先级 P0 ✅ 已完成
- ✅ 基础参数输入（AP、Switch、IPC 数量）
- ✅ NVR 类型选择
- ✅ 功能开关（AI、IPS、DPI、Content Filter、VPN、QoS）
- ✅ Controller 和 Gateway 资源计算
- ✅ 安防系统资源计算（AI 模式）
- ✅ CPU 和内存使用率展示
- ✅ 机型推荐（支持 6 个产品型号）
- ✅ 响应式布局

### V2 版本 - 优先级 P1 ✅ 已完成
- ✅ 需求驱动的推荐模式
- ✅ 规格限制检查和智能过滤
- ✅ Guard 启用/禁用开关
- ✅ Clients 数量输入
- ✅ 摄像头分辨率区分（HD/2K/4K）
- ✅ 存储时长选择（1周/2周/1月/3月/6月）
- ✅ 自动推荐硬盘大小
- ✅ 左右布局设计（输入 + 推荐结果）
- ✅ 滑动条输入方式
- ✅ 8 个产品型号支持（含 Network Only）

### V3 版本 - 优先级 P2
- ⏳ 结果导出（PDF/图片）
- ⏳ 多语言支持
- ⏳ 分享链接（URL 参数保存配置）

### V3 版本 - 优先级 P2
- ⏳ 后台管理系统（产品数据和公式配置）
- ⏳ 用户保存方案功能
- ⏳ 与 Store 系统集成
- ⏳ 高级场景模板（办公/学校/酒店/零售）

## 7. 验收标准

### 7.1 功能验收
- [ ] 所有输入参数可正常填写和修改
- [ ] 计算结果准确，误差在 ±15% 以内
- [ ] 资源使用率可视化清晰直观
- [ ] 机型推荐逻辑正确
- [ ] 响应式布局适配移动端和桌面端

### 7.2 性能验收
- [ ] 页面加载时间 < 2s
- [ ] 计算响应时间 < 100ms
- [ ] 无明显的页面卡顿或闪烁

### 7.3 兼容性验收
- [ ] Chrome（最新版本和前一版本）
- [ ] Firefox（最新版本）
- [ ] Safari（最新版本）
- [ ] Edge（最新版本）

## 8. 风险与依赖

### 8.1 风险
- ⚠️ IPS、VPN、QoS 的实际资源消耗待研发实测，当前使用预估值可能不准确
- ⚠️ 产品型号规格可能随硬件更新而变化，需要维护机制
- ⚠️ 计算公式可能需要根据实际测试数据调整

### 8.2 依赖
- 研发团队提供准确的计算公式和参数
- 设计团队提供 UI/UX 设计稿
- 产品团队提供完整的产品型号数据
- 营销团队提供产品图片和描述文案

## 9. 附录

### 9.1 参考资料
- Unifi Resource Calculator: https://ui.com/cloud-gateways/resource-calculator
- Omada 产品规格文档（待补充）

### 9.2 术语表
- **AIO**: All-In-One，一体机
- **DMIPS**: Dhrystone MIPS，CPU 性能度量单位
- **IPC**: IP Camera，网络摄像头
- **NVR**: Network Video Recorder，网络视频录像机
- **IPS**: Intrusion Prevention System，入侵防御系统
- **DPI**: Deep Packet Inspection，深度包检测
- **QoS**: Quality of Service，服务质量

---

**文档版本**: v2.0
**最后更新**: 2025-01-18
**负责人**: Xavier Chen
**状态**: Production
