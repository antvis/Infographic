---
title: Contributing
---

The source code for AntV Infographic is hosted on [GitHub](https://github.com/antvis/infographic), and the npm package is published on [npm](https://www.npmjs.com/package/@antv/infographic). This page helps you quickly become familiar with the repository structure and core modules, making it easy to start development and contribution.

## Directory Structure {#dir}

Main directories and their purposes:

```text
.
├── __tests__        Unit and utility tests
├── dev              Development environment and debugging
└── src
    ├── constants      Constant definitions
    ├── designs        Design assets (structures, items, layouts, components, decorations, titles, etc.)
    ├── jsx            JSX engine (primitive components, types, layouts, and rendering)
    ├── options        Infographic syntax definition and parsing
    ├── editor         Editor (plugins, interactions, commands, state management)
    ├── renderer       Core renderer and stylization capabilities
    ├── resource       Resource loading system
    ├── runtime        Runtime logic
    ├── templates      Template registration
    ├── themes         Theme configuration
    ├── types          Common types
    └── utils          Utility functions
```

## Main Functional Modules {#modules}

- **JSX Engine**: Parses JSX without relying on React, outputs SVG.
- **Design Assets**: Collection of visual building blocks including structures, items, decorations, etc.
- **Syntax Parsing**: Parses infographic syntax to compose reusable templates.
- **Editor**: Interactive canvas element modification capabilities, including plugin system, interactions, and command/state management.
- **Renderer**: Renders templates and data into final SVG output, supports export.
- **Stylization**: Provides various stylization effects such as hand-drawn, textures, etc.
- **Resource Loading**: Loads external icons, illustrations, and other resources, with custom extension support.

## Quick Development {#dev}

1. Clone the code:

```bash
git clone git@github.com:antvis/infographic.git
```

2. Install dependencies:

```bash
cd infographic
npm install
cd dev
npm install
```

3. Start development environment:

```bash
# Run from the dev directory
npm run dev
```

## Submit PR {#contribute}

We welcome all forms of contribution—bug fixes, documentation improvements, and feature additions are all valuable.

1. Create a branch:

```bash
git checkout -b feature/your-feature-name
```

2. Commit changes:

```bash
git commit -m "Add your feature description"
```

3. Push branch:

```bash
git push origin feature/your-feature-name
```

4. Create Pull Request:

Submit a Pull Request on GitHub with a brief description of the purpose and impact of the changes.

## Open Source Plan {#os-plan}

AntV Infographic will continue to open more capabilities, and we welcome community participation. Here is the open source plan for the next phase:

<img
  src="https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*15OrQo7ftkAAAAAASxAAAAgAemJ7AQ/original"
  alt="open source plan"
/>
