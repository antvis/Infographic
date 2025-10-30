# 配置选项

本页面详细说明创建 Infographic 实例时的所有配置选项。

## InfographicOptions

### 类型定义

```typescript
interface InfographicOptions {
  container?: string | HTMLElement;
  width?: number;
  height?: number;
  padding?: Padding;
  template?: string;
  design?: DesignOptions;
  data: Data;
  theme?: string;
  themeConfig?: ThemeConfig;
}
```

## 基础选项

### container

- **类型：** `string | HTMLElement`
- **可选**
- **描述：** 渲染容器，可以是 CSS 选择器字符串或 DOM 元素

**示例：**

```typescript
// CSS 选择器
container: '#my-container';
container: '.infographic-wrapper';

// HTMLElement
container: document.getElementById('my-container');
container: document.querySelector('.infographic');
```

### width

- **类型：** `number`
- **可选**
- **描述：** 信息图宽度（像素）

**示例：**

```typescript
width: 800;
width: 1200;
```

**说明：**

- 如果不指定，将使用容器的宽度
- 会设置容器的 `style.width`

### height

- **类型：** `number`
- **可选**
- **描述：** 信息图高度（像素）

**示例：**

```typescript
height: 600;
height: 800;
```

**说明：**

- 如果不指定，将根据内容自动计算
- 会设置容器的 `style.height`

### padding

- **类型：** `Padding`
- **可选**
- **描述：** 容器内边距

**Padding 类型：**

```typescript
type Padding =
  | number // 统一内边距
  | [number, number] // [垂直, 水平]
  | [number, number, number, number]; // [上, 右, 下, 左]
```

**示例：**

```typescript
// 所有方向 20px
padding: 20;

// 上下 10px, 左右 20px
padding: [10, 20];

// 上 10px, 右 20px, 下 10px, 左 20px
padding: [10, 20, 10, 20];
```

## 设计选项

### template

- **类型：** `string`
- **可选**
- **描述：** 使用的模板名称

**示例：**

```typescript
template: 'process-flow';
template: 'timeline';
```

**说明：**

- 使用 `getTemplates()` 查看所有可用模板
- 模板会提供默认的 `design` 和 `theme` 配置
- 可以通过 `design` 和 `themeConfig` 覆盖模板设置

### design

- **类型：** `DesignOptions`
- **可选**
- **描述：** 设计配置，包括结构、数据项等

详见 [DesignOptions](#designoptions)

### data

- **类型：** `Data`
- **必需**
- **描述：** 信息图数据

详见[数据](/guide/concepts#数据)

## 主题选项

### theme

- **类型：** `string`
- **可选**
- **默认值：** `'default'`
- **描述：** 使用的主题名称

**示例：**

```typescript
theme: 'default';
theme: 'dark';
theme: 'corporate';
```

**说明：**

- 使用 `getThemes()` 查看所有可用主题
- 使用 `registerTheme()` 注册自定义主题

### themeConfig

- **类型：** `ThemeConfig`
- **可选**
- **描述：** 主题配置，用于自定义或覆盖主题

详见[主题](/guide/concepts#主题)

## DesignOptions

设计配置选项，用于指定结构和数据项组件。

### 类型定义

```typescript
interface DesignOptions {
  title?: string | TitleConfig;
  structure?: string | StructureConfig;
  item?: string | ItemConfig;
  items?: (string | ItemConfig)[];
}
```

### title

- **类型：** `string | TitleConfig`
- **可选**
- **描述：** 标题组件配置

**字符串形式：**

```typescript
design: {
  title: 'default'; // 使用默认标题组件
}
```

**对象形式：**

```typescript
design: {
  title: {
    type: 'default',
    alignHorizontal: 'center',
    fontSize: 24
  }
}
```

### structure

- **类型：** `string | StructureConfig`
- **可选**
- **描述：** 结构组件配置，现阶段请查阅 TS 类型。

**字符串形式：**

```typescript
design: {
  structure: 'list-column';
}
```

**对象形式（带参数）：**

```typescript
design: {
  structure: {
    type: 'list-column',
    gap: 30,       // 自定义间距
    width: 400     // 自定义宽度
  }
}
```

详见[结构组件 API](/api/structures)

### item

- **类型：** `string | ItemConfig`
- **可选**
- **描述：** 数据项组件配置，现阶段请查阅 TS 类型

**字符串形式：**

```typescript
design: {
  item: 'badge-card';
}
```

**对象形式（带参数）：**

```typescript
design: {
  item: {
    type: 'badge-card',
    width: 300,
    height: 100,
    iconSize: 32,
    valueFormatter: (value) => `${value}%`
  }
}
```

详见[数据项组件 API](/api/items)

### items

- **类型：** `(string | ItemConfig)[]`
- **可选**
- **描述：** 多级数据项组件配置，用于层级结构需要多级数据项样式的场景

**示例：**

```typescript
design: {
  items: [
    'badge-card', // 第一个数据项使用 badge-card
    {
      // 第二个数据项使用自定义配置的 progress-card
      type: 'progress-card',
      width: 250,
    },
    'icon-badge', // 第三个数据项使用 icon-badge
  ];
}
```

## 完整示例

### 基础配置

```typescript
const infographic = new Infographic({
  container: '#container',
  width: 800,
  height: 600,
  data: {
    title: '产品特性',
    items: [{ label: '特性 1' }, { label: '特性 2' }, { label: '特性 3' }],
  },
});
```

### 完整配置

```typescript
const infographic = new Infographic({
  // 基础选项
  container: '#container',
  width: 1200,
  height: 800,
  padding: { top: 20, right: 40, bottom: 20, left: 40 },

  // 数据
  data: {
    title: '2024 年度规划',
    desc: '各季度目标和进展',
    items: [
      {
        icon: 'calendar',
        label: 'Q1',
        desc: '市场调研',
        value: 100,
      },
      {
        icon: 'chart',
        label: 'Q2',
        desc: '产品开发',
        value: 120,
      },
      {
        icon: 'rocket',
        label: 'Q3',
        desc: '产品上线',
        value: 110,
      },
      {
        icon: 'trophy',
        label: 'Q4',
        desc: '市场推广',
        value: 150,
      },
    ],
  },

  // 设计
  design: {
    structure: {
      type: 'list-row',
      gap: 40,
    },
    item: {
      type: 'badge-card',
      width: 250,
      height: 120,
      iconSize: 36,
      valueFormatter: (value) => `${value}%`,
    },
  },

  // 主题
  theme: 'default',
  themeConfig: {
    colorPrimary: '#1890ff',
    fontFamily: 'PingFang SC, sans-serif',
    stylize: 'gradient',
  },
});

infographic.render();
```

### 使用模板

```typescript
const infographic = new Infographic({
  container: '#container',
  template: 'process-flow', // 使用模板
  data: {
    title: '用户注册流程',
    items: [
      { label: '填写信息' },
      { label: '验证邮箱' },
      { label: '完成注册' },
    ],
  },
  // 可以覆盖模板配置
  themeConfig: {
    colorPrimary: '#52c41a',
  },
});
```

## 相关链接

- [Infographic API](/api/infographic) - 主类 API
- [数据](/guide/concepts#数据) - 数据格式定义
- [结构组件](/api/structures) - 结构组件列表
- [数据项组件](/api/items) - 数据项组件列表
- [主题](/guide/concepts#主题) - 主题配置
