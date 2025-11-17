export interface GapProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

/**
 * 用于在布局中创建间隙的占位符组件。
 * @description
 * ⚠️ 只能通过 <Gap /> 使用，不能通过 const gap = <Gap /> 这种方式使用。
 */
export const Gap = () => {
  return <></>;
};
