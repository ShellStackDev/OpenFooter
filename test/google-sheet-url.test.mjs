import assert from 'node:assert/strict';
import { normalizeGoogleSheetUrl } from '../src/utils/google-sheet.ts';

const sheetId = '19MtVKVncGDUlRxSWbWcJftAKBkszbIdWk8jwfGdrg5g';

assert.equal(
  normalizeGoogleSheetUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`),
  `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`
);

assert.equal(
  normalizeGoogleSheetUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=123`),
  `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=123`
);

assert.equal(
  normalizeGoogleSheetUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/view?usp=sharing&gid=8`),
  `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=8`
);

const pub = 'https://docs.google.com/spreadsheets/d/e/abc/pub?output=csv';
assert.equal(normalizeGoogleSheetUrl(pub), pub);

assert.throws(() => normalizeGoogleSheetUrl('notaurl'));
assert.throws(() => normalizeGoogleSheetUrl('https://example.com/sheet.csv'));

console.log('google-sheet url normalization tests passed');
