export const escapeHtml = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const isSafeUrl = (value: string): boolean => {
  const url = value.trim();
  if (!url) return false;
  const lowered = url.toLowerCase();
  if (lowered.startsWith('javascript:') || lowered.startsWith('data:text/html')) return false;
  try {
    const parsed = new URL(url, globalThis.location?.origin ?? 'https://example.com');
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};
