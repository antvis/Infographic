import { describe, expect, it } from 'vitest';
import { Infographic } from '../../../src/runtime';

const SYNTAX = `infographic list-row-simple-horizontal-arrow
data
  title Steps
  lists
    - label Step 1
      desc Setup
    - label Step 2
      desc Ship`;

describe('Infographic direction', () => {
  it.each([
    ['rtl', 'ltr', false],
    ['ltr', 'rtl', true],
  ] as const)(
    'lets direction %s in options be overridden by direction %s in the syntax',
    (option, spec, mirrored) => {
      const container = document.createElement('div');
      const infographic = new Infographic({ container, direction: option });

      infographic.render(`${SYNTAX}\ndirection ${spec}`);

      const mirror = container.querySelector(
        'svg > g[transform^="matrix(-1 0 0 1"]',
      );
      expect(mirror !== null).toBe(mirrored);
    },
  );
});
