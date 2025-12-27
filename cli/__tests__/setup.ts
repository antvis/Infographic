import { beforeAll, afterAll } from 'vitest';
import { setupDOM, teardownDOM } from '@antv/infographic/ssr';

// Setup jsdom environment before all tests
beforeAll(() => {
  setupDOM();
});

// Cleanup after all tests
afterAll(() => {
  teardownDOM();
});
