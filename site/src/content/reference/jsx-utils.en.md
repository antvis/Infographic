---
title: Utility Functions
---

AntV Infographic provides utility functions that help reuse geometry calculations and node operations inside layouts or custom components.

## cloneElement {#clone-element}

Shallowly clone a JSX node and override parts of its props. Useful when adjusting child `x`/`y` or styles inside a layout.

```ts
function cloneElement(
  element: JSXElement,
  props?: Partial<typeof element.props>
): JSXElement;
```

| Parameter  | Type                                                     | Description                                                   |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------- |
| `element`  | [`JSXElement`](/reference/infographic-types#jsx-element) | The node to clone.                                            |
| `props`    | `Record<string, any>`                                    | Props that override or extend the original. A shallow merge is performed. |

**Returns**: A new [`JSXElement`](/reference/infographic-types#jsx-element). The original remains unchanged.

## getElementBounds {#get-element-bounds}

Compute the bounds of a single JSX node. Supports primitives, layout components, function components, and arrays.

```ts
function getElementBounds(node?: JSXNode): Bounds;
```

| Parameter | Type                                                              | Description                         |
| --------- | ----------------------------------------------------------------- | ----------------------------------- |
| `node`    | [`JSXNode`](/reference/infographic-types#jsx-node) \| `undefined` | Any JSX node or array of nodes.     |

**Returns**: [`Bounds`](/reference/infographic-types#bounds`). Returns `width=0`/`height=0` if neither explicit size nor children are available.

**Behavior**

- Layout components (created via `createLayout`) compute their layout before measurements.
- Function components prefer explicit `width`/`height`; if missing, the rendered result is measured recursively.
- Passing an array recursively unfolds the children and merges their bounds.

## getElementsBounds {#get-elements-bounds}

Compute the combined bounds of multiple nodes by calling `getElementBounds` on each and taking the union.

```ts
function getElementsBounds(elements: JSXNode): Bounds;
```

| Parameter  | Type                                               | Description        |
| ---------- | -------------------------------------------------- | ------------------ |
| `elements` | [`JSXNode`](/reference/infographic-types#jsx-node) | One or more nodes (array allowed). |

**Returns**: [`Bounds`](/reference/infographic-types#bounds`). Returns zero when the input is empty or lacks valid nodes.

## getCombinedBounds {#get-combined-bounds}

Pure geometry helper that merges multiple `Bounds` entries; it does not rely on nodes.

```ts
function getCombinedBounds(list?: Bounds[] | null): Bounds;
```

| Parameter | Type                                                                       | Description           |
| --------- | -------------------------------------------------------------------------- | --------------------- |
| `list`    | [`Bounds[]`](/reference/infographic-types#bounds) \| `null` \| `undefined` | Bounds list to merge. |

**Returns**: [`Bounds`](/reference/infographic-types#bounds`). Returns zero when the list is empty.

## renderSVG {#render-svg}

Render JSX nodes into an SVG string for use in the browser or other environments.

```ts
function renderSVG(node: JSXNode, options?: object): string;
```

| Parameter  | Type                                               | Description                      |
| ---------- | -------------------------------------------------- | -------------------------------- |
| `node`     | [`JSXNode`](/reference/infographic-types#jsx-node) | The JSX node or array to render. |
| `options`  | `object \| undefined`                              | SVG container attributes.        |

**Returns**: SVG string.

## Usage Scenarios {#usage}

- Custom layouts: use `getElementBounds` to measure children, then `cloneElement` to update `x`/`y`.
- Auto-sizing components: when width/height are absent, compute them with `getElementsBounds` and feed the results back.
- Combined calculations: merge precomputed `Bounds` lists using `getCombinedBounds` to avoid traversing the tree multiple times.
