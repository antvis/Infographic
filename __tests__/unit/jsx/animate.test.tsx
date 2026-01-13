/** @jsxImportSource ../../../src */
import { describe, expect, it } from 'vitest';
import { Path, Rect, renderSVG } from '../../../src';

describe('SVG Animation Support', () => {
  it('should support animate element for simple animations', () => {
    const element = (
      <Rect width={100} height={100} fill="blue">
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur="2s"
          repeatCount="indefinite"
        />
      </Rect>
    );

    const svg = renderSVG(element);
    expect(svg).toContain('<animate');
    expect(svg).toContain('attributeName="opacity"');
    expect(svg).toContain('values="0;1;0"');
    expect(svg).toContain('dur="2s"');
    expect(svg).toContain('repeatCount="indefinite"');
  });

  it('should support strokeDasharray animation for line dash effect', () => {
    const element = (
      <Path
        d="M 10,30 A 20,20 0,0,1 50,30 A 20,20 0,0,1 90,30"
        stroke="blue"
        strokeWidth={3}
        fill="none"
        strokeDasharray="10,5"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="30"
          dur="1s"
          repeatCount="indefinite"
        />
      </Path>
    );

    const svg = renderSVG(element);
    expect(svg).toContain('stroke-dasharray="10,5"');
    expect(svg).toContain('<animate');
    expect(svg).toContain('attributeName="stroke-dashoffset"');
    expect(svg).toContain('from="0"');
    expect(svg).toContain('to="30"');
  });

  it('should support animateTransform for rotation', () => {
    const element = (
      <Rect width={50} height={50} x={25} y={25} fill="red">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="3s"
          repeatCount="indefinite"
        />
      </Rect>
    );

    const svg = renderSVG(element);
    expect(svg).toContain('<animateTransform');
    expect(svg).toContain('attributeName="transform"');
    expect(svg).toContain('type="rotate"');
    expect(svg).toContain('from="0 50 50"');
    expect(svg).toContain('to="360 50 50"');
  });

  it('should support multiple animations on single element', () => {
    const element = (
      <Rect width={100} height={100} fill="green">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill"
          values="green;blue;green"
          dur="3s"
          repeatCount="indefinite"
        />
      </Rect>
    );

    const svg = renderSVG(element);
    const animateCount = (svg.match(/<animate/g) || []).length;
    expect(animateCount).toBe(2);
  });

  it('should render complete dash animation example', () => {
    const element = (
      <Path
        d="M 10,50 L 190,50"
        stroke="#1890ff"
        strokeWidth={4}
        fill="none"
        strokeDasharray="20,10"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="30"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </Path>
    );

    const svg = renderSVG(element);
    expect(svg).toContain('<path');
    expect(svg).toContain('stroke-dasharray="20,10"');
    expect(svg).toContain('<animate');
    expect(svg).toContain('attributeName="stroke-dashoffset"');
    expect(svg).toContain('from="0"');
    expect(svg).toContain('to="30"');
    expect(svg).toContain('dur="0.8s"');
    expect(svg).toContain('repeatCount="indefinite"');
  });
});
