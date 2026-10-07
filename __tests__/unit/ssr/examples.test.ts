import { describe, it, vi } from 'vitest';
import { renderToString } from '../../../src/ssr';
import { EXAMPLE_FILES, expectGolden, readExample } from './helpers';

vi.mock('../../../src/utils/fetch.ts', async (importOriginal) => {
  const { withMockedIcons } = await import('./helpers');
  return withMockedIcons(await importOriginal());
});

describe('SSR Examples', () => {
  for (const file of EXAMPLE_FILES) {
    it(`should render ${file}`, async () => {
      const result = await renderToString(readExample(file));

      expectGolden(file.replace('.txt', '.svg'), result);
    });
  }
});
