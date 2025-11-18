/** @jsxImportSource ../../../src */
import { describe, expect, it } from 'vitest';
import { Defs, Rect, renderSVG } from '../../../src';
import { minifySvg } from '../../utils';

describe('defs element', () => {
  it('should collect defs content and render correctly', () => {
    const Element = () => {
      return (
        <>
          <Defs>
            <linearGradient id="linear-color" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff0000" />
              <stop offset="100%" stop-color="#0000ff" />
            </linearGradient>
          </Defs>
          <Rect fill="url(#linear-color)" width={100} height={100} />
        </>
      );
    };

    expect(renderSVG(<Element />)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="linear-color" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff0000" />
      <stop offset="100%" stop-color="#0000ff" />
    </linearGradient>
  </defs>
  <rect fill="url(#linear-color)" width="100" height="100" />
</svg>`),
    );
  });

  it('should handle multiple defs with different definitions', () => {
    const Element = () => {
      return (
        <>
          <Defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff0000" />
              <stop offset="100%" stop-color="#0000ff" />
            </linearGradient>
            <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00ff00" />
              <stop offset="100%" stop-color="#ffff00" />
            </radialGradient>
          </Defs>
          <Rect fill="url(#gradient1)" width={50} height={50} />
          <Rect fill="url(#gradient2)" x={60} width={50} height={50} />
        </>
      );
    };

    expect(renderSVG(<Element />)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 50">
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff0000" />
      <stop offset="100%" stop-color="#0000ff" />
    </linearGradient>
    <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00ff00" />
      <stop offset="100%" stop-color="#ffff00" />
    </radialGradient>
  </defs>
  <rect fill="url(#gradient1)" width="50" height="50" />
  <rect fill="url(#gradient2)" x="60" width="50" height="50" />
</svg>`),
    );
  });

  it('should handle defs with patterns', () => {
    const Element = () => {
      return (
        <>
          <Defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="3" fill="#000" />
            </pattern>
          </Defs>
          <Rect fill="url(#dots)" width={100} height={60} />
        </>
      );
    };

    expect(renderSVG(<Element />)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60">
  <defs>
    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="3" fill="#000" />
    </pattern>
  </defs>
  <rect fill="url(#dots)" width="100" height="60" />
</svg>`),
    );
  });

  it('should handle defs with filters', () => {
    const Element = () => {
      return (
        <>
          <Defs>
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </Defs>
          <Rect fill="red" filter="url(#blur)" width={80} height={80} />
        </>
      );
    };

    expect(renderSVG(<Element />)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">
  <defs>
    <filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
    </filter>
  </defs>
  <rect fill="red" filter="url(#blur)" width="80" height="80" />
</svg>`),
    );
  });

  it('should handle defs with clipPath', () => {
    const Element = () => {
      return (
        <>
          <Defs>
            <clipPath id="clip">
              <circle cx="50" cy="50" r="40" />
            </clipPath>
          </Defs>
          <Rect fill="blue" clipPath="url(#clip)" width={100} height={100} />
        </>
      );
    };

    expect(renderSVG(<Element />)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <clipPath id="clip">
      <circle cx="50" cy="50" r="40" />
    </clipPath>
  </defs>
  <rect fill="blue" clip-path="url(#clip)" width="100" height="100" />
</svg>`),
    );
  });

  it('should handle empty defs', () => {
    const Element = () => {
      return (
        <>
          <Defs></Defs>
          <Rect fill="green" width={50} height={50} />
        </>
      );
    };

    expect(renderSVG(<Element />)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <rect fill="green" width="50" height="50" />
</svg>`),
    );
  });

  it('should handle multiple defs elements', () => {
    const Element = () => {
      return (
        <>
          <Defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#ff0000" />
              <stop offset="100%" stop-color="#0000ff" />
            </linearGradient>
          </Defs>
          <Defs>
            <pattern
              id="pattern1"
              x="0"
              y="0"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <rect width="5" height="5" fill="#000" />
            </pattern>
          </Defs>
          <Rect fill="url(#grad1)" width={50} height={30} />
          <Rect fill="url(#pattern1)" x={60} width={50} height={30} />
        </>
      );
    };

    expect(renderSVG(<Element />)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 30">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff0000" />
      <stop offset="100%" stop-color="#0000ff" />
    </linearGradient>
    <pattern id="pattern1" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
      <rect width="5" height="5" fill="#000" />
    </pattern>
  </defs>
  <rect fill="url(#grad1)" width="50" height="30" />
  <rect fill="url(#pattern1)" x="60" width="50" height="30" />
</svg>`),
    );
  });
});
