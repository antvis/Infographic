---
title: Custom Resource Loader
---

<Note>If you are not familiar with resources, start with the [Resources](/learn/resources) section.</Note>

When the built-in protocols are not enough for your resource sources, register a custom resource loader to extend how icons, illustrations, and other assets are fetched.

Implementation is straightforward:

1. Register a loader via `registerResourceLoader`.
2. Parse the protocol and fetch the resource inside the loader function.
3. Return a standard resource object through helper functions (such as `loadSVGResource`).

`@antv/infographic` also provides helpers like `loadSVGResource` to convert fetched content into the format the framework understands.

## Simple Example {#simple-example}

Below is a simple example that loads icons from [Iconify](https://iconify.design/) and illustrations from the [balazser/undraw-svg-collection](https://github.com/balazser/undraw-svg-collection) GitHub repository:

```js
import {registerResourceLoader, loadSVGResource} from '@antv/infographic';

// Register the resource loader
registerResourceLoader(async (config) => {
  const {scene = 'icon', data} = config; // scene distinguishes icon / illustration

  // Parse the resource ID (feel free to design your own protocol; here we assume data is the ID)
  let url;

  if (scene === 'icon') {
    url = `https://api.iconify.design/${data}.svg`;
  } else {
    url = `https://raw.githubusercontent.com/balazser/undraw-svg-collection/refs/heads/main/svgs/${data}.svg`;
  }

  // Fetch the resource
  const response = await fetch(url);
  const svgString = await response.text();

  // Convert to a framework-friendly resource object
  return loadSVGResource(svgString);
});
```

<Note>Due to CORS restrictions, ensure the target server returns proper cross-origin headers.</Note>

## Full Example {#full-example}

Here is a complete example of a custom loader:

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  Infographic,
} from '@antv/infographic';

// Function that fetches resources from your own server
async function fetchFromYourServer(scene: string, id: string): Promise<string> {
  const response = await fetch(
    `https://your-api.com/assets?type=${scene}&id=${id}`
  );
  return await response.text();
}

// Register the loader
registerResourceLoader(async (config) => {
  const {data, scene = 'icon'} = config;

  // Parse the resource ID (here data is the ID; you can extend the protocol)
  const id = data;

  // Load from your server
  const svgString = await fetchFromYourServer(scene, id);

  // Convert to SVG resource object
  return loadSVGResource(svgString);
});

// Usage
const infographic = new Infographic({
  // other configuration...
});

infographic.render(`
data
  items
    - icon star # Use the custom protocol with scene=icon
      label Feature 1
      desc Using the custom resource loader
      illus chart-growth # Use the custom protocol with scene=illus
`);
```

## Helper Functions {#helper-functions}

The framework exposes helpers that simplify handling different resource formats inside your loader.

### loadSVGResource() - SVG Conversion {#loadsvgresource---svg-conversion}

The most commonly used helper, it converts an SVG string into a usable resource object.

**Basic usage**:

```typescript
import {loadSVGResource} from '@antv/infographic';

registerResourceLoader(async (config) => {
  const svgString = await fetch(`/api/icons/${config.data}`).then((r) =>
    r.text()
  );

  return loadSVGResource(svgString);
});
```

**Handling different SVG formats**:

```typescript
// Supports <svg> tags
const svg1 = '<svg xmlns="http://www.w3.org/2000/svg">...</svg>';
loadSVGResource(svg1); // ✅ auto-converted

// Supports <symbol> tags
const svg2 = '<symbol id="icon-star">...</symbol>';
loadSVGResource(svg2); // ✅ usable as-is

// Handling possible parsing failures
const resource = loadSVGResource(svgString);
if (!resource) {
  console.error('SVG parsing failed');
}
```

> 💡 **Tip**: For full API details, see [Core Concepts - Resources](/learn/resources)

### loadImageBase64Resource() - Image Conversion {#loadimagebase64resource---image-conversion}

Use this helper to load Base64-encoded images (PNG, JPEG, GIF, etc.) and convert them into SVG resources.

**Basic usage**:

```typescript
import {loadImageBase64Resource} from '@antv/infographic';

registerResourceLoader(async (config) => {
  if (config.data.startsWith('img:')) {
    const base64 = await fetchImageAsBase64(config.data);

    return await loadImageBase64Resource(base64);
  }

  // handle other cases...
});
```

**Typical scenario**:

```typescript
registerResourceLoader(async (config) => {
  if (config.type === 'image') {
    return await loadImageBase64Resource(config.data);
  }

  const svgString = await fetchFromServer(config.data);
  return loadSVGResource(svgString);
});
```

> ⚠️ **Note**: This helper returns a promise, so remember to `await`.

### loadRemoteResource() - Remote Loading {#loadremoteresource---remote-loading}

Load SVG resources from a remote URL. It is commonly used internally but is also available for custom workflows.

**Basic usage**:

```typescript
import {loadRemoteResource} from '@antv/infographic';

registerResourceLoader(async (config) => {
  if (typeof config.data === 'string' && (config.data.startsWith('http://') || config.data.startsWith('https://'))) {
    return await loadRemoteResource(config.data);
  }

  // handle other protocols...
});
```

**Combine with caching**:

```typescript
const cache = new Map<string, Resource>();

registerResourceLoader(async (config) => {
  const url = config.data;

  if (cache.has(url)) {
    return cache.get(url)!;
  }

  const resource = await loadRemoteResource(url);

  if (resource) {
    cache.set(url, resource);
  }

  return resource;
});
```

## Advanced Usage {#advanced-usage}

### Cache Optimization {#cache-optimization}

Cache resources to improve performance:

```typescript
const resourceCache = new Map<string, string>();

registerResourceLoader(async (config) => {
  const {data, scene} = config;
  const key = `${scene || 'default'}:${data}`;

  if (resourceCache.has(key)) {
    return loadSVGResource(resourceCache.get(key)!);
  }

  const svgString = await fetchFromYourServer(scene, data);
  resourceCache.set(key, svgString);

  return loadSVGResource(svgString);
});
```

### Error Handling {#error-handling}

Return a fallback resource when loading fails:

```typescript
registerResourceLoader(async (config) => {
  try {
    const svgString = await fetchFromYourServer(config.data);
    return loadSVGResource(svgString);
  } catch (error) {
    console.error('Resource loading failed:', error);

    const fallbackSVG = '<svg>...</svg>';
    return loadSVGResource(fallbackSVG);
  }
});
```

### Supporting Multiple Formats {#multiple-formats}

Branch logic based on the resource format:

```typescript
import {
  registerResourceLoader,
  loadSVGResource,
  loadImageBase64Resource,
} from '@antv/infographic';

registerResourceLoader(async (config) => {
  const {data, scene = 'icon', format} = config;

  if (typeof data === 'string' && data.startsWith('img:')) {
    const resourceId = data.slice(4);
    const imageBase64 = await fetchImageAsBase64(resourceId);
    return loadImageBase64Resource(imageBase64);
  }

  const svg =
    scene === 'illus'
      ? await fetchIllustration(data)
      : await fetchIcon(data, format);
  return loadSVGResource(svg);
});
```

### Preloading Resources {#preload-resources}

Preload every resource before rendering:

```typescript
import {Infographic} from '@antv/infographic';

function extractResourceEntries(data: Data): Array<{scene: 'icon' | 'illus'; id: string}> {
  const entries: Array<{scene: 'icon' | 'illus'; id: string}> = [];

  data.items.forEach((item) => {
    if (item.icon) entries.push({scene: 'icon', id: item.icon as string});
    if (item.illus) entries.push({scene: 'illus', id: item.illus as string});
  });

  return entries;
}

async function preloadResources(data: Data) {
  const entries = extractResourceEntries(data);
  await Promise.all(entries.map(({scene, id}) => fetchFromYourServer(scene, id)));
}

const data = {
  items: [
    {icon: '1', /** ... */},
    {icon: '2', /** ... */},
    {icon: '3', /** ... */},
  ],
};

await preloadResources(data);

const infographic = new Infographic({
  // other configuration...
});

infographic.render(`
infographic list-row-horizontal-icon-arrow
data
  title Preload Example
  items
    - icon 1
      label Data 1
    - icon 2
      label Data 2
    - icon 3
      label Data 3
`);
```

## Best Practices {#best-practices}

### 1. Use Clear Resource Identifiers {#meaningful-resource-identifiers}

```typescript
// Recommended: readable names
icon: 'user-profile';
icon: 'chart-bar';
illus: 'dashboard-overview';

// Not recommended: obscure IDs
icon: 'res001';
icon: 'abc123';
```

### 2. Keep a Unified Protocol {#uniform-resource-protocol}

Use a consistent protocol across your project:

```typescript
icon: 'ref:remote:https://example.com/star.svg';
illus: 'chart-1';

// Or use object payloads
icon: { source: 'remote', format: 'svg', data: 'https://example.com/star.svg' };
illus: { source: 'inline', format: 'svg', data: '<svg>...</svg>' };
```

### 3. Track Loading States {#loading-state}

Provide user feedback while resources are loading:

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
  // Update your UI to reflect the loading status
}
```

### 4. Gracefully Degrade on Failure {#error-degradation}

Fallback to placeholders when loading fails:

```typescript
registerResourceLoader(async (config) => {
  try {
    const svgString = await fetchFromYourServer(config.scene, config.data);
    return loadSVGResource(svgString);
  } catch (error) {
    console.warn(`Resource load failed: ${config.scene}:${config.data}`, error);
    return loadSVGResource(getPlaceholderSVG(config.scene));
  }
});

function getPlaceholderSVG(scene?: string): string {
  if (scene === 'icon') {
    return '<svg><!-- icon placeholder --></svg>';
  }
  if (scene === 'illus') {
    return '<svg><!-- illustration placeholder --></svg>';
  }
  return '<svg><!-- default placeholder --></svg>';
}
```

## Considerations {#considerations}

When using a resource loader, keep the following in mind to avoid common pitfalls.

### 1. Single Loader Instance {#single-loader}

`registerResourceLoader` replaces the previous loader, so handle all resource types within one registration:

```typescript
registerResourceLoader(async (config) => {
  if (config.scene === 'icon') {
    return await loadIcon(config.data);
  }
  if (config.scene === 'illus') {
    return await loadIllus(config.data);
  }
  if (typeof config.data === 'string' && config.data.startsWith('img:')) {
    return await loadImageBase64Resource(await fetchImageAsBase64(config.data.slice(4)));
  }
  return null;
});
```

Avoid registering multiple loaders, which would override the previous ones.

### 2. Asynchronous Loading {#async-loading}

`@antv/infographic` loads resources in parallel, and resource fetching does not block rendering. Slow resources may appear with a delay inside the infographic.

```typescript
const infographic = new Infographic({
  // other configuration...
});

infographic.render(`
data
  items
    - icon 1
      label Data 1
    - icon 2
      label Data 2
    - icon 3
      label Data 3
`);
```
