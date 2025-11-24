---
title: 项目介绍
---

AntV Infographic 的源代码托管在 [GitHub](https://github.com/antvis/infographic)，npm 包发布在 [npm](https://www.npmjs.com/package/@antv/infographic)。本页帮助你快速熟悉仓库结构和核心模块，方便上手开发与贡献。

## 目录结构 {#dir}

主要目录及用途：

```text
.
├── __tests__        单元与工具测试
├── dev              开发环境与调试
└── src
    ├── constants      常量定义
    ├── designs        设计资产（结构、数据项、布局、组件、装饰、标题等）
    ├── jsx            JSX 引擎（原语组件、类型、布局与渲染）
    ├── options        信息图语法定义与解析
    ├── renderer       核心渲染器与风格化能力
    ├── resource       资源加载体系
    ├── runtime        运行时逻辑
    ├── templates      模板注册
    ├── themes         主题配置
    ├── types          通用类型
    └── utils          工具函数
```

## 主要功能模块 {#modules}

- **JSX 引擎**：在不依赖 React 的情况下解析 JSX，输出 SVG。
- **设计资产**：结构、数据项、装饰等视觉积木的实现集合。
- **语法解析**：解析信息图语法，组合出可复用的模板。
- **渲染器**：将模板与数据渲染为最终 SVG 输出，并支持导出。
- **风格化**：提供手绘、纹理等多种风格化效果。
- **资源加载**：加载外部图标、插图等资源，并提供自定义扩展。

## 快速开发 {#dev}

1. 克隆代码：

```bash
git clone git@github.com:antvis/infographic.git
```

2. 安装依赖：

```bash
cd infographic
npm install
cd dev
npm install
```

3. 启动开发环境：

```bash
# 位于 dev 目录下运行
npm run dev
```

## 提交 PR {#contribute}

欢迎任何形式的贡献——修复 bug、补充文档、添加功能都很宝贵。

1. 创建分支：

```bash
git checkout -b feature/your-feature-name
```

2. 提交更改：

```bash
git commit -m "Add your feature description"
```

3. 推送分支：

```bash
git push origin feature/your-feature-name
```

4. 创建 Pull Request：

在 GitHub 提交 Pull Request，并简要说明变更目的和影响。

## 开源计划 {#os-plan}

AntV Infographic 将持续开放更多能力，欢迎社区参与共建。下面是下一阶段的开源计划：

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*15OrQo7ftkAAAAAASxAAAAgAemJ7AQ/original"
  alt="open source plan"
/>
