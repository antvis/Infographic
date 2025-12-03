export function getCommonAttrs<T extends Record<string, any>>(attrs: T[]) {
  return Object.keys(attrs[0]).reduce((acc, key) => {
    const k = key as keyof T;
    if (attrs.every((attr) => attr[k] === attrs[0][k])) {
      acc[k] = attrs[0][k];
    }
    return acc;
  }, {} as T);
}
