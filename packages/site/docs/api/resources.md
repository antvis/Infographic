# 资源加载 API

本页面详细说明资源加载相关的 API。

> 💡 **相关文档**：
>
> - [核心概念 - 资源](/guide/concepts#资源) - 理解资源的设计原理和工作机制
> - [资源加载器指南](/guide/resource-loader) - 详细的实践指南和使用示例

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
  data: '<svg>...</svg>',
};

// 自定义资源
const customConfig: ResourceConfig = {
  type: 'custom',
  data: 'icon:star',
  category: 'icons', // 可以添加自定义属性
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
function registerResourceLoader(loader: ResourceLoader): void;
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
  const response = await fetch(`/api/resources/${config.data}`);
  const svgString = await response.text();
  return loadSVGResource(svgString);
});
```

## 加载工具

### loadSVGResource()

将 SVG 字符串转换为资源对象。

**类型签名：**

```typescript
function loadSVGResource(data: string): Resource | null;
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

const svgString = '<svg xmlns="http://www.w3.org/2000/svg">...</svg>';
const resource = loadSVGResource(svgString);
```

### loadImageBase64Resource()

加载 Base64 编码的图片资源。

**类型签名：**

```typescript
function loadImageBase64Resource(data: string): Promise<Resource | null>;
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
```

### loadRemoteResource()

加载远程资源（通常在内部使用）。

**类型签名：**

```typescript
function loadRemoteResource(url: string): Promise<Resource | null>;
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

const resource = await loadRemoteResource('https://example.com/icon.svg');
```

## 内置协议

框架内置支持以下资源协议，无需注册加载器。所有内置协议使用 Data URI 格式：

```
data:[<MIME-type>][;base64],<data>
```

### SVG 资源

```
data:image/svg+xml,<svg-string>
```

### 远程 URL

```
data:text/url,<url>
```

### Base64 图片

```
data:image/<format>;base64,<base64-string>
```

## 资源解析

### parseResourceConfig()

解析资源配置（内部使用）。

**类型签名：**

```typescript
function parseResourceConfig(
  config: string | ResourceConfig,
): ResourceConfig | null;
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

## 相关链接

- [核心概念 - 资源](/guide/concepts#资源) - 理解资源的设计原理和工作机制
- [资源加载器指南](/guide/resource-loader) - 详细的实践指南和使用示例
- [配置选项](/api/options) - 了解如何配置资源
- [数据](/guide/concepts#数据) - 数据格式说明
