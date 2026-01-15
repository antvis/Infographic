---
title: Type Definitions
---

The root configuration for infographic syntax is [`InfographicOptions`](/reference/infographic-options). This page expands on the compound types referenced within, so you can quickly locate field structures while browsing the syntax reference.

## Bounds {#bounds}

Describes an element’s bounding box, commonly used in layout calculations and helper utilities.

```ts
type Bounds = {x: number; y: number; width: number; height: number};
```

## JSXElement {#jsx-element}

Definition of the low-level JSX node used during rendering.

```ts
interface JSXElement {
  type: string | symbol | ((props?: any) => JSXNode);
  props: Record<string, any>;
  key?: string | null;
}
```

## JSXNode {#jsx-node}

General-purpose JSX node type.

```ts
type JSXNode =
  | JSXElement
  | string
  | number
  | boolean
  | null
  | undefined
  | JSXNode[];
```

> `JSXNode` represents any node in the render tree, while `JSXElement` refers to the nodes that carry `type`/`props`.

## ComponentType {#component-type}

Utility type for component signatures. Components accept `children` and return `JSXNode`.

```ts
type ComponentType<P = {}> = (props: P & {children?: JSXNode}) => JSXNode;
```

## Padding {#padding}

Padding can be a single number (uniform padding) or an array representing `[top, right, bottom, left]`.

```ts
type Padding = number | number[];
```

## SVGOptions {#svg-options}

Extra configuration for the SVG container that allows setting styles, attributes, and identifiers.

| Property   | Type                                          | Required | Description   |
| ---------- | --------------------------------------------- | -------- | ------------- |
| style      | `Record<string, string \| number>`            | No       | Inline styles |
| attributes | `Record<string, string \| number \| boolean>` | No       | Extra attrs   |
| id         | `string`                                      | No       | Element id    |
| className  | `string`                                      | No       | Element class |

## ExportOptions {#export-options}

Parameters for exporting as SVG or PNG.

```ts
type ExportOptions = SVGExportOptions | PNGExportOptions;
```

### SVGExportOptions {#svg-export-options}

| Property       | Type      | Required | Description                              |
| -------------- | --------- | -------- | ---------------------------------------- |
| type           | `'svg'`   | **Yes**  | Export format                            |
| embedResources | `boolean` | No       | Inline remote resources (default `true`) |
| removeIds      | `boolean` | No       | Remove id dependencies (default `false`) |

### PNGExportOptions {#png-export-options}

| Property | Type     | Required | Description                                                |
| -------- | -------- | -------- | ---------------------------------------------------------- |
| type     | `'png'`  | **Yes**  | Export format                                              |
| dpr      | `number` | No       | Device pixel ratio (defaults to `window.devicePixelRatio`) |

## DesignOptions {#design-options}

Design configuration options.

| Property  | Type                                                                         | Required | Description              |
| --------- | ---------------------------------------------------------------------------- | -------- | ------------------------ |
| structure | `string` \| [WithType](#with-type)\<[StructureOptions](#structure-options)\> | No       | Structure                |
| title     | `string` \| [WithType](#with-type)\<[TitleOptions](#title-options)\>         | No       | Title                    |
| item      | `string` \| [WithType](#with-type)\<[ItemOptions](#item-options)\>           | No       | Item                     |
| items     | `string` \| [WithType](#with-type)\<[ItemOptions](#item-options)\>[]         | No       | Per-level item overrides |

## BaseItemProps {#base-item-props}

Base props that item components receive during rendering.

| Property        | Type                         | Required | Description                         |
| --------------- | ---------------------------- | -------- | ----------------------------------- | --------------- | -------------------- |
| x               | `number`                     | No       | X coordinate of the top-left corner |
| y               | `number`                     | No       | Y coordinate of the top-left corner |
| id              | `string`                     | No       | Custom identifier                   |
| indexes         | `number[]`                   | **Yes**  | Index path within the hierarchy     |
| data            | [Data](#data)                | **Yes**  | Entire data payload                 |
| datum           | [ItemDatum](#item-datum)     | **Yes**  | Current item data                   |
| themeColors     | [ThemeColors](#theme-colors) | **Yes**  | Theme color set                     |
| positionH       | `'normal'                    | 'center' | 'flipped'`                          | No              | Horizontal direction |
| positionV       | `'normal'                    | 'middle' | 'flipped'`                          | No              | Vertical direction   |
| valueFormatter  | `(value: number) => string   | number`  | No                                  | Value formatter |
| `[key: string]` | `any`                        | No       | Additional props passed through     |

## ItemOptions {#item-options}

Optional configuration for items, equivalent to `Partial<BaseItemProps>`.

```ts
type ItemOptions = Partial<BaseItemProps>;
```

## Item {#item}

Defines a data item component and its combinability.

```ts
interface Item<T extends BaseItemProps = BaseItemProps> {
  component: ComponentType<T>;
  composites: string[];
  options?: ItemOptions;
}
```

## BaseStructureProps {#base-structure-props}

Render props passed to structure components.

```ts
interface BaseStructureProps {
  Title?: ComponentType<Pick<TitleProps, 'title' | 'desc'>>;
  Item: ComponentType<
    Omit<BaseItemProps, 'themeColors'> &
      Partial<Pick<BaseItemProps, 'themeColors'>>
  >;
  Items: ComponentType<Omit<BaseItemProps, 'themeColors'>>[];
  data: Data;
  options: ParsedInfographicOptions;
}
```

## Structure {#structure}

Defines a structure component and how it can be composed.

```ts
interface Structure {
  component: ComponentType<BaseStructureProps>;
  composites: string[];
}
```

## StructureOptions {#structure-options}

Additional dictionary of options for structures.

```ts
type StructureOptions = Record<string, any>;
```

## BaseData {#base-data}

Base shape shared by all infographic data types.

| Property        | Type                                                           | Required | Description      |
| --------------- | -------------------------------------------------------------- | -------- | ---------------- |
| title           | `string`                                                       | No       | Title            |
| desc            | `string`                                                       | No       | Description      |
| items           | [ItemDatum](#item-datum)[]                                     | No       | Item list        |
| illus           | `Record<string, string \| [ResourceConfig](#resource-config)>` | No       | Illustration map |
| attributes      | `Record<string, object>`                                       | No       | Extra attributes |
| `[key: string]` | `any`                                                          | No       | Custom fields    |

## Data {#data}

Union of `ListData`, `SequenceData`, `HierarchyData`, `CompareData`, `RelationData`, `StatisticsData`.

### BaseDatum {#base-datum}

| Property        | Type                                           | Required | Description      |
| --------------- | ---------------------------------------------- | -------- | ---------------- |
| icon            | `string` \| [ResourceConfig](#resource-config) | No       | Icon resource    |
| label           | `string`                                       | No       | Label text       |
| desc            | `string`                                       | No       | Description      |
| value           | `number`                                       | No       | Numeric value    |
| illus           | `string` \| [ResourceConfig](#resource-config) | No       | Illustration     |
| attributes      | `Record<string, object>`                       | No       | Extra attributes |
| `[key: string]` | `any`                                          | No       | Custom fields    |

### ItemDatum {#item-datum}

Union of `ListDatum`, `SequenceDatum`, `HierarchyDatum`, `CompareDatum`, `RelationNodeDatum`, `StatisticsDatum`.

### ListDatum {#list-datum}

Extends [BaseDatum](#base-datum).

### SequenceDatum {#sequence-datum}

Extends [BaseDatum](#base-datum).

### HierarchyDatum {#hierarchy-datum}

Extends [BaseDatum](#base-datum).

| Property | Type                                 | Required | Description |
| -------- | ------------------------------------ | -------- | ----------- |
| children | [HierarchyDatum](#hierarchy-datum)[] | No       | Children    |

### CompareDatum {#compare-datum}

Extends [HierarchyDatum](#hierarchy-datum).

### RelationNodeDatum {#relation-node-datum}

Extends [BaseDatum](#base-datum).

| Property | Type     | Required | Description |
| -------- | -------- | -------- | ----------- |
| id       | `string` | No       | Custom id   |
| group    | `string` | No       | Group key   |

### RelationEdgeDatum {#relation-edge-datum}

Extends [BaseDatum](#base-datum).

| Property        | Type                                 | Required | Description   |
| --------------- | ------------------------------------ | -------- | ------------- |
| id              | `string`                             | No       | Custom id     |
| from            | `string`                             | **Yes**  | Source id     |
| to              | `string`                             | **Yes**  | Target id     |
| direction       | `'forward' \| 'both' \| 'none'`      | No       | Direction     |
| showArrow       | `boolean`                            | No       | Show arrow    |
| arrowType       | `'arrow' \| 'triangle' \| 'diamond'` | No       | Arrow style   |
| `[key: string]` | `any`                                | No       | Custom fields |

### StatisticsDatum {#statistics-datum}

Extends [BaseDatum](#base-datum).

| Property | Type     | Required | Description |
| -------- | -------- | -------- | ----------- |
| value    | `number` | **Yes**  | Value       |
| category | `string` | No       | Category    |

### ListData {#list-data}

Extends [BaseData](#base-data).

| Property | Type                       | Required | Description |
| -------- | -------------------------- | -------- | ----------- |
| items    | [ListDatum](#list-datum)[] | No       | Item list   |
| lists    | [ListDatum](#list-datum)[] | No       | List items  |

### SequenceData {#sequence-data}

Extends [BaseData](#base-data).

| Property  | Type                               | Required | Description    |
| --------- | ---------------------------------- | -------- | -------------- |
| items     | [SequenceDatum](#sequence-datum)[] | No       | Item list      |
| sequences | [SequenceDatum](#sequence-datum)[] | No       | Sequence items |
| order     | `'asc' \| 'desc'`                  | No       | Sort order     |

### HierarchyData {#hierarchy-data}

Extends [BaseData](#base-data).

| Property | Type                               | Required | Description |
| -------- | ---------------------------------- | -------- | ----------- |
| items    | `[HierarchyDatum]`                 | No       | Item list   |
| root     | [HierarchyDatum](#hierarchy-datum) | No       | Root node   |

### CompareData {#compare-data}

Extends [BaseData](#base-data).

| Property | Type                             | Required | Description   |
| -------- | -------------------------------- | -------- | ------------- |
| items    | [CompareDatum](#compare-datum)[] | No       | Item list     |
| compares | [CompareDatum](#compare-datum)[] | No       | Compare items |

### RelationData {#relation-data}

Extends [BaseData](#base-data).

| Property  | Type                                        | Required | Description |
| --------- | ------------------------------------------- | -------- | ----------- |
| items     | [RelationNodeDatum](#relation-node-datum)[] | No       | Node list   |
| nodes     | [RelationNodeDatum](#relation-node-datum)[] | No       | Node list   |
| relations | [RelationEdgeDatum](#relation-edge-datum)[] | No       | Edge list   |

### StatisticsData {#statistics-data}

Extends [BaseData](#base-data).

| Property | Type                                   | Required | Description |
| -------- | -------------------------------------- | -------- | ----------- |
| items    | [StatisticsDatum](#statistics-datum)[] | No       | Item list   |
| values   | [StatisticsDatum](#statistics-datum)[] | No       | Value list  |

## ThemeConfig {#theme-config}

Theme configuration options.

| Property      | Type                                                                                                                                                                                    | Required | Description          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------- |
| colorBg       | `string`                                                                                                                                                                                | No       | Background color     |
| colorPrimary  | `string`                                                                                                                                                                                | No       | Primary color        |
| base          | `{ global?: [DynamicAttributes](#dynamic-attributes)\<[BaseAttributes](#base-attributes)\>; shape?: [ShapeAttributes](#shape-attributes); text?: [TextAttributes](#text-attributes); }` | No       | Base styles          |
| base.`global` | [DynamicAttributes](#dynamic-attributes)\<[BaseAttributes](#base-attributes)\>                                                                                                          | No       | Global defaults      |
| base.`shape`  | [ShapeAttributes](#shape-attributes)                                                                                                                                                    | No       | Global shape styles  |
| base.`text`   | [TextAttributes](#text-attributes)                                                                                                                                                      | No       | Global text styles   |
| palette       | [Palette](#palette)                                                                                                                                                                     | No       | Palette              |
| title         | [TextAttributes](#text-attributes)                                                                                                                                                      | No       | Title styling        |
| desc          | [TextAttributes](#text-attributes)                                                                                                                                                      | No       | Description styling  |
| item          | `object`                                                                                                                                                                                | No       | Item-specific config |
| item.`icon`   | [DynamicAttributes](#dynamic-attributes)\<[IconAttributes](#icon-attributes)\>                                                                                                          | No       | Icon styling         |
| item.`label`  | [DynamicAttributes](#dynamic-attributes)\<[TextAttributes](#text-attributes)\>                                                                                                          | No       | Label styling        |
| item.`desc`   | [DynamicAttributes](#dynamic-attributes)\<[TextAttributes](#text-attributes)\>                                                                                                          | No       | Description styling  |
| item.`value`  | [DynamicAttributes](#dynamic-attributes)\<[TextAttributes](#text-attributes)\>                                                                                                          | No       | Value styling        |
| stylize       | [StylizeConfig](#stylize-config) \| `null`                                                                                                                                              | No       | Stylization feature  |

## BaseAttributes {#base-attributes}

Common attributes for defining fill and opacity.

| Property       | Type               | Required | Description    |
| -------------- | ------------------ | -------- | -------------- |
| opacity        | `number \| string` | No       | Transparency   |
| fill           | `string`           | No       | Fill color     |
| fill-opacity   | `number \| string` | No       | Fill opacity   |
| stroke         | `string`           | No       | Stroke color   |
| stroke-opacity | `number \| string` | No       | Stroke opacity |

## ThemeSeed {#theme-seed}

Seed input used to generate theme colors.

| Property     | Type      | Required | Description               |
| ------------ | --------- | -------- | ------------------------- |
| colorPrimary | `string`  | **Yes**  | Original primary color    |
| colorBg      | `string`  | No       | Background color          |
| isDarkMode   | `boolean` | No       | Whether dark mode is used |

## ThemeColors {#theme-colors}

Computed theme colors derived from `ThemeSeed`.

| Property           | Type      | Required | Description                  |
| ------------------ | --------- | -------- | ---------------------------- |
| colorPrimary       | `string`  | **Yes**  | Primary color                |
| colorPrimaryBg     | `string`  | **Yes**  | Light background for primary |
| colorPrimaryText   | `string`  | **Yes**  | Text color on primary bg     |
| colorText          | `string`  | **Yes**  | Strongest text color         |
| colorTextSecondary | `string`  | **Yes**  | Secondary text color         |
| colorWhite         | `string`  | **Yes**  | Pure white                   |
| colorBg            | `string`  | **Yes**  | Canvas background            |
| colorBgElevated    | `string`  | **Yes**  | Card background              |
| isDarkMode         | `boolean` | **Yes**  | Dark-mode indicator          |

## Font {#font}

Font resource configuration.

```ts
type FontWeightName =
  | 'thin'
  | 'extralight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold'
  | 'black'
  | 'extrablack';

interface Font {
  fontFamily: string;
  name: string;
  baseUrl: string;
  fontWeight: {[keys in FontWeightName]?: string};
}
```

## IconAttributes {#icon-attributes}

Attributes available for icons (`<use>` or `<image>`).

| Property     | Type               | Required | Description  |
| ------------ | ------------------ | -------- | ------------ |
| id           | `number \| string` | No       | Element id   |
| class        | `number \| string` | No       | CSS class    |
| x            | `number \| string` | No       | X coordinate |
| y            | `number \| string` | No       | Y coordinate |
| width        | `number \| string` | No       | Width        |
| height       | `number \| string` | No       | Height       |
| href         | `number \| string` | No       | Resource URL |
| fill         | `number \| string` | No       | Fill color   |
| fill-opacity | `number \| string` | No       | Fill opacity |
| opacity      | `number \| string` | No       | Opacity      |

## ShapeAttributes {#shape-attributes}

| Property          | Type                                  | Required | Description      |
| ----------------- | ------------------------------------- | -------- | ---------------- |
| opacity           | `number \| string`                    | No       | Opacity          |
| fill              | `string`                              | No       | Fill color       |
| fill-opacity      | `number \| string`                    | No       | Fill opacity     |
| fill-rule         | `'nonzero' \| 'evenodd' \| 'inherit'` | No       | Fill rule        |
| stroke            | `string`                              | No       | Stroke color     |
| stroke-width      | `number \| string`                    | No       | Stroke width     |
| stroke-linecap    | `number \| string`                    | No       | Stroke line cap  |
| stroke-linejoin   | `number \| string`                    | No       | Stroke line join |
| stroke-dasharray  | `number \| string`                    | No       | Dash array       |
| stroke-dashoffset | `number \| string`                    | No       | Dash offset      |
| stroke-opacity    | `number \| string`                    | No       | Stroke opacity   |

## TextAttributes {#text-attributes}

| Property          | Type               | Required | Description        |
| ----------------- | ------------------ | -------- | ------------------ |
| x                 | `number \| string` | No       | X coordinate       |
| y                 | `number \| string` | No       | Y coordinate       |
| width             | `number \| string` | No       | Width              |
| height            | `number \| string` | No       | Height             |
| text-alignment    | `string`           | No       | Text alignment     |
| font-family       | `string`           | No       | Font family        |
| font-size         | `number \| string` | No       | Font size          |
| font-weight       | `number \| string` | No       | Font weight        |
| font-style        | `number \| string` | No       | Font style         |
| font-variant      | `number \| string` | No       | Font variant       |
| letter-spacing    | `number \| string` | No       | Letter spacing     |
| line-height       | `number \| string` | No       | Line height        |
| fill              | `number \| string` | No       | Fill color         |
| stroke            | `number \| string` | No       | Stroke color       |
| stroke-width      | `number \| string` | No       | Stroke width       |
| text-anchor       | `number \| string` | No       | Text anchor        |
| dominant-baseline | `number \| string` | No       | Baseline alignment |

## ElementProps {#element-props}

Definitions for additional graphics you can add in editor mode.

```ts
type ElementProps = GeometryProps | TextProps;

interface GeometryProps {
  type:
    | 'rectangle'
    | 'circle'
    | 'ellipse'
    | 'line'
    | 'polyline'
    | 'polygon'
    | 'path'
    | 'image';
  attributes: Record<string, any>;
}

interface TextProps {
  type: 'text';
  textContent: string;
  attributes: TextAttributes;
}
```

## IPlugin {#plugin}

Editor plugin interface to extend editing capabilities.

```ts
interface IPlugin {
  name: string;
  init(options: {
    emitter: any;
    editor: any;
    commander: any;
    plugin: any;
    state: any;
  }): void;
  destroy(): void;
}
```

`init` receives the editor context (events, commands, state, etc.). Clean up bindings and side effects in `destroy`.

## IInteraction {#interaction}

Interface for interaction handlers (selection, dragging, etc.).

```ts
interface IInteraction {
  name: string;
  init(options: {emitter: any; editor: any; commander: any; interaction: any}): void;
  destroy(): void;
}
```

## ResourceConfig {#resource-config}

Describes an icon, image, or remote [resource](/learn/resources).

| Property        | Type                                       | Required | Description           |
| --------------- | ------------------------------------------ | -------- | --------------------- |
| type            | `'image' \| 'svg' \| 'remote' \| 'custom'` | **Yes**  | Resource type         |
| data            | `string`                                   | **Yes**  | Identifier or payload |
| `[key: string]` | `any`                                      | No       | Resource extras       |

## ResourceLoader {#resource-loader}

Signature for custom resource loaders.

```ts
type ResourceLoader = (
  config: ResourceConfig
) => Promise<SVGSymbolElement | null>;
```

## DynamicAttributes {#dynamic-attributes}

Utility type that allows static values or functions that derive the value from runtime context.

```ts
type DynamicAttributes<T extends object> = {
  [key in keyof T]?:
    | T[key]
    | ((value: T[key], node: SVGElement) => T[key] | undefined);
};
```

- `T` represents the target attribute map, such as `TextAttributes`.
- `node` is the SVG element currently being styled, allowing differentiated styles per node.

## Palette {#palette}

Palette type alias that supports multiple definitions.

```ts
type Palette =
  | string
  | string[]
  | ((ratio: number, index: number, count: number) => string);
```

- `string`: reference a [registered palette](/reference/built-in-palettes).
- `string[]`: discrete colors that are applied cyclically.
- Function: compute a color based on the ratio, index, and total count.

> For registering palettes, see [Custom Palettes](/learn/custom-palette).

## StylizeConfig {#stylize-config}

Union type for stylization options: rough sketch, pattern, or gradient.

```ts
type StylizeConfig = RoughConfig | PatternConfig | GradientConfig;
```

### RoughConfig {#rough-config}

| Property   | Type      | Required | Description        |
| ---------- | --------- | -------- | ------------------ |
| type       | `'rough'` | **Yes**  | Enable rough style |
| roughness  | `number`  | No       | Roughness amount   |
| bowing     | `number`  | No       | Curve intensity    |
| fillWeight | `number`  | No       | Line weight        |
| hachureGap | `number`  | No       | Gap between lines  |

### PatternConfig {#pattern-config}

| Property        | Type             | Required | Description                                                          |
| --------------- | ---------------- | -------- | -------------------------------------------------------------------- |
| type            | `'pattern'`      | **Yes**  | Enable pattern fill                                                  |
| pattern         | `string`         | **Yes**  | Pattern name (see [built-in patterns](/reference/built-in-patterns)) |
| backgroundColor | `string \| null` | No       | Background color                                                     |
| foregroundColor | `string \| null` | No       | Foreground color                                                     |
| scale           | `number \| null` | No       | Scale factor                                                         |

### PatternStyle {#pattern-style}

Reusable fields for `PatternConfig` (`backgroundColor`, `foregroundColor`, `scale`).

### GradientConfig {#gradient-config}

Union of linear or radial gradients.

```ts
type GradientConfig = LinearGradient | RadialGradient;
```

#### LinearGradient {#linear-gradient}

| Property | Type                                              | Required | Description     |
| -------- | ------------------------------------------------- | -------- | --------------- |
| type     | `'linear-gradient'`                               | **Yes**  | Linear gradient |
| colors   | `string[] \| { color: string; offset: string }[]` | No       | Gradient stops  |
| angle    | `number`                                          | No       | Gradient angle  |

#### RadialGradient {#radial-gradient}

| Property | Type                                              | Required | Description     |
| -------- | ------------------------------------------------- | -------- | --------------- |
| type     | `'radial-gradient'`                               | **Yes**  | Radial gradient |
| colors   | `string[] \| { color: string; offset: string }[]` | No       | Gradient stops  |

## TemplateOptions {#template-options}

Like [InfographicOptions](/learn/infographic-syntax#infographic-options) but without `container`, `template`, or `data`.

```ts
type TemplateOptions = Omit<
  InfographicOptions,
  'container' | 'template' | 'data'
>;
```

## Other Types {#other-types}

### WithType {#with-type}

Adds a required `type` field to any object, useful for explicitly declaring component types.

```ts
type WithType<T> = T & {type: string};
```

### WithProps {#with-props}

Adds an optional `props` field for carrying extra parameters needed during rendering.

```ts
type WithProps<T, P = any> = T & {props?: P};
```
