# 高级用法

本指南介绍 Infographic 的高级特性和使用技巧。

## 加载外部资源

Infographic 支持加载图标、插图等资源。框架不提供资源服务，需要自行实现资源加载逻辑。

### 快速示例

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  Infographic,
} from '@antv/infographic';

// 注册资源加载器
registerResourceLoader(async (config) => {
  const { data } = config;

  // 从你的服务器加载资源
  const response = await fetch(`/api/resources/${data}`);
  const svgString = await response.text();

  // 转换为资源对象
  return loadSVGResource(svgString);
});

// 使用
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [
      {
        icon: 'star', // 资源标识符
        label: '功能 1',
        illus: 'chart-growth', // 插图标识符
      },
    ],
  },
});

infographic.render();
```

### 内置协议

框架支持以下内置协议，无需注册加载器：

```typescript
// SVG 资源
icon: 'data:image/svg+xml,<svg>...</svg>';

// 远程 URL
icon: 'data:text/url,https://example.com/icon.svg';

// Base64 图片
icon: 'data:image/png;base64,iVBORw0KG...';
```

### 详细说明

关于资源加载的完整说明，请查看[资源加载器指南](/guide/resource-loader)和[资源加载 API](/api/resources)。

## 数值格式化

为数据项提供自定义的数值格式化函数：

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
        // 转换为万
        if (value >= 10000) {
          return (value / 10000).toFixed(1) + '万';
        }
        return value.toString();
      },
    },
  },
});
```

### 常用格式化函数

```typescript
// 百分比
const percentFormatter = (value: number) => `${value}%`;

// 货币
const currencyFormatter = (value: number) =>
  `¥${value.toLocaleString('zh-CN')}`;

// 千位分隔符
const thousandFormatter = (value: number) => value.toLocaleString('zh-CN');

// 缩写
const abbreviateFormatter = (value: number) => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};
```

## 自定义尺寸和间距

### 容器尺寸

```typescript
const infographic = new Infographic({
  container: '#container',
  width: 1200, // 指定宽度
  height: 800, // 指定高度
  padding: 20, // 内边距
  data: {
    /* ... */
  },
});
```

### Padding 配置方式

```typescript
// 方式 1: 单个数值（所有方向）
padding: 20

// 方式 2: 数组 [垂直, 水平]
padding: [10, 20]

// 方式 3: 数组 [上, 右, 下, 左]
padding: [10, 20, 10, 20]

// 方式 4: 对象（最灵活）
padding: {
  top: 10,
  right: 20,
  bottom: 10,
  left: 20
}
```

### 结构间距

```typescript
design: {
  structure: {
    type: 'list-column',
    gap: 30,    // 数据项间距
    width: 400, // 内容宽度
  }
}
```

### 数据项尺寸

```typescript
design: {
  item: {
    type: 'badge-card',
    width: 300,
    height: 100,
    iconSize: 32,
    gap: 12,
  }
}
```

## 导出 SVG

获取渲染后的 SVG 元素：

```typescript
import { Infographic, parseSVG } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  data: {
    /* ... */
  },
});

infographic.render();

// 方法 1: 从容器获取
const container = document.querySelector('#container');
const svgElement = container.querySelector('svg');
const svgString = svgElement.outerHTML;

// 方法 2: 使用 compose 方法
const svgElement = infographic.compose();
const svgString = svgElement.outerHTML;

// 下载 SVG
const blob = new Blob([svgString], { type: 'image/svg+xml' });
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = 'infographic.svg';
link.click();
```

## 层级数据

对于层级结构（如组织架构、树形图），使用 `children` 属性：

```typescript
const data = {
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
            { label: '测试团队' },
          ],
        },
        {
          label: 'CMO',
          children: [{ label: '市场部' }, { label: '销售部' }],
        },
        {
          label: 'CFO',
          children: [{ label: '财务部' }, { label: '审计部' }],
        },
      ],
    },
  ],
};

const infographic = new Infographic({
  container: '#container',
  design: {
    structure: 'hierarchy-tree',
    item: 'rounded-rect-node',
  },
  data,
});
```

## 使用多级数据项

在同一个信息图中使用不同样式的数据项：

```typescript
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [{ label: '项目 1' }, { label: '项目 2' }, { label: '项目 3' }],
  },
  design: {
    structure: 'list-column',
    items: [
      'badge-card', // 一级节点使用的数据项
      { type: 'progress-card', width: 250 }, // 二级节点使用的数据项
      'icon-badge', // 三级节点使用的数据项
    ],
  },
});
```

## 响应式设计

### 动态调整尺寸

```typescript
function createResponsiveInfographic() {
  const container = document.querySelector('#container');
  const width = container.clientWidth;

  return new Infographic({
    container,
    width,
    height: width * 0.6, // 保持宽高比
    data: {
      /* ... */
    },
  });
}

// 监听窗口大小变化
let infographic = createResponsiveInfographic();

window.addEventListener('resize', () => {
  infographic = createResponsiveInfographic();
  infographic.render();
});
```

### 媒体查询

```typescript
function getDesignForViewport() {
  const width = window.innerWidth;

  if (width < 768) {
    // 移动端：使用纵向列表
    return {
      structure: 'list-column',
      item: { type: 'compact-card', width: 300 },
    };
  } else if (width < 1200) {
    // 平板：使用网格
    return {
      structure: 'list-grid',
      item: 'badge-card',
    };
  } else {
    // 桌面：使用横向列表
    return {
      structure: 'list-row',
      item: { type: 'badge-card', width: 400 },
    };
  }
}

const infographic = new Infographic({
  container: '#container',
  design: getDesignForViewport(),
  data: {
    /* ... */
  },
});
```

## 性能优化

### 1. 数据预处理

对大量数据进行预处理，避免在渲染时进行复杂计算：

```typescript
// 预计算百分比
const items = rawData.map((item) => ({
  ...item,
  percentage: (item.value / total) * 100,
}));
```

### 2. 资源预加载

对于使用大量外部资源的场景，可以预加载资源：

```typescript
import { loadSVGResource } from '@antv/infographic';

// 预加载所有图标
const iconUrls = data.items.map((item) => item.icon);
await Promise.all(iconUrls.map((url) => loadSVGResource(url)));

// 然后创建信息图
const infographic = new Infographic({
  container: '#container',
  data,
});
```

### 3. 限制数据项数量

对于大数据集，考虑分页或限制显示数量：

```typescript
const PAGE_SIZE = 10;

function createPagedInfographic(page = 0) {
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  return new Infographic({
    container: '#container',
    data: {
      ...data,
      items: data.items.slice(start, end),
    },
  });
}
```

## 下一步

- 查看完整 [API 文档](/api/)
- 浏览[示例库](/examples/)获取更多灵感
