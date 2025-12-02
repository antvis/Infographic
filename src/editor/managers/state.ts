import type { Data, ItemDatum } from '../../types';
import { getDatumByIndexes } from '../../utils';
import type {
  ICommandManager,
  IEditor,
  IStateManager,
  StateChangePayload,
} from '../types';
import { getChildrenDataByIndexes } from '../utils';

export class StateManager implements IStateManager {
  editor!: IEditor;
  command!: ICommandManager;
  data!: Data;

  init(editor: IEditor, command: ICommandManager, data: Data) {
    this.editor = editor;
    this.command = command;
    this.data = data;
  }

  addItemDatum(indexes: number[], datum: ItemDatum | ItemDatum[]): void {
    const pre = indexes.slice(0, -1);
    const last = indexes[indexes.length - 1];

    const arr = Array.isArray(datum) ? datum : [datum];
    const list = getChildrenDataByIndexes(this.data, pre);
    list.splice(last, 0, ...arr);

    this.editor.emit('data:add:item', { indexes, datum });
    this.editor.emit('data:change', {
      type: 'data:change',
      changes: [
        {
          op: 'add',
          path: indexes,
          value: arr,
        },
      ],
    } satisfies StateChangePayload);
  }

  updateItemDatum(indexes: number[], datum: Partial<ItemDatum>): void {
    const item = getDatumByIndexes(this.data, indexes);
    Object.assign(item, datum);

    this.editor.emit('data:update:item', { indexes, datum });
    this.editor.emit('data:change', {
      type: 'data:change',
      changes: [
        {
          op: 'update',
          path: indexes,
          value: datum,
        },
      ],
    } satisfies StateChangePayload);
  }

  removeItemDatum(indexes: number[], count = 1): void {
    const pre = indexes.slice(0, -1);
    const last = indexes[indexes.length - 1];

    const list = getChildrenDataByIndexes(this.data, pre);
    const datum = list.splice(last, count);

    this.editor.emit('data:remove:item', { indexes, datum });
    this.editor.emit('data:change', {
      type: 'data:change',
      changes: [
        {
          op: 'remove',
          path: indexes,
          value: datum,
        },
      ],
    } satisfies StateChangePayload);
  }

  destroy(): void {}
}
