import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  guideSidebar: [
    {
      type: 'category',
      label: '开始',
      items: ['guide/getting-started', 'guide/concepts'],
    },
    {
      type: 'category',
      label: '深入',
      items: ['guide/theme', 'guide/resource-loader', 'guide/advanced'],
    },
  ],
  theorySidebar: [
    'theory/index',
    'theory/classification',
    'theory/core-theory',
    'theory/elements',
    'theory/design',
  ],
  apiSidebar: [
    {
      type: 'category',
      label: 'API 参考',
      items: ['api/index', 'api/infographic', 'api/options'],
    },
    {
      type: 'category',
      label: '组件',
      items: ['api/structures', 'api/items'],
    },
    {
      type: 'category',
      label: '扩展',
      items: ['api/resources'],
    },
  ],
  examplesSidebar: ['examples/index', 'examples/ai-demo'],
  devSidebar: [
    'dev/overview',
    'dev/jsx-engine',
    'dev/ai-assisted-development',
    'dev/dev-environment',
  ],
};

export default sidebars;
