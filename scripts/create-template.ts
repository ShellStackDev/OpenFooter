import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const outDir = process.argv[2] || 'generated-templates';
mkdirSync(outDir, { recursive: true });
copyFileSync(resolve('templates/openfooter-template.csv'), resolve(outDir, 'openfooter-template.csv'));
copyFileSync(resolve('templates/openfooter-template.json'), resolve(outDir, 'openfooter-template.json'));
console.log(`Templates written to ${outDir}`);
