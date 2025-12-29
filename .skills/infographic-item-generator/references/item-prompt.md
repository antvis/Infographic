# 信息图数据项组件生成规范

本文件用于指导生成符合框架规范的 Item 组件代码。

## 目录
- 数据项核心概念
- 数据项设计理念
- 技术规范
- 代码生成要求
- 生成流程
- 输出格式
- 常见问题和最佳实践

## 数据项核心概念

数据项 (Item) 是信息图中的基本信息单元，负责展示单个数据元素。数据项通过结构 (Structure) 进行组织和布局，形成完整的信息图。

每个数据项组件接收：

- **datum**: 当前数据项的数据对象
- **data**: 完整的数据集合（包含所有 items）
- **indexes**: 当前数据项在结构中的位置索引
- **themeColors**: 主题色彩配置
- **positionH**: 水平对齐方式（支持 'normal' 'center' 'flipped'）
- **positionV**: 垂直对齐方式（支持 'normal' 'middle' 'flipped'）

## 数据项设计理念

数据项没有固定的分类体系，而是基于不同信息图的设计需求灵活创建。可以是简单的文本展示、复杂的图表元素、特殊形状的几何图形，或任何其他视觉表现形式。设计时应考虑：

- 信息的展示需求（文本、数值、图标、状态等）
- 视觉层次和美观性
- 与结构布局的配合
- 主题色彩的合理运用

### 设计要求

- **完整性**：数据项应支持四个基本元素：ItemIcon、ItemLabel、ItemDesc、ItemValue，所有元素都是可选的
- **自适应布局**：当某些元素缺失时，其他元素应自动调整位置充分利用空间
- **数值处理**：`datum.value` 可能为 `undefined`，需要正确处理并条件渲染
- **渐变使用**：不是所有设计都需要渐变，应根据视觉效果决定，纯色同样有效

## 技术规范

### 1. 类型定义

```typescript
export interface BaseItemProps {
  x?: number;
  y?: number;
  id?: string;
  indexes: number[];
  data: Data;
  datum: Data['items'][number];
  themeColors: ThemeColors;
  positionH?: 'normal' | 'center' | 'flipped';
  positionV?: 'normal' | 'middle' | 'flipped';
  valueFormatter?: (value: number) => string | number;
  [key: string]: any;
}

export interface Data {
  title?: string;
  desc?: string;
  items: ItemDatum[];
  illus?: Record<string, string | ResourceConfig>;
  [key: string]: any;
}

export interface ItemDatum {
  icon?: string | ResourceConfig;
  label?: string;
  desc?: string;
  value?: number;
  illus?: string | ResourceConfig;
  children?: ItemDatum[];
  [key: string]: any;
}

export interface ThemeColors {
  /** 原始主色 */
  colorPrimary: string;
  /** 主色浅色背景 */
  colorPrimaryBg: string;
  /** 主色背景上的文本颜色 */
  colorPrimaryText: string;
  /** 最深文本颜色 */
  colorText: string;
  /** 次要文本颜色 */
  colorTextSecondary: string;
  /** 纯白色 */
  colorWhite: string;
  /** 背景色 */
  colorBg: string;
  /** 卡片背景色 */
  colorBgElevated: string;
}
```

### 2. 可用组件清单

**原子组件 (从 ../../jsx 导入)**

统一使用 `x`, `y`, `width`, `height` 属性定位和设置尺寸：

- **Defs**: SVG 定义容器，用于定义渐变、图案等可复用的 SVG 元素

- **Rect**: 矩形

> 其余属性与 React SVG rect 一致

- **Ellipse**: 椭圆/圆形

> 其余属性与 React SVG ellipse 一致，但坐标使用 `x/y/width/height`，不使用 `cx/cy/rx/ry`

- **重要**: `x`, `y` 为椭圆的左上角位置，不是圆心坐标

- **Path**: 路径图形

> 其余属性与 React SVG path 一致

- **Polygon**: 多边形

  ```typescript
  import { Point } from '../../jsx';
  <Polygon points={[{x: 0, y: 0}, {x: 100, y: 0}, {x: 50, y: 100}]} fill={color} />
  ```

> 其余属性与 React SVG polygon 一致

- **Group**: 分组容器

  ```typescript
  <Group x={0} y={0} width={100} height={100}>
    {children}
  </Group>
  ```

  > Group 的宽高不会有任何约束作用，仅用于获取包围盒，如果未设置，则会基于子节点计算包围盒
  > 其余属性与 React SVG group 一致

- **ShapesGroup**

和 Group 属性和用法完全一致，但内部图形可以被进行风格化渲染

- **Text**: 文本

  ```typescript
  <Text x={0} y={0} width={100} height={20} fontSize={14} fill={color}>
    内容
  </Text>
  ```

  扩展属性：
  - **alignHorizontal**: "left" | "center" | "right"，水平对齐位置
  - **alignVertical**: "top" | "middle" | "bottom" ，垂直对齐位置
  - **lineHeight**: 行高，默认 1.2
  - **wordWrap**: 是否换行，默认 false
  - **backgroundColor**: 背景色

> 其余属性与 React SVG text 一致

**封装组件 (从 ../components 导入)**

- **ItemIcon**: 数据项图标（方形）

  ```typescript
  <ItemIcon
    indexes={indexes}
    x={0}
    y={0}
    size={30}
    fill={themeColors.colorPrimary}
  />
  ```

- **ItemIconCircle**: 数据项图标（圆形背景容器）

  ```typescript
  <ItemIconCircle
    indexes={indexes}
    x={0}
    y={0}
    size={50}
    fill={themeColors.colorPrimary}      // 圆形背景色
    colorBg={themeColors.colorWhite}     // 内部图标背景色
  />
  ```

- **ItemLabel**: 数据项标签（具有默认样式）

  ```typescript
  <ItemLabel
    indexes={indexes}
    x={0}
    y={0}
    width={100}
    // 除非需要特殊样式，否则不建议设置以下属性
    // fontSize={14}
    // alignHorizontal="center"
    // alignVertical="middle"
    // fill={themeColors.colorText}
  >
    {datum.label}
  </ItemLabel>
  ```

- **ItemDesc**: 数据项描述（具有默认样式）

  ```typescript
  <ItemDesc
    indexes={indexes}
    x={0}
    y={0}
    width={200}
    // 除非需要特殊样式，否则不建议设置以下属性
    // fontSize={12}
    // lineHeight={1.4}
    // lineNumber={2}
    // wordWrap={true}
    // fill={themeColors.colorTextSecondary}
  >
    {datum.desc}
  </ItemDesc>
  ```

- **ItemValue**: 数据项数值（具有默认样式）

  ```typescript
  <ItemValue
    indexes={indexes}
    x={0}
    y={0}
    value={datum.value}
    formatter={extractedProps.valueFormatter}  // 可选的格式化函数
    // 除非需要特殊样式，否则不建议设置以下属性
    // fontSize={16}
    // fontWeight="bold"
    // fill={themeColors.colorPrimary}
  />
  ```

- **Illus**: 插图组件

  ```typescript
  <Illus
    x={0}
    y={0}
    width={100}
    height={100}
  />
  ```

- **Gap**: 布局间距占位符

  ```typescript
  <Gap width={10} height={10} />
  ```

  - **重要**: 只能直接使用 `<Gap />`，不能通过 `const gap = <Gap />` 这种方式使用

**布局组件 (从 ../layouts 导入)**

- **FlexLayout**: Flex 弹性布局

  ```typescript
  <FlexLayout
    flexDirection="row" | "column"
    gap={8}
    alignItems="flex-start" | "center" | "flex-end"
  >
    {children}
  </FlexLayout>
  ```

- **AlignLayout**: 对齐布局

> 例如可以将子元素水平和垂直对齐（元素可能会发生重叠）
> 也可以单独执行 horizontal 或 vertical 对齐，另一方向位置保持不变

```typescript
<AlignLayout
  horizontal="left" | "center" | "right"
  vertical="top" | "middle" | "bottom"
  width={100}   // 可选，对齐容器尺寸
  height={100}  // 可选，对齐容器尺寸
>
  {children}
</AlignLayout>
```

### 3. 工具函数

- **getElementBounds**: 获取元素边界

  ```typescript
  const bounds = getElementBounds(<ItemLabel indexes={indexes} />);
  // 返回: { x: number, y: number, width: number, height: number }
  ```

- **getItemProps**: 提取和处理 props，第二个参数为自定义属性名列表

  ```typescript
  // 从 props 中提取指定的自定义属性，避免传递给 restProps
  const [extractedProps, restProps] = getItemProps(props, [
    'width',
    'height',
    'iconSize',
  ]);
  // extractedProps: 包含所有 BaseItemProps + 指定自定义属性的对象
  // restProps: 剩余的 props，通常传给最外层 Group（避免 DOM 警告）
  ```

- **getItemKeyFromIndexes**: 从索引数组生成 key
  ```typescript
  import { getItemKeyFromIndexes } from '../../utils';
  const key = getItemKeyFromIndexes([0, 1]); // "0-1"
  ```

### 4. 第三方库支持

可以导入以下库来增强功能：

- **d3**:

  ```typescript
  import { xxx } from 'd3';
  ```

- **lodash-es**: 工具函数（推荐按需导入）

  ```typescript
  import { xxx } from 'lodash-es';
  ```

- **tinycolor2**: 颜色处理

  ```typescript
  import tinycolor from 'tinycolor2';

  // 实例方法 - 链式调用
  tinycolor(color).darken(20).toHexString();
  tinycolor(color).lighten(10).toHexString();

  // 静态方法 - 混合颜色
  tinycolor.mix(themeColors.colorPrimary, '#fff', 40).toHexString();

  // 克隆方法 - 避免修改原对象
  const base = tinycolor(baseColor);
  const gradStart = base.clone().darken(4).toHexString();
  const gradEnd = base.clone().lighten(12).toHexString();
  ```

- **round-polygon**: 圆角多边形处理
  ```typescript
  import roundPolygon, { getSegments } from 'round-polygon';
  const rounded = roundPolygon(points, radius);
  const segments = getSegments(rounded, 'AMOUNT', 10);
  ```

### 5. 导入模板

```typescript
import { ComponentType, Group } from '../../jsx';

// 根据需要选择性导入原子组件和类型
import {
  getElementBounds,
  Defs,
  Ellipse,
  Path,
  type Point, // Polygon 需要的点类型
  Polygon,
  Rect,
  Text,
} from '../../jsx';

// 根据需要选择性导入封装组件
import {
  Gap,
  Illus,
  ItemDesc,
  ItemIcon,
  ItemIconCircle,
  ItemLabel,
  ItemValue,
} from '../components';

// 根据需要选择性导入布局组件
import { AlignLayout, FlexLayout } from '../layouts';

import { registerItem } from './registry';
import type { BaseItemProps } from './types';
import { getItemProps } from './utils';

// 根据需要导入第三方库
// import { xxx } from 'd3';
// import tinycolor from 'tinycolor2';
// import { xxxx } from 'lodash-es';
// import roundPolygon, { xxx } from 'round-polygon';
```

### 6. composites 字段规则

在 `registerItem` 时，需要传入 `composites` 字段，表示当前组件使用了哪些封装组件。`composites` 的值基于代码实现中使用的组件来确定：

- **ItemLabel** → `"label"`
- **ItemDesc** → `"desc"`
- **ItemValue** → `"value"`
- **ItemIcon** 或 **ItemIconCircle** → `"icon"`
- **Illus** → `"illus"`

**示例**：

```typescript
// 如果组件使用了 ItemLabel 和 ItemDesc
registerItem('simple-text', {
  component: SimpleText,
  composites: ['label', 'desc'],
});

// 如果组件使用了 ItemIcon, ItemLabel, ItemValue 和 ItemDesc
registerItem('full-card', {
  component: FullCard,
  composites: ['icon', 'label', 'value', 'desc'],
});

// 如果组件使用了 Illus, ItemLabel 和 ItemDesc
registerItem('illus-item', {
  component: IllusItem,
  composites: ['illus', 'label', 'desc'],
});
```

### 7. 组件结构模板

```typescript
export interface [ItemName]Props extends BaseItemProps {
  // 除 BaseItemProps 外的自定义参数（gap 等根据设计需求自定义）
  width?: number;
  height?: number;
  iconSize?: number;
  // 其他自定义参数
}

export const [ItemName]: ComponentType<[ItemName]Props> = (props) => {
  const [
    {
      datum,
      data,
      indexes,
      width = 300,
      height = 60,
      iconSize = 30,
      positionH = 'normal',
      positionV = 'normal',
      themeColors,
      valueFormatter = (v: any) => `${v}%`,  // 可以设置默认格式化函数
      // 其他自定义参数
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'iconSize' /* 其他自定义参数 */]);

  // 1. 数据处理
  const value = datum.value; // 保持原始值用于条件判断
  const displayValue = value ?? 0; // 用于显示的值

  // 2. 尺寸和位置计算
  // 使用 getElementBounds 获取子元素尺寸
  // 根据 positionH/positionV 调整布局

  // 3. 渐变定义（如需要）
  const gradientId = `${themeColors.colorPrimary}-component-name`; // 基于颜色生成，便于复用

  // 4. 组件结构
  return (
    <Group {...restProps}>
      {/* Defs 定义（如果需要渐变） */}

      {/* 主要形状和内容 */}
      {datum.icon && <ItemIcon indexes={indexes} {...iconProps} />}

      {datum.label !== undefined && (
        <ItemLabel
          indexes={indexes}
          x={/** 计算 X 坐标 */}
          y={/** 计算 Y 坐标 */}
          {...labelProps}>
          {datum.label}
        </ItemLabel>
      )}

      {/* 数值 - 条件渲染 */}
      {value !== undefined && (
        <ItemValue
          indexes={indexes}
          x={/** 计算 X 坐标 */}
          y={/** 计算 Y 坐标 */}
          value={displayValue}
          formatter={valueFormatter}
          {...valueProps}
        />
      )}

      {/* 描述 - 动态布局 */}
      {datum.desc !== undefined && (
        <ItemDesc
          indexes={indexes}
          x={/** 计算 X 坐标 */}
          y={/** 计算 Y 坐标 */}
          {...descProps}
        >
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('[item-name]', {
  component: [ItemName],
  composites: ['label', 'desc', 'icon', 'value', 'illus'] // 根据组件实际使用的组件来确定
});
```

### 8. indexes 索引系统

**indexes** 是数据项在信息图中的位置标识，用数组表示层级关系：

- **一维结构**（列表、横排等）：`[0]`, `[1]`, `[2]`, ...
- **嵌套结构**（树形、层级等）：
  - 根节点：`[0]`
  - 第一个根节点的子节点：`[0, 0]`, `[0, 1]`, `[0, 2]`, ...
  - `[0, 1]` 节点的子节点：`[0, 1, 0]`, `[0, 1, 1]`, ...

这个索引系统确保每个数据项都有唯一标识。

**索引的常用操作**：

```typescript
// 生成序号
const indexNumber = indexes[0] + 1;
const indexStr = String(indexes[0] + 1).padStart(2, '0'); // "01", "02", ...

// 判断奇偶（用于交替样式）
const isEven = indexes[0] % 2 === 0;
```

### 9. 关键设计原则

#### positionH/positionV 处理

> 不一定需要处理 positionH/V，但如果设计中有对齐需求，则需要进行适配。

```typescript
// positionH 处理示例
const iconX =
  positionH === 'flipped'
    ? width - iconSize // 右对齐
    : positionH === 'center'
      ? (width - iconSize) / 2 // 居中
      : 0; // 默认左对齐

// positionV 处理示例
const iconY =
  positionV === 'middle'
    ? (height - iconSize) / 2
    : positionV === 'flipped'
      ? height - iconSize
      : 0;

// 文本对齐方式
const textAlign =
  positionH === 'flipped'
    ? 'right'
    : positionH === 'center'
      ? 'center'
      : 'left';
```

#### 主题色彩使用

```typescript
// 主色调
fill={themeColors.colorPrimary}

// 背景色
fill={themeColors.colorPrimaryBg}

// 主要文本
fill={themeColors.colorText}

// 次要文本
fill={themeColors.colorTextSecondary}

// 白色（常用于深色背景上的图标/文字）
fill={themeColors.colorWhite}
```

#### 渐变定义

**线性渐变**：

```typescript
const gradientId = `${themeColors.colorPrimary}-component-name`;
<Defs>
  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor={themeColors.colorPrimary} />
    <stop
      offset="100%"
      stopColor={tinycolor.mix(themeColors.colorPrimary, '#fff', 40).toHexString()}
    />
  </linearGradient>
</Defs>;

// 使用渐变
<Rect fill={`url(#${gradientId})`} {...props} />;
```

**径向渐变**：

```typescript
const radialId = `${themeColors.colorPrimary}-radial`;
<Defs>
  <radialGradient id={radialId} cx="50%" cy="50%" r="50%">
    <stop offset="0%" stopColor={themeColors.colorPrimary} />
    <stop
      offset="100%"
      stopColor={tinycolor(themeColors.colorPrimary).darken(20).toHexString()}
    />
  </radialGradient>
</Defs>;
```

**多渐变定义**：

```typescript
// 为不同用途定义多个渐变
const progressGradientId = `${themeColors.colorPrimary}-progress`;
const backgroundGradientId = `${themeColors.colorPrimaryBg}-progress-bg`;
const positiveGradient = `gradient-${themeColors.colorPrimary}-positive`;
const negativeGradient = `gradient-${themeColors.colorPrimary}-negative`;

<Defs>
  <linearGradient id={progressGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor={themeColors.colorPrimary} />
    <stop
      offset="100%"
      stopColor={tinycolor.mix(themeColors.colorPrimary, '#fff', 20).toHexString()}
    />
  </linearGradient>
  <linearGradient id={backgroundGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor={themeColors.colorPrimaryBg} />
    <stop offset="100%" stopColor={themeColors.colorBg} />
  </linearGradient>
</Defs>;
```

**SVG 图案填充**：

```typescript
// 基于索引生成唯一 ID（用于必须唯一的场景）
const uniqueId = `letter-card-${indexes.join('-')}`;
const patternId = `${uniqueId}-pattern`;

<Defs>
  <pattern
    id={patternId}
    patternUnits="userSpaceOnUse"
    width={10}
    height={10}
    patternTransform={`rotate(45)`}
  >
    {/* 注意：pattern 内部使用小写的原生 SVG 元素 */}
    <rect x="0" y="0" width={4} height={10} fill="rgba(0, 0, 0, 0.03)" />
  </pattern>
</Defs>;

// 使用图案
<Rect fill={`url(#${patternId})`} {...props} />;
```

#### 风格化渲染支持

风格化渲染是指将图形在渲染阶段转换为风格化图形，例如手绘风格。

通过以下方式标识的图形可以被进行风格化渲染（由渲染器实现）

1. 添加 `data-element-type="shape"` 属性

```tsx
<Rect data-element-type="shape" width="100" height="100" />
```

2. 使用 ShapesGroup 包裹

```tsx
<ShapesGroup>
  <Rect width="100" height="100" />
  <Rect x="100" width="100" height="100" />
  <Rect x="200" width="100" height="100" />
</ShapesGroup>
```

> 风格化渲染只支持图形元素（如 Path、Ellipse、Rect、Polygon 等），不支持文本元素和分组

#### 响应式尺寸

```tsx
// 基于内容动态调整
const labelBounds = getElementBounds(
  <ItemLabel indexes={indexes}>{datum.label}</ItemLabel>,
);
const totalHeight = iconSize + gap + labelBounds.height;

// 基于数据集合计算比例
const values = data.items.map((item) => item.value ?? 0);
const maxValue = Math.max(...values);
const barHeight = (value / maxValue) * availableHeight;
```

#### 复杂 SVG 路径绘制

```typescript
// 1/4 圆弧路径
const quarterCirclePath = isFlipped
  ? `M ${x} ${y} L ${x} ${y + r} A ${r} ${r} 0 0 0 ${x + r} ${y} Z`
  : `M ${x} ${y} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x - r} ${y} Z`;

<Path d={quarterCirclePath} fill={themeColors.colorPrimary} />;

// 箭头多边形
<Polygon
  points={[
    { x: 0, y: 0 },
    { x: width - 10, y: 0 },
    { x: width, y: height / 2 }, // 箭头尖端
    { x: width - 10, y: height },
    { x: 0, y: height },
    { x: 10, y: height / 2 },
  ]}
  fill={themeColors.colorPrimary}
/>;
```

**SVG 路径命令参考**：

- `M x y` - 移动到
- `L x y` - 直线到
- `A rx ry x-axis-rotation large-arc-flag sweep-flag x y` - 弧线
- `Z` - 闭合路径

### 10. 约束规则

**严格遵守：**

1. **只使用列出的组件和属性**
2. **所有图形组件使用 x/y/width/height 定位**
3. **必须传递 indexes 给所有封装组件**（ItemIcon、ItemLabel、ItemDesc、ItemValue 等）
4. **使用 getItemProps 处理 props**
5. **tinycolor 正确使用**：
   - 实例方法：`tinycolor(color).darken(20).toHexString()`
   - 静态方法：`tinycolor.mix(color1, color2, amount).toHexString()`
6. **支持 positionH/V 对齐方式**（根据设计需求）
7. **避免出现元素坐标为负值的情况**
8. **条件渲染可选元素**（icon、label、desc、value）
9. **注册组件时必须提供 composites 字段**，根据实际使用的封装组件确定值

### 11. 命名规范

- 组件名：大驼峰，如 `DoneList`, `ChartColumn`
- 注册名：小写连字符，如 `done-list`, `chart-column`
- Props 接口：组件名 + `Props`
- 常量：大写下划线，如 `CIRCLE_MASS`, `DOT_RADIUS`

## 代码生成要求

1. **完整性**：包含所有导入、类型定义、组件实现和注册
2. **正确性**：
   - 只使用允许的组件和属性
   - indexes 正确传递给所有封装组件
   - 坐标计算准确
   - Ellipse 的 x/y 为左上角坐标
3. **样式原则**：
   - ItemLabel/ItemDesc/ItemValue 优先使用默认样式
   - 只在确实需要特殊效果时才覆盖样式属性
   - 合理使用主题色彩
4. **灵活性**：
   - 参数有合理默认值
   - 处理边界情况（空数据、缺失字段等）
   - 条件渲染可选元素
   - 支持 positionH/V 对齐
   - 响应式尺寸设计

## 生成流程

1. **理解需求**：明确数据项要展示的内容和视觉效果
2. **设计布局**：确定元素排列和尺寸关系
3. **编写代码**：按模板生成完整代码
4. **验证输出**：检查代码完整性和规范性

## 输出格式

生成完整的 TypeScript 文件：

1. JSX 导入注释
2. Import 语句
3. Props 接口
4. 组件实现
5. 注册语句

## 常见问题和最佳实践

### 数值处理问题

❌ **错误做法**：

```typescript
const value = datum.value ?? 0; // value 永远不为 undefined
{
  value !== undefined && <ItemValue value={value} />; // 条件永远为 true
}
```

✅ **正确做法**：

```typescript
const value = datum.value; // 保持原始值
const displayValue = value ?? 0; // 用于显示
{
  value !== undefined && <ItemValue value={displayValue} />; // 条件渲染正确
}
```

### 渐变 ID 生成

```typescript
// 推荐：基于颜色和用途（可复用）
const gradientId = `${themeColors.colorPrimary}-progress`;

// 或基于索引（用于必须唯一的场景）
const uniqueId = `letter-card-${indexes.join('-')}`;
const gradientId = `${uniqueId}-gradient`;
```

### tinycolor 使用

❌ **错误做法**：

```typescript
tinycolor.darken(color, 20); // 静态方法不存在
tinycolor.lighten(color, 10); // 静态方法不存在
```

✅ **正确做法**：

```typescript
// 实例方法 - 链式调用
tinycolor(color).darken(20).toHexString();
tinycolor(color).lighten(10).toHexString();

// 静态方法 - 混合颜色
tinycolor.mix(themeColors.colorPrimary, '#fff', 40).toHexString();

// 克隆方法 - 避免修改原对象
const base = tinycolor(baseColor);
const gradStart = base.clone().darken(4).toHexString();
const gradEnd = base.clone().lighten(12).toHexString();
```

### 动态布局示例

```typescript
// 描述位置根据是否有数值动态调整
const descY = value !== undefined ? labelY + labelHeight + valueHeight + gap : labelY + labelHeight + smallGap;

<ItemDesc indexes={indexes} y={descY}>
  {datum.desc}
</ItemDesc>;

// 内容宽度根据图标存在与否调整
const textWidth = showIcon && datum.icon ? width - iconSize - gap : width;

<ItemLabel indexes={indexes} width={textWidth}>
  {datum.label}
</ItemLabel>;
```

### 常用工具函数和技巧

```typescript
// 字符串格式化
String(indexes[0] + 1).padStart(2, '0'); // "01", "02", ...
datum.label?.[0].toUpperCase(); // 可选链 + 首字母大写

// 数学常量
Math.SQRT2; // √2 ≈ 1.414
Math.PI; // π ≈ 3.14159

// 计算圆的质心（用于圆弧图形）
const CIRCLE_MASS = (4 * radius) / (3 * Math.PI);

// 圆环进度计算
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;
const strokeDashoffset = circumference * (1 - percentage);
```
