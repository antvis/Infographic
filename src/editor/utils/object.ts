import { isPlainObject, merge } from 'lodash-es';

/**
 * Recursively merges source into target, deleting properties that are undefined in source.
 * This mimics lodash.merge but treats undefined values as delete instructions.
 */
export function applyOptionUpdates(target: any, source: any) {
  Object.keys(source).forEach((key) => {
    const srcValue = source[key];
    if (srcValue === undefined) {
      delete target[key];
    } else if (isPlainObject(srcValue)) {
      if (!isPlainObject(target[key])) {
        target[key] = {};
      }
      applyOptionUpdates(target[key], srcValue);
    } else {
      merge(target, { [key]: srcValue });
    }
  });
}
