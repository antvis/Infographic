import type { ComponentType } from '@antv/infographic-jsx';
import type { ThemeColors } from '../../themes';
import type { Data } from '../../types';

export interface BaseItemProps {
  x?: number;
  y?: number;
  id?: string;

  indexes: number[];
  data: Data;
  datum: Data['items'][number];
  themeColors: ThemeColors;
  positionH?: 'normal' | 'center' | 'flipped';
  positionV?: 'normal' | 'middle' | 'flipped';
  valueFormatter?: (value: number) => string | number;
  [key: string]: any;
}

export interface ItemOptions extends Partial<BaseItemProps> {}

export interface Item<T extends BaseItemProps = BaseItemProps> {
  component: ComponentType<T>;
  composites: string[];
  options?: ItemOptions;
}
