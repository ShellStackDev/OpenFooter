import type { OpenFooterConfig, OpenFooterLink } from '../schema';
export const getInlineLinks = (config: OpenFooterConfig): OpenFooterLink[] => config.links ?? [];
