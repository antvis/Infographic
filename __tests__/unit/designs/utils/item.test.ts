import { describe, expect, it } from 'vitest';
import {
  getItemComponent,
  getItemProps,
} from '../../../../src/designs/utils/item';

describe('getItemProps', () => {
  it('splits component props and container props', () => {
    const data = { items: [] };
    const datum = {};
    const themeColors = {} as any;
    const props = {
      id: 'item-1',
      indexes: [0, 1],
      data,
      datum,
      themeColors,
      positionH: 'center' as const,
      valueFormatter: (v: number) => `$${v}`,
      extra: true,
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      custom: 'keep',
    };

    const [extProps, restProps] = getItemProps(props, ['extra']);

    expect(extProps).toMatchObject({
      indexes: [0, 1],
      data,
      datum,
      themeColors,
      positionH: 'center',
      valueFormatter: props.valueFormatter,
      extra: true,
    });
    expect(restProps).toMatchObject({
      id: 'item-1',
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      custom: 'keep',
    });
    expect(restProps).not.toHaveProperty('indexes');
  });
});

describe('getItemComponent', () => {
  it('returns component by level with fallbacks', () => {
    const First = () => null;
    const Second = () => null;
    const components = [First, Second] as any;

    expect(getItemComponent(components)).toBe(First);
    expect(getItemComponent(components, 1)).toBe(Second);
    expect(getItemComponent(components, 5)).toBe(First);

    const empty = [] as any;
    expect(getItemComponent(empty)()).toBeNull();
  });
});
