import { isPlainObject } from 'lodash-es';

export function applyOptionUpdates(
  target: any,
  source: any,
  basePath: string = '',
  collecotor?: (path: string, newVal: any, oldVal: any) => void,
) {
  Object.keys(source).forEach((key) => {
    const fullPath = basePath ? `${basePath}.${key}` : key;
    const updateValue = source[key];
    const oldValue = target[key];

    if (updateValue === undefined) {
      delete target[key];
      collecotor?.(fullPath, undefined, oldValue);
    } else if (isPlainObject(updateValue) && isPlainObject(oldValue)) {
      applyOptionUpdates(target[key], updateValue, fullPath, collecotor);
    } else {
      target[key] = updateValue;
      if (updateValue !== oldValue) {
        collecotor?.(fullPath, updateValue, oldValue);
      }
    }
  });
}
