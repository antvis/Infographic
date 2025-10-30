# Infographic API

`Infographic` 是框架的核心类，用于创建和渲染信息图。

## 构造函数

### new Infographic(options)

创建一个新的 Infographic 实例。

**类型签名：**

```typescript
constructor(options: InfographicOptions)
```

**参数：**

- `options` - 信息图配置选项，详见[配置选项](/api/options)

**示例：**

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: 800,
  height: 600,
  data: {
    title: '示例',
    items: [{ label: '项目 1' }],
  },
});
```

## 实例方法

### render()

将信息图渲染到容器中。

**类型签名：**

```typescript
render(): void
```

**返回值：**

- `void`

**示例：**

```typescript
const infographic = new Infographic({
  container: '#container',
  data: { /* ... */ },
});

infographic.render();
```

**说明：**

- 该方法会清空容器内容并渲染新的 SVG 元素
- 可以多次调用以更新渲染结果
- 渲染前会自动设置容器的宽高（如果配置了 `width` 和 `height`）

### compose()

创建信息图模版对象。

**类型签名：**

```typescript
compose(): SVGSVGElement
```

**返回值：**

- `SVGSVGElement` - SVG 元素

**示例：**

```typescript
const infographic = new Infographic({
  container: '#container',
  data: { /* ... */ },
});

const svgElement = infographic.compose();

// 可以手动处理 SVG 元素
document.body.appendChild(svgElement);

// 或导出为字符串
const svgString = svgElement.outerHTML;
```

**使用场景：**

- 需要在渲染前对 SVG 进行处理
- 导出 SVG 字符串
- 服务端渲染场景

## 完整示例

### 基础使用

```typescript
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: 800,
  height: 600,
  data: {
    title: '产品特性',
    items: [
      { icon: 'star', label: '高性能', desc: '快速渲染' },
      { icon: 'lock', label: '安全', desc: '数据加密' },
      { icon: 'users', label: '易用', desc: '简单配置' },
    ],
  },
  design: {
    structure: 'list-row',
    item: 'badge-card',
  },
  theme: 'default',
});

infographic.render();
```

### 使用 compose 导出

```typescript
import { Infographic } from '@antv/infographic';

function exportSVG(options: InfographicOptions): string {
  const infographic = new Infographic(options);
  const svgElement = infographic.compose();
  return svgElement.outerHTML;
}

// 使用
const svgString = exportSVG({
  container: '#container',
  data: { /* ... */ },
});

// 下载 SVG 文件
const blob = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'infographic.svg';
link.click();
```

### 动态更新

```typescript
import { Infographic } from '@antv/infographic';

let infographic: Infographic;

function updateInfographic(data: Data) {
  infographic = new Infographic({
    container: '#container',
    data,
  });
  infographic.render();
}

// 初始渲染
updateInfographic(initialData);

// 更新数据后重新渲染
updateButton.addEventListener('click', () => {
  updateInfographic(newData);
});
```

### 响应式实现

```typescript
import { Infographic } from '@antv/infographic';

function createResponsiveInfographic(data: Data) {
  const container = document.querySelector('#container');
  const width = container.clientWidth;

  return new Infographic({
    container,
    width,
    height: width * 0.6,
    data,
  });
}

let infographic = createResponsiveInfographic(data);
infographic.render();

// 监听窗口大小变化
window.addEventListener('resize', debounce(() => {
  infographic = createResponsiveInfographic(data);
  infographic.render();
}, 300));
```

## 注意事项

### 容器选择

- 容器可以是 CSS 选择器字符串或 HTMLElement 对象
- 如果使用选择器，必须确保元素存在
- 容器会被清空并填充新的 SVG 元素

```typescript
// 推荐：等待 DOM 加载完成
document.addEventListener('DOMContentLoaded', () => {
  const infographic = new Infographic({
    container: '#container',
    data: { /* ... */ },
  });
  infographic.render();
});

// 或使用 HTMLElement
const container = document.createElement('div');
document.body.appendChild(container);

const infographic = new Infographic({
  container: container,
  data: { /* ... */ },
});
```

### 性能考虑

- 对于频繁更新的场景，考虑使用防抖或节流
- 避免在 render 方法中进行大量计算，应在数据准备阶段完成
- 大数据集建议分页或虚拟滚动

### 错误处理

```typescript
try {
  const infographic = new Infographic({
    container: '#container',
    data: { /* ... */ },
  });
  infographic.render();
} catch (error) {
  console.error('渲染失败:', error);
  // 处理错误...
}
```

## 相关链接

- [配置选项](/api/options) - 详细的配置选项说明
- [数据结构](/guide/concepts#数据) - 数据格式定义
- [示例](/examples/) - 查看更多使用示例
