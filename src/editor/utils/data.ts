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
