# Non-Browser Rendering

Render infographics to SVG strings in Node.js environment, suitable for SSR, and other non-browser scenarios like AI MCPs and SKills.

## Basic Usage

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
  /** Input: Antv Infographic Syntax string */
  input: string;
  /** Optional infographic options */
  options?: Partial<InfographicOptions>;
}

interface SSRRenderResult {
  /** SVG string */
  svg: string;
  /** Error list */
  errors: SyntaxError[];
  /** Warning list */
  warnings: SyntaxError[];
}

function renderToSVG(options: SSRRenderOptions): Promise<SSRRenderResult>;
```

### DOM Utility Functions

```ts
import { setupDOM, isSSR } from '@antv/infographic/ssr';

// Setup jsdom environment (call before rendering, renderToSVG calls it automatically)
setupDOM();

// Check if currently in non-browser rendering mode
isSSR(): boolean;
```

> **Note**: `renderToSVG` automatically handles DOM environment setup. The DOM environment is reused for performance, so you typically don't need to manually call `setupDOM`.

## Complete Example

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

## Using with Custom Resource Loader

If you need to load custom resources in a non-browser environment, use `registerResourceLoader`. See [Custom Resource Loader](/learn/custom-resource-loader) for details.

```ts
import { renderToSVG } from '@antv/infographic/ssr';
import { registerResourceLoader, loadSVGResource } from '@antv/infographic';

registerResourceLoader(async (config) => {
  const { scene = 'icon', data } = config;

  // Distinguish icon / illus based on scene
  let url: string;
  if (scene === 'icon') {
    url = `https://api.iconify.design/${data}.svg`;
  } else {
    url = `https://raw.githubusercontent.com/your-org/illustrations/main/${data}.svg`;
  }

  // Fetch resource and convert to standard resource object
  const response = await fetch(url);
  const svgString = await response.text();
  return loadSVGResource(svgString);
});

const result = await renderToSVG({ input: syntax });
```

## Notes

1. **Async Resources**: Icons and illustrations are automatically preloaded in non-browser mode to ensure complete rendering results
2. **Embedded Resources**: Exported SVG embeds all resources by default and can be used directly
3. **Editor Mode**: Editor functionality is automatically disabled in non-browser rendering
4. **Runtime**: Requires Node.js 16+
