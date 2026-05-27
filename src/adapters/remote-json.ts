import { readCache, writeCache } from '../utils/cache';
import type { OpenFooterConfig, OpenFooterLink } from '../schema';

export async function getRemoteJsonLinks(config: OpenFooterConfig, forceFresh = false): Promise<OpenFooterLink[]> {
  if (!config.url) return [];
  const ttl = config.disableCache ? 0 : (config.cacheTtlSeconds ?? 300);
  const key = `json:${config.url}`;
  const cached = forceFresh || ttl <= 0 ? null : readCache(key, ttl);
  try {
    const res = await fetch(config.url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    const data = await res.json() as OpenFooterLink[];
    if (!forceFresh && ttl > 0) writeCache(key, data);
    return data;
  } catch {
    if (cached?.data) return cached.data as OpenFooterLink[];
    return [];
  }
}
