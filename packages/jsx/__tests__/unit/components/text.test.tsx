/** @jsxImportSource @antv/infographic-jsx */
import { minifySvg } from '@@/utils';
import { renderSVG, Text } from '@antv/infographic-jsx';
import { describe, expect, it } from 'vitest';

describe('Text', () => {
  it('should render a simple text element', () => {
    const text = (
      <Text width={100} height={50}>
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50">
    <text fill="black" font-size="14" text-anchor="start" dominant-baseline="hanging" data-text-alignment="LEFT TOP" width="100" height="50">Hello World</text>
  </g>
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50">
    <text fill="red" font-size="12" text-anchor="start" dominant-baseline="hanging" data-text-alignment="LEFT TOP" line-height="1.2" data-word-wrap="true" width="100" height="50" font-family="Arial" font-style="italic" font-weight="bold" text-decoration="underline" letter-spacing="2" word-spacing="4" opacity="0.8">Hello World</text>
  </g>
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
        alignVertical="center"
      >
        Hello World
      </Text>
    );

    expect(renderSVG(text)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50">
    <text x="50" y="25" fill="black" font-size="14" text-anchor="middle" dominant-baseline="central" data-text-alignment="CENTER CENTER" width="100" height="50">Hello World</text>
  </g>
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50">
    <text x="100" y="50" fill="black" font-size="14" text-anchor="end" dominant-baseline="text-after-edge" data-text-alignment="RIGHT BOTTOM" width="100" height="50">Hello World</text>
  </g>
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
    <rect width="100" height="50" fill="red" fill-opacity="1" rx="0" ry="0" />
    <text fill="black" font-size="14" text-anchor="start" dominant-baseline="hanging" data-text-alignment="LEFT TOP" width="100" height="50">Hello World</text>
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
    <rect width="100" height="50" fill="blue" fill-opacity="0.5" rx="0" ry="0" />
    <text fill="black" font-size="14" text-anchor="start" dominant-baseline="hanging" data-text-alignment="LEFT TOP" width="100" height="50">Hello World</text>
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
    <rect width="100" height="50" fill="green" fill-opacity="1" rx="10" ry="10" />
    <text fill="black" font-size="14" text-anchor="start" dominant-baseline="hanging" data-text-alignment="LEFT TOP" width="100" height="50">Hello World</text>
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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50">
  <g width="100" height="50" id="my-text">
    <text fill="black" font-size="14" text-anchor="start" dominant-baseline="hanging" data-text-alignment="LEFT TOP" width="100" height="50" id="my-text-text">Hello World</text>
  </g>
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
    <rect width="100" height="50" fill="yellow" fill-opacity="1" rx="0" ry="0" id="my-text-bounds" />
    <text fill="black" font-size="14" text-anchor="start" dominant-baseline="hanging" data-text-alignment="LEFT TOP" width="100" height="50" id="my-text-text">Hello World</text>
  </g>
</svg>
`),
    );
  });
});
