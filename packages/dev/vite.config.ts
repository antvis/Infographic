import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    host: 'local.alipay.com',
  },
  plugins: [tsconfigPaths()],
  optimizeDeps: {
    include: ['@alipay/infographic-dev', '@antv/infographic-jsx'],
  },
});
