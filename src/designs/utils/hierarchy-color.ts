/**
 * 层级结构着色模式类型
 */
export type HierarchyColorMode = 'level' | 'branch' | 'node' | 'node-flat';

/**
 * 层级节点信息接口
 */
export interface HierarchyNode {
  /** 节点深度（层级），从 0 开始 */
  depth: number;
  /** 节点原始索引路径，如 [0, 1, 2] 表示根节点的第2个子节点的第3个子节点 */
  originalIndexes: number[];
  /** 节点在树中的扁平化序号（可选），用于 node-flat 模式 */
  flatIndex?: number;
}

/**
 * 根据层级着色模式获取节点的颜色索引
 *
 * @param node - 层级节点信息
 * @param mode - 着色模式
 * @returns 用于获取调色板颜色的索引数组
 *
 * @example
 * ```typescript
 * // 按层级着色
 * const indexes = getHierarchyColorIndexes({ depth: 2, originalIndexes: [0, 1, 2] }, 'level');
 * // 返回 [2]，表示使用第3个层级的颜色
 *
 * // 按分支着色
 * const indexes = getHierarchyColorIndexes({ depth: 3, originalIndexes: [0, 1, 2, 0] }, 'branch');
 * // 返回 [2]，表示继承第2个二级分支的颜色
 *
 * // 按节点着色（层级路径）
 * const indexes = getHierarchyColorIndexes({ depth: 2, originalIndexes: [0, 1, 2] }, 'node');
 * // 返回 [0, 1, 2]，使用完整路径
 *
 * // 按节点着色（扁平序号）
 * const indexes = getHierarchyColorIndexes({ depth: 2, originalIndexes: [0, 1, 2], flatIndex: 5 }, 'node-flat');
 * // 返回 [5]，使用扁平化的序号
 * ```
 */
export function getHierarchyColorIndexes(
  node: HierarchyNode,
  mode: HierarchyColorMode,
): number[] {
  const { depth, originalIndexes, flatIndex } = node;

  switch (mode) {
    case 'level':
      // 按层级着色：同一层级使用相同颜色
      // 层级 0 → 调色板[0]
      // 层级 1 → 调色板[1]
      // 层级 2 → 调色板[2]
      // ...
      return [depth];

    case 'branch':
      // 按分支着色：
      // - 根节点（层级0）使用调色板[0]
      // - 二级节点（层级1）及其子树按分支使用不同颜色
      //   第1个二级分支 → 调色板[1]
      //   第2个二级分支 → 调色板[2]
      //   第3个二级分支 → 调色板[3]
      //   ...
      if (depth === 0) {
        // 根节点固定使用颜色 0
        return [0];
      } else if (depth === 1) {
        // 二级节点使用其在根节点子节点中的索引 + 1
        return [originalIndexes[1] + 1];
      } else {
        // 更深层级的节点继承其二级祖先的颜色
        // originalIndexes[1] 是二级祖先在根节点子节点中的索引
        return [originalIndexes[1] + 1];
      }

    case 'node':
      // 按节点着色：每个节点使用不同颜色
      // 使用完整的节点索引路径作为颜色索引
      // 这样可以确保每个节点获得独特的颜色
      return originalIndexes;

    case 'node-flat':
      // 按节点扁平序号着色：使用树的遍历序号
      // 如果提供了 flatIndex，直接使用
      // 否则使用第一级索引作为后备方案
      if (flatIndex !== undefined) {
        return [flatIndex];
      }
      // 后备方案：如果没有提供 flatIndex，使用完整路径
      console.warn(
        'node-flat mode requires flatIndex in HierarchyNode, falling back to originalIndexes',
      );
      return originalIndexes;

    default:
      // 默认返回根节点颜色
      return [0];
  }
}

/**
 * 从 d3 hierarchy 节点中提取层级节点信息
 *
 * @param d3Node - d3.hierarchy 生成的节点对象
 * @returns 层级节点信息
 *
 * @example
 * ```typescript
 * const root = d3.hierarchy(data);
 * const nodes = root.descendants();
 *
 * nodes.forEach(node => {
 *   const hierarchyNode = extractHierarchyNode(node);
 *   const colorIndexes = getHierarchyColorIndexes(hierarchyNode, 'branch');
 *   const color = getPaletteColor(options, colorIndexes);
 * });
 * ```
 */
export function extractHierarchyNode(d3Node: any): HierarchyNode {
  return {
    depth: d3Node.depth,
    originalIndexes: d3Node.data._originalIndex || [],
  };
}
