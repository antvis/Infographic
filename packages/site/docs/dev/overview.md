# 项目概览

本文档介绍 Infographic 项目的整体架构和各子包的功能划分。

## 项目架构

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*_rNMTLEdogUAAAAAV5AAAAgAemJ7AQ/original" alt="Infographic 项目架构图" style={{background: '#262258', borderRadius: 16}} />

Infographic 是一个强大的信息图生成与渲染框架，基于 JSX 和 SVG 技术构建。项目采用 **monorepo** 架构，由以下子包组成：

```
infographic/
├── packages/
│   ├── jsx/                    # @antv/infographic-jsx
│   ├── infographic/            # @antv/infographic
│   ├── dev/                    # 开发预览环境
│   └── site/                   # @antv/infographic-site
```

## 子包功能划分

### @antv/infographic-jsx

**轻量级的 JSX 运行时引擎**，为整个信息图框架提供底层渲染能力。

- **定位**：独立的 JSX 到 SVG 渲染引擎
- **核心功能**：
  - 实现完整的 JSX 运行时（jsx、jsxs、jsxDEV、Fragment）
  - 提供原语节点组件（Rect、Ellipse、Text、Group、Path、Polygon、Defs）
  - 支持自动布局和边界计算
  - 渲染输出优化的 SVG 字符串
- **特点**：零依赖、类型安全、可独立使用
- **包大小**：约 20KB（gzipped）

**典型用法**：

```tsx
/** @jsxImportSource @antv/infographic-jsx */
import { renderSVG, Rect, Text, Group } from '@antv/infographic-jsx';

const MyGraphic = () => (
  <Group>
    <Rect width={100} height={50} fill="blue" />
    <Text x={10} y={30} fill="white">
      Hello
    </Text>
  </Group>
);

const svg = renderSVG(<MyGraphic />);
```

### @antv/infographic

**核心信息图框架**，基于 jsx 引擎构建的完整信息图解决方案。

- **定位**：信息图生成的主库，面向最终用户
- **核心功能**：
  - 提供 `Infographic` 类作为统一入口
  - 包含 27+ 内置数据项组件（卡片、图表、箭头、文本等）
  - 提供 25+ 内置结构布局（列表、对比、顺序、层级、关系等）
  - 完整的主题系统和颜色生成算法
  - 强大的资源加载机制（图标、插图）
  - 声明式配置解析
  - 高性能 SVG 渲染管线
- **特点**：组件化设计、高度可扩展、开箱即用

**典型用法**：

```typescript
import { Infographic } from '@antv/infographic';

new Infographic({
  container: '#container',
  data: {
    title: '产品开发流程',
    items: [
      { label: '需求分析', icon: 'lightbulb' },
      { label: '设计阶段', icon: 'design' },
      { label: '开发实现', icon: 'code' },
    ],
  },
  design: {
    structure: 'list-column',
    item: 'badge-card',
  },
}).render();
```

### packages/dev

**开发预览环境**，提供可视化的开发和调试能力。

- **定位**：可视化开发工具
- **技术栈**：React 19 + Ant Design 5 + Vite
- **核心功能**：
  - **灵活组合** Tab：快速测试和组装设计资产
    - 选择任意结构 + 数据项组合
    - 切换不同数据集（列表、层级、对比等）
    - 实时预览效果
    - 调整主题和颜色
  - **模板预览** Tab：预览和测试内置模板
    - 浏览所有已注册模板
    - 数据集自动适配
    - URL 分享功能
  - 配置导出功能
- **特点**：实时预览、配置持久化、易于调试

**工作流程**：

1. 开发新组件 → 在 Dev 环境预览
2. 测试不同组合 → 调整参数
3. 导出配置 → 保存为模板
4. 迭代优化

### @antv/infographic-site

**项目文档网站**，使用 VitePress 构建的官方文档。

- **定位**：用户文档和示例展示
- **技术栈**：VitePress + Vue 3 + TypeScript
- **内容结构**：
  - **指南**：快速开始、核心概念、主题系统、高级用法、开发者指南
  - **理论**：信息图分类、设计原则、构成要素
  - **API**：完整的 API 参考文档
  - **示例**：各类应用场景示例
- **特点**：搜索功能、响应式设计、代码高亮

## 依赖关系

```
@antv/infographic-jsx (底层)
    ↓
    ├── @antv/infographic (核心库)
    │   ↓
    │   ├── packages/dev (开发工具，依赖核心库)
    │   └── @antv/infographic-site (文档，依赖核心库)
    │
    └── 也可独立使用
```

**说明**：

- jsx 引擎是基础，可以独立使用
- infographic 核心库依赖 jsx 引擎
- dev 和 site 都依赖 infographic 核心库
- jsx 引擎也可以被其他项目单独使用

## 技术选型

### 核心技术

| 技术           | 用途     | 原因                       |
| -------------- | -------- | -------------------------- |
| **TypeScript** | 类型系统 | 类型安全、更好的开发体验   |
| **JSX**        | 模板语法 | 声明式、组件化、熟悉的语法 |
| **SVG**        | 渲染目标 | 矢量图形、可缩放、高质量   |

### 工具链

| 工具         | 用途       |
| ------------ | ---------- |
| **pnpm**     | 包管理器   |
| **Vite**     | 构建工具   |
| **Vitest**   | 单元测试   |
| **ESLint**   | 代码检查   |
| **Prettier** | 代码格式化 |

### 第三方库

| 库             | 用途         | 位置                 |
| -------------- | ------------ | -------------------- |
| **d3**         | 复杂布局算法 | infographic          |
| **tinycolor2** | 颜色处理     | infographic          |
| **roughjs**    | 手绘风格     | infographic/renderer |
| **React**      | UI 框架      | dev                  |
| **Ant Design** | 组件库       | dev                  |
| **VitePress**  | 文档生成     | site                 |

## 开发环境要求

- **Node.js**：>= 18.0.0
- **pnpm**：>= 8.0.0
- **操作系统**：macOS、Linux、Windows

## 快速启动

### 1. 克隆仓库

```bash
git clone https://github.com/antvis/infographic.git
cd infographic
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发环境

```bash
# 启动 dev 预览环境
cd packages/dev
npm run dev

# 启动文档网站
cd packages/site
npm run dev
```

### 4. 构建

```bash
# 构建所有包
pnpm build

# 构建特定包
pnpm --filter @antv/infographic-jsx build
pnpm --filter @antv/infographic build
```

### 5. 测试

```bash
# 运行所有测试
pnpm test

# 运行 jsx 包测试
pnpm --filter @antv/infographic-jsx test
```

## 项目结构

```
infographic/
├── packages/
│   ├── jsx/                          # JSX 引擎
│   │   ├── src/
│   │   │   ├── components/          # 原语节点
│   │   │   ├── types/               # 类型定义
│   │   │   ├── utils/               # 工具函数
│   │   │   ├── jsx-runtime.ts       # JSX 运行时
│   │   │   ├── renderer.ts          # 渲染器
│   │   │   ├── layout.ts            # 布局系统
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── infographic/                  # 核心库
│   │   ├── src/
│   │   │   ├── runtime/             # Infographic 类
│   │   │   ├── designs/             # 设计资产
│   │   │   │   ├── items/           # 27+ 数据项
│   │   │   │   ├── structures/      # 25+ 结构
│   │   │   │   ├── components/      # 通用组件
│   │   │   │   ├── layouts/         # 布局组件
│   │   │   │   ├── decorations/     # 装饰元素
│   │   │   │   └── defs/            # SVG 定义
│   │   │   ├── options/             # 配置解析
│   │   │   ├── resource/            # 资源加载
│   │   │   ├── renderer/            # SVG 渲染器
│   │   │   ├── themes/              # 主题系统
│   │   │   ├── templates/           # 模板注册
│   │   │   └── utils/               # 工具函数
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── dev/                          # 开发环境
│   │   ├── src/
│   │   │   ├── App.tsx              # 主应用
│   │   │   ├── Composite.tsx        # 灵活组合
│   │   │   ├── Preview.tsx          # 模板预览
│   │   │   ├── Infographic.tsx      # 渲染组件
│   │   │   └── data.ts              # 示例数据
│   │   ├── package.json
│   │   └── index.html
│   │
│   └── site/                         # 文档网站
│       ├── .vitepress/
│       │   ├── config.mts           # VitePress 配置
│       │   └── theme/               # 自定义主题
│       ├── guide/                   # 用户指南
│       ├── api/                     # API 文档
│       ├── theory/                  # 理论文档
│       ├── examples/                # 示例
│       └── index.md                 # 首页
│
├── pnpm-workspace.yaml              # pnpm 工作区配置
├── package.json                     # 根 package.json
├── tsconfig.json                    # TypeScript 配置
└── README.md                        # 项目 README
```

## 下一步

- [JSX 引擎详解](./jsx-engine.md) - 了解底层 JSX 渲染引擎
- [设计资产开发](./design-assets.md) - 学习如何开发数据项和结构
- [框架内部原理](./framework-internals.md) - 深入理解框架实现
- [Dev 环境使用](./dev-environment.md) - 使用开发工具
- [AI 辅助开发](./ai-assisted-development.md) - 使用 AI 快速开发组件
