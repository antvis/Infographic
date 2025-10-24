# @antv/infographic Site

基于 VitePress 的 @antv/infographic 官方文档站点。

## 技术栈

- **VitePress** - 静态站点生成器
- **Vue 3** - 组件框架
- **TypeScript** - 类型安全
- **CSS** - 样式

## 开发

### 启动开发服务器

```bash
pnpm dev
# 或
pnpm docs:dev
```

访问 `http://localhost:5173`

### 构建生产版本

```bash
pnpm build
# 或
pnpm docs:build
```

### 预览生产版本

```bash
pnpm preview
# 或
pnpm docs:preview
```

### TypeScript 类型检查

```bash
pnpm typecheck
```

## 项目结构

```
packages/site/
├── .vitepress/
│   ├── config.mts          # VitePress 配置
│   ├── env.d.ts           # 全局类型声明
│   ├── theme/
│   │   ├── index.ts       # 主题入口
│   │   ├── style.css      # 全局样式
│   │   ├── components.d.ts # 组件类型声明
│   │   └── components/    # Vue 组件
│   │       ├── HomeHero.vue
│   │       ├── FeatureCard.vue
│   │       ├── ScenarioShowcase.vue
│   │       ├── CTASection.vue
│   │       └── HomePage.vue
│   ├── cache/             # 构建缓存
│   └── dist/              # 构建输出
├── guide/                 # 指南文档
├── api/                   # API 文档
├── examples/              # 示例文档
├── index.md              # 主页 (Vue 组件版)
├── tsconfig.json         # TypeScript 配置
└── package.json

```

## 自定义组件

### 1. HomeHero - 主页 Hero 区域

```vue
<HomeHero />
```

特性：
- 动态渐变背景
- 浮动光球动画
- 数据统计展示

### 2. FeatureCard - 特性卡片

```vue
<FeatureCard
  icon="🚀"
  title="标题"
  details="描述文字"
  :tags="['标签1', '标签2']"
/>
```

Props:
- `icon`: string - 图标（emoji 或文字）
- `title`: string - 标题
- `details`: string - 描述
- `tags`: string[] - 标签列表（可选）

### 3. ScenarioShowcase - 应用场景展示

```vue
<ScenarioShowcase />
```

特性：
- 6 个场景卡片
- 悬停激活状态
- 响应式布局

### 4. CTASection - 行动号召

```vue
<CTASection />
```

特性：
- 粒子动画背景
- 按钮涟漪效果
- 统计数据展示

## TypeScript 配置

### tsconfig.json

项目使用严格的 TypeScript 配置：

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "strict": true,
    "types": ["vitepress/client", "node"]
  }
}
```

### 类型声明

- `.vitepress/env.d.ts` - 全局类型声明（.vue 文件等）
- `.vitepress/theme/components.d.ts` - 组件类型声明

### 路径别名

```typescript
// 在组件中可以使用路径别名
import MyComponent from '@components/MyComponent.vue'
import { helper } from '@theme/utils'
```

配置在 `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@components/*": [".vitepress/theme/components/*"],
      "@theme/*": [".vitepress/theme/*"]
    }
  }
}
```

## 样式定制

### 全局样式

编辑 `.vitepress/theme/style.css`：

```css
/* 自定义 CSS 变量 */
:root {
  --vp-c-brand: #1890ff;
  --vp-c-brand-light: #40a9ff;
  --vp-c-brand-dark: #096dd9;
}
```

### 组件样式

每个 Vue 组件都有 scoped 样式：

```vue
<style scoped>
.my-component {
  /* 组件专属样式 */
}
</style>
```

## 添加新页面

1. 在相应目录下创建 `.md` 文件
2. 在 `.vitepress/config.mts` 中添加导航配置

```typescript
// .vitepress/config.mts
export default defineConfig({
  themeConfig: {
    nav: [
      { text: '新页面', link: '/new-page' }
    ]
  }
})
```

## 添加新组件

1. 在 `.vitepress/theme/components/` 创建组件
2. 在 `.vitepress/theme/index.ts` 注册组件
3. 在 `.vitepress/theme/components.d.ts` 添加类型声明

```typescript
// .vitepress/theme/index.ts
import MyComponent from './components/MyComponent.vue'

export default {
  enhanceApp({ app }) {
    app.component('MyComponent', MyComponent)
  }
}
```

## 调试技巧

### 1. 热模块替换 (HMR)

开发模式下，修改文件会自动刷新浏览器

### 2. Vue Devtools

安装 Vue Devtools 浏览器扩展来调试组件

### 3. TypeScript 检查

运行 `pnpm typecheck` 检查类型错误

### 4. 构建检查

运行 `pnpm build` 检查是否能成功构建

## 常见问题

### Q: 组件没有智能提示？

A: 确保已安装依赖并运行过 `pnpm typecheck`

### Q: 样式不生效？

A: 检查样式是否使用了 `scoped`，以及 CSS 变量是否正确

### Q: 构建失败？

A: 运行 `pnpm typecheck` 检查类型错误

## 参考资料

- [VitePress 官方文档](https://vitepress.dev/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
