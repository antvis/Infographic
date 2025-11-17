import { createElement } from '../../../utils';
import { PatternGenerator } from '../../types';

export const dot: PatternGenerator = ({
  scale = 1,
  backgroundColor,
  foregroundColor,
}) => {
  const pattern = createElement('pattern', {
    id: 'pattern-dot',
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
  const circle1 = createElement('circle', {
    cx: '5',
    cy: '5',
    r: '3',
    fill: foregroundColor,
  });
  const circle2 = createElement('circle', {
    cx: '15',
    cy: '15',
    r: '3',
    fill: foregroundColor,
  });
  pattern.appendChild(rect);
  pattern.appendChild(circle1);
  pattern.appendChild(circle2);
  return pattern;
};
