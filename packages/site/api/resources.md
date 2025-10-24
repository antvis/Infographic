# 资源加载 API

本页面详细说明资源加载相关的 API。

## 类型定义

### ResourceConfig

资源配置对象。

```typescript
interface ResourceConfig {
  type: 'image' | 'svg' | 'remote' | 'custom';
  data: string;
  [key: string]: any;
}
```

**属性：**

- `type` - 资源类型
  - `'image'` - Base64 编码的图片
  - `'svg'` - SVG 字符串
  - `'remote'` - 远程 URL
  - `'custom'` - 自定义类型（需要自定义加载器）

- `data` - 资源数据
  - 对于 `image` 类型：Base64 字符串
  - 对于 `svg` 类型：SVG XML 字符串
  - 对于 `remote` 类型：URL 字符串
  - 对于 `custom` 类型：自定义标识符

**示例：**

```typescript
// SVG 资源
const svgConfig: ResourceConfig = {
  type: 'svg',
  data: '<svg>...</svg>'
};

// 自定义资源
const customConfig: ResourceConfig = {
  type: 'custom',
  data: 'icon:star',
  category: 'icons'  // 可以添加自定义属性
};
```

### ResourceLoader

资源加载器函数类型。

```typescript
type ResourceLoader = (config: ResourceConfig) => Promise<Resource>;
```

**参数：**
- `config: ResourceConfig` - 资源配置对象

**返回值：**
- `Promise<Resource>` - 返回 Promise，解析为资源对象（SVGSymbolElement）

**示例：**

```typescript
const myLoader: ResourceLoader = async (config) => {
  const svgString = await fetchResource(config.data);
  return loadSVGResource(svgString);
};
```

### Resource

资源对象类型（SVGSymbolElement 的别名）。

```typescript
type Resource = SVGSymbolElement;
```

## 注册器

### registerResourceLoader()

注册自定义资源加载器。

**类型签名：**

```typescript
function registerResourceLoader(loader: ResourceLoader): void
```

**参数：**
- `loader: ResourceLoader` - 资源加载器函数

**返回值：**
- `void`

**说明：**
- 只能注册一个加载器，新注册的会覆盖之前的
- 当资源类型为 `custom` 或内置加载器无法处理时，会调用自定义加载器
- 加载器应该是异步函数，返回 Promise

**示例：**

```typescript
import { registerResourceLoader, loadSVGResource } from '@antv/infographic';

registerResourceLoader(async (config) => {
  const { type, data } = config;

  // 从服务器加载资源
  const response = await fetch(`/api/resources?id=${data}`);
  const svgString = await response.text();

  // 转换为资源对象
  return loadSVGResource(svgString);
});
```

**完整示例：**

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  Infographic
} from '@antv/infographic';

// 1. 注册加载器
registerResourceLoader(async (config) => {
  const { data } = config;

  // 解析资源协议
  if (data.startsWith('icon:')) {
    const iconId = data.replace('icon:', '');
    const svg = await fetchIcon(iconId);
    return loadSVGResource(svg);
  }

  if (data.startsWith('illus:')) {
    const illusId = data.replace('illus:', '');
    const svg = await fetchIllustration(illusId);
    return loadSVGResource(svg);
  }

  throw new Error(`不支持的资源类型: ${data}`);
});

// 2. 创建信息图
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [
      {
        icon: 'icon:star',          // 使用自定义协议
        label: '特性 1',
        illus: 'illus:chart-1'
      }
    ]
  }
});

infographic.render();

// 辅助函数
async function fetchIcon(id: string): Promise<string> {
  const response = await fetch(`/api/icons/${id}`);
  return await response.text();
}

async function fetchIllustration(id: string): Promise<string> {
  const response = await fetch(`/api/illustrations/${id}`);
  return await response.text();
}
```

## 加载工具

### loadSVGResource()

将 SVG 字符串转换为资源对象。

**类型签名：**

```typescript
function loadSVGResource(data: string): Resource | null
```

**参数：**
- `data: string` - SVG XML 字符串，必须以 `<svg` 或 `<symbol` 开头

**返回值：**
- `Resource | null` - 资源对象（SVGSymbolElement）或 null（解析失败时）

**说明：**
- 自动将 `<svg>` 标签转换为 `<symbol>` 标签
- 用于在自定义加载器中转换 SVG 字符串

**示例：**

```typescript
import { loadSVGResource } from '@antv/infographic';

// 加载 SVG 字符串
const svgString = '<svg xmlns="http://www.w3.org/2000/svg">...</svg>';
const resource = loadSVGResource(svgString);

if (resource) {
  console.log('资源加载成功');
} else {
  console.error('资源加载失败');
}

// 在自定义加载器中使用
registerResourceLoader(async (config) => {
  const svgString = await fetch(config.data).then(r => r.text());
  return loadSVGResource(svgString);
});
```

### loadImageBase64Resource()

加载 Base64 编码的图片资源。

**类型签名：**

```typescript
function loadImageBase64Resource(data: string): Promise<Resource | null>
```

**参数：**
- `data: string` - Base64 编码的图片数据 URI（格式：`data:image/...;base64,...`）

**返回值：**
- `Promise<Resource | null>` - 返回 Promise，解析为资源对象或 null

**说明：**
- 自动将图片转换为 SVG 格式
- 支持 PNG、JPEG、GIF 等常见图片格式
- 异步函数

**示例：**

```typescript
import { loadImageBase64Resource } from '@antv/infographic';

const base64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...';
const resource = await loadImageBase64Resource(base64);

if (resource) {
  console.log('图片资源加载成功');
}
```

### loadRemoteResource()

加载远程资源（通常在内部使用）。

**类型签名：**

```typescript
function loadRemoteResource(url: string): Promise<Resource | null>
```

**参数：**
- `url: string` - 资源的 URL

**返回值：**
- `Promise<Resource | null>` - 返回 Promise，解析为资源对象或 null

**说明：**
- 从远程 URL 加载 SVG 资源
- 受浏览器 CORS 策略限制
- 异步函数

**示例：**

```typescript
import { loadRemoteResource } from '@antv/infographic';

const url = 'https://example.com/icon.svg';
const resource = await loadRemoteResource(url);

if (resource) {
  console.log('远程资源加载成功');
}
```

## 内置协议

框架支持以下内置资源协议，无需注册加载器：

### Data URI 格式

所有内置协议都使用 Data URI 格式：

```
data:[<MIME-type>][;base64],<data>
```

### SVG 资源

**格式：** `data:image/svg+xml,<svg-string>`

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
      label: '示例'
    }
  ]
};
```

### 远程 URL

**格式：** `data:text/url,<url>`

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:text/url,https://example.com/icon.svg',
      label: '示例'
    }
  ]
};
```

### Base64 图片

**格式：** `data:image/<format>;base64,<base64-string>`

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
      label: '示例'
    }
  ]
};
```

## 资源解析

### parseResourceConfig()

解析资源配置（内部使用）。

**类型签名：**

```typescript
function parseResourceConfig(
  config: string | ResourceConfig
): ResourceConfig | null
```

**参数：**
- `config: string | ResourceConfig` - 资源配置

**返回值：**
- `ResourceConfig | null` - 解析后的配置对象或 null

**说明：**
- 将字符串形式的资源配置解析为 ResourceConfig 对象
- 支持 Data URI 格式自动识别类型
- 不以 `data:` 开头的字符串会被解析为 `custom` 类型

**解析规则：**

```typescript
// Data URI 格式会被自动识别
'data:image/svg+xml,<svg>...'  → { type: 'svg', data: '<svg>...' }
'data:text/url,https://...'    → { type: 'remote', data: 'https://...' }
'data:image/png;base64,...'    → { type: 'image', data: 'data:image/png;base64,...' }

// 非 Data URI 格式被视为自定义类型
'icon:star'                    → { type: 'custom', data: 'icon:star' }
'my-resource-id'               → { type: 'custom', data: 'my-resource-id' }
```

## 使用场景

### 1. 数据项图标

在数据项中配置图标：

```typescript
const data = {
  items: [
    {
      icon: 'icon:star',  // 需要自定义加载器
      label: '特性 1'
    },
    {
      icon: 'data:image/svg+xml,<svg>...</svg>',  // 使用内置协议
      label: '特性 2'
    }
  ]
};
```

### 2. 数据项插图

在数据项中配置插图：

```typescript
const data = {
  items: [
    {
      label: '功能 1',
      illus: 'illus:dashboard',  // 需要自定义加载器
    },
    {
      label: '功能 2',
      illus: {  // 使用对象形式
        type: 'custom',
        data: 'chart-1',
        category: 'illustrations'
      }
    }
  ]
};
```

### 3. 全局插图

在数据根级别配置全局插图：

```typescript
const data = {
  title: '标题',
  items: [/* ... */],
  illus: {
    background: 'data:text/url,https://example.com/bg.jpg',
    logo: 'icon:company-logo'
  }
};
```

## 完整示例

### 基础用法

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  Infographic
} from '@antv/infographic';

// 注册加载器
registerResourceLoader(async (config) => {
  const response = await fetch(`/api/resources/${config.data}`);
  const svgString = await response.text();
  return loadSVGResource(svgString);
});

// 使用
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [
      { icon: 'star', label: '功能 1' },
      { icon: 'heart', label: '功能 2' }
    ]
  }
});

infographic.render();
```

### 带缓存的加载器

```typescript
import {
  registerResourceLoader,
  loadSVGResource
} from '@antv/infographic';

const cache = new Map<string, string>();

registerResourceLoader(async (config) => {
  const { data } = config;

  // 检查缓存
  if (cache.has(data)) {
    return loadSVGResource(cache.get(data)!);
  }

  // 加载资源
  const response = await fetch(`/api/resources/${data}`);
  const svgString = await response.text();

  // 存入缓存
  cache.set(data, svgString);

  return loadSVGResource(svgString);
});
```

### 错误处理

```typescript
import {
  registerResourceLoader,
  loadSVGResource
} from '@antv/infographic';

registerResourceLoader(async (config) => {
  try {
    const response = await fetch(`/api/resources/${config.data}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const svgString = await response.text();
    return loadSVGResource(svgString);
  } catch (error) {
    console.error('资源加载失败:', error);

    // 返回占位符
    return loadSVGResource('<svg><!-- placeholder --></svg>');
  }
});
```

## 注意事项

### 1. 只能注册一个加载器

```typescript
// ✅ 正确：在一个加载器中处理多种类型
registerResourceLoader(async (config) => {
  if (config.data.startsWith('icon:')) {
    return await loadIcon(config.data);
  }
  if (config.data.startsWith('illus:')) {
    return await loadIllus(config.data);
  }
  return null;
});

// ❌ 错误：多次注册会覆盖
registerResourceLoader(loadIcon);
registerResourceLoader(loadIllus);  // 会覆盖上面的
```

### 2. 异步加载

资源加载是异步的，框架会自动等待所有资源加载完成后再渲染：

```typescript
// 框架内部会自动等待
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [
      { icon: 'icon:1', label: '项 1' },
      { icon: 'icon:2', label: '项 2' },  // 并行加载
      { icon: 'icon:3', label: '项 3' }
    ]
  }
});

infographic.render();  // 会等待所有资源加载完成
```

### 3. CORS 限制

远程资源受 CORS 策略限制：

```typescript
// 确保服务器返回正确的 CORS 头
Access-Control-Allow-Origin: *
// 或
Access-Control-Allow-Origin: https://your-domain.com
```

### 4. 性能优化

- 实现资源缓存避免重复加载
- 使用 CDN 加速资源访问
- 预加载常用资源
- 压缩 SVG 文件大小

## 相关链接

- [资源加载器指南](/guide/resource-loader) - 详细的使用指南
- [配置选项](/api/options) - 了解如何配置资源
- [数据结构](/api/data) - 数据格式说明
