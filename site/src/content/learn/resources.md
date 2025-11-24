---
title: 资源
---

AntV Infographic 不自带资源服务。如需使用图标或插图，需要自行处理加载逻辑。可选方案：

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
// 直接使用字符串
icon: 'data:image/svg+xml,<svg>...</svg>';
icon: 'data:text/url,https://example.com/icon.svg';
illus: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
```

### 对象形式 {#object-format}

可以直接提供 [ResourceConfig](/reference/infographic-types#resource-config) 对象：

```typescript
interface ResourceConfig {
  type: 'image' | 'svg' | 'remote' | 'custom';
  data: string;
  [key: string]: any; // 可以添加自定义属性
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

通过 Data URI 包装远程 URL，以 `data:text/url,` 开头，后面为资源的完整 URL：

```json
{
  "data": {
    "items": [
      {
        "icon": "data:text/url,https://example.com/icon.svg"
      }
    ]
  }
}
```

<Warning>
  远程资源加载可能受到 CORS 限制，请确保资源服务器配置了正确的跨域响应头。
</Warning>

### 3. Base64 图片 {#base64-image}

使用 Base64 编码的图片，以 `data:image/<format>;base64,` 开头，后面为 Base64 编码字符串：

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
