import { parseCsv } from '../utils/csv';
import { readCache, writeCache } from '../utils/cache';
import type { OpenFooterConfig, OpenFooterLink } from '../schema';

export async function getGoogleSheetLinks(config: OpenFooterConfig): Promise<OpenFooterLink[]> {
  if (!config.url) return [];
  const ttl = config.cacheTtlSeconds ?? 300;
  const key = `csv:${config.url}`;
  const cached = readCache(key, ttl);
  try {
    const res = await fetch(config.url);
    if (!res.ok) throw new Error('Fetch failed');
    const csv = await res.text();
    const parsed = parseCsv(csv);
    writeCache(key, parsed);
    return parsed;
  } catch {
    if (cached?.data) return cached.data as OpenFooterLink[];
    return [];
  }
}
