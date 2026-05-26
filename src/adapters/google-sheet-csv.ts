import { parseCsv } from '../utils/csv';
import { readCache, writeCache } from '../utils/cache';
import type { OpenFooterConfig, OpenFooterLink } from '../schema';
import { normalizeGoogleSheetUrl } from '../utils/google-sheet';

const inFlightDataRequests = new Map<string, Promise<{ config: Partial<OpenFooterConfig>; links: OpenFooterLink[] }>>();
const inFlightTextRequests = new Map<string, Promise<string>>();

const fetchTextOnce = async (url: string): Promise<string> => {
  const existing = inFlightTextRequests.get(url);
  if (existing) return existing;

  const promise = fetch(url, { redirect: 'follow' })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .finally(() => {
      inFlightTextRequests.delete(url);
    });

  inFlightTextRequests.set(url, promise);
  return promise;
};

const GOOGLE_SHEET_ERROR = [
  'OpenFooter could not load this Google Sheet as CSV.',
  '',
  'Make sure:',
  '1. The sheet is shared with "Anyone with the link can view", or',
  '2. The sheet is published to the web, and',
  '3. The selected sheet tab/gid exists.'
].join('\n');

export async function getGoogleSheetData(config: OpenFooterConfig): Promise<{ config: Partial<OpenFooterConfig>; links: OpenFooterLink[] }> {
  if (!config.url) return { config: {}, links: [] };

  const normalizedUrl = normalizeGoogleSheetUrl(config.url, config.sheetGid);
  const ttl = config.cacheTtlSeconds ?? 300;
  const key = `csv:${normalizedUrl}`;

  const existing = inFlightDataRequests.get(normalizedUrl);
  if (existing) return existing;

  const task = (async () => {
    const cached = readCache(key, ttl);
    if (cached?.fresh && cached.data) return cached.data as { config: Partial<OpenFooterConfig>; links: OpenFooterLink[] };

    try {
      const text = await fetchTextOnce(normalizedUrl);
      const maybeHtml = /^\s*<!doctype html/i.test(text) || /^\s*<html/i.test(text) || /<title>Google Sheets<\/title>/i.test(text);
      if (maybeHtml) throw new Error(GOOGLE_SHEET_ERROR);
      const parsed = parseCsv(text);
      writeCache(key, parsed);
      return parsed;
    } catch {
      if (cached?.data) return cached.data as { config: Partial<OpenFooterConfig>; links: OpenFooterLink[] };
      return { config: {}, links: [] };
    }
  })();

  inFlightDataRequests.set(normalizedUrl, task);
  try {
    return await task;
  } finally {
    inFlightDataRequests.delete(normalizedUrl);
  }
}
