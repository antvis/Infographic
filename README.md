<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [简体中文](./README.zh-CN.md) | English

<div align="center">

# Infographic, bring words to life!

🦋 An Infographic Generation and Rendering Framework, bring words to life!

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/build.yml)](https://github.com/antvis/infographic/actions)
![Visitors](https://hitscounter.dev/api/hit?url=https://github.com/antvis/infographic&label=Visitors&icon=graph-up&color=%23dc3545&message=&style=flat&tz=UTC)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EdkXSojOxqsAAAAAQHAAAAgAemJ7AQ/original" width="256">

</div>

**AntV Infographic** is AntV's next-generation **declarative infographic visualization engine**. With a carefully designed infographic syntax, it can quickly and flexibly render high-quality infographics, making information presentation more efficient and data storytelling simpler.

<div align="center">

<p align="center">
  <a href="https://infographic.antv.vision">
    <img src="https://img.shields.io/badge/Website-2F54EB?style=for-the-badge" alt="Website" />
  </a>
  <a href="https://github.com/antvis/infographic">
    <img src="https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://infographic.antv.vision/learn">
    <img src="https://img.shields.io/badge/Docs-722ED1?style=for-the-badge" alt="Docs" />
  </a>
  <a href="https://infographic.antv.vision/examples">
    <img src="https://img.shields.io/badge/Gallery-13C2C2?style=for-the-badge" alt="Gallery" />
  </a>
  <a href="./prompt.md">
    <img src="https://img.shields.io/badge/Prompt-FA8C16?style=for-the-badge" alt="Prompt" />
  </a>
  <a href="https://infographic.antv.vision/ai">
    <img src="https://img.shields.io/badge/AI%20Agent-EB2F96?style=for-the-badge" alt="AI Agent" />
  </a>
</p>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZdeISZWHuyIAAAAAbEAAAAgAemJ7AQ/fmt.webp" width="768" alt="AntV Infographic Preview">

</div>

## ✨ Features

- 🤖 **AI-friendly**: Configuration and syntax are tuned for AI generation, provide concise prompts, and support AI streaming output and rendering
- 📦 **Ready to use**: ~200 built-in infographic templates, data-item components, and layouts to build professional infographics in minutes
- 🎨 **Theme system**: Hand-drawn, gradients, patterns, multiple preset themes, plus deep customization
- 🧑🏻‍💻 **Built-in editor**: Includes an editor for infographics so AI-generated results can be edited further
- 📐 **High-quality SVG output**: Renders with SVG by default to ensure visual fidelity and easy editing

## 🚀 Installation

```bash
npm install @antv/infographic
```

## 📝 Quick Start

[![](https://img.shields.io/badge/Getting%20Started-2F54EB)](https://infographic.antv.vision/learn/getting-started)
[![](https://img.shields.io/badge/Infographic%20Syntax-13C2C2)](https://infographic.antv.vision/learn/infographic-syntax)
[![](https://img.shields.io/badge/Configuration-722ED1)](https://infographic.antv.vision/reference/infographic-options)

```ts
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  editable: true,
});

infographic.render(`
infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Step 1
      desc: Start
    - label: Step 2
      desc: In Progress
    - label: Step 3
      desc: Complete
`);
```

The rendered result looks like this:

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uvj8Qb26F1MAAAAARAAAAAgAemJ7AQ/fmt.webp" width="480" alt="AntV Infographic DEMO">

## Streaming Rendering

[![](https://img.shields.io/badge/Demo-D46A6A)](https://infographic.antv.vision/learn/infographic-syntax)

With a highly fault-tolerant infographic syntax you can stream AI output in real time and progressively render the infographic.

```ts
let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  infographic.render(buffer);
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*e_PFSZrR9AQAAAAASdAAAAgAemJ7AQ/original" width="480" alt="AntV Infographic Streaming Rendering">

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
