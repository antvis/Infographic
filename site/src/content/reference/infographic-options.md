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

  /** 启用编辑 */
  editable?: boolean;
  /** 启用插件 */
  plugins?: IPlugin[];
  /** 启用交互 */
  interactions?: IInteraction[];
  /** 用于向画布添加图形 */
  elements?: ElementProps[];
}
```

引用类型：[Padding](/reference/infographic-types#padding)、[Data](/reference/infographic-types#data)、[DesignOptions](/reference/infographic-types#design-options)、[ThemeConfig](/reference/infographic-types#theme-config)、[SVGOptions](/reference/infographic-types#svg-options)、[IPlugin](/reference/infographic-types#plugin)、[IInteraction](/reference/infographic-types#interaction)、[ElementProps](/reference/infographic-types#element-props)

编辑相关：

- 将 `editable` 设为 `true` 后会创建内置编辑器。默认插件与交互包括 `EditBar`、`ResizeElement`、`DblClickEditText`、`ClickSelect`、`SelectHighlight`，可通过 `plugins` 与 `interactions` 覆盖或扩展。
- `elements` 用于向画布追加初始图形，类型为 `ElementProps`（编辑器图形定义）。
