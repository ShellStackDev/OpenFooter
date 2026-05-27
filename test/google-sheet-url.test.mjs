import assert from 'node:assert/strict';
import { normalizeGoogleSheetUrl } from '../src/utils/google-sheet.ts';

const sheetId = 'abc123';

assert.equal(
  normalizeGoogleSheetUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`),
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=0`
);

assert.equal(
  normalizeGoogleSheetUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=456`),
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=456`
);

assert.equal(
  normalizeGoogleSheetUrl(`https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=456`, 789),
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=789`
);

const gviz = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=9`;
assert.equal(normalizeGoogleSheetUrl(gviz), gviz);
assert.equal(
  normalizeGoogleSheetUrl(gviz, 12),
  `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=12`
);

const pub = 'https://docs.google.com/spreadsheets/d/e/abc/pub?output=csv';
assert.equal(normalizeGoogleSheetUrl(pub), pub);

assert.throws(() => normalizeGoogleSheetUrl('https://example.com/sheet.csv'), /Google Sheets docs URL/);

console.log('google-sheet url normalization tests passed');
