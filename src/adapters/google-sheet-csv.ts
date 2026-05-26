import { parseCsv } from '../utils/csv';
import { readCache, writeCache } from '../utils/cache';
import type { OpenFooterConfig, OpenFooterLink } from '../schema';
import { normalizeGoogleSheetUrl } from '../utils/google-sheet';

const inFlightRequests = new Map<string, Promise<OpenFooterLink[]>>();

export async function getGoogleSheetLinks(config: OpenFooterConfig): Promise<OpenFooterLink[]> {
  if (!config.url) return [];

  let normalizedUrl = config.url;
  try {
    normalizedUrl = normalizeGoogleSheetUrl(config.url, config.sheetGid);
  } catch {
    return [];
  }

  const ttl = config.cacheTtlSeconds ?? 300;
  const requestKey = `google-sheet:${normalizedUrl}`;
  const key = `csv:${normalizedUrl}`;

  const existing = inFlightRequests.get(requestKey);
  if (existing) return existing;

  const task = (async () => {
    const cached = readCache(key, ttl);
    if (cached?.fresh && cached.data) return cached.data as OpenFooterLink[];

    try {
      const res = await fetch(normalizedUrl);
      if (!res.ok) throw new Error('Fetch failed');

      const contentType = res.headers.get('content-type')?.toLowerCase() ?? '';
      const csv = await res.text();
      const looksLikeHtml = contentType.includes('text/html') || /<\s*html/i.test(csv);
      if (looksLikeHtml) {
        throw new Error('OpenFooter could not load the Google Sheet. The URL did not return CSV. Make sure the sheet is shared publicly or published to the web. For easiest setup, use Share → Anyone with the link can view, or File → Share → Publish to web.');
      }

      const parsed = parseCsv(csv);
      writeCache(key, parsed);
      return parsed;
    } catch {
      if (cached?.data) return cached.data as OpenFooterLink[];
      return [];
    }
  })();

  inFlightRequests.set(requestKey, task);
  try {
    return await task;
  } finally {
    inFlightRequests.delete(requestKey);
  }
}
