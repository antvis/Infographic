---
title: AntV Infographic 简介
---

下为 AntV Infographic 的整体架构图：

![AntV Infographic Architecture](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*zONoSqxD0gwAAAAAT8AAAAgAemJ7AQ/original)

AntV Infographic 整体采用三层架构设计，分别为：

- 底层 JSX 渲染引擎
- 运行时环境
- 对外 API 接口

## JSX 渲染引擎 {#jsx-engine}

[JSX 渲染引擎](/reference/jsx)实现了 JSX 运行时(`JSX Runtime`)，能够在不依赖 React 框架的情况下，使用 JSX 语法设计开发信息图。此外，能够通过渲染器(`Renderer`)将 JSX 元素渲染为 SVG 对象。

此外，JSX 渲染引擎提供了[原语节点](/reference/primitive-nodes)，包括基本图形元素(`Shape`)、容器元素(`Container`)、文本元素(`Text`)等，供上层运行时环境使用。

与 React JSX 不同，AntV Infographic 的一个特点是提供了 [createLayout](/reference/create-layout) 方法，允许用户自定义布局算法，通过其创建的节点可以对内部的子元素进行布局。

## 运行时环境 {#runtime}

AntV 运行时环境包含 `模版生成器`、`渲染器` 和 `编辑器` 三大模块。

模版生成器提供了[信息图语法](learn/infographic-syntax)的定义和解析能力，并能根据语法组装出相应的信息图模版。

此外，AntV Infographic 中所提供的[结构](/learn/design#structure)、[数据项](/learn/design#item)等设计资产均是基于 JSX 渲染引擎实现的原语节点构建而成。

编辑器允许用户通过交互的形式编辑信息图，包括调整图形位置、修改样式等操作。

> 编辑器会在下阶段版本中发布，敬请期待。

## 对外 API 接口 {#api}

AntV Infographic 对外提供了一套完整的 [API 接口](/reference/infographic-api)，供用户进行信息图的创建、渲染和导出等操作。

为了适应 AI 时代的需求，AntV Infographic 还提供了相应的 API 用于获取内部设计的 Schema 信息，以便与 AI 模型进行对接，实现智能化的信息图设计和生成。
