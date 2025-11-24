<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](/README.md)

<div align="center"> 

# Infographic, bring words to life!

🦋 新一代信息图可视化引擎，让文字信息栩栩如生！

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EdkXSojOxqsAAAAAQHAAAAgAemJ7AQ/original" width="256">

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/build.yml)](https://github.com/antvis/infographic/actions)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)

</div>

**AntV Infographic** 是 AntV 推出的新一代**声明式信息图可视化引擎**。
通过统一的语法与组件体系，你可以将结构化数据以优雅、灵活的方式渲染为高质量的信息图，让信息表达更高效，让数据叙事更简单。

<div align="center">

[Website](https://infographic.antv.vision) · [GitHub](https://github.com/antvis/infographic) · [Document](https://infographic.antv.vision/learn) · [Gallery](https://infographic.antv.vision/examples) · [AI Agent](https://infographic.antv.vision/ai)

</div>


## ✨ 特性

- 📦 **开箱即用**：内置 100+ 信息图模板、数据项组件与布局，快速构建专业信息图
- 🎨 **主题系统**：支持手绘（rough）、渐变、图案、多套预设主题，并支持深度自定义
- 🧩 **组件化架构**：数据项、结构布局、渲染单元完全组件化，可灵活组合与扩展
- 📐 **高质量 SVG 输出**：默认基于 SVG 渲染，保证视觉品质与可编辑性
- 🎯 **声明式配置**：简单清晰的配置方式，更适合 AI 生成、机器理解与自动化流程
- 🤖 **AI 友好**：完善的 JSON Schema 定义，使大模型可自动生成可用配置

## 🚀 安装

```bash
npm install @antv/infographic
```

## 📝 快速开始

```ts
import { Infographic } from '@antv/infographic';

const infographic = new Infographic({
  container: '#container',
  width: '100%',
  height: '100%',
  template: 'list-row-simple-horizontal-arrow',
  data: {
    items: [
      { label: '步骤 1', desc: '开始' },
      { label: '步骤 2', desc: '进行中' },
      { label: '步骤 3', desc: '完成' },
    ],
  },
});

infographic.render();
```

然后你可以在容器中看到信息图渲染出来。

![](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uvj8Qb26F1MAAAAARAAAAAgAemJ7AQ/fmt.webp)

更多示例请参考[文档站点](https://infographic.antv.vision/examples)。


## 💬 社区与交流

- 在 GitHub 提交你的问题或建议
- 参与 [GitHub Discussions](https://github.com/antvis/infographic/discussions) 与社区交流
- 欢迎参与贡献，一起完善 AntV Infographic！

如有任何建议，欢迎在 GitHub 上与我们交流！欢迎 Star ⭐ 支持我们。

- [AntV 官网](https://antv.antgroup.com/)
- [GitHub 仓库](https://github.com/antvis/infographic)
- [问题反馈 Issues](https://github.com/antvis/infographic/issues)


## 📄 许可证

本项目基于 **MIT** 许可开源，详见 [LICENSE](./LICENSE)。
