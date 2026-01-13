---
title: Architecture Design
---

AntV Infographic uses a three-layer architecture: JSX rendering engine, runtime, and external API. The overall structure is shown below:

![AntV Infographic Architecture](https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*zONoSqxD0gwAAAAAT8AAAAgAemJ7AQ/original)

## JSX Rendering Engine {#jsx-engine}

The [JSX rendering engine](/reference/jsx) implements an independent JSX Runtime, allowing you to describe infographics using JSX without relying on React, and the renderer outputs JSX elements as SVG.

The engine includes built-in [primitive nodes](/reference/primitive-nodes), containing basic components such as geometric shapes, text, groups, etc., and supports composing more complex structures from these basic components.

Unlike React JSX, the framework provides [createLayout](/reference/create-layout) to write custom layout algorithms.

## Runtime Environment {#runtime}

The runtime includes template generator, renderer, and editor:

- Template Generator: Defines and parses the [infographic syntax](/learn/infographic-syntax), combining them into reusable templates
- Renderer: Renders templates and data into final SVG, supporting export capabilities
- Editor: Interactively modify graphics and styles (coming soon)

All design assets (structures, data items, etc.) are implemented based on JSX primitive nodes.

## External API Interface {#api}

Exposes a complete [API](/reference/infographic-api) for creating, rendering, and exporting infographics, and provides Schema acquisition capabilities for easy integration with AI models.
