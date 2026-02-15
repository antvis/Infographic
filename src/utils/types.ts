// =============================================================================
// Path Helper Types (路径生成工具类型)
//
// 作用：递归提取对象的所有可选路径（点语法），用于 SyncRegistry 等场景的类型安全与补全。
//
// [Input]:
// type Obj = { a: { b: { c: string } }, d: number };
//
// [Output]:
// "a" | "a.b" | "a.b.c" | "d"
// =============================================================================

// 1. 递归深度控制：定义一个元组，用于递减深度 (D -> D-1)
// Prev[3] => 2, Prev[2] => 1, ... Prev[0] => never
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 2. 终止节点类型：遇到这些类型停止递归
// 包括基本类型、数组、函数等，只深入遍历普通对象
type StopType =
  | string
  | number
  | boolean
  | symbol
  | undefined
  | null
  | ((...args: any[]) => any)
  | Array<any>;

// 3. 辅助：拼接两个路径片段 (K.P)
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

// 4. 辅助：提取对象中明确定义的 Key (过滤掉索引签名 [key: string]: any)
// 使用 Key Remapping (TS 4.1+) 技术
type ValidKey<T> = keyof {
  [K in keyof T as string extends K
    ? never
    : number extends K
      ? never
      : K]: any;
};

/**
 * 递归生成 T 的所有点语法路径 (例如 "design.structure" 或 "data.items")
 * @template T 目标对象类型
 * @template D 递归深度限制，默认 3 层 (足以覆盖大多数配置嵌套)
 */
export type Path<T, D extends number = 3> = [D] extends [never]
  ? never // A. 达到最大深度，终止
  : T extends StopType
    ? never // B. 遇到终止类型，终止
    : {
        // C. 遍历所有有效的 Key，并移除可选修饰符 (-?) 以处理 undefined
        [K in ValidKey<T>]-?: K extends string | number
          ? // 生成: 当前路径 K 或 "K + 子路径"
              K | Join<K, Path<NonNullable<T[K]>, Prev[D]>>
          : never;
      }[ValidKey<T>]; // D. 提取所有生成路径的联合类型
