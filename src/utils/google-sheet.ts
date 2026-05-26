export const GOOGLE_SHEET_SOURCES = ['google-sheet', 'google-sheets', 'google-sheet-csv'] as const;

export const isGoogleSheetSource = (source?: string): boolean =>
  GOOGLE_SHEET_SOURCES.includes((source ?? '').toLowerCase() as (typeof GOOGLE_SHEET_SOURCES)[number]);

export const normalizeGoogleSheetUrl = (url: string, gid?: string): string => {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('Invalid URL');
  }

  if (parsed.hostname !== 'docs.google.com') {
    throw new Error('URL must be a docs.google.com Google Sheets URL');
  }

  if (!parsed.pathname.startsWith('/spreadsheets/')) {
    throw new Error('URL is not a Google Sheets URL');
  }

  if (parsed.pathname.includes('/spreadsheets/d/e/')) {
    return parsed.toString();
  }

  const sheetMatch = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
  if (!sheetMatch) {
    throw new Error('Could not determine Google Sheet ID from URL');
  }

  const sheetId = sheetMatch[1];
  const hashGid = parsed.hash.match(/gid=(\d+)/)?.[1];
  const queryGid = parsed.searchParams.get('gid') ?? undefined;
  const resolvedGid = gid ?? queryGid ?? hashGid ?? '0';

  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${resolvedGid}`;
};
