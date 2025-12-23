---
title: Custom Fonts
---

To use brand or distinctive fonts in your infographic, follow these steps:

1. Deploy the font or use an existing hosted resource. For guidance, see [Deploying Font Packages](https://chinese-font.netlify.app/zh-cn/post/deploy_to_cdn).
2. Register the font via [registerFont](/reference/infographic-exports#register-font).
3. Apply the registered font through the `font-family` setting in your [theme](/learn/theme).

Example:

```js
import {registerFont, Infographic} from '@antv/infographic';

registerFont({
  fontFamily: 'Alibaba PuHuiTi',
  name: 'Alibaba PuHuiTi',
  baseUrl: 'https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css',
  fontWeight: {regular: 'regular'},
});

const infographic = new Infographic({
  // other configuration options...
});

infographic.render(`
theme
  base
    text
      font-family Alibaba PuHuiTi # Configure global font
  item
    label
      font-family Alibaba PuHuiTi # Configure only item label font
`);
```

Make sure your font CDN supports CORS and caching so rendering stays stable and loads quickly.
