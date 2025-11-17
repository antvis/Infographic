import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {},
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['umd'],
      name: 'AntVInfographic',
      fileName: () => 'infographic.min.js',
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
    minify: 'esbuild',
    sourcemap: true,
    target: 'es2015',
    outDir: 'dist',
    emptyOutDir: false,
  },
  esbuild: {
    target: 'es2015',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
  },
});
