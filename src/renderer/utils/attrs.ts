import type { DynamicAttributes, DynamicItemAttribute } from '../../themes';

export function parseDynamicAttributes<T extends object>(
  node: SVGElement,
  attributes: DynamicAttributes<T> | DynamicItemAttribute<T>,
): T {
  const attrs = Object.entries(attributes).reduce((acc, [key, value]) => {
    if (typeof value === 'function') {
      const staticValue = value(node.getAttribute(key));
      if (staticValue) acc[key as keyof T] = staticValue;
    } else {
      Object.assign(acc, { [key]: value });
    }
    return acc;
  }, {} as T);

  return attrs;
}
