export interface LinearGradientProps {
  id?: string;
  startColor?: string;
  stopColor?: string;
  direction?: 'left-right' | 'right-left' | 'top-bottom' | 'bottom-top';
}

export const LinearGradient = (props: LinearGradientProps) => {
  const {
    id = 'linear-gradient',
    startColor = 'black',
    stopColor = 'white',
    direction = 'left-right',
  } = props;

  const directionMap = {
    'left-right': { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
    'right-left': { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
    'top-bottom': { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    'bottom-top': { x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
  };

  return (
    <linearGradient id={id} {...directionMap[direction]}>
      <stop offset="0%" stopColor={startColor} />
      <stop offset="100%" stopColor={stopColor} />
    </linearGradient>
  );
};
