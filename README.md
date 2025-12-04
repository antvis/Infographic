<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [中文](./README.zh-CN.md) | English

<div align="center">

# Infographic, bring words to life!

🦋 An Infographic Generation and Rendering Framework, bring words to life!

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/build.yml)](https://github.com/antvis/infographic/actions)
![Visitors](https://hitscounter.dev/api/hit?url=https://github.com/antvis/infographic&label=Visitors&icon=graph-up&color=%23dc3545&message=&style=flat&tz=UTC)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EdkXSojOxqsAAAAAQHAAAAgAemJ7AQ/original" width="256">

</div>

**AntV Infographic** is a next-generation **declarative infographic visualization engine** from AntV.
With unified syntax and component architecture, you can render structured data into high-quality infographics in an elegant and flexible way, making information presentation more efficient and data storytelling simpler.

<div align="center">

[Website](https://infographic.antv.vision) · [GitHub](https://github.com/antvis/infographic) · [Document](https://infographic.antv.vision/learn) · [Gallery](https://infographic.antv.vision/examples) · [AI Agent](https://infographic.antv.vision/ai)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZdeISZWHuyIAAAAAbEAAAAgAemJ7AQ/fmt.webp" width="768" alt="AntV Infographic Preview">

</div>

## ✨ Features

- 📦 **Ready to use**: 100+ built-in templates, data-item components, and layouts to assemble infographics in minutes
- 🎨 **Themeable**: Hand-drawn (rough), gradients, patterns, multiple presets, and deep customization
- 🧑🏻‍💻 **Built-in editor**: built-in editor for AI-generated infographics, allowing for further customization and refinement
- 🧩 **Composable**: Structures, items, and render units are fully componentized for flexible extension
- 🎯 **Declarative Configuration**: Simple and clear configuration approach, ideal for AI generation, machine understanding, and automated workflows
- 🤖 **AI-friendly**: Declarative config with JSON Schema, ideal for AI generation and automated workflows
- 📐 **High-quality SVG**: Default SVG output for crisp visuals and easy editing/export

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
  // Enable editing with the built-in editor
  editable: true,
});

infographic.render();
```

Render the infographic in the target container.

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uvj8Qb26F1MAAAAARAAAAAgAemJ7AQ/fmt.webp" width="480" alt="AntV Infographic DEMO">

For more examples, please refer to the [documentation](https://infographic.antv.vision/examples) site.

## 🗂 Configuration

The `InfographicOptions` configuration item required when instantiating the Infographic class, see the information graph syntax for more information.

| Attribute   | Type                    | Required   | Description                           | Reference                                        |
| ----------- | ----------------------- | ---------- | ------------------------------------- | ------------------------------------------------ |
| container   | `string \| HTMLElement` | N     | Container, can be selector or HTMLElement. | -                                                                                           |
| width       | `number \| string`      | N     | Width, support pixel value or percentage.  | -                                                                                           |
| height      | `number \| string`      | N     | Height, support pixel value or percentage. | -                                                                                           |
| padding     | `Padding`               | N     | Padding for container                      | [Padding](https://infographic.antv.vision/reference/infographic-types#padding)              |
| template    | `string`                | N     | Template name                              | -                                                                                           |
| design      | `DesignOptions`         | N     | Design options                             | [DesignOptions](https://infographic.antv.vision/reference/infographic-types#design-options) |
| data        | `Data`                  | **Y** | Data for Infographic                       | [Data](https://infographic.antv.vision/reference/infographic-types#data)                    |
| theme       | `string`                | N     | Theme name                                 | -                                                                                           |
| themeConfig | `ThemeConfig`           | N     | Theme configure options                    | [ThemeConfig](https://infographic.antv.vision/reference/infographic-types#theme-config)     |
| svg         | `SVGOptions`            | N     | Options for SVG container                  | [SVGOptions](https://infographic.antv.vision/reference/infographic-types#svg-options)       |
| editable    | `boolean`               | N     | Whethe editable?                           | -                                                                                           |

For more details, please refer to the [Configuration](https://infographic.antv.vision/reference/infographic-options) section.


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
