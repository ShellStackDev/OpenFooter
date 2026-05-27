export declare const GOOGLE_SHEET_SOURCES: readonly ["google-sheet", "google-sheets", "google-sheet-csv"];
export declare const isGoogleSheetSource: (source?: string) => boolean;
export declare const normalizeGoogleSheetUrl: (url: string, gid?: string | number) => string;
