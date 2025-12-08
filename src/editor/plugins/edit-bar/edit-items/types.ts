import type { BaseAttributes } from '../../../../types';
import type { ICommandManager, Selection } from '../../../types';

export type EditItem<T extends BaseAttributes = BaseAttributes> = (
  selection: Selection,
  attrs: T,
  commander: ICommandManager,
  options?: Record<string, any>,
) => HTMLElement;
