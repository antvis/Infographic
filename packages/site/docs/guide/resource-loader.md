# 资源加载器

本指南介绍如何配置和使用资源加载器，为信息图提供图标和插图资源。

> 💡 **理解资源概念**：想要了解为什么需要资源加载器以及资源的工作机制，请参考 [核心概念 - 资源](/guide/concepts#资源)

## 概述

@antv/infographic 框架本身不提供任何资源服务。如果你的信息图中使用了图标或插图资源，需要自行实现资源加载逻辑。

框架支持两种方式：

1. **内置协议** - 使用 Data URI 直接嵌入资源（无需注册加载器）
2. **自定义加载器** - 注册加载器从你的服务加载资源

## 资源配置方式

在数据中，`icon` 和 `illus` 属性可以配置资源：

```typescript
const data = {
  items: [
    {
      icon: 'icon-name', // 字符串形式
      label: '功能 1',
      illus: {
        // 对象形式
        type: 'custom',
        data: 'my-illustration-id',
      },
    },
  ],
};
```

### 字符串形式

字符串会被自动解析为 `ResourceConfig` 对象：

```typescript
// 直接使用字符串
icon: 'star';
icon: 'icon:company-021';
illus: 'illus:teacher-student-rafiki';
```

### 对象形式

可以直接提供 `ResourceConfig` 对象：

```typescript
interface ResourceConfig {
  type: 'image' | 'svg' | 'remote' | 'custom';
  data: string;
  [key: string]: any; // 可以添加自定义属性
}
```

## 内置资源协议

框架内置了几种资源协议，无需注册加载器即可使用：

### 1. SVG 资源

使用 Data URI 格式的 SVG：

```typescript
{
  icon: 'data:image/svg+xml,<svg>...</svg>';
}
```

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
      label: '功能 1',
    },
  ],
};
```

### 2. 远程 URL

通过 Data URI 包装远程 URL：

```typescript
{
  icon: 'data:text/url,https://example.com/icon.svg';
}
```

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:text/url,https://cdn.example.com/icons/star.svg',
      label: '功能 1',
    },
  ],
};
```

::: warning 注意
远程资源加载可能受到 CORS 限制，请确保资源服务器配置了正确的跨域响应头。
:::

### 3. Base64 图片

使用 Base64 编码的图片：

```typescript
{
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
}
```

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
      label: '功能 1',
    },
  ],
};
```

## 自定义资源加载器

对于不符合内置协议的资源，需要注册自定义资源加载器。

### 注册加载器

使用 `registerResourceLoader` 函数注册：

```typescript
import { registerResourceLoader, loadSVGResource } from '@antv/infographic';

registerResourceLoader(async (config) => {
  // config.type: 资源类型 ('custom' 或其他)
  // config.data: 资源标识符

  // 根据资源标识符加载资源
  const svgString = await fetchResourceFromYourServer(config.data);

  // 使用内置工具转换为资源对象
  return loadSVGResource(svgString);
});
```

### 完整示例

下面是一个完整的自定义加载器示例，支持从自定义服务加载图标和插图：

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  Infographic,
} from '@antv/infographic';

// 注册资源加载器
registerResourceLoader(async (config) => {
  const { data } = config;

  // 解析资源类型和 ID
  // 例如: "icon:star" -> type="icon", id="star"
  //       "illus:chart-1" -> type="illus", id="chart-1"
  let type: string;
  let id: string;

  if (data.startsWith('icon:')) {
    type = 'icon';
    id = data.replace('icon:', '');
  } else if (data.startsWith('illus:')) {
    type = 'illustration';
    id = data.replace('illus:', '');
  } else {
    // 其他自定义协议
    type = 'default';
    id = data;
  }

  // 从你的服务器加载资源
  const svgString = await fetchFromYourServer(type, id);

  // 转换为 SVG 资源对象
  return loadSVGResource(svgString);
});

// 从服务器获取资源的函数
async function fetchFromYourServer(type: string, id: string): Promise<string> {
  const response = await fetch(
    `https://your-api.com/assets?type=${type}&id=${id}`,
  );
  return await response.text();
}

// 使用
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [
      {
        icon: 'icon:star', // 使用自定义协议
        label: '特性 1',
        illus: 'illus:chart-growth', // 使用自定义协议
      },
    ],
  },
});

infographic.render();
```

## 高级用法

### 缓存优化

为提高性能，建议在加载器中实现缓存：

```typescript
const resourceCache = new Map<string, string>();

registerResourceLoader(async (config) => {
  const { data } = config;

  // 检查缓存
  if (resourceCache.has(data)) {
    return loadSVGResource(resourceCache.get(data)!);
  }

  // 加载资源
  const svgString = await fetchFromYourServer(data);

  // 存入缓存
  resourceCache.set(data, svgString);

  return loadSVGResource(svgString);
});
```

### 错误处理

加载失败时返回默认资源：

```typescript
registerResourceLoader(async (config) => {
  try {
    const svgString = await fetchFromYourServer(config.data);
    return loadSVGResource(svgString);
  } catch (error) {
    console.error('资源加载失败:', error);

    // 返回默认 SVG
    const fallbackSVG = '<svg>...</svg>';
    return loadSVGResource(fallbackSVG);
  }
});
```

### 支持多种资源格式

根据资源类型使用不同的加载策略：

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  loadImageBase64Resource,
} from '@antv/infographic';

registerResourceLoader(async (config) => {
  const { data } = config;

  // 解析资源标识符
  const [protocol, ...rest] = data.split(':');
  const resourceId = rest.join(':');

  switch (protocol) {
    case 'icon':
      // 加载 SVG 图标
      const iconSvg = await fetchIcon(resourceId);
      return loadSVGResource(iconSvg);

    case 'illus':
      // 加载 SVG 插图
      const illusSvg = await fetchIllustration(resourceId);
      return loadSVGResource(illusSvg);

    case 'img':
      // 加载位图图片（转为 Base64）
      const imageBase64 = await fetchImageAsBase64(resourceId);
      return loadImageBase64Resource(imageBase64);

    default:
      throw new Error(`不支持的资源协议: ${protocol}`);
  }
});
```

### 预加载资源

在渲染前预加载所有资源：

```typescript
import { Infographic } from '@antv/infographic';

// 提取所有资源标识符
function extractResourceIds(data: Data): string[] {
  const ids: string[] = [];

  data.items.forEach((item) => {
    if (item.icon) ids.push(item.icon as string);
    if (item.illus) ids.push(item.illus as string);
  });

  return ids;
}

// 预加载资源
async function preloadResources(data: Data) {
  const resourceIds = extractResourceIds(data);

  await Promise.all(resourceIds.map((id) => fetchFromYourServer(id)));
}

// 使用
const data = {
  /* ... */
};

// 先预加载
await preloadResources(data);

// 再渲染
const infographic = new Infographic({
  container: '#container',
  data,
});

infographic.render();
```

## 工具函数

框架提供了工具函数帮助在自定义加载器中处理不同格式的资源。

### loadSVGResource() - SVG 资源转换

最常用的工具函数，用于将 SVG 字符串转换为框架可用的资源对象。

**基本用法**：

```typescript
import { loadSVGResource } from '@antv/infographic';

registerResourceLoader(async (config) => {
  // 从服务器获取 SVG 字符串
  const svgString = await fetch(`/api/icons/${config.data}`).then((r) =>
    r.text(),
  );

  // 转换为资源对象
  return loadSVGResource(svgString);
});
```

**处理不同的 SVG 格式**：

```typescript
// 支持 <svg> 标签
const svg1 = '<svg xmlns="http://www.w3.org/2000/svg">...</svg>';
loadSVGResource(svg1); // ✅ 自动转换

// 支持 <symbol> 标签
const svg2 = '<symbol id="icon-star">...</symbol>';
loadSVGResource(svg2); // ✅ 直接使用

// 处理可能的解析失败
const resource = loadSVGResource(svgString);
if (!resource) {
  console.error('SVG 解析失败');
}
```

> 💡 **提示**：完整的 API 参数说明请参考 [资源 API 文档](/api/resources#loadsvgresource)

### loadImageBase64Resource() - 图片资源转换

用于加载 Base64 编码的图片（PNG、JPEG、GIF 等），自动转换为 SVG 格式。

**基本用法**：

```typescript
import { loadImageBase64Resource } from '@antv/infographic';

registerResourceLoader(async (config) => {
  if (config.data.startsWith('img:')) {
    // 获取图片的 Base64 数据
    const base64 = await fetchImageAsBase64(config.data);

    // 转换为资源对象（异步）
    return await loadImageBase64Resource(base64);
  }

  // 处理其他类型...
});
```

**应用场景**：

```typescript
// 场景：支持用户上传的图片作为图标
registerResourceLoader(async (config) => {
  if (config.type === 'image') {
    // config.data 已经是 Base64 格式
    return await loadImageBase64Resource(config.data);
  }

  // 默认从服务器加载 SVG
  const svgString = await fetchFromServer(config.data);
  return loadSVGResource(svgString);
});
```

> ⚠️ **注意**：此函数是异步的，需要使用 `await`

### loadRemoteResource() - 远程资源加载

从远程 URL 加载 SVG 资源，通常在内部使用，但也可以在自定义场景中使用。

**基本用法**：

```typescript
import { loadRemoteResource } from '@antv/infographic';

registerResourceLoader(async (config) => {
  if (config.data.startsWith('http://') || config.data.startsWith('https://')) {
    // 直接从 URL 加载
    return await loadRemoteResource(config.data);
  }

  // 处理其他协议...
});
```

**结合缓存使用**：

```typescript
const cache = new Map<string, Resource>();

registerResourceLoader(async (config) => {
  const url = config.data;

  // 检查缓存
  if (cache.has(url)) {
    return cache.get(url)!;
  }

  // 加载远程资源
  const resource = await loadRemoteResource(url);

  // 存入缓存
  if (resource) {
    cache.set(url, resource);
  }

  return resource;
});
```

> ⚠️ **注意**：受 CORS 限制，确保目标服务器配置了正确的跨域响应头

## 最佳实践

### 1. 使用有意义的资源标识符

```typescript
// 推荐：清晰的命名
icon: 'icon:user-profile';
icon: 'icon:chart-bar';
illus: 'illus:dashboard-overview';

// 不推荐：难以理解的标识符
icon: 'res001';
icon: 'abc123';
```

### 2. 统一资源协议

在整个项目中使用统一的资源协议格式：

```typescript
// 统一使用 "type:id" 格式
icon: 'icon:star'
illus: 'illus:chart-1'

// 或使用对象格式
icon: { type: 'icon', data: 'star' }
illus: { type: 'illus', data: 'chart-1' }
```

### 3. 实现加载状态

提供加载反馈：

```typescript
let isLoading = false;
const loadingResources = new Set<string>();

registerResourceLoader(async (config) => {
  const { data } = config;

  loadingResources.add(data);
  updateLoadingState();

  try {
    const svgString = await fetchFromYourServer(data);
    return loadSVGResource(svgString);
  } finally {
    loadingResources.delete(data);
    updateLoadingState();
  }
});

function updateLoadingState() {
  isLoading = loadingResources.size > 0;
  // 更新 UI 显示加载状态
}
```

### 4. 错误降级

加载失败时提供合理的降级方案：

```typescript
registerResourceLoader(async (config) => {
  try {
    const svgString = await fetchFromYourServer(config.data);
    return loadSVGResource(svgString);
  } catch (error) {
    // 记录错误
    console.warn(`资源加载失败: ${config.data}`, error);

    // 返回占位符 SVG
    return loadSVGResource(getPlaceholderSVG(config.data));
  }
});

function getPlaceholderSVG(resourceId: string): string {
  // 根据资源类型返回不同的占位符
  if (resourceId.startsWith('icon:')) {
    return '<svg><!-- icon placeholder --></svg>';
  }
  return '<svg><!-- default placeholder --></svg>';
}
```

## 使用场景

资源在信息图中有多种使用场景，了解这些场景有助于更好地规划资源加载策略。

### 1. 数据项图标

最常见的场景是为每个数据项配置图标：

```typescript
const data = {
  items: [
    {
      icon: 'icon:star', // 需要自定义加载器
      label: '特性 1',
    },
    {
      icon: 'data:image/svg+xml,<svg>...</svg>', // 使用内置协议
      label: '特性 2',
    },
  ],
};
```

**适用情况**：

- 功能列表展示
- 服务介绍
- 产品特点说明
- 流程步骤标识

**加载策略建议**：

- 使用自定义加载器统一管理图标库
- 实现缓存避免重复加载
- 提供占位符防止加载失败影响布局

### 2. 数据项插图

为数据项配置较大的插图，通常用于视觉化展示：

```typescript
const data = {
  items: [
    {
      label: '功能 1',
      illus: 'illus:dashboard', // 需要自定义加载器
    },
    {
      label: '功能 2',
      illus: {
        // 使用对象形式，可携带额外信息
        type: 'custom',
        data: 'chart-1',
        category: 'illustrations',
      },
    },
  ],
};
```

**适用情况**：

- 概念说明
- 场景展示
- 使用指南
- 数据可视化配图

**加载策略建议**：

- 插图文件通常较大，考虑延迟加载
- 使用 CDN 加速访问
- 提供加载进度反馈

### 3. 全局插图

在数据根级别配置全局插图，如背景、Logo 等：

```typescript
const data = {
  title: '年度报告',
  items: [
    /* ... */
  ],
  illus: {
    background: 'data:text/url,https://example.com/bg.jpg',
    logo: 'icon:company-logo',
  },
};
```

**适用情况**：

- 品牌标识
- 背景装饰
- 水印
- 统一视觉元素

**加载策略建议**：

- 背景图优先使用 CDN
- 考虑图片压缩和格式优化
- Logo 使用 SVG 保证清晰度

### 4. 混合使用

实际项目中通常混合使用多种资源协议：

```typescript
const data = {
  items: [
    {
      // 使用自定义加载器（图标库）
      icon: 'icon:dashboard',
      label: '数据面板',
      // 使用 Data URI（嵌入式资源）
      illus: 'data:image/svg+xml,<svg>...</svg>',
    },
    {
      // 使用远程 URL（第三方资源）
      icon: 'data:text/url,https://cdn.example.com/icons/chart.svg',
      label: '图表分析',
    },
  ],
};
```

**选择建议**：

- **自定义协议**：内部统一管理的资源（图标库、插图库）
- **Data URI**：小型嵌入式资源、一次性使用的资源
- **远程 URL**：第三方资源、大型资源、动态资源

## 常见问题

### 资源加载失败怎么办？

1. 检查资源服务器是否可访问
2. 检查 CORS 配置
3. 查看浏览器控制台的错误信息
4. 实现错误降级机制

### 如何调试资源加载？

在加载器中添加日志：

```typescript
registerResourceLoader(async (config) => {
  console.log('加载资源:', config);

  try {
    const svgString = await fetchFromYourServer(config.data);
    console.log('资源加载成功:', config.data);
    return loadSVGResource(svgString);
  } catch (error) {
    console.error('资源加载失败:', config.data, error);
    throw error;
  }
});
```

### 可以注册多个加载器吗？

不可以，`registerResourceLoader` 会覆盖之前注册的加载器。如需支持多种资源类型，请在一个加载器中处理：

```typescript
registerResourceLoader(async (config) => {
  const { data } = config;

  if (data.startsWith('type1:')) {
    return await loadType1(data);
  } else if (data.startsWith('type2:')) {
    return await loadType2(data);
  }

  // 默认处理
  return await loadDefault(data);
});
```

## 注意事项

在使用资源加载器时，需要注意以下几点以避免常见问题。

### 1. 只能注册一个加载器

`registerResourceLoader` 会覆盖之前注册的加载器，因此需要在一个加载器中处理所有资源类型：

```typescript
// ✅ 正确：在一个加载器中处理多种类型
registerResourceLoader(async (config) => {
  if (config.data.startsWith('icon:')) {
    return await loadIcon(config.data);
  }
  if (config.data.startsWith('illus:')) {
    return await loadIllus(config.data);
  }
  // 默认处理
  return null;
});

// ❌ 错误：多次注册会覆盖
registerResourceLoader(loadIcon);
registerResourceLoader(loadIllus); // 会覆盖上面的 loadIcon
```

**建议**：

- 使用协议前缀（如 `icon:`、`illus:`）区分不同类型
- 在加载器内部实现路由逻辑
- 对未知类型返回 null 或抛出错误

### 2. 资源加载是异步的

框架会自动等待所有资源加载完成后再渲染，无需手动处理：

```typescript
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [
      { icon: 'icon:1', label: '项 1' },
      { icon: 'icon:2', label: '项 2' }, // 并行加载
      { icon: 'icon:3', label: '项 3' },
    ],
  },
});

infographic.render(); // 会等待所有资源加载完成
```

**建议**：

- 不需要使用 `await infographic.render()`
- 框架内部会并行加载多个资源
- 考虑实现加载进度提示提升用户体验

### 3. CORS 限制

使用远程 URL 加载资源时会受到浏览器 CORS 策略限制：

```typescript
// 确保资源服务器返回正确的 CORS 头
Access-Control-Allow-Origin: *
// 或指定域名
Access-Control-Allow-Origin: https://your-domain.com
```

**解决方案**：

- **方案 1**：配置服务器 CORS 响应头
- **方案 2**：使用同域资源或服务端代理
- **方案 3**：将资源转为 Data URI 嵌入

### 4. 性能优化建议

资源加载会影响信息图的渲染性能，建议采取以下优化措施：

| 优化策略 | 说明 | 适用场景 |
||||
| **实现缓存** | 避免重复加载相同资源 | 所有场景 |
| **使用 CDN** | 加速远程资源访问 | 远程URL场景 |
| **预加载** | 提前加载常用资源 | 已知资源列表 |
| **压缩资源** | 减小 SVG 文件大小 | 自有资源 |
| **延迟加载** | 按需加载非关键资源 | 大量资源场景 |

**缓存示例**：

```typescript
const cache = new Map<string, string>();

registerResourceLoader(async (config) => {
  const { data } = config;

  if (cache.has(data)) {
    return loadSVGResource(cache.get(data)!);
  }

  const svgString = await fetchFromYourServer(data);
  cache.set(data, svgString);

  return loadSVGResource(svgString);
});
```

### 5. 错误处理和降级

生产环境中务必实现错误处理，防止资源加载失败导致渲染中断：

```typescript
registerResourceLoader(async (config) => {
  try {
    const svgString = await fetchFromYourServer(config.data);
    return loadSVGResource(svgString);
  } catch (error) {
    console.error(`资源加载失败: ${config.data}`, error);

    // 返回占位符 SVG
    return loadSVGResource(
      '<svg viewBox="0 0 24 24"><rect width="24" height="24" fill="#ccc"/></svg>',
    );
  }
});
```

**建议**：

- 记录错误日志便于排查
- 提供视觉占位符而非空白
- 根据资源类型返回不同占位符
- 考虑实现重试机制

### 6. 资源格式要求

确保资源符合以下格式要求：

- **SVG**：必须是有效的 SVG XML，可以是 `<svg>` 或 `<symbol>` 标签
- **图片**：Base64 格式必须包含完整的 Data URI 头（`data:image/...;base64,...`）
- **编码**：SVG 字符串使用 UTF-8 编码

**常见错误**：

```typescript
// ❌ 错误：缺少 XML 命名空间
'<svg><circle r="10"/></svg>';

// ✅ 正确：包含完整命名空间
'<svg xmlns="http://www.w3.org/2000/svg"><circle r="10"/></svg>';
```

## 相关链接

- [核心概念 - 资源](/guide/concepts#资源) - 理解资源的设计原理和工作机制
- [资源 API 参考](/api/resources) - 完整的资源加载 API
- [配置选项](/api/options) - 了解如何配置资源
- [高级用法](/guide/advanced) - 更多高级特性
