---
title: Custom Themes
---

Themes are used to configure the global styles and aesthetics of infographics. For a concept review, please first read [Core Concepts - Themes](/learn/theme).

## Configure Themes {#configure-themes}

For simple theme configurations, you can directly pass configuration options when creating infographics:

```js
const infographic = new Infographic({
  // Other configuration options...
});

infographic.render(`
theme
  colorPrimary #FF356A
  colorBg #FFFFFF
  # Other theme configuration options...
`);
```

> For complete configuration options, see [Core Concepts - Themes](/learn/theme).

## Register Themes {#register-themes}

For more commonly used themes, you can register them for easier reuse using `registerTheme`:

```js
import {registerTheme} from '@antv/infographic';

registerTheme('my-theme', {
  // Theme configuration options
});
```

After registration, you can reference it in syntax with `theme my-theme`, combined with `theme` for further adjustments:

```syntax
infographic list-row-simple-horizontal-arrow
theme my-theme
  colorPrimary #FF356A
  # Other override configuration options...
```
