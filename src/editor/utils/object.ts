import { cloneDeep, isEqual, isPlainObject } from 'lodash-es';

export interface ApplyOptionUpdatesOptions {
  /** Whether to notify parent paths of changes (bubbling) */
  bubbleUp?: boolean;
  /** Callback triggered whenever a property value changes */
  collector?: (path: string, newVal: any, oldVal: any) => void;
}

/**
 * Recursively applies properties from 'source' to 'target' and collects changes.
 *
 * @param target - The object to be updated
 * @param source - The source object containing partial updates
 * @param basePath - Current path prefix for nested properties
 * @param options - Configuration options
 */
export function applyOptionUpdates(
  target: any,
  source: any,
  basePath: string = '',
  options?: ApplyOptionUpdatesOptions,
): void {
  const { bubbleUp = false, collector } = options ?? {};

  const hasChange = applyOptionUpdatesInternal(
    target,
    source,
    basePath,
    collector,
    bubbleUp,
  );

  if (basePath === '' && hasChange && bubbleUp && collector) {
    collector('', cloneDeep(target), undefined);
  }
}

/**
 * Internal recursive function.
 * Returns true if any change occurred within this branch (or its children).
 */
function applyOptionUpdatesInternal(
  target: any,
  source: any,
  basePath: string,
  collector: ((path: string, newVal: any, oldVal: any) => void) | undefined,
  bubbleUp: boolean,
): boolean {
  let hasChange = false;

  Object.keys(source).forEach((key) => {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return;
    }

    const fullPath = basePath ? `${basePath}.${key}` : key;
    const updateValue = source[key];
    const oldValue = target[key];
    let childChanged = false;

    if (updateValue === undefined) {
      // Handle deletion: Only delete and notify if the key actually exists
      if (key in target) {
        delete target[key];
        collector?.(fullPath, undefined, oldValue);
        childChanged = true;
      }
    } else if (isPlainObject(updateValue)) {
      // Handle nested object
      if (!isPlainObject(target[key])) {
        target[key] = {};
        // If strict value equality is needed for the object ref itself,
        // one might consider firing collector here, but the legacy logic prioritizes leaf values.
      }

      childChanged = applyOptionUpdatesInternal(
        target[key],
        updateValue,
        fullPath,
        collector,
        bubbleUp,
      );
    } else {
      // Handle primitive update
      target[key] = updateValue;
      if (!isEqual(updateValue, oldValue)) {
        collector?.(fullPath, updateValue, oldValue);
        childChanged = true;
      }
    }

    if (childChanged) {
      hasChange = true;
    }
  });

  // Bubbling: Notify if any child changed in this branch
  // The recursion naturally ensures this happens in "deepest-first" (post-order) sequence.
  if (hasChange && bubbleUp && basePath !== '') {
    // Current target is now fully updated for this scope.
    collector?.(basePath, cloneDeep(target), undefined);
  }

  return hasChange;
}
