---
title: 自定义字体
---

想在信息图中使用品牌或特色字体，可按以下步骤：

1. 部署字体或者使用已有字体资源，部署方式可参考：[字体分包部署与使用](https://chinese-font.netlify.app/zh-cn/post/deploy_to_cdn)
2. 使用 [registerFont](/reference/infographic-exports#register-font) 注册字体。
3. 在[主题](/learn/theme)配置中通过配置 `font-family` 使用注册的字体。

以下为示例代码：

```js
import {registerFont, Infographic} from '@antv/infographic';

registerFont({
  fontFamily: 'Alibaba PuHuiTi',
  name: '阿里巴巴普惠体',
  baseUrl: 'https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css',
  fontWeight: {regular: 'regular'},
});

const infographic = new Infographic({
  // 其他配置项...
  themeConfig: {
    base: {
      text: {
        // 配置全局字体
        'font-family': 'Alibaba PuHuiTi',
      },
    },
    item: {
      label: {
        // 仅配置数据项标题字体
        'font-family': 'Alibaba PuHuiTi',
      },
    },
  },
});
```

建议确保字体 CDN 支持跨域与缓存，这样渲染更稳定、加载更快。
