import tinycolor from 'tinycolor2';
import { registerTheme } from './registry';

registerTheme('dark', {
  colorBg: '#1F1F1F',
  base: {
    text: {
      fill: '#fff',
    },
  },
});

registerTheme('hand-drawn', {
  base: {
    text: {
      'font-family': '851tegakizatsu',
    },
  },
  stylize: {
    type: 'rough',
  },
});

function toGray(color: string | undefined) {
  if (!color) return color;
  const tc = tinycolor(color);
  const hsl = tc.toHsl();
  hsl.s = 0;
  return tinycolor(hsl).toHex8String();
}

registerTheme('grayscale', {
  base: {
    global: {
      // fill: (v) => toGray(v),
      // stroke: (v) => toGray(v),
      fill: (v) => '#fff',
      stroke: (v) => toGray(v && v !== 'none' ? v : 'gray'),
    },
    text: {
      fill: 'gray',
    },
  },
  item: {
    icon: {
      fill: 'gray',
    },
  },
});
