import { describe, expect, it } from 'vitest';
import { renderToSVG } from '../../../src/ssr';
import { getPalette } from '../../../src/renderer/palettes';

describe('SSR Renderer', () => {
  it('should failed with unknown_key', async () => {
    const syntax = `infograph template
data
  items
    - label Step 1`;

    const result = await renderToSVG({
      input: syntax,
    });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].code).toBe('unknown_key');
  });
  it('should failed with bad syntax', async () => {
    const syntax = `infographic template
data
items
  - label Step 1`;

    const result = await renderToSVG({
      input: syntax,
    });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].code).toBe('unknown_key');
  });
  it('should failed with no template', async () => {
    const syntax = `
data
  items
    - label Step 1`;

    const result = await renderToSVG({
      input: syntax,
    });
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe('No template specified');
  });
  it('should handle unknown template', async () => {
    const syntax = `infographic unknown-template
data
  items
    - label Step 1
      desc Start`;

    const result = await renderToSVG({
      input: syntax,
    });
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors.some((error) => error.message === 'No such template: unknown-template')).toBe(true);
  });

  it('should render simple syntax to SVG', async () => {
    const result = await renderToSVG({
      input: `infographic list-row-simple-horizontal-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete`,
    });
    expect(result.errors).toHaveLength(0);
    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('Step 1</span>');
    expect(result.svg).toContain('Step 2</span>');
    expect(result.svg).toContain('Step 3</span>');
  });

  it('should handle invalid syntax and return errors', async () => {
    const result = await renderToSVG({
      input: 'invalid syntax....',
    });

    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should accept options object', async () => {
    const result = await renderToSVG({
      input: `infographic list-row-simple-horizontal-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress`,
      options: {
        // Additional options can be passed here
        themeConfig: {
          palette: getPalette('spectral'),
        },
      },
    });

    expect(result.svg).toContain('<svg');
    expect(result.errors).toHaveLength(0);
  });

  it('should render Chinese characters correctly', async () => {
    const result = await renderToSVG({
      input: `infographic list-row-simple-horizontal-arrow
data
  items
    - label 步骤 1
      desc 开始
    - label 步骤 2
      desc 进行中
    - label 步骤 3
      desc 完成`,
    });

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('步骤 1</span>');
    expect(result.svg).toContain('步骤 2</span>');
    expect(result.svg).toContain('步骤 3</span>');
    expect(result.errors).toHaveLength(0);
  });

  it('should return warnings when present', async () => {
    const result = await renderToSVG({
      input: `infographic list-row-simple-horizontal-arrow
data
  items
    - label Test`,
    });

    expect(result.svg).toContain('<svg');
    // Warnings should be captured if any
    expect(Array.isArray(result.warnings)).toBe(true);
  });

  it('should render text content correctly using textContent in SSR', async () => {
    const result = await renderToSVG({
      input: `infographic list-row-simple-horizontal-arrow
data
  title Main Title
  desc Description text
  items
    - label Item 1
      desc First item
    - label Item 2
      desc Second item`,
    });

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('Item 1');
    expect(result.svg).toContain('Item 2');
    expect(result.svg).toContain('First item');
    expect(result.svg).toContain('Second item');
    expect(result.errors).toHaveLength(0);
  });

  it('should handle special characters and Unicode in text', async () => {
    const result = await renderToSVG({
      input: `infographic list-row-simple-horizontal-arrow
data
  items
    - label 特殊字符 < > &
      desc Test
    - label Emoji 😀🎉
      desc Unicode`,
    });

    expect(result.svg).toContain('<svg');
    // Special characters should be properly escaped in XML/SVG
    expect(result.svg).toContain('特殊字符 &lt; &gt; &amp;');
    expect(result.svg).toContain('Emoji 😀🎉');
    expect(result.errors).toHaveLength(0);
  });

  it('should place xmlns on span element', async () => {
    const result = await renderToSVG({
      input: `infographic list-row-simple-horizontal-arrow
data
  items
    - label Test Text`,
    });

    expect(result.errors).toHaveLength(0);
    const parser = new DOMParser();
    const doc = parser.parseFromString(result.svg, 'image/svg+xml');
    const foreignObject = doc.querySelector('foreignObject');
    expect(foreignObject).toBeDefined();
    const span = foreignObject!.querySelector('span');
    expect(span).toBeDefined();
    expect(span!.namespaceURI).toBe('http://www.w3.org/1999/xhtml');
  });
});
