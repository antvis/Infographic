# 核心概念

本文介绍 AntV Infographic 中的核心概念，帮助你理解框架的设计思想和工作原理。

## 信息图语法

**信息图语法**是创建信息图时传入的配置对象，即 `new Infographic({ ... })` 中的参数。它定义了信息图的所有方面：容器、尺寸、数据、设计、主题等。

```typescript
interface InfographicOptions {
  container?: string | HTMLElement; // 渲染容器
  width?: number; // 画布宽度
  height?: number; // 画布高度
  padding?: Padding; // 容器内边距
  template?: string; // 使用的模板
  design?: DesignOptions; // 设计配置
  data: Data; // 数据（必需）
  theme?: string; // 主题名称
  themeConfig?: ThemeConfig; // 主题配置
}
```

### 基本用法

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    title: '产品特性',
    items: [{ label: '高性能' }, { label: '易用性' }, { label: '可扩展' }],
  },
  design: {
    structure: 'list-column',
    item: 'badge-card',
  },
});

infographic.render();
```

信息图语法是声明式的：你只需描述**想要什么样的信息图**，框架会自动处理渲染细节。

## 设计

**设计（Design）** 定义了信息图的视觉呈现方式，对应配置对象中的 `design` 字段。设计包含三个核心元素：

```typescript
interface DesignOptions {
  structure?: string | StructureOptions; // 结构布局
  title?: string | TitleOptions; // 标题组件
  item?: string | ItemOptions; // 数据项组件
  items?: (string | ItemOptions)[]; // 多层级数据项
}
```

### 设计资产的本质

**所有设计资产本质上都是 JSX 组件**。框架提供了内置的组件库，你也可以注册自定义组件来扩展设计能力。

### 结构（Structure）

**结构**是信息图的骨架，它决定了整体布局和样式。

**结构的职责**：

1. **放置标题** - 确定标题在画布中的位置
2. **布局数据项** - 根据设计意图对数据项进行排列（纵向、横向、网格、树形等）
3. **视觉装饰** - 从美学角度添加装饰元素，提升整体视觉效果

```typescript
// 使用内置结构
design: {
  structure: 'list-column'  // 纵向列表布局
}

// 使用结构并配置参数
design: {
  structure: {
    type: 'list-row',
    gap: 20,           // 数据项间距
    align: 'center'    // 对齐方式
  }
}
```

**为什么需要结构？**

不同的信息表达需要不同的布局方式：

- 并列的特性展示 → 列表结构
- 时间顺序的事件 → 时间轴结构
- 组织架构关系 → 树形结构
- 对比分析 → 对比结构

结构让这些布局模式可复用，你无需关心具体的定位和排列逻辑。

### 标题（Title）

**标题组件**用于展示信息图的标题和副标题，通常位于信息图的顶部。

```typescript
design: {
  title: 'default'  // 使用默认标题组件
}

// 或自定义标题样式
design: {
  title: {
    type: 'default',
    fontSize: 24,
    align: 'center'
  }
}
```

标题本身是普通组件，但由于大多数信息图都需要标题，我们将它作为设计的一部分独立出来，方便配置和复用。

### 数据项（Item）

**数据项组件**用于展示具体的数据内容，是信息图中的最小可视化单元。

```typescript
design: {
  item: 'badge-card'  // 使用徽章卡片样式
}

// 或配置数据项参数
design: {
  item: {
    type: 'badge-card',
    width: 200,
    height: 100,
    iconSize: 32
  }
}
```

**数据项的子元素**

一个数据项可以包含多个子元素（也可以不包含）：

- **标签（Label）** - 数据的名称或类别
- **描述（Desc）** - 详细说明文字
- **图标（Icon）** - 视觉符号
- **值（Value）** - 数值数据
- **插图（Illus）** - 装饰性或说明性图片
- **装饰图形** - 背景、边框等视觉元素

不同的数据项组件会选择性地使用这些子元素。例如，`badge-card` 会显示图标、标签和描述，而 `chart-column` 则侧重于展示数值。

**为什么需要数据项？**

数据项将**数据**与**视觉呈现**解耦。相同的数据可以用不同的数据项组件呈现：

- 用 `badge-card` 呈现 → 卡片风格
- 用 `circular-progress` 呈现 → 环形进度图
- 用 `pill-badge` 呈现 → 胶囊徽章

这让你可以快速切换视觉风格，而无需修改数据结构。

### 多层级数据项（Items）

对于层级结构（如树图、对比图），可以为不同层级配置不同的数据项：

```typescript
design: {
  structure: 'hierarchy-tree',
  items: [
    'circle-node',      // 第一层使用圆形节点
    'rounded-rect-node' // 第二层使用圆角矩形
  ]
}
```

## 模板

**模板（Template）** 是配置的预设组合，用于快速创建特定风格的信息图。

### 模板的本质

模板本质上就是 `design` 和 `themeConfig` 的组合：

```typescript
type TemplateOptions = {
  design?: DesignOptions;
  themeConfig?: ThemeConfig;
  width?: number;
  height?: number;
  padding?: Padding;
};
```

例如，一个流程图模板可能包含：

```typescript
{
  design: {
    structure: {
      type: 'sequence-steps',
      gap: 40
    },
    item: {
      type: 'compact-card',
      width: 240
    }
  },
  themeConfig: {
    colorPrimary: '#1890ff',
    stylize: 'gradient'
  }
}
```

### 注册和使用模板

```typescript
import { registerTemplate, Infographic } from '@antv/infographic';

// 1. 注册模板
registerTemplate('my-process-flow', {
  design: {
    structure: 'sequence-steps',
    item: 'compact-card',
  },
  themeConfig: {
    colorPrimary: '#52c41a',
  },
});

// 2. 使用模板
const infographic = new Infographic({
  container: '#container',
  template: 'my-process-flow', // 引用模板
  data: {
    title: '用户注册流程',
    items: [
      /* ... */
    ],
  },
});

infographic.render();
```

### 覆盖模板配置

使用模板时，可以覆盖模板中的部分配置：

```typescript
new Infographic({
  template: 'my-process-flow',
  themeConfig: {
    colorPrimary: '#ff4d4f', // 覆盖模板的主色
  },
  data: {
    /* ... */
  },
});
```

**为什么需要模板？**

模板解决了**配置复用**的问题。当你找到一个满意的设计配置后，可以将其保存为模板，在多个信息图中复用，保持视觉风格的一致性。

模板的主题配置部分，详见下文的[主题](#主题)章节。

## 数据

**数据（Data）** 定义了信息图要展示的内容。

```typescript
interface Data {
  title?: string; // 标题
  desc?: string; // 描述
  items: ItemDatum[]; // 数据项数组（必需）
  illus?: Record<string, ResourceConfig>; // 全局插图资源
  [key: string]: any; // 自定义字段
}
```

### 数据项结构

每个数据项可以包含以下字段：

```typescript
interface ItemDatum {
  icon?: string | ResourceConfig; // 图标
  label?: string; // 标签
  desc?: string; // 描述
  value?: number; // 数值
  illus?: string | ResourceConfig; // 插图
  children?: ItemDatum[]; // 子节点
  [key: string]: any; // 自定义字段
}
```

### 基本数据示例

```typescript
const data = {
  title: '产品特性',
  desc: '我们的核心优势',
  items: [
    {
      icon: 'star',
      label: '高性能',
      desc: '快速渲染，流畅体验',
      value: 95,
    },
    {
      icon: 'heart',
      label: '易用性',
      desc: '简单配置，快速上手',
      value: 90,
    },
  ],
};
```

### 层级数据

**子节点（children）** 字段用于表示嵌套或分组关系。

#### 场景一：层级结构

适用于树图、组织架构等：

```typescript
const hierarchyData = {
  title: '组织架构',
  items: [
    {
      label: 'CEO',
      children: [
        {
          label: 'CTO',
          children: [{ label: '前端团队' }, { label: '后端团队' }],
        },
        {
          label: 'CFO',
          children: [{ label: '财务部' }, { label: '审计部' }],
        },
      ],
    },
  ],
};
```

#### 场景二：总分关系

适用于对比类信息图。例如，对比 A 和 B 的优缺点：

```typescript
const comparisonData = {
  title: '方案对比',
  items: [
    {
      label: '方案 A',
      children: [
        { label: '成本低', desc: '前期投入少' },
        { label: '上手快', desc: '学习曲线平缓' },
        { label: '生态好', desc: '社区活跃' },
      ],
    },
    {
      label: '方案 B',
      children: [
        { label: '性能强', desc: '处理速度快' },
        { label: '扩展性好', desc: '易于定制' },
        { label: '安全性高', desc: '企业级保障' },
      ],
    },
  ],
};
```

这种情况下，`items` 的长度为 2（A 和 B），每个项的 `children` 包含各自的优点列表。

### 自定义字段

数据结构支持 `[key: string]: any` 字段，你可以添加自定义数据：

```typescript
const data = {
  items: [
    {
      label: '销售额',
      value: 1000000,
      customField: 'some-value', // 自定义字段
      metadata: {
        // 自定义对象
        region: 'Asia',
        quarter: 'Q1',
      },
    },
  ],
};
```

目前框架尚未直接使用自定义字段，但预留了这个能力供未来扩展或自定义组件使用。

## 主题

**主题（Theme）** 定义了信息图的整体视觉风格，包括颜色、字体、图形样式等。

### 主题配置接口

```typescript
interface ThemeConfig {
  colorBg?: string; // 背景色
  colorPrimary?: string; // 主色
  palette?: Palette; // 色板
  stylize?: StylizeConfig; // 风格化
  base?: {
    // 全局基础样式
    shape?: ShapeAttributes; // 图形样式
    text?: TextAttributes; // 文本样式
  };
  title?: TextAttributes; // 标题样式
  desc?: TextAttributes; // 描述样式
  item?: {
    // 数据项样式
    icon?: IconAttributes;
    label?: TextAttributes;
    desc?: TextAttributes;
    value?: TextAttributes;
    shape?: ShapeAttributes;
  };
  elements?: Record<string, ShapeAttributes | TextAttributes>;
}
```

### 核心配置原理

#### 1. 主色与背景色

**colorPrimary** 和 **colorBg** 是主题的基础：

```typescript
themeConfig: {
  colorPrimary: '#1890ff',
  colorBg: '#ffffff'
}
```

**作用机制**：

- `colorPrimary`：影响整体色调，全局图形（背景、装饰元素）会从中取色或基于它计算衍生色
- `colorBg`：画布背景色

框架会基于 `colorPrimary` 自动生成一套色彩系统，包括浅色背景、文本颜色等衍生色。

#### 2. 色板系统

**色板（Palette）** 用于为多个数据项分配颜色。框架支持三种色板类型：

```typescript
type Palette =
  | string // 注册的色板名称
  | string[] // 离散色板（数组）
  | ((ratio: number, index: number, count: number) => string); // 连续色板（回调）
```

**三种类型的使用场景**：

**类型 1：注册的色板**

```typescript
palette: 'antv'; // 使用已注册的色板
```

适用于团队共享的标准色板。

**类型 2：离散色板（数组）**

```typescript
palette: ['#1890ff', '#52c41a', '#faad14', '#f5222d'];
```

适用于固定数量的数据项，按索引循环取色。

**类型 3：连续色板（回调）**

```typescript
palette: (ratio, index, count) => {
  // ratio: 0-1 之间的比例（index / count）
  // index: 当前数据项索引
  // count: 数据项总数
  return `hsl(${ratio * 360}, 70%, 50%)`;
};
```

适用于数量不固定的数据项，可以基于比例计算颜色（如渐变）。

**注册色板**：

```typescript
import { registerPalette } from '@antv/infographic';

registerPalette('my-palette', ['#e6f7ff', '#1890ff', '#003a8c']);
```

**未设置色板时**：所有数据项使用 `colorPrimary` 颜色，信息图呈现单一色调。

#### 3. 风格化系统

**stylize** 用于应用特殊的视觉风格：

```typescript
stylize: 'rough'; // 手绘风格
stylize: 'gradient'; // 渐变效果
stylize: 'pattern'; // 图案纹理
```

风格化会全局影响图形的渲染方式，改变视觉表现。

### theme 和 themeConfig

框架提供两种配置主题的方式：

```typescript
new Infographic({
  theme: 'dark', // 使用注册的主题
  themeConfig: {
    // 覆盖部分配置
    colorPrimary: '#1890ff',
  },
});
```

**它们的关系**：

- `theme`：指定使用哪个主题（内置或已注册）
- `themeConfig`：对主题进行二次配置，会**合并覆盖**主题中的配置

这种设计允许你基于现有主题快速定制，而无需从零配置。

**注册自定义主题**：

```typescript
import { registerTheme } from '@antv/infographic';

registerTheme('my-theme', {
  colorPrimary: '#722ed1',
  palette: ['#722ed1', '#eb2f96', '#fa8c16'],
});
```

### 样式层级

主题配置具有层级结构，越具体的配置优先级越高：

1. **base** - 全局基础样式（最低优先级）
2. **title / desc** - 标题和描述样式
3. **item** - 数据项子元素样式（label、desc、icon 等）
4. **elements** - 特定命名元素样式（最高优先级）

这让你可以设置全局默认样式，同时针对特定元素精细调整。

### 深入学习

主题系统的详细使用方法、最佳实践和完整示例，请参考 **[主题系统指南](/guide/theme)**

## 资源

**资源（Resource）** 指信息图中使用的外部图标和插图。

### 为什么需要资源？

AntV Infographic 是**前端信息图渲染框架**，专注于信息图的渲染和布局逻辑，它**本身不提供任何图标和插图素材**。

这种设计的原因：

1. **灵活性** - 你可以使用任何图标库（Font Awesome、Material Icons、自定义 SVG 等）
2. **减少体积** - 不内置资源，保持框架轻量
3. **品牌定制** - 使用符合品牌规范的图标和插图

当信息图需要显示图标或插图时，必须通过**资源加载器**提供这些素材。

### 资源配置接口

在数据中，图标（icon）和插图（illus）支持两种配置方式：

```typescript
// 方式 1：字符串（简单场景）
icon: 'star';

// 方式 2：ResourceConfig 对象（复杂场景）
icon: {
  type: 'custom', // 资源类型
  data: 'icon-name'; // 资源标识
};
```

**ResourceConfig 类型定义**：

```typescript
interface ResourceConfig {
  type: 'image' | 'svg' | 'remote' | 'custom'; // 资源类型
  data: string; // 资源标识或数据
  [key: string]: any; // 可扩展的自定义字段
}
```

### 资源加载机制

框架通过**资源加载器（Resource Loader）** 来获取实际的图标和插图内容：

```typescript
type ResourceLoader = (config: ResourceConfig) => Promise<Resource>;
```

**工作流程**：

1. 框架解析数据中的 `icon` 和 `illus` 字段
2. 转换为 `ResourceConfig` 对象
3. 调用已注册的资源加载器
4. 加载器返回 SVG 资源对象
5. 框架渲染到信息图中

**基本用法**：

```typescript
import { registerResourceLoader, loadSVGResource } from '@antv/infographic';

// 注册全局资源加载器
registerResourceLoader(async (config) => {
  // 从你的服务加载 SVG
  const svgString = await fetch(`/api/icons/${config.data}`).then((r) =>
    r.text(),
  );

  // 转换为资源对象
  return loadSVGResource(svgString);
});
```

注册后，所有信息图都会使用这个加载器来加载资源。

### 深入学习

- **[资源加载器指南](/guide/resource-loader)** - 详细的实践指南，包括内置协议、自定义加载器、缓存优化等
- **[资源加载 API](/api/resources)** - 完整的 API 参考文档

## 深入学习

### 理论基础

想要创建更专业的信息图？了解信息图设计的理论基础将帮助你做出更好的设计决策：

- **[信息图理论](/theory/)** - 了解信息图的基本概念和设计原理
- **[信息图分类](/theory/classification)** - 认识不同类型的信息图及其应用场景
- **[设计原则](/theory/design)** - 掌握信息图设计的核心原则

### 实践指南

- 查看[示例](/examples/)学习常见用法
- 阅读[主题系统](/guide/theme)自定义视觉风格
- 了解[资源加载器](/guide/resource-loader)加载图标和插图
- 探索[高级用法](/guide/advanced)了解进阶特性

### API 参考

- 查看[结构组件 API](/api/structures)了解所有结构组件
- 查看[数据项组件 API](/api/items)了解所有数据项组件
