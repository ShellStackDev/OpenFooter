import { OpenFooterConfig, OpenFooterLink } from '../schema';
export declare function getGoogleSheetData(config: OpenFooterConfig, forceFresh?: boolean): Promise<{
    config: Partial<OpenFooterConfig>;
    links: OpenFooterLink[];
}>;
