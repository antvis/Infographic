import { registerPalette } from './registry';
import type { Palette } from './types';

export const antv: Palette = [
  '#1783FF',
  '#00C9C9',
  '#F0884D',
  '#D580FF',
  '#7863FF',
  '#60C42D',
  '#BD8F24',
  '#FF80CA',
  '#2491B3',
  '#17C76F',
  '#70CAF8',
];
registerPalette('antv', antv);

export const spectral: Palette = (_, index, count) => {
  const colors = [
    ['#fc8d59', '#ffffbf', '#99d594'],
    ['#d7191c', '#fdae61', '#abdda4', '#2b83ba'],
    ['#d7191c', '#fdae61', '#ffffbf', '#abdda4', '#2b83ba'],
    ['#d53e4f', '#fc8d59', '#fee08b', '#e6f598', '#99d594', '#3288bd'],
    [
      '#d53e4f',
      '#fc8d59',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#99d594',
      '#3288bd',
    ],
    [
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
    ],
    [
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
    ],
    [
      '#9e0142',
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
      '#5e4fa2',
    ],
    [
      '#9e0142',
      '#d53e4f',
      '#f46d43',
      '#fdae61',
      '#fee08b',
      '#ffffbf',
      '#e6f598',
      '#abdda4',
      '#66c2a5',
      '#3288bd',
      '#5e4fa2',
    ],
  ];

  const size = Math.min(Math.max(count, 3), 11);
  return colors[size - 3][index % size];
};

registerPalette('spectral', spectral);
