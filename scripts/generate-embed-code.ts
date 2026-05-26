import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function main() {
  const rl = createInterface({ input, output });
  const brandName = await rl.question('Brand name: ');
  const tagline = await rl.question('Tagline (optional): ');
  const source = await rl.question('Source type (google-sheet-csv|remote-json|inline-json): ');
  const url = await rl.question('CSV/JSON URL: ');
  const theme = await rl.question('Theme (light|dark|minimal|auto): ');
  const layout = await rl.question('Layout (compact|full|columns): ');
  rl.close();

  console.log('\nCopy/paste embed code:\n');
  console.log('<script src="https://cdn.jsdelivr.net/npm/openfooter/dist/openfooter.iife.min.js"></script>');
  console.log('');
  console.log('<open-footer');
  console.log(`  source="${source || 'google-sheet-csv'}"`);
  console.log(`  url="${url}"`);
  console.log(`  brand-name="${brandName}"`);
  if (tagline) console.log(`  brand-tagline="${tagline}"`);
  console.log(`  theme="${theme || 'dark'}"`);
  console.log(`  layout="${layout || 'columns'}">`);
  console.log('</open-footer>');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
