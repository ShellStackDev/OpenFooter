import { existsSync } from 'node:fs';
const requiredFiles = [
  'dist/openfooter.iife.min.js','dist/openfooter.es.js','dist/index.d.ts',
  'examples/index.html','examples/google-sheet/index.html','examples/layouts/columns-brand.html','examples/layouts/centered.html','examples/layouts/compact.html','examples/layouts/all-layouts.html','examples/themes/dark.html','examples/themes/light.html','examples/themes/custom-colors.html','templates/openfooter-template.csv'
];
const missing = requiredFiles.filter((f) => !existsSync(f));
if (missing.length) { console.error('Smoke test failed. Missing files:'); missing.forEach((f)=>console.error(`- ${f}`)); process.exit(1); }
console.log('Smoke test passed.');
