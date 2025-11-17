import { resolve } from 'path';
import { defineConfig } from 'vite';

const entry = process.env.ENTRY || 'index';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, `src/${entry}.ts`),
      formats: ['umd'],
      name:
        entry === 'index' ? 'AntVInfographicJSX' : 'AntVInfographicJSXRuntime',
      fileName: () => `${entry}.umd.js`,
    },
    rollupOptions: {
      external: ['@types/react'],
    },
    minify: 'esbuild',
    sourcemap: true,
    target: 'es2015',
    outDir: 'dist',
    emptyOutDir: entry === 'index',
  },
  esbuild: {
    target: 'es2015',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
});
