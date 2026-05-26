import { existsSync } from 'node:fs';

const requiredFiles = [
  'dist/openfooter.iife.min.js',
  'dist/openfooter.es.js',
  'dist/index.d.ts',
  'examples/local-inline/index.html',
  'examples/local-json/index.html',
  'examples/local-json/openfooter.links.json',
  'examples/cdn-local/index.html',
  'examples/google-sheet/index.html'
];

const missing = requiredFiles.filter((file) => !existsSync(file));

if (missing.length > 0) {
  console.error('Smoke test failed. Missing files:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

console.log('Smoke test passed. Required build artifacts and examples exist.');
