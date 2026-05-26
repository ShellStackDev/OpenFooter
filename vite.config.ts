import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OpenFooter',
      formats: ['es', 'iife'],
      fileName: (format) => format === 'es' ? 'openfooter.es.js' : 'openfooter.iife.js'
    },
    minify: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
