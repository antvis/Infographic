// 常量定义
const DEFAULT_SEPARATOR = ',';

/**
 * 将项目键值转换为索引数组（从0开始）
 * @param key - 项目键值，如 '0,1,2'
 * @param separator - 分隔符，默认为 ','
 * @example getIndexesFromItemKey('0,1,2') => [0, 1, 2]
 */
export const getIndexesFromItemKey = (
  key: string,
  separator: string = DEFAULT_SEPARATOR,
): number[] => {
  return key.split(separator).map((value) => parseInt(value, 10));
};

/**
 * 从项目 dataset.indexes 中获取索引数组
 * @example getItemIndexes('1,2,3') => [0, 1, 2]
 */
export const getItemIndexes = (indexesStr: string): number[] => {
  return getIndexesFromItemKey(indexesStr);
};
