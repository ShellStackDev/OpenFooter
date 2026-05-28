import { OpenFooterConfig, OpenFooterLink } from './schema';
export declare const groupLinksByCategory: (links: OpenFooterLink[]) => Record<string, OpenFooterLink[]>;
export declare const renderBrandBlock: (config: OpenFooterConfig) => string;
export declare const buildFooterHtml: (config: OpenFooterConfig, links: OpenFooterLink[]) => string;
