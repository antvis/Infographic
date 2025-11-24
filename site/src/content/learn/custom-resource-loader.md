---
title: 自定义资源加载器
---

<Note>如果你不了解资源的概念，可以先阅读[资源](/learn/resources)一节</Note>

当内置协议不足以满足资源来源时，可以注册自定义资源加载器，扩展图标、插图等的获取方式。

实现流程很简单：

1. 使用 `registerResourceLoader` 注册加载函数
2. 在函数内解析协议、拉取资源
3. 通过工具函数（如 `loadSVGResource`）返回标准资源对象

`@antv/infographic` 还提供了 `loadSVGResource` 等工具函数，帮助将内容转换为框架可识别的资源。

## 简单示例 {#simple-example}

下面是一个简单的示例，它从[iconify](https://iconify.design/)加载图标，并从`balazser/undraw-svg-collection`的 [Github 仓库](https://github.com/balazser/undraw-svg-collection)加载插图：

```js
import {registerResourceLoader, loadSVGResource} from '@antv/infographic';

// 注册资源加载器
registerResourceLoader(async (config) => {
  const {data} = config;

  // 解析资源类型和 ID
  // 例如: "icon:mdi/rocket-launch" -> type="icon", id="mdi/rocket-launch"
  //       "illus:analysis" -> type="illus", id="analysis"
  let url: string;

  if (type === 'icon') {
    url = `https://api.iconify.design/${id}.svg`;
  } else if (type === 'illus') {
    url = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/refs/heads/main/svgs/${id}.svg`;
  }

  // 请求资源
  const response = await fetch(url);
  const svgString = await response.text();

  // 使用工具函数加载资源
  return loadSVGResource(svgString);
});
```

<Note>受 CORS 限制，确保目标服务器配置了正确的跨域响应头</Note>

## 完整示例 {#full-example}

下面是一个完整的自定义加载器示例

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  Infographic,
} from '@antv/infographic';

// 从服务器获取资源的函数
async function fetchFromYourServer(type: string, id: string): Promise<string> {
  const response = await fetch(
    `https://your-api.com/assets?type=${type}&id=${id}`
  );
  return await response.text();
}

// 注册资源加载器
registerResourceLoader(async (config) => {
  const {data} = config;

  // 解析资源类型和 ID
  // 例如: "icon:star" -> type="icon", id="star"
  // "illus:chart-1" -> type="illus", id="chart-1"
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

// 使用
const infographic = new Infographic({
  // 其他配置项...
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

## 工具函数 {#工具函数}

框架提供了工具函数帮助在自定义加载器中处理不同格式的资源。

### loadSVGResource() - SVG 资源转换 {#loadsvgresource---svg-资源转换}

最常用的工具函数，用于将 SVG 字符串转换为框架可用的资源对象。

**基本用法**：

```typescript
import {loadSVGResource} from '@antv/infographic';

registerResourceLoader(async (config) => {
  // 从服务器获取 SVG 字符串
  const svgString = await fetch(`/api/icons/${config.data}`).then((r) =>
    r.text()
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

> 💡 **提示**：完整的 API 参数说明请参考 [核心概念 - 资源](/learn/resources)

### loadImageBase64Resource() - 图片资源转换 {#loadimagebase64resource---图片资源转换}

用于加载 Base64 编码的图片（PNG、JPEG、GIF 等），自动转换为 SVG 格式。

**基本用法**：

```typescript
import {loadImageBase64Resource} from '@antv/infographic';

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

### loadRemoteResource() - 远程资源加载 {#loadremoteresource---远程资源加载}

从远程 URL 加载 SVG 资源，通常在内部使用，但也可以在自定义场景中使用。

**基本用法**：

```typescript
import {loadRemoteResource} from '@antv/infographic';

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

## 高级用法 {#advanced-usage}

### 缓存优化 {#cache-optimization}

为提高性能，建议在加载器中实现缓存：

```typescript
const resourceCache = new Map<string, string>();

registerResourceLoader(async (config) => {
  const {data} = config;

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

### 错误处理 {#error-handling}

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

### 支持多种资源格式 {#multiple-formats}

根据资源类型使用不同的加载策略：

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  loadImageBase64Resource,
} from '@antv/infographic';

registerResourceLoader(async (config) => {
  const {data} = config;

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

### 预加载资源 {#preload-resources}

在渲染前预加载所有资源：

```typescript
import {Infographic} from '@antv/infographic';

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
  // 其他配置项...
  data,
});

infographic.render();
```

## 最佳实践 {#best-practices}

### 1. 使用有意义的资源标识符 {#meaningful-resource-identifiers}

```typescript
// 推荐：清晰的命名
icon: 'icon:user-profile';
icon: 'icon:chart-bar';
illus: 'illus:dashboard-overview';

// 不推荐：难以理解的标识符
icon: 'res001';
icon: 'abc123';
```

### 2. 统一资源协议 {#uniform-resource-protocol}

在整个项目中使用统一的资源协议格式：

```typescript
// 统一使用 "type:id" 格式
icon: 'icon:star'
illus: 'illus:chart-1'

// 或使用对象格式
icon: { type: 'icon', data: 'star' }
illus: { type: 'illus', data: 'chart-1' }
```

### 3. 实现加载状态 {#loading-state}

提供加载反馈：

```typescript
let isLoading = false;
const loadingResources = new Set<string>();

registerResourceLoader(async (config) => {
  const {data} = config;

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

### 4. 错误降级 {#error-degradation}

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

## 注意事项 {#considerations}

在使用资源加载器时，需要注意以下几点以避免常见问题。

### 1. 单一加载器 {#single-loader}

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

### 2. 异步资源加载 {#async-loading}

`@antv/infographic` 会并行加载资源，且资源的加载不会阻塞信息图渲染过程。

当资源加载速度较慢时，信息图中的图标/插图可能会延迟显示。

```typescript
const infographic = new Infographic({
  // 其他配置项...
  data: {
    items: [
      {icon: 'icon:1', label: '数据项 1'},
      {icon: 'icon:2', label: '数据项 2'}, // 并行加载
      {icon: 'icon:3', label: '数据项 3'},
    ],
  },
});

infographic.render();
```
