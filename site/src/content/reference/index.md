---
title: AntV Infographic 简介
---

AntV Infographic 采用三层架构：JSX 渲染引擎、运行时、对外 API。下图为整体结构：

![AntV Infographic Architecture](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*zONoSqxD0gwAAAAAT8AAAAgAemJ7AQ/original)

## JSX 渲染引擎 {#jsx-engine}

[JSX 渲染引擎](/reference/jsx)实现了独立的 JSX Runtime，在不依赖 React 的情况下用 JSX 描述信息图，并由渲染器将 JSX 元素输出为 SVG。

引擎内置[原语节点](/reference/primitive-nodes)，涵盖 Shape、Container、Text 等基础组件供运行时复用。

与 React JSX 不同，框架提供 [createLayout](/reference/create-layout) 以编写自定义布局算法。

## 运行时环境 {#runtime}

运行时包含模板生成器、渲染器与编辑器：

- 模板生成器：定义并解析[信息图语法](/learn/infographic-syntax)，组合出可复用模板
- 渲染器：将模板与数据渲染为最终 SVG，支撑导出能力
- 编辑器：交互式修改图形、样式（即将发布）

所有设计资产（结构、数据项等）都基于 JSX 原语节点实现。

## 对外 API 接口 {#api}

对外暴露完整的 [API](/reference/infographic-api)，用于创建、渲染、导出信息图，并提供 Schema 获取能力，便于与 AI 模型对接。
