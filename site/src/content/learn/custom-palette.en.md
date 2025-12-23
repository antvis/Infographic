---
title: Custom Palettes
---

> If you are unfamiliar with palette concepts, start with [Core Concepts - Theme - Palette](/learn/theme#palette)

Register custom palettes through [registerPalette](/reference/infographic-exports#register-palette) so you can reuse them inside infographics.

```js
import {registerPalette, Infographic} from '@antv/infographic';

// Register a discrete palette (an array of color strings)
registerPalette('discrete-palette', ['#FF356A', '#7BC9FF', '#FFD166']);

// Register a continuous palette (a function that returns a color string)
registerPalette('continuous-palette', (ratio) => {
  const r = Math.round(255 * ratio);
  const g = Math.round(200 * (1 - ratio));
  const b = 150;
  return `rgb(${r}, ${g}, ${b})`;
});

const infographic = new Infographic({
  // other configuration options...
});

infographic.render(`
theme
  palette discrete-palette
`);
```

Custom palettes are perfect for brand-specific color systems or other business-driven aesthetics. Once registered, reference the palette by name in `themeConfig.palette`.
