import type { Data, ItemDatum } from '../../types';
import { getDatumByIndexes } from '../../utils';

/**
 * 获取数据项的子数据
 */
export function getChildrenDataByIndexes(
  data: Data,
  indexes: number[],
): ItemDatum[] {
  if (indexes.length === 0) return data.data;
  const datum = getDatumByIndexes(data, indexes);
  datum.children ||= [];
  return datum.children;
}

/**
 * Build lodash-style path for an item based on indexes.
 * Example: [1,2] -> data.items[1].children[2]
 */
export function buildItemPath(
  indexes: number[],
  prefix = 'data.items',
): string {
  return indexes.reduce(
    (path, idx, i) =>
      i === 0 ? `${path}[${idx}]` : `${path}.children[${idx}]`,
    prefix,
  );
}
