import { ElementTypeEnum } from '../../constants';
import type { Data, Element, IEventEmitter, ItemDatum } from '../../types';
import { getDatumByIndexes, getElementRole, isIconElement } from '../../utils';
import type {
  ElementProps,
  ICommandManager,
  IEditor,
  IStateManager,
  StateChangePayload,
  StateManagerInitOptions,
} from '../types';
import { getChildrenDataByIndexes, getIndexesFromElement } from '../utils';

export class StateManager implements IStateManager {
  emitter!: IEventEmitter;
  editor!: IEditor;
  command!: ICommandManager;
  data!: Data;

  init(options: StateManagerInitOptions) {
    Object.assign(this, options);
  }

  addItemDatum(indexes: number[], datum: ItemDatum | ItemDatum[]): void {
    const pre = indexes.slice(0, -1);
    const last = indexes[indexes.length - 1];

    const arr = Array.isArray(datum) ? datum : [datum];
    const list = getChildrenDataByIndexes(this.data, pre);
    list.splice(last, 0, ...arr);

    this.emitter.emit('data:add:item', { indexes, datum });
    this.emitter.emit('data:change', {
      type: 'data:change',
      changes: [
        {
          op: 'add',
          path: 'items',
          indexes,
          value: arr,
        },
      ],
    } satisfies StateChangePayload);
  }

  updateItemDatum(indexes: number[], datum: Partial<ItemDatum>): void {
    const item = getDatumByIndexes(this.data, indexes);
    Object.assign(item, datum);
    this.emitter.emit('data:update:item', { indexes, datum });
    this.emitter.emit('data:change', {
      type: 'data:change',
      changes: [
        {
          op: 'update',
          path: 'items',
          indexes,
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

    this.emitter.emit('data:remove:item', { indexes, datum });
    this.emitter.emit('data:change', {
      type: 'data:change',
      changes: [
        {
          op: 'remove',
          path: 'items',
          indexes,
          value: datum,
        },
      ],
    } satisfies StateChangePayload);
  }

  updateData(key: string, value: any) {
    (this.data as any)[key] = value;
    this.emitter.emit('data:update:data', { key, value });
    this.emitter.emit('data:change', {
      type: 'data:change',
      changes: [
        {
          op: 'update',
          path: key,
          value,
        },
      ],
    } satisfies StateChangePayload);
  }

  updateElement(element: Element, props: Partial<ElementProps>): void {
    this.updateBuiltInElement(element, props);
  }

  /**
   * 不包含文本内容、图标类型更新
   */
  private updateBuiltInElement(element: Element, props: Partial<ElementProps>) {
    const { attributes = {} } = props;
    const role = getElementRole(element);
    const isItemElement =
      isIconElement(element) ||
      ElementTypeEnum.ItemLabel === role ||
      ElementTypeEnum.ItemDesc === role ||
      ElementTypeEnum.ItemValue === role ||
      ElementTypeEnum.ItemsIllus === role;
    if (isItemElement) {
      const datum = getDatumByIndexes(
        this.data,
        getIndexesFromElement(element),
      );
      const key = role.replace('item-', '');
      datum.attributes ||= {};
      datum.attributes[key] ||= {};
      Object.assign(datum.attributes[key], attributes);
    } else if (
      ElementTypeEnum.Title === role ||
      ElementTypeEnum.Desc === role ||
      ElementTypeEnum.Illus === role
    ) {
      this.data.attributes ||= {};
      this.data.attributes[role] ||= {};
      Object.assign(this.data.attributes[role], attributes);
    }

    this.emitter.emit('data:update:attrs', { element, props });
    this.emitter.emit('data:change', {
      type: 'data:change',
      changes: [
        {
          op: 'update',
          role,
          indexes: isItemElement ? getIndexesFromElement(element) : undefined,
          path: isItemElement ? 'items' : 'attributes',
          value: props,
        },
      ],
    } satisfies StateChangePayload);
  }

  destroy(): void {}
}
