import type { BaseAttributes } from '../../../../types';
import type { ICommandManager, Selection } from '../../../types';

export type EditItemOptions = {
  root?: HTMLElement | ShadowRoot;
  [key: string]: any;
};

export type EditItem<T extends BaseAttributes = BaseAttributes> = (
  selection: Selection,
  attrs: T,
  commander: ICommandManager,
  options?: EditItemOptions,
) => HTMLElement;
