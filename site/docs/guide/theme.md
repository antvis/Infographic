# 主题系统

主题定义了信息图的视觉风格，包括颜色、字体、风格化效果等。本指南将帮助你快速配置和定制主题。

> 💡 **理解主题原理**：想要深入了解主题的设计原理和类型系统，请参考 [核心概念 - 主题](/guide/concepts#主题)

## 快速开始

### 使用内置主题

框架提供了多个开箱即用的内置主题：

```typescript
import { Infographic, getThemes } from '@antv/infographic';

// 查看所有可用主题
const themes = getThemes();
console.log(themes); // ['default', 'dark', ...]

// 使用深色主题
const infographic = new Infographic({
  container: '#container',
  theme: 'dark',
  data: {
    title: '季度业绩',
    items: [
      { label: 'Q1', value: 100 },
      { label: 'Q2', value: 120 },
    ],
  },
});

infographic.render();
```

### 自定义主题配置

通过 `themeConfig` 覆盖或扩展主题设置：

```typescript
const infographic = new Infographic({
  container: '#container',
  theme: 'default', // 基于默认主题
  themeConfig: {
    colorPrimary: '#52c41a', // 自定义主色
    palette: ['#52c41a', '#1890ff', '#faad14'],
    stylize: 'rough', // 手绘风格
  },
  data: {
    /* ... */
  },
});
```

## 颜色配置

### 主色调

**colorPrimary** 是信息图的品牌色，影响整体视觉风格：

```typescript
themeConfig: {
  colorPrimary: '#1890ff'; // 蓝色主题
}
```

**应用场景**：

- 全局装饰元素
- 默认图形颜色（未设置 palette 时）
- 主题色衍生系统的基础

### 背景色

**colorBg** 设置画布背景：

```typescript
themeConfig: {
  colorBg: '#ffffff'  // 白色背景
}

// 深色背景
themeConfig: {
  colorBg: '#141414',
  colorPrimary: '#1890ff'
}
```

### 调色板（Palette）

**调色板用于为多个数据项分配不同颜色**，让数据更容易区分。

#### 使用颜色数组

适合固定数量的数据项：

```typescript
themeConfig: {
  palette: [
    '#5B8FF9', // 蓝色
    '#5AD8A6', // 绿色
    '#5D7092', // 紫色
    '#F6BD16', // 黄色
  ];
}
```

当数据项超过数组长度时，会循环使用颜色。

#### 使用注册的色板

```typescript
themeConfig: {
  palette: 'antv'; // AntV 官方色板
}

// 查看可用色板
import { getPalettes } from '@antv/infographic';
console.log(getPalettes());
```

**常用内置色板**：

- `antv` - AntV 标准色板
- `tableau10` - Tableau 经典 10 色
- `category20` - 20 色分类色板

#### 使用动态色板（回调）

适合数据项数量不固定的场景：

```typescript
themeConfig: {
  palette: (ratio, index, count) => {
    // 创建从蓝到红的渐变色板
    const hue = 240 - ratio * 120; // 240°(蓝) → 120°(绿) → 0°(红)
    return `hsl(${hue}, 70%, 50%)`;
  };
}
```

**参数说明**：

- `ratio`: 0-1 之间的比例（`index / count`）
- `index`: 当前数据项的索引
- `count`: 数据项总数

#### 注册自定义色板

创建可复用的色板：

```typescript
import { registerPalette } from '@antv/infographic';

// 注册企业色板
registerPalette('corporate', [
  '#003366', // 深蓝
  '#0066cc', // 蓝色
  '#3399ff', // 亮蓝
  '#66b3ff', // 浅蓝
]);

// 使用注册的色板
themeConfig: {
  palette: 'corporate';
}
```

## 风格化效果

风格化（Stylize）为信息图添加特殊的视觉效果，让设计更具表现力。

### 手绘风格（Rough）

模拟手绘效果，为图形添加不规则边缘：

```typescript
themeConfig: {
  stylize: 'rough';
}
```

**视觉效果**：

- ✏️ 线条有轻微抖动
- 📝 边缘不完全规则
- 🎨 营造手绘、轻松的氛围

**适用场景**：

- 创意型信息图
- 非正式场合
- 头脑风暴、草图风格
- 教育和儿童向内容

### 渐变效果（Gradient）

为图形添加渐变填充：

```typescript
themeConfig: {
  stylize: 'gradient';
}
```

**视觉效果**：

- 🌈 颜色平滑过渡
- ✨ 增加视觉层次感
- 💎 现代、精致的外观

**适用场景**：

- 商业报告
- 产品宣传
- 现代化设计
- 需要视觉冲击力的场景

### 图案填充（Pattern）

使用纹理图案填充形状：

```typescript
themeConfig: {
  stylize: 'pattern';
}
```

**视觉效果**：

- 🔲 添加纹理细节
- 📐 几何图案装饰
- 🖼️ 增加质感

**适用场景**：

- 需要区分色盲用户
- 打印输出（黑白打印时仍可区分）
- 复古或装饰性设计

## 注册自定义主题

将常用的主题配置注册为可复用的主题：

```typescript
import { registerTheme } from '@antv/infographic';

// 注册企业主题
registerTheme('corporate', {
  colorPrimary: '#003366',
  colorBg: '#ffffff',
  palette: ['#003366', '#0066cc', '#3399ff', '#66b3ff'],
  stylize: 'gradient',
  base: {
    text: {
      'font-family': 'Arial, sans-serif',
    },
  },
});

// 在任何地方使用
const infographic = new Infographic({
  theme: 'corporate',
  data: {
    /* ... */
  },
});
```

## 主题组合

基于已有主题进行扩展，快速创建变体：

```typescript
const infographic = new Infographic({
  container: '#container',
  theme: 'dark', // 基于深色主题
  themeConfig: {
    colorPrimary: '#f5222d', // 改为红色主调
    stylize: 'rough', // 添加手绘风格
  },
  data: {
    /* ... */
  },
});
```

**常见组合策略**：

### 品牌主题 + 手绘风格

```typescript
{
  theme: 'default',
  themeConfig: {
    colorPrimary: '#your-brand-color',
    stylize: 'rough'
  }
}
```

### 深色模式 + 渐变效果

```typescript
{
  theme: 'dark',
  themeConfig: {
    stylize: 'gradient',
    palette: ['#1890ff', '#52c41a', '#faad14']
  }
}
```

## 完整示例

### 示例 1：企业年度报告

```typescript
import { Infographic, registerTheme } from '@antv/infographic';

// 注册企业主题
registerTheme('annual-report', {
  colorPrimary: '#003366',
  colorBg: '#f5f5f5',
  palette: ['#003366', '#0066cc', '#3399ff', '#66b3ff'],
  stylize: 'gradient',
  base: {
    text: {
      'font-family': '"Helvetica Neue", Arial, sans-serif',
    },
  },
  title: {
    'font-size': 28,
    'font-weight': 'bold',
    fill: '#003366',
  },
});

// 使用主题
const infographic = new Infographic({
  container: '#container',
  theme: 'annual-report',
  data: {
    title: '2024 年度业绩报告',
    items: [
      { label: 'Q1', value: 120, desc: '同比增长 20%' },
      { label: 'Q2', value: 135, desc: '同比增长 25%' },
      { label: 'Q3', value: 128, desc: '同比增长 18%' },
      { label: 'Q4', value: 150, desc: '同比增长 30%' },
    ],
  },
  design: {
    structure: 'list-row',
    item: 'chart-column',
  },
});

infographic.render();
```

### 示例 2：创意型海报

```typescript
const infographic = new Infographic({
  container: '#container',
  themeConfig: {
    colorPrimary: '#ff6b6b',
    palette: (ratio) => {
      // 彩虹色板
      const hue = ratio * 360;
      return `hsl(${hue}, 70%, 60%)`;
    },
    stylize: 'rough', // 手绘风格
    base: {
      text: {
        'font-family': '"Comic Sans MS", cursive',
        'font-size': 16,
      },
    },
  },
  data: {
    title: '🎨 创意工作流程',
    items: [
      { label: '灵感', icon: '💡' },
      { label: '草图', icon: '✏️' },
      { label: '设计', icon: '🎨' },
      { label: '完成', icon: '✨' },
    ],
  },
  design: {
    structure: 'sequence-steps',
    item: 'badge-card',
  },
});

infographic.render();
```

### 示例 3：深色模式仪表板

```typescript
const infographic = new Infographic({
  container: '#container',
  theme: 'dark',
  themeConfig: {
    colorPrimary: '#1890ff',
    palette: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
    stylize: 'gradient',
  },
  data: {
    title: '系统状态监控',
    items: [
      { label: 'CPU', value: 45, desc: '使用率' },
      { label: '内存', value: 68, desc: '使用率' },
      { label: '磁盘', value: 32, desc: '使用率' },
      { label: '网络', value: 88, desc: '吞吐量' },
    ],
  },
  design: {
    structure: 'list-grid',
    item: 'circular-progress',
  },
});

infographic.render();
```

## 主题最佳实践

### 1. 颜色对比度

确保主色与背景色有足够的对比度，保证可读性：

```typescript
// ✅ 好的对比度
{
  colorPrimary: '#1890ff',  // 深色主色
  colorBg: '#ffffff'        // 浅色背景
}

// ✅ 深色模式的对比度
{
  colorPrimary: '#40a9ff',  // 浅色主色
  colorBg: '#141414'        // 深色背景
}

// ❌ 对比度不足
{
  colorPrimary: '#d9d9d9',  // 浅灰色
  colorBg: '#ffffff'        // 白色背景（对比度太低）
}
```

**检查工具**：使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) 确保符合 WCAG 标准。

### 2. 调色板选择

选择具有区分度的颜色，避免相似颜色导致混淆：

```typescript
// ✅ 色相差异明显
{
  palette: [
    '#1890ff', // 蓝
    '#52c41a', // 绿
    '#faad14', // 橙
    '#f5222d', // 红
  ];
}

// ❌ 颜色过于相似
{
  palette: [
    '#1890ff', // 蓝
    '#40a9ff', // 浅蓝（与上面太接近）
    '#096dd9', // 深蓝（与第一个太接近）
    '#69c0ff', // 更浅的蓝
  ];
}
```

**建议**：

- 使用色轮上相距至少 30° 的颜色
- 数据项超过 6 个时，考虑使用渐变色板
- 避免同时使用多个高饱和度颜色

### 3. 风格化的适用场景

根据使用场景选择合适的风格化：

| 风格 | 适用场景 | 不适用场景 |
||||
| **无风格化** | 正式报告、数据分析、企业文档 | 需要视觉冲击力的场景 |
| **rough** | 创意设计、教育内容、草图风格 | 正式商务、精确数据展示 |
| **gradient** | 现代设计、产品宣传、展示型信息图 | 简约设计、数据密集型图表 |
| **pattern** | 打印输出、复古设计、无障碍需求 | 数字屏幕优先、现代简约风格 |

### 4. 主题一致性

在同一应用中保持主题配置的一致性：

```typescript
// ✅ 使用注册主题保持一致性
registerTheme('app-theme', {
  colorPrimary: '#1890ff',
  palette: ['#1890ff', '#52c41a', '#faad14'],
});

// 所有信息图使用相同主题
const chart1 = new Infographic({ theme: 'app-theme' /* ... */ });
const chart2 = new Infographic({ theme: 'app-theme' /* ... */ });

// ❌ 每个图表使用不同配置
const chart1 = new Infographic({ themeConfig: { colorPrimary: '#1890ff' } });
const chart2 = new Infographic({ themeConfig: { colorPrimary: '#52c41a' } });
```

### 5. 可访问性（Accessibility）

确保信息图对所有用户可访问：

**色盲友好**：

```typescript
// ✅ 使用色盲友好的色板
{
  palette: [
    '#0173B2', // 蓝
    '#DE8F05', // 橙
    '#029E73', // 绿
    '#CC78BC', // 紫
  ];
}
```

**使用图案辅助**：

```typescript
// 对于关键信息，结合图案使用
{
  stylize: 'pattern',  // 即使是色盲也能区分
  palette: ['#1890ff', '#52c41a', '#faad14']
}
```

**文字大小**：

```typescript
{
  base: {
    text: {
      'font-size': 14  // 建议不小于 12px
    }
  },
  item: {
    label: {
      'font-size': 16
    }
  }
}
```

### 6. 响应式主题

考虑不同设备和屏幕尺寸：

```typescript
// 移动端使用更大的字号
const isMobile = window.innerWidth < 768;

const infographic = new Infographic({
  themeConfig: {
    base: {
      text: {
        'font-size': isMobile ? 16 : 14,
      },
    },
    title: {
      'font-size': isMobile ? 24 : 28,
    },
  },
  data: {
    /* ... */
  },
});
```

## 调试主题

### 查看应用的主题

在浏览器控制台查看当前主题配置：

```typescript
const infographic = new Infographic({
  /* ... */
});
console.log(infographic.getTheme());
```

### 实时调整主题

在开发环境中快速测试主题效果：

```typescript
const infographic = new Infographic({
  container: '#container',
  theme: 'default',
  data: {
    /* ... */
  },
});

infographic.render();

// 动态更新主题
infographic.update({
  themeConfig: {
    colorPrimary: '#52c41a',
  },
});
```

## 进阶技巧

### 动态主题切换

实现明暗主题切换：

```typescript
let isDark = false;

function toggleTheme() {
  isDark = !isDark;
  infographic.update({
    theme: isDark ? 'dark' : 'default',
  });
}

// 绑定到按钮
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
```

### 主题继承

创建主题变体：

```typescript
import { registerTheme, getTheme } from '@antv/infographic';

// 基于现有主题创建变体
const baseTheme = getTheme('default');

registerTheme('default-variant', {
  ...baseTheme,
  colorPrimary: '#52c41a', // 仅改变主色
  stylize: 'gradient', // 添加渐变
});
```

## 相关资源

- **[核心概念 - 主题](/guide/concepts#主题)** - 理解主题的设计原理和类型系统
- **[API 文档](/api/options#theme-config)** - 完整的主题配置 API 参考
- **[高级用法](/guide/advanced)** - 探索更多主题技巧

## 常见问题

### Q: 如何选择合适的色板？

A: 考虑以下因素：

- **数据项数量**：少于 10 个用离散色板，多于 10 个考虑渐变色板
- **数据类型**：分类数据用离散色板，连续数据用渐变色板
- **品牌规范**：优先使用品牌色板
- **可访问性**：确保色盲友好

### Q: 风格化会影响性能吗？

A: 有轻微影响，但通常可以忽略：

- `rough` 风格会增加路径复杂度，可能影响渲染性能
- `gradient` 和 `pattern` 对性能影响较小
