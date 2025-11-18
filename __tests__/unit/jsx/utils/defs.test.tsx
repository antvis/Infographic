/** @jsxImportSource ../../../../src */
import { describe, expect, it } from 'vitest';
import { Defs, Group, Rect, renderSVG } from '../../../../src';
import { minifySvg } from '../../../utils';

describe('jsx use defs', () => {
  it('use defs', () => {
    const Node = () => {
      return (
        <>
          <Defs>
            <linearGradient id="myGradient" gradientTransform="rotate(90)">
              <stop offset="5%" stop-color="gold" />
              <stop offset="95%" stop-color="red" />
            </linearGradient>
          </Defs>
          <Rect width={100} height={100} fill="url(#myGradient)" />
        </>
      );
    };

    const svg = renderSVG(<Node />);
    expect(svg).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="myGradient" gradientTransform="rotate(90)">
      <stop offset="5%" stop-color="gold" />
      <stop offset="95%" stop-color="red" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" fill="url(#myGradient)" />
</svg>
`),
    );
  });

  it('multiple defs', () => {
    const Node = () => {
      return (
        <>
          <Defs>
            <linearGradient id="myGradient" gradientTransform="rotate(90)">
              <stop offset="5%" stop-color="gold" />
              <stop offset="95%" stop-color="red" />
            </linearGradient>
            <clipPath id="myClip">
              <circle cx="50" cy="50" r="40" />
            </clipPath>
          </Defs>
          <Rect
            width={100}
            height={100}
            fill="url(#myGradient)"
            clip-path="url(#myClip)"
          />
        </>
      );
    };

    const svg = renderSVG(<Node />);
    expect(svg).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="myGradient" gradientTransform="rotate(90)">
      <stop offset="5%" stop-color="gold" />
      <stop offset="95%" stop-color="red" />
    </linearGradient>
    <clipPath id="myClip">
      <circle cx="50" cy="50" r="40" />
    </clipPath>
  </defs>
  <rect width="100" height="100" fill="url(#myGradient)" clip-path="url(#myClip)" />
</svg>
`),
    );
  });

  it('multiple nodes with defs', () => {
    const Node1 = () => {
      return (
        <>
          <Defs>
            <linearGradient id="myGradient" gradientTransform="rotate(90)">
              <stop offset="5%" stop-color="gold" />
              <stop offset="95%" stop-color="red" />
            </linearGradient>
          </Defs>
          <Rect width={100} height={100} fill="url(#myGradient)" />
        </>
      );
    };

    const Node2 = () => {
      return (
        <>
          <Defs>
            <clipPath id="myClip">
              <circle cx="50" cy="50" r="40" />
            </clipPath>
          </Defs>
          <Rect
            y={100}
            width={100}
            height={100}
            fill="url(#myGradient)"
            clip-path="url(#myClip)"
          />
        </>
      );
    };

    const Container = () => {
      return (
        <Group>
          <Node1 />
          <Node2 />
        </Group>
      );
    };

    expect(renderSVG(<Container />)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
  <defs>
    <linearGradient id="myGradient" gradientTransform="rotate(90)">
      <stop offset="5%" stop-color="gold" />
      <stop offset="95%" stop-color="red" />
    </linearGradient>
    <clipPath id="myClip">
      <circle cx="50" cy="50" r="40" />
    </clipPath>
  </defs>
  <g>
    <rect width="100" height="100" fill="url(#myGradient)" />
    <rect y="100" width="100" height="100" fill="url(#myGradient)" clip-path="url(#myClip)" />
  </g>
</svg>
`),
    );
  });
});
