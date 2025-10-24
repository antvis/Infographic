# @antv/infographic 入门教程

欢迎使用 @antv/infographic，这是一个强大而灵活的信息图生成与渲染框架。本教程将帮助你快速上手并创建第一个信息图。

## 目录

- [什么是 Infographic](#什么是-infographic)
- [快速开始](#快速开始)
- [核心概念](#核心概念)
- [创建第一个信息图](#创建第一个信息图)
- [使用内置模板](#使用内置模板)
- [自定义主题](#自定义主题)
- [进阶用法](#进阶用法)
- [下一步](#下一步)

## 什么是 Infographic

@antv/infographic 是一个基于 SVG 的信息图生成框架，允许你通过简单的配置生成美观、可交互的信息图表。框架提供了丰富的内置组件和灵活的扩展机制，适用于数据可视化、流程图、组织架构图等多种场景。

### 主要特性

- 声明式配置，易于使用
- 丰富的内置组件和模板
- 灵活的主题系统
- 支持自定义扩展
- 基于 SVG，高质量输出

## 快速开始

### 安装

```bash
npm install @antv/infographic
# 或
pnpm add @antv/infographic
# 或
yarn add @antv/infographic
```

### 最简单的示例

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container', // 容器选择器或 HTMLElement
  data: {
    title: '我的第一个信息图',
    items: [
      { label: '步骤 1', desc: '开始' },
      { label: '步骤 2', desc: '进行中' },
      { label: '步骤 3', desc: '完成' },
    ],
  },
});

infographic.render();
```

## 核心概念

在深入使用之前，让我们理解 Infographic 的核心概念：

### 1. 数据 (Data)

数据是信息图的内容来源，包含标题、描述和数据项。

```typescript
interface Data {
  title?: string;         // 标题
  desc?: string;          // 描述
  items: ItemDatum[];     // 数据项数组
  illus?: Record<string, string | ResourceConfig>; // 插图资源
}

interface ItemDatum {
  icon?: string | ResourceConfig;  // 图标
  label?: string;                   // 标签
  desc?: string;                    // 描述
  value?: number;                   // 数值
  illus?: string | ResourceConfig;  // 插图
  children?: ItemDatum[];           // 子项（用于层级结构）
}
```

### 2. 结构 (Structure)

结构定义了数据项的组织和布局方式。框架提供了多种内置结构：

- **列表结构** (`list-*`): 信息项并列排布
  - `list-column`: 纵向列表
  - `list-row`: 横向列表
  - `list-grid`: 网格列表
  - `list-waterfall`: 瀑布流列表

- **对比结构** (`compare-*`): 二元或多元对比布局
  - `compare-left-right`: 左右对比
  - `compare-mirror`: 镜像对比

- **顺序结构** (`sequence-*`): 具有方向性和顺序性
  - `sequence-timeline`: 时间轴
  - `sequence-steps`: 步骤流程
  - `sequence-roadmap-vertical`: 垂直路线图

- **层级结构** (`hierarchy-*`): 树状或主次关系
  - `hierarchy-tree`: 树形结构
  - `hierarchy-pyramid`: 金字塔结构

- **关系结构** (`relation-*`): 展示元素间的连接关系
  - `relation-circle`: 圆形关系图
  - `relation-network`: 网络图

### 3. 数据项 (Item)

数据项是信息图中的基本信息单元，负责展示单个数据元素。框架提供了多种内置数据项：

- `badge-card`: 徽章卡片
- `icon-badge`: 图标徽章
- `plain-text`: 纯文本
- `progress-card`: 进度卡片
- `chart-column`: 柱状图
- `circular-progress`: 环形进度
- 等等...

### 4. 主题 (Theme)

主题定义了信息图的视觉风格，包括颜色、字体等。

```typescript
interface ThemeConfig {
  colorPrimary?: string;        // 主色
  fontFamily?: string;          // 字体
  fontSize?: number;            // 字号
  stylize?: 'rough' | 'pattern' | 'gradient'; // 风格化
  palette?: string;             // 调色板
}
```

### 5. 模板 (Template)

模板是预定义的配置组合，可以快速创建特定类型的信息图。

## 创建第一个信息图

让我们创建一个更完整的信息图示例。

### 示例 1：简单的步骤列表

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: 800,
  height: 600,
  data: {
    title: '产品开发流程',
    desc: '从需求到上线的完整流程',
    items: [
      {
        icon: 'lightbulb',
        label: '需求分析',
        desc: '收集和分析用户需求',
        value: 1,
      },
      {
        icon: 'design',
        label: '设计阶段',
        desc: '完成 UI/UX 设计',
        value: 2,
      },
      {
        icon: 'code',
        label: '开发实现',
        desc: '编码和单元测试',
        value: 3,
      },
      {
        icon: 'test',
        label: '测试验证',
        desc: '功能和性能测试',
        value: 4,
      },
      {
        icon: 'rocket',
        label: '上线发布',
        desc: '部署到生产环境',
        value: 5,
      },
    ],
  },
  design: {
    structure: 'list-column',  // 使用纵向列表结构
    item: 'badge-card',         // 使用徽章卡片样式
  },
  theme: 'default',
  themeConfig: {
    colorPrimary: '#1890ff',
  },
});

infographic.render();
```

### 示例 2：对比图

```typescript
const comparisonInfographic = new Infographic({
  container: '#container',
  data: {
    title: '产品版本对比',
    items: [
      {
        label: '基础版',
        desc: '适合个人用户',
        value: 99,
      },
      {
        label: '专业版',
        desc: '适合团队使用',
        value: 299,
      },
      {
        label: '企业版',
        desc: '企业级解决方案',
        value: 999,
      },
    ],
  },
  design: {
    structure: 'compare-left-right',
    item: 'progress-card',
  },
});

comparisonInfographic.render();
```

### 示例 3：层级结构

```typescript
const hierarchyInfographic = new Infographic({
  container: '#container',
  data: {
    title: '组织架构',
    items: [
      {
        label: 'CEO',
        children: [
          {
            label: 'CTO',
            children: [
              { label: '前端团队' },
              { label: '后端团队' },
            ],
          },
          {
            label: 'CMO',
            children: [
              { label: '市场部' },
              { label: '销售部' },
            ],
          },
        ],
      },
    ],
  },
  design: {
    structure: 'hierarchy-tree',
    item: 'rounded-rect-node',
  },
});

hierarchyInfographic.render();
```

## 使用内置模板

模板提供了快速创建常见信息图的方式。

```typescript
import { Infographic, getTemplates } from '@antv/infographic';

// 查看所有可用模板
const templates = getTemplates();
console.log(templates);

// 使用模板
const infographic = new Infographic({
  container: '#container',
  template: 'process-flow', // 使用流程图模板
  data: {
    title: '用户注册流程',
    items: [
      { label: '填写信息' },
      { label: '验证邮箱' },
      { label: '完成注册' },
    ],
  },
});

infographic.render();
```

## 自定义主题

### 使用内置主题

```typescript
import { getThemes } from '@antv/infographic';

// 查看所有可用主题
const themes = getThemes();
console.log(themes);

const infographic = new Infographic({
  container: '#container',
  theme: 'dark', // 使用深色主题
  data: { /* ... */ },
});
```

### 自定义主题配置

```typescript
const infographic = new Infographic({
  container: '#container',
  themeConfig: {
    colorPrimary: '#52c41a',     // 自定义主色
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    stylize: 'rough',             // 手绘风格
  },
  data: { /* ... */ },
});
```

### 注册自定义主题

```typescript
import { registerTheme } from '@antv/infographic';

registerTheme('my-theme', {
  seed: {
    colorPrimary: '#722ed1',
    fontFamily: 'Georgia, serif',
  },
});

// 使用自定义主题
const infographic = new Infographic({
  container: '#container',
  theme: 'my-theme',
  data: { /* ... */ },
});
```

## 进阶用法

### 加载外部资源

```typescript
const infographic = new Infographic({
  container: '#container',
  data: {
    title: '产品特性',
    items: [
      {
        icon: { url: 'https://example.com/icon1.svg' },
        label: '高性能',
        illus: { url: 'https://example.com/chart1.png' },
      },
      {
        icon: { url: 'https://example.com/icon2.svg' },
        label: '易用性',
      },
    ],
    illus: {
      background: 'https://example.com/bg.jpg',
    },
  },
});
```

### 数值格式化

```typescript
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [
      { label: '销售额', value: 1234567 },
      { label: '用户数', value: 98765 },
    ],
  },
  design: {
    item: {
      type: 'badge-card',
      valueFormatter: (value: number) => {
        return (value / 10000).toFixed(1) + '万';
      },
    },
  },
});
```

### 自定义尺寸和间距

```typescript
const infographic = new Infographic({
  container: '#container',
  width: 1200,
  height: 800,
  padding: { top: 20, right: 40, bottom: 20, left: 40 },
  data: { /* ... */ },
  design: {
    structure: {
      type: 'list-column',
      gap: 30, // 自定义间距
    },
    item: {
      type: 'badge-card',
      width: 300,
      height: 100,
    },
  },
});
```

### 导出 SVG

```typescript
import { parseSVG } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: { /* ... */ },
});

infographic.render();

// 获取容器中的 SVG
const container = document.querySelector('#container');
const svgElement = container.querySelector('svg');

// 导出为字符串
const svgString = svgElement.outerHTML;

// 或者使用框架提供的工具
const parsedSVG = parseSVG(svgString);
```

## 下一步

现在你已经掌握了 Infographic 的基础用法，可以继续学习：

1. [API 文档](./api.md) - 详细的 API 参考
2. [开发指南](./src/designs/items/prompt.md) - 创建自定义数据项
3. [结构开发](./src/designs/structures/prompt.md) - 创建自定义结构
4. 示例项目 - 查看更多实际应用案例

如有问题或建议，欢迎在 GitHub 上提 Issue 或 PR！
