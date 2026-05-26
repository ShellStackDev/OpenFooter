import { readFileSync } from 'node:fs';

const REQUIRED_COLUMNS = ['type','label','url','icon','category','priority','is_active','is_featured','description','start_date','end_date'];
const TRUE_FALSE = ['true','false','yes','no','1','0','y','n'];

const isSafeUrl = (value: string): boolean => {
  const url = value.trim();
  if (!url) return false;
  const lowered = url.toLowerCase();
  if (lowered.startsWith('javascript:') || lowered.startsWith('data:text/html')) return false;
  return /^(https?:|mailto:|tel:)/i.test(url);
};

const isValidDate = (value: string): boolean => !value || !Number.isNaN(Date.parse(value));
const parseCsvRow = (line: string) => line.split(',').map((v) => v.trim());

function validateCsv(path: string): string[] {
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvRow(lines[0] || '');
  const errors: string[] = [];

  REQUIRED_COLUMNS.forEach((col) => { if (!headers.includes(col)) errors.push(`Missing required column: ${col}`); });

  lines.slice(1).forEach((line, idx) => {
    const rowNum = idx + 2;
    const cols = parseCsvRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = cols[i] ?? ''; });

    if (!row.label) errors.push(`Row ${rowNum}: missing label`);
    if (!row.url || !isSafeUrl(row.url)) errors.push(`Row ${rowNum}: invalid/unsafe url`);
    if (row.priority && Number.isNaN(Number(row.priority))) errors.push(`Row ${rowNum}: priority must be a number`);
    ['is_active','is_featured'].forEach((k) => {
      const value = (row[k] || '').toLowerCase();
      if (value && !TRUE_FALSE.includes(value)) errors.push(`Row ${rowNum}: ${k} must be one of ${TRUE_FALSE.join(', ')}`);
    });
    if (!isValidDate(row.start_date || '')) errors.push(`Row ${rowNum}: invalid start_date`);
    if (!isValidDate(row.end_date || '')) errors.push(`Row ${rowNum}: invalid end_date`);
  });

  return errors;
}

function validateJson(path: string): string[] {
  const data = JSON.parse(readFileSync(path, 'utf8')) as any[];
  const errors: string[] = [];
  data.forEach((row, idx) => {
    const rowNum = idx + 1;
    if (!row.label) errors.push(`Item ${rowNum}: missing label`);
    if (!row.url || !isSafeUrl(row.url)) errors.push(`Item ${rowNum}: invalid/unsafe url`);
    if (row.priority !== undefined && Number.isNaN(Number(row.priority))) errors.push(`Item ${rowNum}: priority must be number`);
    if (!isValidDate(row.startDate ?? '')) errors.push(`Item ${rowNum}: invalid startDate`);
    if (!isValidDate(row.endDate ?? '')) errors.push(`Item ${rowNum}: invalid endDate`);
  });
  return errors;
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: npm run validate -- <path-to-csv-or-json>');
  process.exit(1);
}

const errors = filePath.endsWith('.csv') ? validateCsv(filePath) : validateJson(filePath);
if (errors.length) {
  console.error('Validation failed:\n' + errors.map((e) => `- ${e}`).join('\n'));
  process.exit(1);
}

console.log(`Validation passed for ${filePath}`);
