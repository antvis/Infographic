---
title: Getting Started
---

Infographics compress textual information through visual language, allowing readers to grasp key points in the shortest time. This section builds on the quick start guide by providing complete configuration examples and key points.

Below is a complete example including custom design, themes, and resource loading:

<CodeRunner>

```js
import {
  Infographic,
  registerResourceLoader,
  loadSVGResource,
} from '@antv/infographic';

registerResourceLoader(async (config) => {
  const {data} = config;
  const res = await fetch(`https://api.iconify.design/${data}.svg`);
  const text = await res.text();
  return loadSVGResource(text);
});

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  editable: true,
  padding: 30,
});

infographic.render(`
design
  title default
    width 300
  structure list-row
    gap 0
    zigzag true
  item horizontal-icon-arrow
theme dark
  palette
    - #61DDAA
    - #F6BD16
    - #F08BB4
  base
    text
      font-family 851tegakizatsu
  stylize rough
data
  title Project Progress
  items
    - label Step 1
      desc Start
      time Last Day
      icon mdi/rocket-launch
    - label Step 2
      desc In Progress
      time Today
      icon mdi/progress-clock
    - label Step 3
      desc Complete
      time Tomorrow
      icon mdi/trophy
`);
```

</CodeRunner>

Code explanation:

- **Resource Loader**: Use `registerResourceLoader` to fetch SVG from Iconify on demand.
- **Editor**: Set `editable: true` to enable interactive editing.
- **Design**: The `design` field customizes the title, structure, data item types and parameters.
- **Theme**: Switch to dark theme and configure palette, fonts, and stylization with `themeConfig`.
- **Data**: Pass in the title and data items (label, description, time, icon).

Instead of using the `template` field, we directly provide design configuration here. You can think of templates as preset combinations of `design` and themes for quick access.

For more details, continue reading:

- [Infographic Syntax](/learn/infographic-syntax)
- [Core Concepts - Resources](/learn/resources)
- [Core Concepts - Data](/learn/data)
- [Core Concepts - Theme](/learn/theme)
- [Core Concepts - Design](/learn/design)
