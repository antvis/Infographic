import type { BaseItemProps } from '../items/types';
import { BaseStructureProps } from '../structures';

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

/**
 * 针对层级结构，获取当前层级对应的组件
 */
export function getItemComponent(
  Items: BaseStructureProps['Items'],
  level?: number,
) {
  if (Items.length === 0) return () => null;
  if (level === undefined) return Items[0];
  return Items[level] ?? Items[0];
}
