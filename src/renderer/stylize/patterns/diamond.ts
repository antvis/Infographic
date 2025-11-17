import { createElement } from '../../../utils';
import { PatternGenerator } from '../../types';

export const diamond: PatternGenerator = ({
  scale = 0.5,
  backgroundColor,
  foregroundColor,
}) => {
  const pattern = createElement('pattern', {
    id: 'pattern-diamond',
    width: '20',
    height: '20',
    patternTransform: `scale(${scale})`,
    patternUnits: 'userSpaceOnUse',
  });
  const rect = createElement('rect', {
    width: '100%',
    height: '100%',
    fill: backgroundColor,
  });
  const path = createElement('path', {
    d: 'M0,0 L20,20 M20,0 L0,20',
    stroke: foregroundColor,
    'stroke-width': '1',
  });
  pattern.appendChild(rect);
  pattern.appendChild(path);
  return pattern;
};
