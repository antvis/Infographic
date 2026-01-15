---
title: Infographic Syntax
---

Infographic syntax is a Mermaid-like grammar for describing templates, designs, data, and themes. It works well with AI streaming output and manual editing alike, and you can render it directly via `Infographic.render(syntax)`.

<InfographicStreamRunner>

```plain
infographic list-row-horizontal-icon-arrow
data
  title Customer Growth Engine
  desc Multi-channel reach and repeat purchases
  lists
    - label Lead Acquisition
      value 18.6
      desc Channel investment and content marketing
      icon mdi/rocket-launch
    - label Conversion Optimization
      value 12.4
      desc Lead scoring and automated follow-ups
      icon mdi/progress-check
    - label Loyalty Boost
      value 9.8
      desc Membership programs and benefits
      icon mdi/account-sync
    - label Brand Advocacy
      value 6.2
      desc Community rewards and referral loops
      icon mdi/account-group
    - label Customer Success
      value 7.1
      desc Training support and activation
      icon mdi/book-open-page-variant
    - label Product Growth
      value 10.2
      desc Trial conversion and feature nudges
      icon mdi/chart-line
    - label Data Insight
      value 8.5
      desc Key metrics and attribution analysis
      icon mdi/chart-areaspline
    - label Ecosystem
      value 5.4
      desc Co-marketing and resource swaps
      icon mdi/handshake
```

</InfographicStreamRunner>

Infographic syntax is inspired by AntV G2 and G6 graphical grammars, and it blends in insights from [Infographic Theory](/learn/infographic-theory) and [Design Principles](/learn/infographic-design). Its goal is to keep your focus on storytelling and visuals instead of low-level plumbing.

We express an infographic as: <Math>Infographic = Information Structure + Graphic Semantics</Math>

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*Ir9aTL5mKQYAAAAARVAAAAgAemJ7AQ/original"
  width="50%"
/>

Information structure captures the data abstraction that determines content and hierarchy, while graphic semantics captures the design abstraction that defines the visual appearance and style.

## Syntax Structure {#syntax-structure}

The entry point starts with `infographic [template-name]`, followed by blocks that describe the template, design, data, and theme.

```plain
infographic list-row-horizontal-icon-arrow
data
  title Customer Growth Engine
  desc Multi-channel reach and repeat purchases
  lists
    - label Lead Acquisition
      value 18.6
      desc Channel investment and content marketing
      icon company-021_v1_lineal
    - label Conversion Optimization
      value 12.4
      desc Lead scoring and automated follow-ups
      icon antenna-bars-5_v1_lineal
```

## Syntax Rules {#syntax-rules}

- The entry starts with `infographic [template-name]`.
- Key-value pairs use spaces for separation, and indentation is done with two spaces.
- blocks like `structure [name]`, `item [name]`, or `title [name]` omit the `type`.
- Object arrays use `-` on new lines (e.g., `data.lists`), while simple arrays stay inline (e.g., `palette`).
- Container-specific configurations belong in `new Infographic({ ... })` (such as `width`, `height`, `padding`, `editable`); inside the syntax you only define `template`, `design`, or `theme`.

### template {#template}

The template is declared directly in the entry point.

```plain
infographic <template-name>
```

### design {#design}

The `design` block selects structures, cards, titles, and other modules.

```plain
design
  structure <structure-name>
    gap 12
  item <item-name>
    showIcon true
  title default
    align center
```

### data {#data}

The `data` block is the core of the information structure. It usually includes a `title`, `desc`, and data items. Each data item can include:

- label: display text
- desc: description text
- value: numeric value
- icon: keyword (auto-mapped to an icon)

Data items live under fields such as `lists`, `sequences`, `values`, and `nodes`.

> Data items refer to objects under `lists`, `sequences`, `values`, `nodes`, and similar fields.

In general, the selected template expects a certain data item field. For example, `list-row-horizontal-icon-arrow` fits `lists`, while `relation-dagre-flow-tb-simple-circle-node` fits `nodes` plus `relations`.

> If you are unsure, you can use the generic `items` field and the template will adapt.

#### List data {#list-data}

List data represents a group of peer items without ordering, common for checklists or feature lists. Use `lists`.

```plain
infographic list-grid-compact-card
data
  title Fruit Shopping List
  lists
    - label Watermelon
      icon watermelon
    - label Apple
      icon apple
    - label Banana
      icon banana
```

#### Sequence data {#sequence-data}

Sequence data is similar to lists but ordered, often used for timelines or steps. Use `sequences`.

```plain
infographic sequence-steps-simple
data
  sequences
    - label Step 1
    - label Step 2
    - label Step 3
```

Use the `order` field to specify sorting (`asc` or `desc`). In the example below, `order desc` means items are arranged in descending order.

```plain
infographic sequence-stairs-front-pill-badge
data
  title Job Level Sequence
  sequences
    - label P7
    - label P6
    - label P5
  order desc
```

#### Hierarchy data {#hierarchy-data}

Hierarchy data describes a tree structure, common for org charts or taxonomies. Use `root` for the root node and `children` recursively for descendants.

```plain
infographic hierarchy-structure
data
  root
    label Company
    children
      - label Department A
      - label Department B
```

#### Compare data {#compare-data}

Compare data is for side-by-side or grouped comparisons (e.g. SWOT or quadrant charts). Use `compares`.

```plain
infographic quadrant-quarter-simple-card
data
  compares
    - label High Value, High Growth
      icon star
    - label High Value, Low Growth
      icon diamond
    - label Low Value, High Growth
      icon rocket
    - label Low Value, Low Growth
      icon down
```

Compare items can also include `children` to create comparison hierarchies, where each root item is a comparison target and children are its metrics:

```plain
infographic compare-swot
data
  compares
    - label Plan A
      value 68
      children
        - label Higher conversion
        - label Higher AOV
    - label Plan B
      value 82
      children
        - label Lower conversion
        - label Average AOV
```

#### Statistical data {#statistical-data}

Statistical data showcases metrics, using `values`.

```plain
infographic chart-column-simple
data
  values
    - label Visits
      value 1280
    - label Conversion Rate
      value 12.4
    - label Average Order Value
      value 256
```

For grouped data, use `category` (with a compatible template), for example:

```plain
infographic chart-column-grouped-simple
data
  title Rainfall Data
  values
    - label January
      value 18.9
      category Chongqing
    - label January
      value 12.4
      category Beijing
    - label February
      value 15.6
      category Chongqing
    - label February
      value 10.2
      category Beijing
```

#### Relation data {#relation-data}

Relation data describes node-to-node connections, such as flowcharts and networks. Use `nodes` for nodes and `relations` for edges.

- Nodes include:
  - id: unique node id (defaults to `label` if omitted; last definition wins on duplicates)
  - label: display text (defaults to `id` if omitted)
  - group: group label for coloring
- Relations include:
  - from: source node id
  - to: target node id
  - label: edge label text
  - direction: `forward` (default), `both`, or `none`
  - showArrow: whether to show arrowheads
  - arrowType: `arrow`, `triangle`, or `diamond`

**YAML-style:**

```plain
infographic relation-dagre-flow-tb-simple-circle-node
data
  title Relation Graph
  nodes
    - id A
      label Node A
    - id B
      label Node B
  relations
    - from A
      to B
```

**Mermaid-style (flowchart-like):**

```plain
infographic relation-dagre-flow-tb-simple-circle-node
data
  nodes
    - id A
      label Node A
    - id B
      label Node B
    - id C
      label Node C
  relations
    A -> B
    A <- C
    A -> B -> C -> A
```

For simple relation graphs, you can omit `nodes` and define nodes directly in `relations`:

```plain
infographic relation-dagre-flow-tb-simple-circle-node
data
  relations
    A - The Edge Between A and B -> B
    B -> C[Label of C]
    C -->|The Edge Between C and D| D
```

Below is the full relation edge syntax:

| Syntax Example              | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `A -> B`                    | from A to B                                     |
| `A <- B`                    | from B to A                                     |
| `A -- B`                    | undirected edge (`direction none`)              |
| `A<->B`                     | bidirectional edge (`direction both`)           |
| `A -relation label-> B`     | relation label (`label`), no special characters |
| `A -->\|relation label\| B` | same, but allows special characters             |
| `A --> B[label]`            | node label (`label`)                            |

Notes:

- Extra dashes (e.g. `A ----> B`), `-.-`, `==>`, `--x`, `--o` are normalized to `--` or `->`.
- `id1(label)` / `id1([label])` are equivalent to `id1[label]`.
- Attributes like `id@{...}` are ignored.

### theme {#theme}

The `theme` block switches themes and tweaks palettes, fonts, and stylization.

Use a preset theme:

```plain
theme <theme-name>
```

Use a custom theme:

```plain
theme
  colorBg #0b1220
  colorPrimary #ff5a5f
  palette #ff5a5f #1fb6ff #13ce66
  stylize rough
    roughness 0.3
```

## Usage Cases {#usage-cases}

### Regular Rendering {#regular-rendering}

Render the entire syntax in one go.

```ts
import {Infographic} from '@antv/infographic';

const instance = new Infographic({
  container: '#container',
  width: 900,
  height: 540,
  padding: 24,
});

const syntaxText = `
infographic list-row-horizontal-icon-arrow
data
  title Customer Growth Engine
  desc Multi-channel reach and repeat purchases
  lists
    - label Lead Acquisition
      value 18.6
      desc Channel investment and content marketing
      icon company-021_v1_lineal
    - label Conversion Optimization
      value 12.4
      desc Lead scoring and automated follow-ups
      icon antenna-bars-5_v1_lineal
`;

instance.render(syntaxText);
```

### Streaming Rendering {#streaming-rendering}

Call `render` repeatedly as the model outputs fragments (pseudo code). Append every new syntax chunk to a buffer and re-render so the canvas stays in sync.

```ts
import {Infographic} from '@antv/infographic';

const instance = new Infographic({
  container: '#container',
  width: 900,
  height: 540,
  padding: 24,
});

const chunks = [
  'infographic list-row-horizontal-icon-arrow\n',
  'data\n  title Customer Growth Engine\n  desc Multi-channel reach and repeat purchases\n',
  '  lists\n    - label Lead Acquisition\n      value 18.6\n',
  '      desc Channel investment and content marketing\n      icon company-021_v1_lineal\n',
];

let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  instance.render(buffer);
}
```
