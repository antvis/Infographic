import { describe, expect, it, vi } from 'vitest';
import { StateManager } from '../../../../src/editor/managers/state';
import type { Data, Element } from '../../../../src/types';
import { setSVGPadding } from '../../../../src/utils';

vi.mock('../../../../src/utils', async () => {
  const actual = await vi.importActual<any>('../../../../src/utils');
  return { ...actual, setSVGPadding: vi.fn() };
});

const createSVGElement = (role: string, indexes?: number[]): Element => {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect',
  );
  element.setAttribute('data-element-type', role);
  if (indexes) element.setAttribute('data-indexes', indexes.join(','));
  return element as unknown as Element;
};

const createState = (
  dataOverrides?: Partial<Data>,
  optionsOverrides?: Record<string, any>,
) => {
  const items = [{ label: 'Item 1', attributes: {} }, { label: 'Item 2' }];
  const data: Data = {
    title: 'Title',
    desc: 'Desc',
    items,
    data: items,
    attributes: {},
    ...dataOverrides,
  } as Data;

  const emitter = { emit: vi.fn() } as any;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const state = new StateManager();
  const options = { data, ...optionsOverrides } as any;
  state.init({
    emitter,
    editor: { getDocument: () => svg } as any,
    commander: {} as any,
    options,
  });
  return { state, emitter, data, options, svg };
};

describe('StateManager', () => {
  it('adds, updates and removes item data while emitting changes', () => {
    const { state, emitter, data } = createState();

    state.addItemDatum([1], { label: 'Inserted' });
    expect(data.items[1].label).toBe('Inserted');
    expect(emitter.emit).toHaveBeenCalledWith('options:data:item:add', {
      indexes: [1],
      datum: { label: 'Inserted' },
    });
    expect(emitter.emit).toHaveBeenCalledWith('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'add',
          path: 'data.items',
          indexes: [1],
          value: [{ label: 'Inserted' }],
        },
      ],
    });

    emitter.emit.mockClear();

    state.updateItemDatum([0], { label: 'Updated' });
    expect(data.items[0].label).toBe('Updated');
    expect(emitter.emit).toHaveBeenCalledWith('options:data:item:update', {
      indexes: [0],
      datum: { label: 'Updated' },
    });
    expect(emitter.emit).toHaveBeenCalledWith('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          path: 'data.items',
          indexes: [0],
          value: { label: 'Updated' },
        },
      ],
    });

    emitter.emit.mockClear();

    state.removeItemDatum([1]);
    expect(data.items[1].label).toBe('Item 2');
    expect(emitter.emit).toHaveBeenCalledWith('options:data:item:remove', {
      indexes: [1],
      datum: [{ label: 'Inserted' }],
    });
    expect(emitter.emit).toHaveBeenCalledWith('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'remove',
          path: 'data.items',
          indexes: [1],
          value: [{ label: 'Inserted' }],
        },
      ],
    });
  });

  it('updates top-level data values and emits change', () => {
    const { state, emitter, data } = createState();

    state.updateData('title', 'New Title');
    expect(data.title).toBe('New Title');
    expect(emitter.emit).toHaveBeenCalledWith('options:data:update', {
      key: 'title',
      value: 'New Title',
    });
    expect(emitter.emit).toHaveBeenCalledWith('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          path: 'data.title',
          value: 'New Title',
        },
      ],
    });
  });

  it('updates attributes for item elements and non-item elements', () => {
    const { state, data, emitter } = createState();
    const itemElement = createSVGElement('item-label', [0]);
    const titleElement = createSVGElement('title');

    state.updateElement(itemElement, { attributes: { fill: 'red' } });
    expect(data.items[0].attributes?.label).toEqual({ fill: 'red' });
    expect(emitter.emit).toHaveBeenCalledWith('options:element:update', {
      element: itemElement,
      props: { attributes: { fill: 'red' } },
    });
    expect(emitter.emit).toHaveBeenCalledWith('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          role: 'item-label',
          indexes: [0],
          path: 'data.items[0].attributes.label',
          value: { attributes: { fill: 'red' } },
        },
      ],
    });

    emitter.emit.mockClear();

    state.updateElement(titleElement, { attributes: { color: 'blue' } });
    expect(data.attributes?.title).toEqual({ color: 'blue' });
    expect(emitter.emit).toHaveBeenCalledWith('options:element:update', {
      element: titleElement,
      props: { attributes: { color: 'blue' } },
    });
    expect(emitter.emit).toHaveBeenCalledWith('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          role: 'title',
          indexes: undefined,
          path: 'data.attributes.title',
          value: { attributes: { color: 'blue' } },
        },
      ],
    });
  });

  it('updates options and applies padding', () => {
    const mockedSetSVGPadding = vi.mocked(setSVGPadding);
    mockedSetSVGPadding.mockClear();
    const { state, emitter, data, svg } = createState(undefined, {
      padding: 0,
    });

    const updated = { padding: 10, theme: 'dark' };
    state.updateOptions(updated as any);

    expect(state.getOptions()).toMatchObject({
      data,
      padding: 10,
      theme: 'dark',
    });
    expect(mockedSetSVGPadding).toHaveBeenCalledWith(svg, [10, 10, 10, 10]);
    expect(emitter.emit).toHaveBeenCalledWith('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          path: '',
          value: updated,
        },
      ],
    });
  });
});
