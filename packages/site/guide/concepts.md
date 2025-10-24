# 核心概念

在深入使用 Infographic 之前，让我们理解框架的核心概念。

## 数据 (Data)

数据是信息图的内容来源，包含标题、描述和数据项。

### 数据结构

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

### 示例

```typescript
const data = {
  title: '季度业绩报告',
  desc: '2024 Q1 各部门业绩概览',
  items: [
    {
      icon: 'chart',
      label: '销售部',
      desc: '超额完成目标',
      value: 125,
    },
    {
      icon: 'users',
      label: '市场部',
      desc: '用户增长显著',
      value: 110,
    },
  ],
};
```

## 结构 (Structure)

结构定义了数据项的组织和布局方式。框架提供了多种内置结构，每种结构适用于不同的信息组织场景。

### 结构分类

#### 列表结构 (`list-*`)

信息项并列排布，无明显方向性或层级关系。

- `list-column` - 纵向列表
- `list-row` - 横向列表
- `list-grid` - 网格列表
- `list-waterfall` - 瀑布流列表
- `list-sector` - 扇形列表

**适用场景**：产品特性展示、服务列表、功能清单

```typescript
design: {
  structure: 'list-column'
}
```

#### 对比结构 (`compare-*`)

明确的二元或多元对比布局。

- `compare-left-right` - 左右对比
- `compare-mirror` - 镜像对比
- `compare-hierarchy-row` - 层级横向对比
- `compare-hierarchy-left-right` - 层级左右对比

**适用场景**：产品版本对比、优劣对比、前后对比

```typescript
design: {
  structure: 'compare-left-right'
}
```

#### 顺序结构 (`sequence-*`)

具有明确方向性和顺序性的信息流。

- `sequence-timeline` - 时间轴
- `sequence-steps` - 步骤流程
- `sequence-ascending-steps` - 上升步骤
- `sequence-snake-steps` - 蛇形步骤
- `sequence-roadmap-vertical` - 垂直路线图
- `sequence-horizontal-zigzag` - 水平之字形

**适用场景**：流程图、时间线、步骤指引、发展历程

```typescript
design: {
  structure: 'sequence-timeline'
}
```

#### 层级结构 (`hierarchy-*`)

树状、嵌套或明显的主次关系布局。

- `hierarchy-tree` - 树形结构
- `hierarchy-pyramid` - 金字塔结构

**适用场景**：组织架构、分类体系、层级关系

```typescript
design: {
  structure: 'hierarchy-tree',
}
```

#### 关系结构 (`relation-*`)

展示元素间的连接、依赖或相互作用关系。

- `relation-circle` - 圆形关系图
- `relation-network` - 网络图

**适用场景**：关系网络、依赖关系、连接图

```typescript
design: {
  structure: 'relation-circle'
}
```

#### 统计图 (`chart-*`)

以图表形式展示定量数据关系。

- `quadrant` - 四象限图

**适用场景**：数据分析、象限分布

## 数据项 (Item)

数据项是信息图中的基本信息单元，负责展示单个数据元素。

### 数据项属性

每个数据项组件接收：

- `datum` - 当前数据项的数据对象
- `data` - 完整的数据集合
- `indexes` - 当前数据项在结构中的位置索引
- `themeColors` - 主题色彩配置
- `positionH / positionV` - 水平和垂直对齐方式

### 内置数据项

框架提供了 30+ 种内置数据项组件：

#### 卡片类

- `badge-card` - 徽章卡片
- `compact-card` - 紧凑卡片
- `progress-card` - 进度卡片
- `ribbon-card` - 丝带卡片
- `rounded-rect-node` - 圆角矩形节点
- `candy-card-lite` - 糖果卡片（轻量）
- `l-corner-card` - L 角卡片
- `letter-card` - 字母卡片
- `quarter-simple-card` - 四分之一简单卡片

#### 徽章类

- `icon-badge` - 图标徽章
- `pill-badge` - 胶囊徽章

#### 图表类

- `chart-column` - 柱状图
- `circular-progress` - 环形进度
- `quarter-circular` - 四分之一圆形

#### 箭头类

- `horizontal-icon-arrow` - 水平图标箭头
- `vertical-icon-arrow` - 垂直图标箭头
- `simple-horizontal-arrow` - 简单水平箭头
- `simple-vertical-arrow` - 简单垂直箭头
- `horizontal-icon-line` - 水平图标线

#### 形状类

- `circle-node` - 圆形节点
- `pyramid` - 金字塔

#### 文本类

- `plain-text` - 纯文本
- `bullet-text` - 项目符号文本
- `done-list` - 完成列表

#### 其他

- `simple-item` - 简单项
- `simple-illus-item` - 简单插图项

### 使用示例

```typescript
design: {
  item: 'badge-card'
}

// 或带自定义参数
design: {
  item: {
    type: 'badge-card',
    width: 300,
    height: 100,
    iconSize: 32,
  }
}
```

## 主题 (Theme)

主题定义了信息图的视觉风格，包括颜色、字体等。

### 主题配置

```typescript
interface ThemeConfig {
  colorPrimary?: string;        // 主色
  fontFamily?: string;          // 字体
  fontSize?: number;            // 字号
  stylize?: 'rough' | 'pattern' | 'gradient'; // 风格化
  palette?: string;             // 调色板
}
```

### 使用主题

```typescript
// 使用内置主题
{
  theme: 'default'
}

// 自定义主题配置
{
  themeConfig: {
    colorPrimary: '#52c41a',
    fontFamily: 'Arial, sans-serif',
    stylize: 'rough',  // 手绘风格
  }
}
```

详见[主题系统](/guide/theme)了解更多。

## 模板 (Template)

模板是预定义的配置组合，可以快速创建特定类型的信息图。

### 使用模板

```typescript
import { Infographic, getTemplates } from '@antv/infographic';

// 查看所有可用模板
const templates = getTemplates();

// 使用模板
const infographic = new Infographic({
  container: '#container',
  template: 'process-flow',
  data: {
    title: '用户注册流程',
    items: [
      { label: '填写信息' },
      { label: '验证邮箱' },
      { label: '完成注册' },
    ],
  },
});
```

## 资源加载

数据项中的 `icon` 和 `illus` 属性用于配置图标和插图资源。

### 资源配置

```typescript
const data = {
  items: [
    {
      icon: 'star',              // 字符串形式
      label: '特性 1',
      illus: {                   // 对象形式
        type: 'custom',
        data: 'chart-1'
      }
    }
  ]
};
```

### 资源加载器

框架本身不提供资源服务，需要注册资源加载器来加载图标和插图：

```typescript
import { registerResourceLoader, loadSVGResource } from '@antv/infographic';

registerResourceLoader(async (config) => {
  // 从你的服务器加载资源
  const svgString = await fetch(`/api/resources/${config.data}`).then(r => r.text());
  return loadSVGResource(svgString);
});
```

详见[资源加载器指南](/guide/resource-loader)了解完整说明。

## 下一步

- 查看[示例](/examples/)学习常见用法
- 阅读[主题系统](/guide/theme)自定义视觉风格
- 了解[资源加载器](/guide/resource-loader)加载图标和插图
- 探索[高级用法](/guide/advanced)了解进阶特性
- 查看[结构组件 API](/api/structures)了解所有结构组件
- 查看[数据项组件 API](/api/items)了解所有数据项组件
