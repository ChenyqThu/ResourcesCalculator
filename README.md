# Omada AIO 智能推荐系统

## 项目简介

Omada AIO（All-In-One）智能推荐系统是一个基于需求驱动的产品选型工具。用户只需输入实际的网络和安防需求，系统会自动计算资源消耗，并智能推荐最合适的 Omada 一体机型号。

## 核心特性

### ✨ 智能推荐模式
- **需求驱动**：用户先输入需求，系统根据需求推荐机型
- **规格匹配**：自动检查设备数量、客户端数量、摄像头数量是否超过产品规格限制
- **类型优先**：无 Guard 需求时优先推荐 Network Only 产品，避免过度配置
- **存储推荐**：根据摄像头数量和保存时长，自动推荐合适的硬盘规格

### 📊 左右布局设计
- **输入表单**：左右卡片布局（Network | Guard），滑动条输入
- **推荐结果**：左侧机型列表 + 右侧详细信息，一目了然
- **实时响应**：参数变化时即时更新推荐结果

### 🎯 精准计算
- **资源计算**：基于实际公式精确计算 CPU、Memory 消耗
- **使用率评估**：综合使用率（取 CPU 和 Memory 最大值）
- **状态分级**：低负载、适中、较高、超载四种状态
- **推荐分类**：推荐、性价比、高性能三种类型

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 7
- **UI 框架**: Tailwind CSS 4
- **语言**: TypeScript 5.9
- **工具库**: @vueuse/core, clsx, tailwind-merge

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录

### 预览生产构建

```bash
npm run preview
```

## 产品型号数据

### 产品列表

| 型号 | 服务类型 | CPU | Memory | 存储 | 管理规模 |
|------|---------|-----|--------|------|---------|
| **Fusion Pro Wi-Fi 7** | Network + Guard | 19.5K DMIPS (4 cores) | 4GB | SD 卡 1TB | 300 clients, 30 devices<br>10*HD / 4*2K / 2*4K cameras |
| **Fusion G+** | Network Only | 13.8K DMIPS (4 cores) | 3GB | 无 | 300 clients, 30 devices |
| **Fusion 2.5G** | Network Only | 18.4K DMIPS (4 cores) | 2GB | 无 | 300 clients, 30 devices |
| **Fusion Pro 2.5G** | Network + Guard | 34.6K DMIPS (4 cores) | 4GB | SSD 4TB (单盘位) | 300 clients, 30 devices<br>15*HD / 8*2K / 5*4K cameras |
| **Fusion Pro 2.5G PoE** | Network + Guard | 34.6K DMIPS (4 cores) | 4GB | SSD 4TB (单盘位) | 300 clients, 30 devices<br>15*HD / 8*2K / 5*4K cameras |
| **Fusion Pro 10G** | Network + Guard | 42.2K DMIPS (4 cores) | 4GB | SSD 4TB (单盘位) | 500 clients, 50 devices<br>15*HD / 8*2K / 5*4K cameras |
| **Fusion Max 10G** | Network + Guard | 51.0K DMIPS (8 cores) | 8GB | HDD 48TB (双盘位) | 2000 clients, 200 devices<br>50*HD / 25*2K / 15*4K cameras |
| **Fusion Max 10G PoE** | Network + Guard | 51.0K DMIPS (8 cores) | 8GB | HDD 48TB (双盘位) | 2000 clients, 200 devices<br>50*HD / 25*2K / 15*4K cameras |

### 服务类型说明

- **Network Only**: 仅支持网络功能（Controller + Gateway），不支持 Guard（安防）
- **Network + Guard**: 支持完整功能（Controller + Gateway + Guard）

### 存储类型说明

- **SD 卡**: 最大容量 1TB，适合小规模存储
- **SSD**: 单盘位，最大容量 4TB，适合中等规模存储
- **HDD**: 双盘位，最大容量 48TB（24TB × 2），适合大规模长期存储

## 核心计算公式

### Controller 资源计算

```
CPU (DMIPS) = 933 + 42 × (AP数量 + Switch数量)
内存 (MB) = 1172 + 1.78 × (AP数量 + Switch数量)
```

### Gateway 资源计算

```
CPU (DMIPS) = 920 + IPS算力 + VPN算力 + QoS算力
内存 (MB) = 150 + DPI内存(60) + IPS内存(215) + Content Filter内存(50) + VPN内存(100)
```

**注意**: IPS、VPN、QoS 的 CPU 消耗为预估值，需研发实测确认。

### Protect (Guard) 资源计算

#### CPU 成本构成

基础成本：150 (连接+无图事件+巡店)
- 内置 NVR：+ 170 (内置NVR事件+播放+AI数据流推送) = 320 DMIPS/camera
- 外置 NVR：+ 325 (Relay推拉流) = 475 DMIPS/camera

AI 增量成本（可多选）：
- 人形车形检测：+ 40 DMIPS/camera
- People Count：+ 190 DMIPS/camera

**公式示例**：
```
开启人形车形检测：
CPU = 360 + (320 + 40) × n1 + (475 + 40) × n2 = 360 + 360 × n1 + 515 × n2

开启 People Count：
CPU = 360 + (320 + 190) × n1 + (475 + 190) × n2 = 360 + 510 × n1 + 665 × n2

两个都开：
CPU = 360 + (320 + 40 + 190) × n1 + (475 + 40 + 190) × n2 = 360 + 550 × n1 + 705 × n2
```

#### 内存计算

```
内存 (MB) = 928 + 14.5 × n1 + 22 × n2
```

其中：
- n1 = 内置NVR下的IPC数量
- n2 = 外置NVR下的IPC数量

**注意**: CPU/内存消耗与摄像头清晰度无关，主要取决于摄像头总数。

### 存储需求计算

#### 每日存储需求

```
HD (1080p): 12 GB/天/camera
2K: 22 GB/天/camera
4K: 45 GB/天/camera
```

#### 推荐硬盘大小

根据摄像头数量、类型和期望保存时长，按市面规格向上推荐：
- 可用规格：1TB、8TB、16TB、28TB
- 计算公式：`需要容量 = 每日存储 × 摄像头数量 × 保存天数`
- 推荐规则：选择满足需求的最小规格

## 推荐算法

### 规格限制检查

系统会自动检查以下规格限制：
1. **Clients 数量**：是否超过产品上限
2. **设备数量**（AP + Switch）：是否超过产品上限
3. **摄像头数量**：HD/2K/4K 各类型是否超过产品规格
4. **Guard 支持**：如果需要 Guard，过滤掉 Network Only 产品
5. **存储容量**：推荐硬盘是否在产品支持的存储范围内

**超限处理**：如果超过规格限制，该产品的推荐度会大幅下滑（标记为超载状态）。

### 推荐类型分类

根据综合使用率（CPU 和 Memory 使用率的最大值）：

- **推荐** (Recommended): 75% - 85%，资源利用充分且留有余量
- **性价比** (Value): 60% - 75%，性价比较高，资源余量较大
- **高性能** (Advanced): < 60%，性能冗余，适合未来扩展

### 排序规则

1. **Guard 需求匹配**：如果不需要 Guard，Network Only 产品优先
2. **推荐类型**：Recommended > Value > Advanced
3. **使用率优化**：
   - Recommended 类型：越接近 80% 越好
   - Value 类型：使用率从高到低排序
   - Advanced 类型：使用率从低到高排序（留有更多余量）

## 使用流程

1. **输入网络需求**
   - Switch 数量（滑动条）
   - AP 数量（滑动条）
   - Clients 数量（滑动条）
   - Gateway 功能选择（IPS、DPI、Content Filter、VPN、QoS）

2. **输入 Guard 需求**（可选）
   - 启用/关闭 Guard 功能
   - HD/2K/4K 摄像头数量（滑动条）
   - 期望保存时长（1周/2周/1月/3月/6月）
   - NVR 类型（内置/外置）
   - AI 功能选择（人形车形检测、People Count）

3. **查看推荐结果**
   - 左侧：推荐机型列表（按推荐度排序）
   - 右侧：选中机型的详细信息
     - 硬件规格（CPU、Memory）
     - 管理规模限制
     - 存储配置
     - 推荐硬盘大小（仅 Guard 模式）
     - 资源占用情况

## 项目结构

```
src/
├── components/
│   ├── calculator/
│   │   ├── RecommendationInput.vue      # 需求输入组件（左右卡片）
│   │   ├── RecommendationResults.vue    # 推荐结果组件（列表+详情）
│   │   ├── ApplicationCard.vue          # 应用卡片组件
│   │   ├── ModelSelector.vue            # 机型选择器（已废弃）
│   │   ├── ProductCard.vue              # 产品卡片
│   │   └── ResourceBars.vue             # 资源条（已废弃）
│   └── ui/                              # 基础 UI 组件
├── composables/
│   ├── useCalculator.ts                 # 计算器逻辑
│   └── useRecommendation.ts             # 推荐引擎逻辑
├── data/
│   ├── products.ts                      # 产品数据（8个型号）
│   └── constants.ts                     # 计算常量
├── types/
│   └── index.ts                         # TypeScript 类型定义
├── utils/
│   └── calculator.ts                    # 计算工具函数
└── App.vue                              # 主应用
```

## 文档

- [PRD - 产品需求文档](./PRD.md)
- [ARCHITECTURE - 系统架构设计](./ARCHITECTURE.md)

## 更新日志

### v2.0 - 智能推荐模式 (2025-01-18)

- ✅ 重构为需求驱动的推荐模式
- ✅ 添加 8 个产品型号（含 Network Only 型号）
- ✅ 添加规格限制检查和智能过滤
- ✅ 优化推荐算法，Guard 需求匹配
- ✅ 左右布局设计，提升用户体验
- ✅ 自动推荐硬盘大小功能
- ✅ 滑动条输入方式，操作更直观

### v1.0 - 初始版本

- ✅ 基础资源计算功能
- ✅ 产品推荐功能
- ✅ 资源使用率可视化

## 许可证

© 2025 TP-Link Systems Inc. All rights reserved.
