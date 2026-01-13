import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    fs: {
      allow: ['..'],
    },
    port: 7080,
  },
  plugins: [tsconfigPaths({ root: '../' })],
  optimizeDeps: {
    exclude: ['@antv/infographic', '@antv/hierarchy'],
  },
});
