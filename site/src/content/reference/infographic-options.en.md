---
title: Configuration
---

Instantiating `Infographic` requires passing `InfographicOptions`. For more context check [Infographic Syntax](/learn/infographic-syntax).

The following lists the detailed type definition for `InfographicOptions`.

```typescript
interface InfographicOptions {
  /** Container selector or HTMLElement */
  container?: string | HTMLElement;
  /** Width */
  width?: number | string;
  /** Height */
  height?: number | string;
  /** Container padding */
  padding?: Padding;
  /** Template */
  template?: string;
  /** Design */
  design?: DesignOptions;
  /** Data */
  data: Data;
  /** Theme name */
  theme?: string;
  /** Extra theme overrides */
  themeConfig?: ThemeConfig;
  /** SVG container options */
  svg?: SVGOptions;

  /** Enable editor mode */
  editable?: boolean;
  /** Enable plugins */
  plugins?: IPlugin[];
  /** Enable interactions */
  interactions?: IInteraction[];
  /** Additional graphics drawn on the canvas */
  elements?: ElementProps[];
}
```

Referenced types: [Padding](/reference/infographic-types#padding), [Data](/reference/infographic-types#data), [DesignOptions](/reference/infographic-types#design-options), [ThemeConfig](/reference/infographic-types#theme-config), [SVGOptions](/reference/infographic-types#svg-options), [IPlugin](/reference/infographic-types#plugin), [IInteraction](/reference/infographic-types#interaction), [ElementProps](/reference/infographic-types#element-props).

**Editor-related notes**

- Setting `editable` to `true` initializes the built-in editor. The default plugins and interactions include `EditBar`, `ResizeElement`, `DblClickEditText`, `ClickSelect`, and `SelectHighlight`. You can override or extend them via `plugins` and `interactions`.
- `elements` lets you append custom graphics when the canvas initializes. Each entry follows the `ElementProps` definition used by the editor.
