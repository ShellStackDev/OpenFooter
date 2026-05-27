import { minify } from 'terser';
import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync('dist/openfooter.iife.js', 'utf8');
const result = await minify(source, {
  compress: true,
  mangle: true,
  format: { comments: false }
});

if (!result.code) {
  throw new Error('Failed to minify dist/openfooter.iife.js');
}

writeFileSync('dist/openfooter.iife.min.js', result.code, 'utf8');
console.log('Created dist/openfooter.iife.min.js');
