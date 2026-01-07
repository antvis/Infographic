import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import * as path from 'path';

export default defineConfig({
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
  resolve: {
    alias: [
      { find: '@antv/infographic', replacement: path.resolve(__dirname, '../src') },
    ],
  },
  plugins: [tsconfigPaths()],
  optimizeDeps: {
    exclude: ['@antv/infographic', '@antv/hierarchy'],
  },
});
