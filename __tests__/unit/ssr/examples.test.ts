import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from 'vitest';
import { renderToSVG } from '../../../src/ssr';

const EXAMPLES_DIR = join(__dirname, 'examples');

const exampleFiles = [
  '01-basic-list.txt',
  '02-list-with-icons.txt',
  '03-timeline.txt',
  '04-themed-dark.txt',
  '05-quarterly-revenue.txt',
  '06-comparison.txt',
  '07-hierarchy.txt',
  '08-quadrant.txt',
  '09-chart-bars.txt',
  '10-swot-analysis.txt',
];

describe('SSR Examples', () => {
  for (const file of exampleFiles) {
    it(`should render ${file}`, async () => {
      const input = readFileSync(join(EXAMPLES_DIR, file), 'utf-8');

      const result = await renderToSVG({ input });

      expect(result.errors).toHaveLength(0);
      expect(result.svg).toBeTruthy();
      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');
    });
  }
});
