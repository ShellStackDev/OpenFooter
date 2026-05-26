export type OpenFooterLinkType =
  | 'social'
  | 'project'
  | 'legal'
  | 'featured'
  | 'contact'
  | 'custom';

export type OpenFooterLink = {
  label: string;
  url: string;
  type?: OpenFooterLinkType;
  icon?: string;
  category?: string;
  description?: string;
  priority?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  startDate?: string;
  endDate?: string;
};

export type OpenFooterConfig = {
  source?: 'inline-json' | 'remote-json' | 'google-sheet-csv';
  url?: string;
  links?: OpenFooterLink[];
  brandName?: string;
  brandTagline?: string;
  copyrightName?: string;
  theme?: 'light' | 'dark' | 'minimal' | 'auto';
  layout?: 'compact' | 'full' | 'columns';
  showPoweredBy?: boolean;
  cacheTtlSeconds?: number;
};
