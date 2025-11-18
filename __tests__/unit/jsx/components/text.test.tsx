/** @jsxImportSource ../../../../src */
import { describe, expect, it } from 'vitest';
import { renderSVG, Text } from '../../../../src';
import { minifySvg } from '../../../utils';

describe('Text', () => {
  it('should render a simple text element', () => {
    const text = (
      <Text width={100} height={50}>
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 12.32 100 50">
 <text width="100" height="50" data-element-type="text" y="12.32" fill="black" font-size="14" text-anchor="start" dominant-baseline="baseline" data-text-alignment="LEFT TOP">Hello World</text>
</svg>
`),
    );
  });

  it('should render text with attributes', () => {
    const text = (
      <Text
        width={100}
        height={50}
        fill="red"
        fontSize={12}
        fontFamily="Arial"
        fontStyle="italic"
        fontWeight="bold"
        textDecoration="underline"
        letterSpacing={2}
        wordSpacing={4}
        opacity={0.8}
        lineHeight={1.2}
        wordWrap={true}
      >
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 11.76 100 50">
  <text width="100" height="50" data-element-type="text" y="11.76" fill="red" font-size="12" text-anchor="start" dominant-baseline="baseline" data-text-alignment="LEFT TOP" line-height="1.2" data-word-wrap="true" font-family="Arial" font-style="italic" font-weight="bold" text-decoration="underline" letter-spacing="2" word-spacing="4" opacity="0.8">Hello World</text>
</svg>
`),
    );
  });

  it('should render a simple text in center alignment', () => {
    const text = (
      <Text
        width={100}
        height={50}
        alignHorizontal="center"
        alignVertical="middle"
      >
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="50 25 100 50">
  <text width="100" height="50" data-element-type="text" x="50" y="25" fill="black" font-size="14" text-anchor="middle" dominant-baseline="central" data-text-alignment="CENTER MIDDLE">Hello World</text>
</svg>
`),
    );
  });

  it('should render a simple text in right bottom alignment', () => {
    const text = (
      <Text
        width={100}
        height={50}
        alignHorizontal="right"
        alignVertical="bottom"
      >
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="100 50 100 50">
  <text width="100" height="50" data-element-type="text" x="100" y="50" fill="black" font-size="14" text-anchor="end" dominant-baseline="baseline" data-text-alignment="RIGHT BOTTOM">Hello World</text>
</svg>
`),
    );
  });

  it('should render a simple text with background color', () => {
    const text = (
      <Text width={100} height={50} backgroundColor="red">
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50">
    <rect data-element-type="shape" width="100" height="50" fill="red" fill-opacity="1" rx="0" ry="0" />
    <text data-element-type="text" y="12.32" width="100" height="50" fill="black" font-size="14" text-anchor="start" dominant-baseline="baseline" data-text-alignment="LEFT TOP">Hello World</text>
  </g>
</svg>
`),
    );
  });

  it('should render text with background opacity', () => {
    const text = (
      <Text
        width={100}
        height={50}
        backgroundColor="blue"
        backgroundOpacity={0.5}
      >
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50">
    <rect data-element-type="shape" width="100" height="50" fill="blue" fill-opacity="0.5" rx="0" ry="0" />
    <text data-element-type="text" y="12.32" width="100" height="50" fill="black" font-size="14" text-anchor="start" dominant-baseline="baseline" data-text-alignment="LEFT TOP">Hello World</text>
  </g>
</svg>
`),
    );
  });

  it('should render text with rounded background', () => {
    const text = (
      <Text
        width={100}
        height={50}
        backgroundColor="green"
        backgroundRadius={10}
      >
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50">
    <rect data-element-type="shape" width="100" height="50" fill="green" fill-opacity="1" rx="10" ry="10" />
    <text data-element-type="text" y="12.32" width="100" height="50" fill="black" font-size="14" text-anchor="start" dominant-baseline="baseline" data-text-alignment="LEFT TOP">Hello World</text>
  </g>
</svg>
`),
    );
  });

  it('should render text with id', () => {
    const text = (
      <Text id="my-text" width={100} height={50}>
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 12.32 100 50">
  <text width="100" height="50" id="my-text" data-element-type="text" y="12.32" fill="black" font-size="14" text-anchor="start" dominant-baseline="baseline" data-text-alignment="LEFT TOP">Hello World</text>
</svg>
`),
    );
  });

  it('should render text with id and background', () => {
    const text = (
      <Text id="my-text" width={100} height={50} backgroundColor="yellow">
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50" id="my-text">
    <rect data-element-type="shape" width="100" height="50" fill="yellow" fill-opacity="1" rx="0" ry="0" />
    <text data-element-type="text" y="12.32" width="100" height="50" fill="black" font-size="14" text-anchor="start" dominant-baseline="baseline" data-text-alignment="LEFT TOP">Hello World</text>
  </g>
</svg>
`),
    );
  });
});
