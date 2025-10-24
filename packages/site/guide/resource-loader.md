# 资源加载器

@antv/infographic 框架本身不提供任何资源服务，如果你的信息图中使用了图标或插图资源，需要自行实现资源加载逻辑。

## 资源配置方式

在数据中，`icon` 和 `illus` 属性可以配置资源：

```typescript
const data = {
  items: [
    {
      icon: 'icon-name',           // 字符串形式
      label: '功能 1',
      illus: {                      // 对象形式
        type: 'custom',
        data: 'my-illustration-id'
      }
    }
  ]
};
```

### 字符串形式

字符串会被自动解析为 `ResourceConfig` 对象：

```typescript
// 直接使用字符串
icon: 'star'
icon: 'icon:company-021'
illus: 'illus:teacher-student-rafiki'
```

### 对象形式

可以直接提供 `ResourceConfig` 对象：

```typescript
interface ResourceConfig {
  type: 'image' | 'svg' | 'remote' | 'custom';
  data: string;
  [key: string]: any;  // 可以添加自定义属性
}
```

## 内置资源协议

框架内置了几种资源协议，无需注册加载器即可使用：

### 1. SVG 资源

使用 Data URI 格式的 SVG：

```typescript
{
  icon: 'data:image/svg+xml,<svg>...</svg>'
}
```

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>',
      label: '功能 1'
    }
  ]
};
```

### 2. 远程 URL

通过 Data URI 包装远程 URL：

```typescript
{
  icon: 'data:text/url,https://example.com/icon.svg'
}
```

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:text/url,https://cdn.example.com/icons/star.svg',
      label: '功能 1'
    }
  ]
};
```

::: warning 注意
远程资源加载可能受到 CORS 限制，请确保资源服务器配置了正确的跨域响应头。
:::

### 3. Base64 图片

使用 Base64 编码的图片：

```typescript
{
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...'
}
```

**示例：**

```typescript
const data = {
  items: [
    {
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
      label: '功能 1'
    }
  ]
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
  Infographic
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
  const response = await fetch(`https://your-api.com/assets?type=${type}&id=${id}`);
  return await response.text();
}

// 使用
const infographic = new Infographic({
  container: '#container',
  data: {
    items: [
      {
        icon: 'icon:star',              // 使用自定义协议
        label: '特性 1',
        illus: 'illus:chart-growth'     // 使用自定义协议
      }
    ]
  }
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
  loadImageBase64Resource
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

  data.items.forEach(item => {
    if (item.icon) ids.push(item.icon as string);
    if (item.illus) ids.push(item.illus as string);
  });

  return ids;
}

// 预加载资源
async function preloadResources(data: Data) {
  const resourceIds = extractResourceIds(data);

  await Promise.all(
    resourceIds.map(id => fetchFromYourServer(id))
  );
}

// 使用
const data = { /* ... */ };

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

框架提供了几个工具函数帮助实现资源加载器：

### loadSVGResource()

将 SVG 字符串转换为资源对象：

```typescript
import { loadSVGResource } from '@antv/infographic';

const svgString = '<svg>...</svg>';
const resource = loadSVGResource(svgString);
```

**参数：**
- `data: string` - SVG 字符串（可以是 `<svg>` 或 `<symbol>` 标签）

**返回：**
- `SVGSymbolElement | null` - 资源对象或 null

### loadImageBase64Resource()

加载 Base64 编码的图片资源：

```typescript
import { loadImageBase64Resource } from '@antv/infographic';

const base64 = 'data:image/png;base64,iVBORw0KG...';
const resource = await loadImageBase64Resource(base64);
```

### loadRemoteResource()

加载远程资源（内部使用）：

```typescript
import { loadRemoteResource } from '@antv/infographic';

const url = 'https://example.com/icon.svg';
const resource = await loadRemoteResource(url);
```

## 最佳实践

### 1. 使用有意义的资源标识符

```typescript
// 推荐：清晰的命名
icon: 'icon:user-profile'
icon: 'icon:chart-bar'
illus: 'illus:dashboard-overview'

// 不推荐：难以理解的标识符
icon: 'res001'
icon: 'abc123'
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

## 相关链接

- [资源 API 参考](/api/resources) - 完整的资源加载 API
- [配置选项](/api/options) - 了解如何配置资源
- [高级用法](/guide/advanced) - 更多高级特性
