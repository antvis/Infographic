<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> 简体中文 | [English](/README.md)

<div align="center">

# Infographic, bring words to life!

🦋 新一代信息图可视化引擎，让文字信息栩栩如生！

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/build.yml)](https://github.com/antvis/infographic/actions)
![Visitors](https://hitscounter.dev/api/hit?url=https://github.com/antvis/infographic&label=Visitors&icon=graph-up&color=%23dc3545&message=&style=flat&tz=UTC)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*EdkXSojOxqsAAAAAQHAAAAgAemJ7AQ/original" width="256">

</div>

**AntV Infographic** 是 AntV 推出的新一代**声明式信息图可视化引擎**，通过精心设计的信息图语法，能够快速、灵活地渲染出高质量的信息图，让信息表达更高效，让数据叙事更简单。

<div align="center">

<p align="center">
  <a href="https://infographic.antv.vision">
    <img src="https://img.shields.io/badge/%E5%AE%98%E7%BD%91-2F54EB?style=for-the-badge" alt="官网" />
  </a>
  <a href="https://github.com/antvis/infographic">
    <img src="https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://infographic.antv.vision/learn">
    <img src="https://img.shields.io/badge/%E6%96%87%E6%A1%A3-722ED1?style=for-the-badge" alt="文档" />
  </a>
  <a href="https://infographic.antv.vision/examples">
    <img src="https://img.shields.io/badge/%E7%A4%BA%E4%BE%8B-13C2C2?style=for-the-badge" alt="示例" />
  </a>
  <a href="./prompt.zh-CN.md">
    <img src="https://img.shields.io/badge/Prompt-FA8C16?style=for-the-badge" alt="Prompt" />
  </a>
  <a href="https://infographic.antv.vision/ai">
    <img src="https://img.shields.io/badge/AI%20Agent-EB2F96?style=for-the-badge" alt="AI Agent" />
  </a>
</p>

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*ZdeISZWHuyIAAAAAbEAAAAgAemJ7AQ/fmt.webp" width="768" alt="AntV Infographic 预览">

</div>

## ✨ 特性

- 🤖 **AI 友好**：配置和语法更适合 AI 生成，提供简洁有效的 Prompt，支持 AI 流式输出和渲染
- 📦 **开箱即用**：内置 ~200 信息图模板、数据项组件与布局，快速构建专业信息图
- 🎨 **主题系统**：支持手绘、渐变、图案、多套预设主题，允许深度自定义
- 🧑🏻‍💻 **内置编辑器**：内置信息图的编辑器，让 AI 生成之后可以二次编辑
- 📐 **高质量 SVG 输出**：默认基于 SVG 渲染，保证视觉品质与可编辑性

## 🚀 安装

```bash
npm install @antv/infographic
```

## 📝 快速开始

[![](https://img.shields.io/badge/%E5%85%A5%E9%97%A8%E6%8C%87%E5%8D%97-2F54EB)](https://infographic.antv.vision/learn/getting-started)
[![](https://img.shields.io/badge/%E4%BF%A1%E6%81%AF%E5%9B%BE%E8%AF%AD%E6%B3%95-13C2C2)](https://infographic.antv.vision/learn/infographic-syntax)
[![](https://img.shields.io/badge/%E9%85%8D%E7%BD%AE%E9%A1%B9-722ED1)](https://infographic.antv.vision/reference/infographic-options)

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

渲染结果如下：

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*uvj8Qb26F1MAAAAARAAAAAgAemJ7AQ/fmt.webp" width="480" alt="AntV Infographic DEMO">

## 流式渲染

[![](https://img.shields.io/badge/Demo-D46A6A)](https://infographic.antv.vision/learn/infographic-syntax)

使用具有高容错性的信息图语法能够实时接收 AI 流式输出并逐步渲染信息图。

```ts
let buffer = '';
for (const chunk of chunks) {
  buffer += chunk;
  infographic.render(buffer);
}
```

<img src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*e_PFSZrR9AQAAAAASdAAAAgAemJ7AQ/original" width="480" alt="AntV Infographic 流式渲染">

## 💬 社区与交流

- 在 GitHub 提交你的问题或建议
- 参与 [GitHub Discussions](https://github.com/antvis/infographic/discussions) 与社区交流
- 欢迎参与贡献，一起完善 AntV Infographic！

如有任何建议，欢迎在 GitHub 上与我们交流！欢迎 Star ⭐ 支持我们。

- [AntV 官网](https://antv.antgroup.com/)
- [GitHub 仓库](https://github.com/antvis/infographic)
- [问题反馈](https://github.com/antvis/infographic/issues)

## 📄 许可证

本项目基于 **MIT** 许可开源，详见 [LICENSE](./LICENSE)。
