export const normalizeGoogleSheetUrl = (url: string, gid?: string | number): string => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid Google Sheets URL. Expected a docs.google.com/spreadsheets URL.');
  }

  if (parsed.hostname !== 'docs.google.com' || !parsed.pathname.startsWith('/spreadsheets/')) {
    throw new Error('URL must be a Google Sheets docs URL (docs.google.com/spreadsheets/...).');
  }

  if (parsed.pathname.includes('/spreadsheets/d/e/') && parsed.pathname.includes('/pub')) {
    return parsed.toString();
  }

  const gvizMatch = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)\/gviz\/tq/i);
  const sheetMatch = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)/i);
  const sheetId = gvizMatch?.[1] || sheetMatch?.[1];
  if (!sheetId) throw new Error('Could not determine spreadsheet ID from URL.');

  const hashGid = parsed.hash.match(/gid=(\d+)/)?.[1];
  const queryGid = parsed.searchParams.get('gid') ?? undefined;
  const resolvedGid = String(gid ?? queryGid ?? hashGid ?? '0');

  if (gvizMatch && gid === undefined) return parsed.toString();
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${encodeURIComponent(resolvedGid)}`;
};
