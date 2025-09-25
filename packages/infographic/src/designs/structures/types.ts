import type { ComponentType } from '@antv/infographic-jsx';
import type { ParsedInfographicOptions } from '../../options';
import type { Data } from '../../types';
import { TitleProps } from '../components';
import type { BaseItemProps } from '../items';

export interface BaseStructureProps {
  Title?: ComponentType<Pick<TitleProps, 'title' | 'desc'>>;
  Item: ComponentType<Omit<BaseItemProps, 'themeColors'>>; // themeColors will be injected
  Items: ComponentType<Omit<BaseItemProps, 'themeColors'>>[];
  data: Data;
  options: ParsedInfographicOptions;
}

export interface Structure {
  component: ComponentType<BaseStructureProps>;
}

export interface StructureOptions {
  [key: string]: any;
}
