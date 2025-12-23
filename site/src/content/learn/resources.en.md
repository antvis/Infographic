---
title: Resources
---

AntV Infographic provides an [icon service](/icon). For templates that use illustrations, you need to handle the loading logic yourself. Optional approaches:

1. **Built-in Protocol**: Use Data URI to embed resources directly (no loader registration required)
2. **Custom Loader**: Register a loader to fetch on-demand from your service

## Resource Configuration Methods {#resource-configuration}

In data, the `icon` and `illus` properties can configure resources:

```syntax
data
  items
    - icon <ResourceConfig or string>
      illus <ResourceConfig or string>
```

For more loading strategies (icon protocols, failure fallbacks, etc.), see [Custom Resource Loader](/learn/custom-resource-loader).

### String Format {#string-format}

Strings are automatically parsed into [ResourceConfig](/reference/infographic-types#resource-config) objects:

```typescript
// Inline SVG (not base64)
icon: 'data:image/svg+xml,<svg>...</svg>';
// Standard base64 image (png/jpg/webp/...)
icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...';
// Remote resource (optional format hint)
icon: 'ref:remote:svg:https://example.com/icon.svg';
illus: 'ref:remote:https://example.com/banner.png'; // When fmt is not provided, inferred from URL / Content-Type
// Search icon (provided by AntV icon search service)
icon: 'ref:search:svg:computer network';
```

### Object Format {#object-format}

You can directly provide a [ResourceConfig](/reference/infographic-types#resource-config) object:

```typescript
interface ResourceConfig {
  source: 'inline' | 'remote' | 'search' | 'custom';
  format?: 'svg' | 'image' | string;     // Fallback format hint, prioritize actual Content-Type/content determination
  encoding?: 'raw' | 'data-uri' | 'base64';
  data: string;                          // inline content / URL / search term / custom payload
  scene?: 'icon' | 'illus';              // Optional, framework will automatically fill in the current field's scene
  [key: string]: any;                    // Custom extension
}
```

## Built-in Resource Protocols {#built-in-protocols}

The framework has several built-in resource protocols that can be used without registering a loader:

### 1. SVG Resources {#svg-resource}

Use Data URI format SVG, starting with `data:image/svg+xml,`, followed by SVG string:

```syntax
data
  items
    - icon data:image/svg+xml,<svg>...</svg>
```

### 2. Remote URL {#remote-url}

Directly specify URL through custom protocol `ref:remote[:fmt]:<url>` (`fmt` can be omitted, inferred from URL or response headers when missing):

```syntax
data
  items
    - icon ref:remote:svg:https://example.com/icon.svg
```

<Warning>
  Remote resource loading may be subject to CORS restrictions. Please ensure that the resource server is configured with proper cross-origin response headers.
</Warning>
