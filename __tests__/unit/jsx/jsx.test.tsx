/** @jsxImportSource ../../../src */
import { describe, expect, it } from 'vitest';
import {
  Ellipse,
  Group,
  JSXElement,
  Rect,
  renderSVG,
  Text,
} from '../../../src';
import { getRenderableChildrenOf } from '../../../src/jsx/utils';
import { minifySvg } from '../../utils';

describe('render jsx svg', () => {
  it('should render a simple jsx element', () => {
    const element = <Rect width={100} height={100} fill="red" />;

    expect(typeof element.type).toBe('function');
    expect(element.props).toEqual({
      width: 100,
      height: 100,
      fill: 'red',
    });
  });

  it('should render a jsx element with string child', () => {
    const element = (
      <Text x={10} y={20}>
        Hello
      </Text>
    );
    const children = getRenderableChildrenOf(element);
    expect(children.length).toEqual(1);
    expect(children[0]).toBe('Hello');
  });

  it('should render a jsx element with child', () => {
    const element = (
      <Group>
        <Rect width={100} height={100} fill="red" />
      </Group>
    );
    const children = getRenderableChildrenOf(element);
    expect(children.length).toEqual(1);
    expect(children[0]).toEqual({
      type: Rect,
      props: { width: 100, height: 100, fill: 'red' },
    });
  });

  it('should render a jsx element with children', () => {
    const element = (
      <Group>
        <Rect width={100} height={100} fill="red" />
        <Ellipse width={100} height={100} fill="blue" />
      </Group>
    );
    expect(element.type).toBe(Group);
    const children = getRenderableChildrenOf(element);
    expect(children).toEqual([
      {
        type: Rect,
        props: { width: 100, height: 100, fill: 'red' },
      },
      {
        type: Ellipse,
        props: { width: 100, height: 100, fill: 'blue' },
      },
    ]);
  });

  it('should render a svg element with props', () => {
    const element = <Rect width={100} height={100} fill="red" />;
    expect(
      renderSVG(element, { x: -50, y: -50, width: 200, height: 200 }),
    ).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 200 200">
  <rect width="100" height="100" fill="red" />
</svg>`),
    );
  });

  it('should handle jsx fragments', () => {
    const element = (
      <>
        <Rect width={50} height={50} fill="red" />
        <Ellipse x={60} width={50} height={50} fill="blue" />
      </>
    );

    expect(renderSVG(element)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 50">
  <rect width="50" height="50" fill="red" />
  <ellipse x="60" width="50" height="50" fill="blue" cx="85" cy="25" rx="25" ry="25" />
</svg>`),
    );
  });

  it('should handle nested jsx elements', () => {
    const element = (
      <Group x={10} y={10}>
        <Group x={5} y={5}>
          <Rect width={30} height={30} fill="red" />
        </Group>
        <Ellipse x={40} y={0} width={20} height={20} fill="blue" />
      </Group>
    );

    expect(renderSVG(element)).toBe(
      minifySvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="15 10 55 35">
  <g x="10" y="10" transform="translate(10, 10)">
    <g x="5" y="5" transform="translate(5, 5)">
      <rect width="30" height="30" fill="red" />
    </g>
    <ellipse x="40" y="0" width="20" height="20" fill="blue" cx="50" cy="10" rx="10" ry="10" />
  </g>
</svg>
`),
    );
  });

  it('should handle jsx elements with key props', () => {
    const elements = [
      <Rect width={30} height={30} fill="red" />,
      <Ellipse x={40} width={30} height={30} fill="blue" />,
    ];

    const element = <Group>{elements}</Group>;
    const children = getRenderableChildrenOf(element);

    expect(children).toEqual([
      {
        type: Rect,
        props: { width: 30, height: 30, fill: 'red' },
      },
      {
        type: Ellipse,
        props: { x: 40, width: 30, height: 30, fill: 'blue' },
      },
    ]);
  });

  it('should handle jsx elements with conditional rendering', () => {
    const showEllipse = true;
    const element = (
      <Group>
        <Rect width={50} height={50} fill="red" />
        {showEllipse && <Ellipse x={60} width={50} height={50} fill="blue" />}
      </Group>
    );

    const children = getRenderableChildrenOf(element);
    expect(children.length).toBe(2);
    expect((children[0] as JSXElement).type).toBe(Rect);
    expect((children[1] as JSXElement).type).toBe(Ellipse);
  });

  it('should handle jsx elements with array of children', () => {
    const items = [
      { id: 1, color: 'red' },
      { id: 2, color: 'blue' },
      { id: 3, color: 'green' },
    ];

    const element = (
      <Group>
        {items.map((item, index) => (
          <Rect x={index * 30} width={25} height={25} fill={item.color} />
        ))}
      </Group>
    );

    const children = getRenderableChildrenOf(element);
    expect(children.length).toBe(3);
    expect(children[0]).toEqual({
      type: Rect,
      props: { x: 0, width: 25, height: 25, fill: 'red' },
    });
    expect(children[1]).toEqual({
      type: Rect,
      props: { x: 30, width: 25, height: 25, fill: 'blue' },
    });
    expect(children[2]).toEqual({
      type: Rect,
      props: { x: 60, width: 25, height: 25, fill: 'green' },
    });
  });

  it('should handle jsx elements with custom components', () => {
    const CustomRect = (props: any) => (
      <Rect {...props} fill={props.color || 'black'} />
    );

    const element = <CustomRect width={40} height={40} color="purple" />;

    expect(element.type).toBe(CustomRect);
    expect(element.props).toEqual({
      width: 40,
      height: 40,
      color: 'purple',
    });
  });

  it('should handle jsx elements with spread props', () => {
    const rectProps = {
      width: 60,
      height: 60,
      fill: 'orange',
      stroke: 'black',
      strokeWidth: 2,
    };

    const element = <Rect {...rectProps} x={20} />;

    expect(element.props).toEqual({
      width: 60,
      height: 60,
      fill: 'orange',
      stroke: 'black',
      strokeWidth: 2,
      x: 20,
    });
  });

  it('should handle empty jsx elements', () => {
    const element = <Group></Group>;
    const children = getRenderableChildrenOf(element);
    expect(children.length).toBe(0);
  });

  it('should handle jsx elements with null/undefined children', () => {
    const element = (
      <Group>
        {null}
        <Rect width={30} height={30} fill="red" />
        {undefined}
        {false}
        <Ellipse width={30} height={30} fill="blue" />
        {true}
      </Group>
    );

    const children = getRenderableChildrenOf(element);
    expect(children.length).toBe(2);
    expect((children[0] as JSXElement).type).toBe(Rect);
    expect((children[1] as JSXElement).type).toBe(Ellipse);
  });
});
