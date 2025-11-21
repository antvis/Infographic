---
title: 配置
---

实例化 `Infographic` 类时所需传入的`InfographicOptions`配置项，详见[信息图语法](/learn/infographic-syntax)。

此处提供 `InfographicOptions` 的详细类型定义。

```typescript
interface InfographicOptions {
  /** 容器，可以是选择器或者 HTMLElement */
  container?: string | HTMLElement;
  /** 宽度 */
  width?: number | string;
  /** 高度 */
  height?: number | string;
  /** 容器内边距 */
  padding?: Padding;
  /** 模板 */
  template?: string;
  /** 设计 */
  design?: DesignOptions;
  /** 数据 */
  data: Data;
  /** 主题 */
  theme?: string;
  /** 额外主题配置 */
  themeConfig?: ThemeConfig;
  /** svg 容器上的配置 */
  svg?: SVGOptions;
}
```

引用类型：[Padding](/reference/infographic-types#padding)、[Data](/reference/infographic-types#data)、[DesignOptions](/reference/infographic-types#design-options)、[ThemeConfig](/reference/infographic-types#theme-config)、[SVGOptions](/reference/infographic-types#svg-options)
