---
title: 资源
---

AntV Infographic 提供了[图标服务](/icon)，对于使用插图的模版，则需要自行处理加载逻辑。可选方案：

1. **内置协议**：使用 Data URI 直接嵌入资源（无需注册加载器）
2. **自定义加载器**：注册加载器从你的服务按需拉取

## 资源配置方式 {#resource-configuration}

在数据中，`icon` 和 `illus` 属性可以配置资源：

```json
{
  "data": {
    "items": [
      {
        "icon": "<ResourceConfig 或 字符串>",
        "illus": "<ResourceConfig 或 字符串>"
      }
    ]
  }
}
```

更多加载策略（图标协议、失败兜底等）请参阅[自定义资源加载器](/learn/custom-resource-loader)。

### 字符串形式 {#string-format}

字符串会被自动解析为 [ResourceConfig](/reference/infographic-types#resource-config) 对象：

```typescript
// 内联 SVG（非 base64）
icon: 'data:image/svg+xml,<svg>...</svg>';
// 标准 base64 图片（png/jpg/webp/...）
icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
// 远程资源（可选格式提示）
icon: 'ref:remote:svg:https://example.com/icon.svg';
illus: 'ref:remote:https://example.com/banner.png'; // 未提供 fmt 时会按 URL / Content-Type 推断
// 搜索图标（由 AntV 图标搜索服务提供）
icon: 'ref:search:svg:computer network';
```

### 对象形式 {#object-format}

可以直接提供 [ResourceConfig](/reference/infographic-types#resource-config) 对象：

```typescript
interface ResourceConfig {
  source: 'inline' | 'remote' | 'search' | 'custom';
  format?: 'svg' | 'image' | string;     // 兜底格式提示，优先使用真实 Content-Type/内容判定
  encoding?: 'raw' | 'data-uri' | 'base64';
  data: string;                          // inline 内容 / URL / 搜索词 / 自定义 payload
  scene?: 'icon' | 'illus';              // 可选，框架会自动填充当前字段的场景
  [key: string]: any;                    // 自定义扩展
}
```

## 内置资源协议 {#built-in-protocols}

框架内置了几种资源协议，无需注册加载器即可使用：

### 1. SVG 资源 {#svg-resource}

使用 Data URI 格式的 SVG，以 `data:image/svg+xml,` 开头，后面为 SVG 字符串：

```json
{
  "data": {
    "items": [
      {
        "icon": "data:image/svg+xml,<svg>...</svg>"
      }
    ]
  }
}
```

### 2. 远程 URL {#remote-url}

通过自定义协议 `ref:remote[:fmt]:<url>` 直接指定 URL（`fmt` 可省略，缺省时由 URL 或响应头推断）：

```json
{
  "data": {
    "items": [
      {
        "icon": "ref:remote:svg:https://example.com/icon.svg"
      }
    ]
  }
}
```

<Warning>
  远程资源加载可能受到 CORS 限制，请确保资源服务器配置了正确的跨域响应头。
</Warning>

### 3. Base64 图片 {#base64-image}

使用 Base64 编码的图片，遵循标准 data URI，如 `data:image/<format>;base64,`：

```json
{
  "data": {
    "items": [
      {
        "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."
      }
    ]
  }
}
```

### 4. 图标搜索 {#search-icon}

通过 `ref:search[:fmt]:<keywords>` 使用AntV 图标搜索服务提供资源，`fmt` 默认为 `svg`：

```json
{
  "data": {
    "items": [
      {
        "icon": "ref:search:computer network"
      }
    ]
  }
}
```
