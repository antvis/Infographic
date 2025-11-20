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
