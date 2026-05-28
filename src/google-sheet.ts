import { parseCsv } from './csv';
import { readCache, writeCache } from './utils/cache';
import type { OpenFooterConfig, OpenFooterLink } from './schema';
import { normalizeGoogleSheetUrl } from './utils/google-sheet';

const inFlightDataRequests = new Map<string, Promise<{ config: Partial<OpenFooterConfig>; links: OpenFooterLink[] }>>();
const inFlightTextRequests = new Map<string, Promise<string>>();

const withCacheBust = (url: string): string => {
  const u = new URL(url);
  u.searchParams.set('_of_cache_bust', String(Date.now()));
  return u.toString();
};

const fetchTextOnce = async (dedupeKeyUrl: string, requestUrl: string): Promise<string> => {
  const existing = inFlightTextRequests.get(dedupeKeyUrl);
  if (existing) return existing;

  const promise = fetch(requestUrl, { redirect: 'follow' })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      return response.text();
    })
    .finally(() => {
      inFlightTextRequests.delete(dedupeKeyUrl);
    });

  inFlightTextRequests.set(dedupeKeyUrl, promise);
  return promise;
};

export async function getGoogleSheetData(config: OpenFooterConfig, forceFresh = false): Promise<{ config: Partial<OpenFooterConfig>; links: OpenFooterLink[] }> {
  if (!config.url) return { config: {}, links: [] };

  const normalizedUrl = normalizeGoogleSheetUrl(config.url, config.sheetGid);
  const ttl = config.disableCache ? 0 : (config.cacheTtlSeconds ?? 0);
  const key = `csv:${normalizedUrl}`;

  const dedupeKey = forceFresh ? `${normalizedUrl}:force:${Date.now()}` : normalizedUrl;
  const existing = inFlightDataRequests.get(dedupeKey);
  if (existing) return existing;

  const task = (async () => {
    const cached = forceFresh || ttl <= 0 ? null : readCache(key, ttl);
    if (cached?.fresh && cached.data) return cached.data as { config: Partial<OpenFooterConfig>; links: OpenFooterLink[] };

    try {
      const text = await fetchTextOnce(dedupeKey, withCacheBust(normalizedUrl));
      const maybeHtml = /^\s*<!doctype html/i.test(text) || /^\s*<html/i.test(text) || /<title>Google Sheets<\/title>/i.test(text);
      if (maybeHtml) throw new Error('OpenFooter could not load this Google Sheet as CSV.\n\nMake sure:\n1. The sheet is shared with "Anyone with the link can view", or\n2. The sheet is published to the web, and\n3. The selected sheet tab/gid exists.');
      const parsed = parseCsv(text);
      if (!forceFresh && ttl > 0) writeCache(key, parsed);
      return parsed;
    } catch {
      if (cached?.data) return cached.data as { config: Partial<OpenFooterConfig>; links: OpenFooterLink[] };
      return { config: {}, links: [] };
    }
  })();

  inFlightDataRequests.set(dedupeKey, task);
  try { return await task; } finally { inFlightDataRequests.delete(dedupeKey); }
}
