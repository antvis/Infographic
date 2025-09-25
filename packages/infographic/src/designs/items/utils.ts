import { getItemKeyFromIndexes } from '../../utils';
import type { BaseItemProps } from './types';

export function getItemId(indexes: number[], appendix: string) {
  return `item-${getItemKeyFromIndexes(indexes)}-${appendix}`;
}

/**
 * 从属性中拆分出组件属性和容器属性
 * @param props
 * @param extKeys
 * @returns
 */
export function getItemProps<T extends BaseItemProps>(
  props: T,
  extKeys: string[] = [],
) {
  const restProps: Record<string, any> = { ...props };
  const extProps: T = {} as any;

  const keys = [
    'indexes',
    'data',
    'datum',
    'positionH',
    'positionV',
    'themeColors',
    'valueFormatter',
    ...extKeys,
  ];

  keys.forEach((key) => {
    if (key in restProps) {
      extProps[key as keyof T] = restProps[key];
      delete restProps[key];
    }
  });

  // keep x, y, width, height in rest
  ['x', 'y', 'width', 'height'].forEach((key) => {
    if (key in props) {
      restProps[key] = props[key];
    }
  });

  return [extProps, restProps] as const;
}
