import type { ComponentType } from '../../jsx';
import type { ParsedInfographicOptions } from '../../options';
import type { Data } from '../../types';
import { TitleProps } from '../components';
import type { BaseItemProps } from '../items';

export interface BaseStructureProps {
  Title?: ComponentType<Pick<TitleProps, 'title' | 'desc'>>;
  Item: ComponentType<
    Omit<BaseItemProps, 'themeColors'> &
      Partial<Pick<BaseItemProps, 'themeColors'>>
  >;
  Items: ComponentType<Omit<BaseItemProps, 'themeColors'>>[];
  data: Data;
  options: ParsedInfographicOptions;
}

export interface Structure {
  component: ComponentType<BaseStructureProps>;
  composites: string[];
}

export interface StructureOptions {
  [key: string]: any;
}
