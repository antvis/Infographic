import { createElement } from '../../../utils';
import { PatternGenerator } from '../../types';

export const square: PatternGenerator = ({
  scale = 0.3,
  backgroundColor,
  foregroundColor,
}) => {
  const pattern = createElement('pattern', {
    id: 'pattern-square',
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
    d: 'M0,0 L20,0 L20,20 L0,20 Z',
    fill: foregroundColor,
  });
  pattern.appendChild(rect);
  pattern.appendChild(path);
  return pattern;
};
