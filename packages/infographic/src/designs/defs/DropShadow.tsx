interface DropShadowProps {
  id?: string;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  color?: string;
  opacity?: number;
}

export const DropShadow = (props: DropShadowProps) => {
  const { color = 'black', opacity = 0.8, ...restProps } = props;
  return (
    <filter
      id="drop-shadow"
      x="-25%"
      y="-25%"
      width="200%"
      height="200%"
      {...restProps}
    >
      <feDropShadow
        dx="4"
        dy="4"
        stdDeviation="4"
        flood-color={color}
        flood-opacity={opacity}
      />
    </filter>
  );
};
