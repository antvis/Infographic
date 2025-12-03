/**
 * 针对多选时，获取多个属性中相同的属性值
 */
export function getSelectionAttrs<T extends Record<string, any>>(
  attrs: T[],
): T {
  if (!attrs.length) return {} as T;

  return Object.keys(attrs[0]).reduce((acc, key) => {
    const k = key as keyof T;
    if (attrs.every((attr) => attr[k] === attrs[0][k])) {
      acc[k] = attrs[0][k];
    }
    return acc;
  }, {} as T);
}
