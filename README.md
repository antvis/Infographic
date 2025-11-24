
<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [中文](./README.zh-CN.md) | English

<div align="center">

# Infographic, bring words to life!

🦋 An Infographic Generation and Rendering Framework, bring words to life!

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/build.yml)](https://github.com/antvis/infographic/actions)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)


<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EdkXSojOxqsAAAAAQHAAAAgAemJ7AQ/original" width="256">

</div>

**AntV Infographic** is a next-generation **declarative infographic visualization engine** from AntV.
With unified syntax and component architecture, you can render structured data into high-quality infographics in an elegant and flexible way, making information presentation more efficient and data storytelling simpler.

<div align="center">

[Website](https://infographic.antv.vision) · [GitHub](https://github.com/antvis/infographic) · [Document](https://infographic.antv.vision/learn) · [Gallery](https://infographic.antv.vision/examples) · [AI Agent](https://infographic.antv.vision/ai)

</div>


## ✨ Features

- 📦 **Ready to Use**: Built-in 100+ infographic templates, data item components, and layouts for quickly building professional infographics
- 🎨 **Theme System**: Supports hand-drawn (rough) style, gradients, patterns, multiple preset themes, and deep customization
- 🧩 **Component Architecture**: Data items, structural layouts, and rendering units are fully componentized for flexible composition and extension
- 📐 **High-Quality SVG Output**: SVG-based rendering by default, ensuring visual quality and editability
- 🎯 **Declarative Configuration**: Simple and clear configuration approach, ideal for AI generation, machine understanding, and automated workflows
- 🤖 **AI-Friendly**: Complete JSON Schema definitions enable large language models to automatically generate usable configurations


## 🚀 Installation

```bash
npm install @antv/infographic
```


## 📝 Quick Start

```ts
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  template: 'list-row-simple-horizontal-arrow',
  data: {
    items: [
      { label: 'Step 1', desc: 'Start' },
      { label: 'Step 2', desc: 'In Progress' },
      { label: 'Step 3', desc: 'Complete' },
    ],
  },
});

infographic.render();
```

Then you can see the infographic rendered in the container.

![](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uvj8Qb26F1MAAAAARAAAAAgAemJ7AQ/fmt.webp)

For more examples, please refer to the [documentation](https://infographic.antv.vision/examples) site.


## 💬 Community & Communication

- Submit your questions or suggestions on GitHub
- Join [GitHub Discussions](https://github.com/antvis/infographic/discussions) to communicate with the community
- Contributions are welcome! Let's improve AntV Infographic together!

If you have any suggestions, feel free to communicate with us on GitHub! Star ⭐ us to show your support.

- [AntV Official Website](https://antv.antgroup.com/)
- [GitHub Repository](https://github.com/antvis/infographic)
- [Issue Tracker](https://github.com/antvis/infographic/issues)


## 📄 License

This project is open source under the **MIT** license. See [LICENSE](./LICENSE) for details.
