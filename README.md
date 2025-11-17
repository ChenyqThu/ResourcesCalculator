# Omada AIO 资源计算器

## 项目简介

Omada AIO（All-In-One）资源计算器是一个智能化的产品选型工具，帮助用户根据实际业务需求（网络规模、安防需求、功能选项等）快速选择合适的 Omada 一体机型号。

## 功能特性

- ✅ **智能计算**：根据 AP、Switch、IPC 数量及功能选项，实时计算资源消耗
- ✅ **产品推荐**：自动推荐性价比、推荐型号和进阶型号
- ✅ **可视化展示**：直观的资源使用率进度条和状态标签
- ✅ **响应式设计**：完美适配桌面端和移动端
- ✅ **实时计算**：输入参数变化时即时更新结果

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI 框架**: Tailwind CSS
- **语言**: TypeScript
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

## 核心计算公式

### Controller 资源计算

```
CPU (DMIPS) = 933 + 42 × (AP数量 + Switch数量)
内存 (MB) = 1172 + 1.78 × (AP数量 + Switch数量)
```

### Gateway 资源计算

```
CPU (DMIPS) = 920 + IPS算力 + VPN算力 + QoS算力
内存 (MB) = 150 + DPI内存 + IPS内存 + Content Filter内存 + VPN内存
```

### Protect (安防) 资源计算

**开启 AI - 人形车形检测：**
```
CPU (DMIPS) = 360 + 129600 × n1 + 265225 × n2
内存 (MB) = 928 + 14.5 × n1 + 22 × n2
```

**开启 People Count：**
```
CPU (DMIPS) = 360 + 183600 × n1 + 342725 × n2
内存 (MB) = 928 + 14.5 × n1 + 22 × n2
```

其中：
- n1 = 内置NVR下的IPC数量
- n2 = 外置NVR下的IPC数量

## 文档

- [PRD - 产品需求文档](./PRD.md)
- [ARCHITECTURE - 系统架构设计](./ARCHITECTURE.md)

## 许可证

© 2025 TP-Link Systems Inc. All rights reserved.
