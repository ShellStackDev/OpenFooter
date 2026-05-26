import { readCache, writeCache } from '../utils/cache';
import type { OpenFooterConfig, OpenFooterLink } from '../schema';

export async function getRemoteJsonLinks(config: OpenFooterConfig): Promise<OpenFooterLink[]> {
  if (!config.url) return [];
  const ttl = config.cacheTtlSeconds ?? 300;
  const key = `json:${config.url}`;
  const cached = readCache(key, ttl);
  try {
    const res = await fetch(config.url);
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json() as OpenFooterLink[];
    writeCache(key, data);
    return data;
  } catch {
    if (cached?.data) return cached.data as OpenFooterLink[];
    return [];
  }
}
