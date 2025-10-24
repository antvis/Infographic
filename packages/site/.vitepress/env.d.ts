/// <reference types="vitepress/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// 扩展 VitePress 主题
declare module 'vitepress/theme' {
  import type { Theme } from 'vitepress';
  const theme: Theme;
  export default theme;
}
