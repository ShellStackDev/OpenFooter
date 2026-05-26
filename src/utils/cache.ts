const prefix = 'openfooter:';
export const readCache = (key: string, ttlSeconds: number) => {
  try {
    const raw = localStorage.getItem(prefix + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; data: unknown };
    const fresh = Date.now() - parsed.ts < ttlSeconds * 1000;
    return { data: parsed.data, fresh };
  } catch {
    return null;
  }
};

export const writeCache = (key: string, data: unknown) => {
  try { localStorage.setItem(prefix + key, JSON.stringify({ ts: Date.now(), data })); } catch {}
};
