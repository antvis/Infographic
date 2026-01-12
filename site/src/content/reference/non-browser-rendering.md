# 非浏览器中渲染

在 Node.js 环境中将信息图渲染为 SVG 字符串，适用于 SSR、给AI用的MCP、SKILLs等非浏览器场景。

## 基本用法

```ts
import { renderToSVG } from '@antv/infographic/ssr';

const result = await renderToSVG({
  input: `
infographic list-row-simple-horizontal-arrow
data
  items:
    - label: Step 1
      desc: Start
    - label: Step 2
      desc: In Progress
    - label: Step 3
      desc: Complete
`,
});

console.log(result.svg);
console.log('Errors:', result.errors);
console.log('Warnings:', result.warnings);
```

## API

### renderToSVG

```ts
interface SSRRenderOptions {
  /** 输入：Antv 信息图语法字符串 */
  input: string;
  /** 可选的信息图配置 */
  options?: Partial<InfographicOptions>;
}

interface SSRRenderResult {
  /** SVG 字符串 */
  svg: string;
  /** 错误列表 */
  errors: SyntaxError[];
  /** 警告列表 */
  warnings: SyntaxError[];
}

function renderToSVG(options: SSRRenderOptions): Promise<SSRRenderResult>;
```

### DOM 工具函数

```ts
import { setupDOM, isSSR } from '@antv/infographic/ssr';

// 设置 jsdom 环境（渲染前调用，renderToSVG 会自动调用）
setupDOM();

// 检查当前是否在非浏览器渲染模式
isSSR(): boolean;
```

> **注意**：`renderToSVG` 会自动处理 DOM 环境的设置。DOM 环境会复用以提高性能，通常不需要手动调用 `setupDOM`。

## 完整示例

```ts
import { renderToSVG } from '@antv/infographic/ssr';
import { writeFileSync } from 'fs';

async function renderInfographicToFile() {
  const syntax = `
infographic list-row-simple-horizontal-arrow
data
  title My Process
  items:
    - label: Planning
      desc: Define requirements
    - label: Development
      desc: Build features
    - label: Testing
      desc: Quality assurance
    - label: Deployment
      desc: Go live
`;

  const result = await renderToSVG({ input: syntax });

  if (result.errors.length > 0) {
    console.error('Render errors:', result.errors);
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn('Render warnings:', result.warnings);
  }

  writeFileSync('output.svg', result.svg, 'utf-8');
  console.log('Successfully rendered to output.svg');
}

renderInfographicToFile();
```

## 配合自定义资源加载器

如果需要在非浏览器环境中加载自定义资源，可以使用 `registerResourceLoader`。详见[自定义资源加载器](/learn/custom-resource-loader)。

```ts
import { renderToSVG } from '@antv/infographic/ssr';
import { registerResourceLoader, loadSVGResource } from '@antv/infographic';

registerResourceLoader(async (config) => {
  const { scene = 'icon', data } = config;

  // 根据 scene 区分 icon / illus
  let url: string;
  if (scene === 'icon') {
    url = `https://api.iconify.design/${data}.svg`;
  } else {
    url = `https://raw.githubusercontent.com/your-org/illustrations/main/${data}.svg`;
  }

  // 请求资源并转换为标准资源对象
  const response = await fetch(url);
  const svgString = await response.text();
  return loadSVGResource(svgString);
});

const result = await renderToSVG({ input: syntax });
```

## 注意事项

1. **异步资源**：非浏览器模式下会自动预加载图标和插图资源，确保渲染结果完整
2. **嵌入资源**：导出的 SVG 默认嵌入所有资源，可直接使用
3. **编辑器模式**：非浏览器渲染会自动禁用编辑器功能
4. **运行环境**：需要 Node.js 16+ 环境
