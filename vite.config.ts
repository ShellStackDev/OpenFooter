import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      outDir: 'dist'
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'OpenFooter',
      formats: ['es', 'iife'],
      fileName: (format) => (format === 'es' ? 'openfooter.es.js' : 'openfooter.iife.js')
    },
    minify: false,
    rollupOptions: {
      output: {
        extend: true,
        inlineDynamicImports: true
      }
    }
  }
});
