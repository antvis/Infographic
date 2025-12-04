import { describe, expect, it, vi } from 'vitest';
import { StateManager } from '../../../../src/editor/managers/state';
import type { Data, Element } from '../../../../src/types';

const createSVGElement = (role: string, indexes?: number[]): Element => {
  const element = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect',
  );
  element.setAttribute('data-element-type', role);
  if (indexes) element.setAttribute('data-indexes', indexes.join(','));
  return element as unknown as Element;
};

const createState = (data?: Partial<Data>) => {
  const items = [{ label: 'Item 1', attributes: {} }, { label: 'Item 2' }];
  const mockData: Data = {
    title: 'Title',
    desc: 'Desc',
    items,
    // keep a copy on data to satisfy editor helpers that read data.data
    data: items,
    attributes: {},
    ...data,
  } as Data;

  const emitter = { emit: vi.fn() } as any;
  const state = new StateManager();
  state.init({
    emitter,
    editor: {} as any,
    commander: {} as any,
    data: mockData,
  });
  return { state, emitter, data: mockData };
};

describe('StateManager', () => {
  it('adds, updates and removes item data while emitting changes', () => {
    const { state, emitter, data } = createState();

    state.addItemDatum([1], { label: 'Inserted' });
    expect(data.items[1].label).toBe('Inserted');
    expect(emitter.emit).toHaveBeenCalledWith('data:add:item', {
      indexes: [1],
      datum: { label: 'Inserted' },
    });

    state.updateItemDatum([0], { label: 'Updated' });
    expect(data.items[0].label).toBe('Updated');
    expect(emitter.emit).toHaveBeenCalledWith('data:update:item', {
      indexes: [0],
      datum: { label: 'Updated' },
    });

    state.removeItemDatum([1]);
    expect(data.items[1].label).toBe('Item 2');
    expect(emitter.emit.mock.calls).toContainEqual([
      'data:remove:item',
      { indexes: [1], datum: [{ label: 'Inserted' }] },
    ]);
  });

  it('updates top-level data values and emits change', () => {
    const { state, emitter, data } = createState();

    state.updateData('title', 'New Title');
    expect(data.title).toBe('New Title');
    expect(emitter.emit).toHaveBeenCalledWith('data:update:data', {
      key: 'title',
      value: 'New Title',
    });
  });

  it('updates attributes for item elements and non-item elements', () => {
    const { state, data } = createState();
    const itemElement = createSVGElement('item-label', [0]);
    const titleElement = createSVGElement('title');

    state.updateElement(itemElement, { attributes: { fill: 'red' } });
    expect(data.items[0].attributes?.label).toEqual({ fill: 'red' });

    state.updateElement(titleElement, { attributes: { color: 'blue' } });
    expect(data.attributes?.title).toEqual({ color: 'blue' });
  });
});
