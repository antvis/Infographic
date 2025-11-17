/** @jsxImportSource @antv/infographic-jsx */
import { minifySvg } from '@@/utils';
import {
  Ellipse,
  Group,
  GroupProps,
  Rect,
  Text,
  cloneElement,
  createLayout,
  getElementBounds,
  getElementsBounds,
  renderSVG,
} from '@antv/infographic-jsx';
import { describe, expect, it } from 'vitest';

describe('jsx layout components', () => {
  interface HorizontalLayoutProps extends GroupProps {
    gap?: number;
  }

  const HorizontalLayout = createLayout<HorizontalLayoutProps>(
    (children, { gap = 10, ...props }) => {
      let currentX = 0;
      const layoutedChildren = children.map((child) => {
        const bounds = getElementBounds(child);
        const cloned = cloneElement(child, { x: currentX });
        currentX += bounds.width + gap;
        return cloned;
      });

      if (!props.width || !props.height) {
        const totalBounds = getElementsBounds(layoutedChildren);
        props.x ??= totalBounds.x;
        props.y ??= totalBounds.y;
        props.width ??= totalBounds.width;
        props.height ??= totalBounds.height;
      }
      return <Group {...props}>{layoutedChildren}</Group>;
    },
  );

  it('simple layout', () => {
    const Node = () => (
      <HorizontalLayout y={10}>
        <Rect width={30} height={40} fill="red" strokeWidth={10} />
        <Ellipse width={50} height={50} fill="blue" />
      </HorizontalLayout>
    );
    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 10 90 50">
  <g y="10" x="0" width="90" height="50" transform="translate(0, 10)">
    <rect width="30" height="40" fill="red" stroke-width="10" x="0" />
    <ellipse width="50" height="50" fill="blue" x="40" cx="65" cy="25" rx="25" ry="25" />
  </g>
</svg>`,
      ),
    );
  });

  it('nest layout', () => {
    const Node = () => (
      <HorizontalLayout>
        <HorizontalLayout y={10}>
          <Rect width={30} height={40} fill="red" strokeWidth={10} />
          <Ellipse width={50} height={50} fill="blue" />
        </HorizontalLayout>
        <Rect width={50} height={50} fill="pink" strokeWidth={10} />
      </HorizontalLayout>
    );

    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 60">
  <g x="0" y="0" width="150" height="60">
    <g y="10" x="0" width="90" height="50" transform="translate(0, 10)">
      <rect width="30" height="40" fill="red" stroke-width="10" x="0" />
      <ellipse width="50" height="50" fill="blue" x="40" cx="65" cy="25" rx="25" ry="25" />
    </g>
    <rect width="50" height="50" fill="pink" stroke-width="10" x="100" />
  </g>
</svg>`,
      ),
    );
  });

  it('layout with text node', () => {
    const Node = () => (
      <HorizontalLayout>
        <Rect width={30} height={40} fill="red" strokeWidth={10} />
        <Text y={20} width={35} fontSize={14}>
          Hello
        </Text>
        <Ellipse width={50} height={50} fill="blue" />
      </HorizontalLayout>
    );
    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 52.32">
  <g x="0" y="0" width="135" height="52.32">
    <rect width="30" height="40" fill="red" stroke-width="10" x="0" />
    <text x="40" y="32.32" width="35" data-element-type="text" data-x="40" data-y="20" fill="black" font-size="14" text-anchor="start" dominant-baseline="baseline" data-text-alignment="LEFT TOP" height="0">Hello</text>
    <ellipse width="50" height="50" fill="blue" x="85" cx="110" cy="25" rx="25" ry="25" />
  </g>
</svg>
`,
      ),
    );
  });

  interface VerticalLayoutProps extends GroupProps {
    gap?: number;
  }

  const VerticalLayout = createLayout<VerticalLayoutProps>(
    (children, { gap = 10, ...props }) => {
      let currentY = 0;
      const layoutedChildren = children.map((child) => {
        const bounds = getElementBounds(child);
        const cloned = cloneElement(child, { y: currentY });
        currentY += bounds.height + gap;
        return cloned;
      });

      if (!props.width || !props.height) {
        const totalBounds = getElementsBounds(layoutedChildren);
        props.x ??= totalBounds.x;
        props.y ??= totalBounds.y;
        props.width ??= totalBounds.width;
        props.height ??= totalBounds.height;
      }
      return <Group {...props}>{layoutedChildren}</Group>;
    },
  );

  it('vertical layout', () => {
    const Node = () => (
      <VerticalLayout x={10}>
        <Rect width={40} height={20} fill="red" strokeWidth={5} />
        <Ellipse width={60} height={30} fill="blue" />
        <Rect width={50} height={25} fill="green" />
      </VerticalLayout>
    );

    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 0 60 95">
  <g x="10" y="0" width="60" height="95" transform="translate(10, 0)">
    <rect width="40" height="20" fill="red" stroke-width="5" y="0" />
    <ellipse width="60" height="30" fill="blue" y="30" cx="30" cy="45" rx="30" ry="15" />
    <rect width="50" height="25" fill="green" y="70" />
  </g>
</svg>`,
      ),
    );
  });

  it('should handle layout with explicit dimensions', () => {
    const Node = () => (
      <HorizontalLayout width={200} height={100} x={0} y={0}>
        <Rect width={30} height={40} fill="red" />
        <Ellipse width={50} height={50} fill="blue" />
      </HorizontalLayout>
    );

    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
  <g width="200" height="100" x="0" y="0">
    <rect width="30" height="40" fill="red" x="0" />
    <ellipse width="50" height="50" fill="blue" x="40" cx="65" cy="25" rx="25" ry="25" />
  </g>
</svg>`,
      ),
    );
  });

  it('should handle layout with custom gap', () => {
    const Node = () => (
      <HorizontalLayout gap={20}>
        <Rect width={30} height={30} fill="red" />
        <Rect width={30} height={30} fill="blue" />
        <Rect width={30} height={30} fill="green" />
      </HorizontalLayout>
    );

    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 30">
  <g x="0" y="0" width="130" height="30">
    <rect width="30" height="30" fill="red" x="0" />
    <rect width="30" height="30" fill="blue" x="50" />
    <rect width="30" height="30" fill="green" x="100" />
  </g>
</svg>`,
      ),
    );
  });

  it('should handle empty layout', () => {
    const Node = () => <HorizontalLayout></HorizontalLayout>;

    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0 0">
  <g x="0" y="0" width="0" height="0" />
</svg>`,
      ),
    );
  });

  it('should handle layout with single child', () => {
    const Node = () => (
      <VerticalLayout>
        <Rect width={50} height={50} fill="purple" />
      </VerticalLayout>
    );

    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <g x="0" y="0" width="50" height="50">
    <rect width="50" height="50" fill="purple" y="0" />
  </g>
</svg>`,
      ),
    );
  });

  interface GridLayoutProps extends GroupProps {
    cols: number;
    gap?: number;
  }

  const GridLayout = createLayout<GridLayoutProps>(
    (children, { cols, gap = 10, ...props }) => {
      let currentX = 0;
      let currentY = 0;
      let maxRowHeight = 0;

      const layoutedChildren = children.map((child, index) => {
        const bounds = getElementBounds(child);

        if (index > 0 && index % cols === 0) {
          currentY += maxRowHeight + gap;
          currentX = 0;
          maxRowHeight = 0;
        }

        const cloned = cloneElement(child, { x: currentX, y: currentY });

        currentX += bounds.width + gap;
        maxRowHeight = Math.max(maxRowHeight, bounds.height);

        return cloned;
      });

      if (!props.width || !props.height) {
        const totalBounds = getElementsBounds(layoutedChildren);
        props.x ??= totalBounds.x;
        props.y ??= totalBounds.y;
        props.width ??= totalBounds.width;
        props.height ??= totalBounds.height;
      }
      return <Group {...props}>{layoutedChildren}</Group>;
    },
  );

  it('grid layout with multiple rows', () => {
    const Node = () => (
      <GridLayout cols={2} gap={5}>
        <Rect width={20} height={20} fill="red" />
        <Rect width={20} height={20} fill="blue" />
        <Rect width={20} height={20} fill="green" />
        <Rect width={20} height={20} fill="yellow" />
        <Rect width={20} height={20} fill="purple" />
      </GridLayout>
    );

    expect(renderSVG(<Node />)).toBe(
      minifySvg(
        `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 70">
  <g x="0" y="0" width="45" height="70">
    <rect width="20" height="20" fill="red" x="0" y="0" />
    <rect width="20" height="20" fill="blue" x="25" y="0" />
    <rect width="20" height="20" fill="green" x="0" y="25" />
    <rect width="20" height="20" fill="yellow" x="25" y="25" />
    <rect width="20" height="20" fill="purple" x="0" y="50" />
  </g>
</svg>`,
      ),
    );
  });
});
