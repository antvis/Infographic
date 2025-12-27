import { describe, expect, it } from 'vitest';
import { renderToSVG } from '../../../src/ssr';
import { parseSyntax } from '../../../src/syntax';

describe('SSR Renderer', () => {
  it('should parse syntax correctly', () => {
    const syntax = `infographic list-row-simple-horizontal-arrow
data
  items
    - label Step 1
      desc Start
    - label Step 2
      desc In Progress
    - label Step 3
      desc Complete`;

    const parseResult = parseSyntax(syntax);
    expect(parseResult.errors).toHaveLength(0);
    expect(parseResult.options.data?.items).toBeDefined();
    expect(parseResult.options.data?.items?.length).toBe(3);
    expect(parseResult.options.data?.items?.[0].label).toBe('Step 1');
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

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('Step 1');
    expect(result.errors).toHaveLength(0);
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
    expect(result.svg).toContain('步骤 1');
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
    - label 特殊字符 < > & "
      desc Test
    - label Emoji 😀🎉
      desc Unicode`,
    });

    expect(result.svg).toContain('<svg');
    expect(result.svg).toContain('特殊字符');
    expect(result.svg).toContain('Emoji');
    expect(result.errors).toHaveLength(0);
  });
});
