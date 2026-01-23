/**
 * 规范化百分比输入
 *
 * 支持以下格式：
 * - "2%" 或 "2.5%" → 2 或 2.5
 * - 2 或 2.5 (数字直接作为百分比) → 2 或 2.5
 *
 * @param value - 百分比值，可以是数字或带 "%" 的字符串
 * @returns 规范化后的百分比数值
 *
 * @example
 * ```typescript
 * normalizePercent("2%");   // 返回 2
 * normalizePercent("2.5%"); // 返回 2.5
 * normalizePercent(2);      // 返回 2
 * normalizePercent(2.5);    // 返回 2.5
 * ```
 */
export function normalizePercent(value: number | string | undefined): number {
  if (value === undefined || value === null) return 0;

  // 处理字符串格式 (如 "2%" 或 "2.5%")
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // 移除可能的 '%' 后缀，然后解析
    const numStr = trimmed.endsWith('%') ? trimmed.slice(0, -1) : trimmed;
    const num = parseFloat(numStr);
    return isNaN(num) ? 0 : num;
  }

  // 数字直接作为百分比使用
  return value;
}
