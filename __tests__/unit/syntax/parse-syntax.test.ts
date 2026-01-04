import { describe, expect, it } from 'vitest';
import { parseSyntax } from '../../../src/syntax';

describe('parseSyntax', () => {
  it('parses arrays and preserves string values with spaces', () => {
    const input = `
infographic
theme
  palette #f00 #0f0 #00f
data
  desc Q1 Growth Highlights
  items
    - label MAU
      value 12.3
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.palette).toEqual([
      '#f00',
      '#0f0',
      '#00f',
    ]);
    expect(result.options.data?.desc).toBe('Q1 Growth Highlights');
    expect(result.options.data?.items?.[0]).toMatchObject({
      label: 'MAU',
      value: 12.3,
    });
  });

  it('reports schema mismatch without breaking parsing', () => {
    const input = `
data
  desc
    - hello
    - world
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.options.data?.items?.[0]?.label).toBe('A');
    expect(
      result.errors.some(
        (error) =>
          error.code === 'schema_mismatch' && error.path === 'data.desc',
      ),
    ).toBe(true);
  });

  it('allows custom properties on data items', () => {
    const input = `
data
  items
    - label A
      time 1996
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.data?.items?.[0]).toMatchObject({
      label: 'A',
      time: 1996,
    });
  });

  it('uses infographic shorthand for template and merges blocks', () => {
    const input = `
infographic sales-dashboard
  data
    items
      - label Revenue
`;
    const result = parseSyntax(input);
    expect(result.options.template).toBe('sales-dashboard');
    expect(result.options.data?.items?.[0]?.label).toBe('Revenue');
  });

  it('uses first-line template shorthand when the name is registered', () => {
    const input = `
list-row-horizontal-icon-arrow
data
  items
    - label Step 1
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.template).toBe('list-row-horizontal-icon-arrow');
    expect(result.options.data?.items?.[0]?.label).toBe('Step 1');
  });

  it('skip first-line template shorthand when the name is not registered', () => {
    const input = `
unknown-template-name
data
  items
    - label Step 1
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(1);
    expect(result.options.template).toBeUndefined();
  });

  it('parses nested data and design/theme shorthand', () => {
    const input = `
infographic sales-dashboard
theme
  palette
    - #f00
    - #0f0
  colorBg #000
  stylize rough
    roughness 0.3
design
  structure sequence-timeline
    gap 12
    showIcon true
  item compact-card
data
  title Q1
  desc Stream syntax demo
  items
    - label MAU
      value 12.3
      children
        - label Revenue
          value 4.5
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.template).toBe('sales-dashboard');
    expect(result.options.themeConfig?.palette).toEqual(['#f00', '#0f0']);
    expect(result.options.themeConfig?.colorBg).toBe('#000');
    expect(result.options.themeConfig?.stylize).toMatchObject({
      type: 'rough',
      roughness: 0.3,
    });
    expect(result.options.design?.structure).toMatchObject({
      type: 'sequence-timeline',
      gap: 12,
      showIcon: true,
    });
    expect(result.options.data?.items?.[0]?.children?.[0]).toMatchObject({
      label: 'Revenue',
      value: 4.5,
    });
  });

  it('treats # and // as content, overrides repeated blocks, and reports unknown keys', () => {
    const input = `
width 100 # comment
foo bar
theme
  palette #f00
theme
  colorPrimary #0f0
data
  desc http://example.com // trailing comment
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.options.width).toBe(100);
    expect(result.options.themeConfig?.colorPrimary).toBe('#0f0');
    expect(result.options.themeConfig?.palette).toBeUndefined();
    expect(result.options.data?.desc).toBe(
      'http://example.com // trailing comment',
    );
    expect(
      result.errors.some(
        (error) => error.code === 'unknown_key' && error.path === 'foo',
      ),
    ).toBe(true);
  });

  it('parses palette name strings when a single inline value is provided', () => {
    const input = `
theme
  palette antv
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.palette).toBe('antv');
  });

  it('treats single inline hex colors as palette arrays', () => {
    const input = `
theme
  palette #ff00aa
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.palette).toEqual(['#ff00aa']);
  });

  it('treats single inline rgb colors as palette arrays', () => {
    const input = `
theme
  palette rgba(255, 0, 0, 0.5)
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.palette).toEqual([
      'rgba(255, 0, 0, 0.5)',
    ]);
  });

  it('treats yaml-style palette lists as arrays even with one item', () => {
    const input = `
theme
  palette
    - #abcdef
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.palette).toEqual(['#abcdef']);
  });

  it('drops invalid theme color values and reports errors', () => {
    const input = `
theme
  colorBg #1
  colorPrimary #00ff99
`;
    const result = parseSyntax(input);
    expect(result.options.themeConfig?.colorBg).toBeUndefined();
    expect(result.options.themeConfig?.colorPrimary).toBe('#00ff99');
    expect(
      result.errors.some(
        (error) =>
          error.code === 'invalid_value' && error.path === 'theme.colorBg',
      ),
    ).toBe(true);
  });

  it('filters invalid palette entries but keeps valid ones', () => {
    const input = `
theme
  palette #0ff #0f0 #1
`;
    const result = parseSyntax(input);
    expect(result.options.themeConfig?.palette).toEqual(['#0ff', '#0f0']);
    expect(
      result.errors.some(
        (error) =>
          error.code === 'invalid_value' && error.path === 'theme.palette[2]',
      ),
    ).toBe(true);
  });

  it('parses theme base text colors', () => {
    const input = `
theme
  base
    text
      fill #123456
      stroke #1
    shape
      fill red
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.base?.text?.fill).toBe('#123456');
    expect(result.options.themeConfig?.base?.text?.stroke).toBeUndefined();
    expect(result.options.themeConfig?.base?.shape?.fill).toBe('red');
  });

  it('parses template block shorthand and width string values', () => {
    const input = `
template sales-dashboard
width 100%
data
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.template).toBe('sales-dashboard');
    expect(result.options.width).toBe('100%');
  });

  it('treats block order as irrelevant', () => {
    const inputA = `
infographic sales-dashboard
theme
  colorPrimary #0f0
design
  structure sequence-timeline
    gap 12
data
  title Q1
  items
    - label A
width 100
height 200
`;
    const inputB = `
height 200
data
  title Q1
  items
    - label A
design
  structure sequence-timeline
    gap 12
theme
  colorPrimary #0f0
infographic sales-dashboard
width 100
`;
    const resultA = parseSyntax(inputA);
    const resultB = parseSyntax(inputB);
    expect(resultA.errors).toHaveLength(0);
    expect(resultB.errors).toHaveLength(0);
    expect(resultA.options).toEqual(resultB.options);
  });

  it('overrides repeated blocks with the last definition', () => {
    const input = `
template alpha
template beta
data
  items
    - label First
data
  desc Second
design
  structure timeline
design
  item compact-card
    showIcon true
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.template).toBe('beta');
    expect(result.options.data?.desc).toBe('Second');
    expect(result.options.data?.items).toBeUndefined();
    expect(result.options.design?.structure).toBeUndefined();
    expect(result.options.design?.item).toMatchObject({
      type: 'compact-card',
      showIcon: true,
    });
  });

  it('parses colon/equals separators and root keys without indent', () => {
    const input = `
infographic
width:100
height=200
data
  items
    - label A
      value 1
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.width).toBe(100);
    expect(result.options.height).toBe(200);
    expect(result.options.data?.items?.[0]).toMatchObject({
      label: 'A',
      value: 1,
    });
  });

  it('accepts width separators with and without spaces', () => {
    const cases = [
      { input: 'width 100', expected: 100 },
      { input: 'width:100', expected: 100 },
      { input: 'width: 110', expected: 110 },
      { input: 'width = 120', expected: 120 },
      { input: 'width=130', expected: 130 },
    ];
    cases.forEach(({ input, expected }) => {
      const result = parseSyntax(`${input}\n`);
      expect(result.errors).toHaveLength(0);
      expect(result.options.width).toBe(expected);
    });
  });

  it('accepts separators in nested objects and list items', () => {
    const input = `
data
  title: Q1
  desc=Hello
  items
    - label: A
      value=1
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.data?.title).toBe('Q1');
    expect(result.options.data?.desc).toBe('Hello');
    expect(result.options.data?.items?.[0]).toMatchObject({
      label: 'A',
      value: 1,
    });
  });

  it('parses tab indentation', () => {
    const input = `infographic
\tdata
\t\titems
\t\t\t- label A
\t\t\t  value 1
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.data?.items?.[0]).toMatchObject({
      label: 'A',
      value: 1,
    });
  });

  it('parses comma-separated and JSON-style arrays', () => {
    const input = `
theme
  palette #f00, #0f0, #00f
data
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.palette).toEqual([
      '#f00',
      '#0f0',
      '#00f',
    ]);
  });

  it('parses bracket array values', () => {
    const input = `
theme
  palette [#f00, #0f0]
data
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.palette).toEqual(['#f00', '#0f0']);
  });

  it('ignores incomplete bracket arrays in streaming output', () => {
    const input = `
theme
  colorBg #000
  palette [#f00
data
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.options.themeConfig?.colorBg).toBe('#000');
    expect(result.options.themeConfig?.palette).toBeUndefined();
    expect(result.options.data?.items?.[0]?.label).toBe('A');
  });

  it('keeps values with # or // when not treated as comments', () => {
    const input = `
theme
  colorPrimary #ff0
data
  desc Q1#Growth http://example.com//foo
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.colorPrimary).toBe('#ff0');
    expect(result.options.data?.desc).toBe('Q1#Growth http://example.com//foo');
  });

  it('parses numeric values with trailing # or // content', () => {
    const input = `
width 100#comment
data
  items
    - label A
      value 12.3//comment
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.width).toBe(100);
    expect(result.options.data?.items?.[0]?.value).toBe(12.3);
  });

  it('supports template/theme full shorthand forms', () => {
    const input = `
template
  type sales-dashboard
theme theme-name
data
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.template).toBe('sales-dashboard');
    expect(result.options.theme).toBe('theme-name');
  });

  it('parses theme base/title/desc blocks with custom fields', () => {
    const input = `
theme
  title
    font-family Alibaba PuHuiTi
    fill pink
  desc
    lineHeight 1.2
  base
    global
      opacity 0.5
    shape
      radius 4
    text
      fontSize 12
data
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.themeConfig?.title).toMatchObject({
      'font-family': 'Alibaba PuHuiTi',
      fill: 'pink',
    });
    expect(result.options.themeConfig?.desc).toMatchObject({
      lineHeight: 1.2,
    });
    expect(result.options.themeConfig?.base).toMatchObject({
      global: { opacity: 0.5 },
      shape: { radius: 4 },
      text: { fontSize: 12 },
    });
  });

  it('parses design item/title blocks with shorthand types', () => {
    const input = `
design
  item compact-card
    showIcon true
  title default
    align center
  structure sequence-timeline
    gap 12
data
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(result.errors).toHaveLength(0);
    expect(result.options.design?.item).toMatchObject({
      type: 'compact-card',
      showIcon: true,
    });
    expect(result.options.design?.title).toMatchObject({
      type: 'default',
      align: 'center',
    });
    expect(result.options.design?.structure).toMatchObject({
      type: 'sequence-timeline',
      gap: 12,
    });
  });

  it('reports invalid enum/number values but keeps parsing later blocks', () => {
    const input = `
theme
  stylize
    type triangle
    roughness abc
data
  items
    - label A
`;
    const result = parseSyntax(input);
    expect(
      result.errors.some(
        (error) =>
          error.code === 'invalid_value' && error.path === 'theme.stylize.type',
      ),
    ).toBe(true);
    expect(
      result.errors.some(
        (error) =>
          error.code === 'invalid_value' &&
          error.path === 'theme.stylize.roughness',
      ),
    ).toBe(true);
    expect(result.options.data?.items?.[0]?.label).toBe('A');
  });

  it('reports unknown nested keys but allows unknown in design/theme objects', () => {
    const input = `
data
  foo bar
design
  structure
    custom alpha
theme
  title
    customFont 12
`;
    const result = parseSyntax(input);
    expect(
      result.errors.some(
        (error) => error.code === 'unknown_key' && error.path === 'data.foo',
      ),
    ).toBe(true);
    expect(
      result.errors.some(
        (error) =>
          error.code === 'unknown_key' &&
          error.path === 'design.structure.custom',
      ),
    ).toBe(false);
    expect(
      result.errors.some(
        (error) =>
          error.code === 'unknown_key' &&
          error.path === 'theme.title.customFont',
      ),
    ).toBe(false);
  });

  it('reports array/object mismatches while still parsing later blocks', () => {
    const input = `
data
  items
    label A
theme
  colorBg #000
`;
    const result = parseSyntax(input);
    expect(
      result.errors.some(
        (error) =>
          error.code === 'schema_mismatch' && error.path === 'data.items',
      ),
    ).toBe(true);
    expect(result.options.themeConfig?.colorBg).toBe('#000');
  });

  it('reports bad list or syntax but keeps parsing later blocks', () => {
    const input = `
- label Oops
data
  items
    - label OK
    foo bar
theme
  colorBg #000
`;
    const result = parseSyntax(input);
    expect(result.errors.some((error) => error.code === 'bad_list')).toBe(true);
    expect(result.errors.some((error) => error.code === 'bad_syntax')).toBe(
      true,
    );
    expect(result.options.data?.items?.[0]?.label).toBe('OK');
    expect(result.options.themeConfig?.colorBg).toBe('#000');
  });
});
