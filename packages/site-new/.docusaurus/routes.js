import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/infographic/__docusaurus/debug',
    component: ComponentCreator('/infographic/__docusaurus/debug', 'ea4'),
    exact: true
  },
  {
    path: '/infographic/__docusaurus/debug/config',
    component: ComponentCreator('/infographic/__docusaurus/debug/config', '687'),
    exact: true
  },
  {
    path: '/infographic/__docusaurus/debug/content',
    component: ComponentCreator('/infographic/__docusaurus/debug/content', '86a'),
    exact: true
  },
  {
    path: '/infographic/__docusaurus/debug/globalData',
    component: ComponentCreator('/infographic/__docusaurus/debug/globalData', '6e9'),
    exact: true
  },
  {
    path: '/infographic/__docusaurus/debug/metadata',
    component: ComponentCreator('/infographic/__docusaurus/debug/metadata', '524'),
    exact: true
  },
  {
    path: '/infographic/__docusaurus/debug/registry',
    component: ComponentCreator('/infographic/__docusaurus/debug/registry', '581'),
    exact: true
  },
  {
    path: '/infographic/__docusaurus/debug/routes',
    component: ComponentCreator('/infographic/__docusaurus/debug/routes', '3a9'),
    exact: true
  },
  {
    path: '/infographic/',
    component: ComponentCreator('/infographic/', '0f5'),
    routes: [
      {
        path: '/infographic/',
        component: ComponentCreator('/infographic/', 'b3a'),
        routes: [
          {
            path: '/infographic/',
            component: ComponentCreator('/infographic/', '320'),
            routes: [
              {
                path: '/infographic/api/',
                component: ComponentCreator('/infographic/api/', '128'),
                exact: true,
                sidebar: "apiSidebar"
              },
              {
                path: '/infographic/api/infographic',
                component: ComponentCreator('/infographic/api/infographic', '1ec'),
                exact: true,
                sidebar: "apiSidebar"
              },
              {
                path: '/infographic/api/items',
                component: ComponentCreator('/infographic/api/items', '33b'),
                exact: true,
                sidebar: "apiSidebar"
              },
              {
                path: '/infographic/api/options',
                component: ComponentCreator('/infographic/api/options', '3d2'),
                exact: true,
                sidebar: "apiSidebar"
              },
              {
                path: '/infographic/api/resources',
                component: ComponentCreator('/infographic/api/resources', 'bce'),
                exact: true,
                sidebar: "apiSidebar"
              },
              {
                path: '/infographic/api/structures',
                component: ComponentCreator('/infographic/api/structures', '90d'),
                exact: true,
                sidebar: "apiSidebar"
              },
              {
                path: '/infographic/dev/ai-assisted-development',
                component: ComponentCreator('/infographic/dev/ai-assisted-development', 'ce2'),
                exact: true,
                sidebar: "devSidebar"
              },
              {
                path: '/infographic/dev/dev-environment',
                component: ComponentCreator('/infographic/dev/dev-environment', 'e7c'),
                exact: true,
                sidebar: "devSidebar"
              },
              {
                path: '/infographic/dev/jsx-engine',
                component: ComponentCreator('/infographic/dev/jsx-engine', 'e18'),
                exact: true,
                sidebar: "devSidebar"
              },
              {
                path: '/infographic/dev/overview',
                component: ComponentCreator('/infographic/dev/overview', 'fb2'),
                exact: true,
                sidebar: "devSidebar"
              },
              {
                path: '/infographic/examples/',
                component: ComponentCreator('/infographic/examples/', '0df'),
                exact: true,
                sidebar: "examplesSidebar"
              },
              {
                path: '/infographic/guide/advanced',
                component: ComponentCreator('/infographic/guide/advanced', '470'),
                exact: true,
                sidebar: "guideSidebar"
              },
              {
                path: '/infographic/guide/concepts',
                component: ComponentCreator('/infographic/guide/concepts', '3bb'),
                exact: true,
                sidebar: "guideSidebar"
              },
              {
                path: '/infographic/guide/getting-started',
                component: ComponentCreator('/infographic/guide/getting-started', '573'),
                exact: true,
                sidebar: "guideSidebar"
              },
              {
                path: '/infographic/guide/resource-loader',
                component: ComponentCreator('/infographic/guide/resource-loader', 'd4a'),
                exact: true,
                sidebar: "guideSidebar"
              },
              {
                path: '/infographic/guide/theme',
                component: ComponentCreator('/infographic/guide/theme', '908'),
                exact: true,
                sidebar: "guideSidebar"
              },
              {
                path: '/infographic/theory/',
                component: ComponentCreator('/infographic/theory/', '525'),
                exact: true,
                sidebar: "theorySidebar"
              },
              {
                path: '/infographic/theory/classification',
                component: ComponentCreator('/infographic/theory/classification', '836'),
                exact: true,
                sidebar: "theorySidebar"
              },
              {
                path: '/infographic/theory/core-theory',
                component: ComponentCreator('/infographic/theory/core-theory', '17f'),
                exact: true,
                sidebar: "theorySidebar"
              },
              {
                path: '/infographic/theory/design',
                component: ComponentCreator('/infographic/theory/design', '572'),
                exact: true,
                sidebar: "theorySidebar"
              },
              {
                path: '/infographic/theory/elements',
                component: ComponentCreator('/infographic/theory/elements', 'f20'),
                exact: true,
                sidebar: "theorySidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
