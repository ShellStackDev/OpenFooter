import { OpenFooterConfig, OpenFooterLink } from '../schema';
export declare const parseCsv: (csv: string) => {
    config: Partial<OpenFooterConfig>;
    links: OpenFooterLink[];
};
