import { ElementTypeEnum } from '../../constants';
import type { ParsedInfographicOptions } from '../../options';
import type { Element, IEventEmitter, ItemDatum } from '../../types';
import {
  getDatumByIndexes,
  getElementRole,
  isIconElement,
  parsePadding,
  setSVGPadding,
} from '../../utils';
import type {
  ElementProps,
  ICommandManager,
  IEditor,
  IStateManager,
  StateChangePayload,
  StateManagerInitOptions,
} from '../types';
import {
  buildItemPath,
  getChildrenDataByIndexes,
  getIndexesFromElement,
} from '../utils';

export class StateManager implements IStateManager {
  emitter!: IEventEmitter;
  editor!: IEditor;
  command!: ICommandManager;
  options!: ParsedInfographicOptions;

  init(options: StateManagerInitOptions) {
    Object.assign(this, options);
  }

  addItemDatum(indexes: number[], datum: ItemDatum | ItemDatum[]): void {
    const pre = indexes.slice(0, -1);
    const last = indexes[indexes.length - 1];

    const arr = Array.isArray(datum) ? datum : [datum];
    const list = getChildrenDataByIndexes(this.options.data, pre);
    list.splice(last, 0, ...arr);

    this.emitter.emit('options:data:item:add', { indexes, datum });
    this.emitter.emit('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'add',
          path: 'data.items',
          indexes,
          value: arr,
        },
      ],
    } satisfies StateChangePayload);
  }

  updateItemDatum(indexes: number[], datum: Partial<ItemDatum>): void {
    const item = getDatumByIndexes(this.options.data, indexes);
    Object.assign(item, datum);
    this.emitter.emit('options:data:item:update', { indexes, datum });
    this.emitter.emit('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          path: 'data.items',
          indexes,
          value: datum,
        },
      ],
    } satisfies StateChangePayload);
  }

  removeItemDatum(indexes: number[], count = 1): void {
    const pre = indexes.slice(0, -1);
    const last = indexes[indexes.length - 1];

    const list = getChildrenDataByIndexes(this.options.data, pre);
    const datum = list.splice(last, count);

    this.emitter.emit('options:data:item:remove', { indexes, datum });
    this.emitter.emit('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'remove',
          path: 'data.items',
          indexes,
          value: datum,
        },
      ],
    } satisfies StateChangePayload);
  }

  updateData(key: string, value: any) {
    (this.options.data as any)[key] = value;
    this.emitter.emit('options:data:update', { key, value });
    this.emitter.emit('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          path: `data.${key}`,
          value,
        },
      ],
    } satisfies StateChangePayload);
  }

  updateElement(element: Element, props: Partial<ElementProps>): void {
    this.updateBuiltInElement(element, props);
  }

  updateOptions(options: ParsedInfographicOptions) {
    this.options = { ...this.options, ...options };
    if (this.options.padding !== undefined) {
      setSVGPadding(
        this.editor.getDocument(),
        parsePadding(this.options.padding),
      );
    }
    this.emitter.emit('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          path: '',
          value: options,
        },
      ],
    } satisfies StateChangePayload);
  }

  getOptions(): ParsedInfographicOptions {
    return this.options;
  }

  /**
   * 不包含文本内容、图标类型更新
   */
  private updateBuiltInElement(element: Element, props: Partial<ElementProps>) {
    const { data } = this.options;
    const { attributes = {} } = props;
    const role = getElementRole(element);
    const isItemElement =
      isIconElement(element) ||
      ElementTypeEnum.ItemLabel === role ||
      ElementTypeEnum.ItemDesc === role ||
      ElementTypeEnum.ItemValue === role ||
      ElementTypeEnum.ItemsIllus === role;
    const indexes = isItemElement ? getIndexesFromElement(element) : undefined;
    if (isItemElement) {
      const datum = getDatumByIndexes(data, indexes!);
      const key = role.replace('item-', '');
      datum.attributes ||= {};
      datum.attributes[key] ||= {};
      Object.assign(datum.attributes[key], attributes);
    } else if (
      ElementTypeEnum.Title === role ||
      ElementTypeEnum.Desc === role ||
      ElementTypeEnum.Illus === role
    ) {
      data.attributes ||= {};
      data.attributes[role] ||= {};
      Object.assign(data.attributes[role], attributes);
    }

    this.emitter.emit('options:element:update', { element, props });
    this.emitter.emit('options:change', {
      type: 'options:change',
      changes: [
        {
          op: 'update',
          role,
          indexes,
          path: isItemElement
            ? `${buildItemPath(indexes!)}.attributes.${role.replace('item-', '')}`
            : `data.attributes.${role}`,
          value: props,
        },
      ],
    } satisfies StateChangePayload);
  }

  destroy(): void {}
}
