import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main() {
  const rl = createInterface({ input, output });
  const brandName = await rl.question('Brand name: ');
  const tagline = await rl.question('Tagline (optional): ');
  const url = await rl.question('Google Sheet share URL: ');
  const gid = await rl.question('Sheet gid (default 0): ');
  const theme = await rl.question('Theme (light|dark|minimal|auto): ');
  const layout = await rl.question('Layout (compact|centered|columns-brand): ');
  rl.close();

  console.log('
Copy/paste embed code:
');
  console.log('<script src="https://cdn.jsdelivr.net/npm/openfooter/dist/openfooter.iife.min.js"></script>');
  console.log('');
  console.log('<open-footer');
  console.log(`  url="${url}"`);
  console.log(`  sheet-gid="${gid || '0'}"`);
  console.log(`  brand-name="${brandName}"`);
  if (tagline) console.log(`  brand-tagline="${tagline}"`);
  console.log(`  theme="${theme || 'dark'}"`);
  console.log(`  layout="${layout || 'columns-brand'}">`);
  console.log('</open-footer>');
}

main().catch((error) => { console.error(error); process.exit(1); });
