import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { describe, it, expect, beforeAll } from 'vitest';
import { renderToSVG } from '../../../src/ssr';

const EXAMPLES_DIR = join(__dirname, 'examples');
const OUTPUT_DIR = join(__dirname, 'output', 'svgs');

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

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
  beforeAll(() => {
    if (process.env.GENERATE_GOLDEN) {
      console.log('Generating golden SVG files...');
    }
  });

  for (const file of exampleFiles) {
    it(`should render ${file}`, async () => {
      const input = readFileSync(join(EXAMPLES_DIR, file), 'utf-8');

      const result = await renderToSVG({ input });

      expect(result.errors).toHaveLength(0);
      expect(result.svg).toBeTruthy();
      expect(result.svg).toContain('<svg');
      expect(result.svg).toContain('</svg>');

      if (process.env.GENERATE_GOLDEN) {
        const svgFileName = file.replace('.txt', '.svg');
        writeFileSync(join(OUTPUT_DIR, svgFileName), result.svg);
        console.log(`Generated ${svgFileName}`);
      } else {
        const svgFileName = file.replace('.txt', '.svg');
        const goldenPath = join(OUTPUT_DIR, svgFileName);
        const goldenSvg = readFileSync(goldenPath, 'utf-8');

        expect(result.svg).toBe(goldenSvg);
      }
    });
  }
});
