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
  items
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
  items
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
- Object arrays use `-` on new lines (e.g., `data.items`), while simple arrays stay inline (e.g., `palette`).
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

The `data` block is the core of the information structure. It typically contains titles, descriptions, and item lists, and it supports nested hierarchies.

```plain
data
  title Organizational Structure
  desc Product growth org
  items
    - label Product Growth
      icon company-021_v1_lineal
      children
        - label Growth Strategy
          desc Metrics and experiment design
          icon antenna-bars-5_v1_lineal
        - label User Lifecycle
          desc Lifecycle operations
          icon activities-037_v1_lineal
```

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
  items
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
  '  items\n    - label Lead Acquisition\n      value 18.6\n',
  '      desc Channel investment and content marketing\n      icon company-021_v1_lineal\n',
];

let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  instance.render(buffer);
}
```
