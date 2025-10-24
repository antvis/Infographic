# 主题系统

主题定义了信息图的视觉风格，包括颜色、字体、风格化效果等。Infographic 提供了灵活强大的主题系统。

## 使用内置主题

框架提供了多个内置主题供你选择：

```typescript
import { Infographic, getThemes } from '@antv/infographic';

// 查看所有可用主题
const themes = getThemes();
console.log(themes); // ['default', 'dark', ...]

// 使用主题
const infographic = new Infographic({
  container: '#container',
  theme: 'dark', // 使用深色主题
  data: { /* ... */ },
});
```

## 自定义主题配置

你可以通过 `themeConfig` 覆盖或扩展主题设置：

```typescript
const infographic = new Infographic({
  container: '#container',
  theme: 'default', // 基于默认主题
  themeConfig: {
    colorPrimary: '#52c41a',      // 自定义主色
    colorBg: '#ffffff',           // 背景色
    palette: 'antv',        // 数据项配色
    stylize: 'rough',             // 手绘风格
  },
  data: { /* ... */ },
});
```

## 主题配置选项

### 颜色配置

主题配置提供了两个基础颜色选项：

```typescript
{
  themeConfig: {
    colorPrimary: '#1890ff',  // 信息图的主色调
    colorBg: '#ffffff',       // 信息图的背景色
  }
}
```

对于数据项的颜色，可以通过 `palette` 调色板来配置：

```typescript
{
  themeConfig: {
    colorPrimary: '#1890ff',
    palette: 'antv', // 为多个数据项分配不同的颜色
    // 也可以使用自定义颜色数组
    // palette: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16']
  }
}
```

### 风格化效果

Infographic 支持多种风格化效果：

#### 手绘风格 (rough)

```typescript
{
  themeConfig: {
    stylize: 'rough',
  }
}
```

手绘风格为图形添加不规则边缘，营造手绘效果，适合创意型、非正式的信息图。

#### 图案填充 (pattern)

```typescript
{
  themeConfig: {
    stylize: 'pattern',
  }
}
```

使用纹理图案填充形状，增加视觉层次感。

#### 渐变效果 (gradient)

```typescript
{
  themeConfig: {
    stylize: 'gradient',
  }
}
```

为形状添加渐变填充，使视觉效果更加丰富。

### 调色板

调色板用于为多个数据项分配不同的颜色：

```typescript
{
  themeConfig: {
    palette: 'antv', // 使用内置调色板
  }
}
```

## 注册自定义主题

如果你想创建一个可复用的主题，可以使用 `registerTheme` 注册：

```typescript
import { registerTheme } from '@antv/infographic';

registerTheme('my-theme', {
  colorPrimary: '#722ed1',
  colorBg: '#f0f0f0',
  palette: ['#722ed1', '#eb2f96', '#52c41a', '#1890ff'],
  stylize: 'gradient',
});

// 在其他地方使用
const infographic = new Infographic({
  container: '#container',
  theme: 'my-theme',
  data: { /* ... */ },
});
```

## 主题组合

你可以基于已有主题进行扩展：

```typescript
const infographic = new Infographic({
  container: '#container',
  theme: 'dark',          // 基于深色主题
  themeConfig: {
    colorPrimary: '#f5222d', // 仅覆盖主色
    stylize: 'rough',        // 添加手绘风格
  },
  data: { /* ... */ },
});
```

## 完整示例

下面是一个使用自定义主题的完整示例：

```typescript
import { Infographic, registerTheme } from '@antv/infographic';

// 注册企业主题
registerTheme('corporate', {
  colorPrimary: '#003366',
  colorBg: '#ffffff',
  palette: ['#003366', '#0066cc', '#3399ff', '#66b3ff'],
  stylize: 'gradient',
});

// 使用主题
const infographic = new Infographic({
  container: '#container',
  theme: 'corporate',
  data: {
    title: '2024 年度规划',
    items: [
      { label: 'Q1', value: 100 },
      { label: 'Q2', value: 120 },
      { label: 'Q3', value: 110 },
      { label: 'Q4', value: 150 },
    ],
  },
  design: {
    structure: 'list-row',
    item: 'progress-card',
  },
});

infographic.render();
```

## 主题最佳实践

### 1. 颜色对比度

确保主色调与背景色有足够的对比度，以保证可读性：

```typescript
{
  themeConfig: {
    colorPrimary: '#1890ff',  // 深色主色
    colorBg: '#ffffff',       // 浅色背景
  }
}
```

### 2. 调色板选择

为数据项选择合适的调色板，确保颜色之间有足够的区分度：

```typescript
{
  themeConfig: {
    palette: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#6F5EF9'],
  }
}
```

### 3. 一致性

在同一应用中保持主题配置的一致性，避免过多的主题变化。

### 4. 可访问性

- 考虑色盲用户，避免仅用颜色传达信息
- 确保足够的颜色对比度
- 使用合适的字号（建议 12px 以上）

## 下一步

- 查看[示例](/examples/)了解不同主题的视觉效果
- 阅读 [API 文档](/api/theme)了解完整的主题 API
- 学习[高级用法](/guide/advanced)探索更多主题技巧
