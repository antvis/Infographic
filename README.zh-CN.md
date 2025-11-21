# AntV Infographic

**AntV Infographic** 是 AntV 推出的新一代**声明式信息图可视化引擎**。
通过统一的语法与组件体系，你可以将结构化数据以优雅、灵活的方式渲染为高质量的信息图，让信息表达更高效，让数据叙事更简单。

[![npm version](https://img.shields.io/npm/v/@antv/infographic.svg)](https://www.npmjs.com/package/@antv/infographic)
[![build status](https://img.shields.io/github/actions/workflow/status/antvis/infographic/ci.yml)](https://github.com/antvis/infographic/actions)
[![license](https://img.shields.io/npm/l/@antv/infographic.svg)](./LICENSE)

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

更多示例请参考文档站点。

## 📚 文档

👉 完整文档与模板示例请访问：
**[https://infographic.antv.vision](https://infographic.antv.vision)**

## 📄 许可证

本项目基于 **MIT** 许可开源，详见 [LICENSE](./LICENSE)。

## 🔗 相关链接

- [AntV 官网](https://antv.antgroup.com/)
- [GitHub 仓库](https://github.com/antvis/infographic)
- [问题反馈 Issues](https://github.com/antvis/infographic/issues)

## 💬 社区与交流

- 在 GitHub 提交你的问题或建议
- 参与 [GitHub Discussions](https://github.com/antvis/infographic/discussions) 与社区交流
- 欢迎参与贡献，一起完善 AntV Infographic！

如有任何建议，欢迎在 GitHub 上与我们交流！欢迎 Star ⭐ 支持我们。
