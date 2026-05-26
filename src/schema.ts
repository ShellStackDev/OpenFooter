export type OpenFooterLinkType =
  | 'social'
  | 'project'
  | 'legal'
  | 'featured'
  | 'contact'
  | 'custom';

export type OpenFooterLayout =
  | 'simple'
  | 'centered'
  | 'social'
  | 'columns'
  | 'columns-brand'
  | 'newsletter'
  | 'compact';


export type OpenFooterBrandImageShape = 'circle' | 'rounded' | 'square';

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
  source?: 'inline-json' | 'remote-json' | 'google-sheet-csv' | 'google-sheet' | 'google-sheets';
  url?: string;
  sheetGid?: string;
  links?: OpenFooterLink[];
  brandName?: string;
  brandTagline?: string;
  brandMessage?: string;
  brandImageUrl?: string;
  brandImageAlt?: string;
  brandImageShape?: OpenFooterBrandImageShape;
  copyrightName?: string;
  theme?: 'light' | 'dark' | 'minimal' | 'auto';
  layout?: OpenFooterLayout;
  showPoweredBy?: boolean;
  cacheTtlSeconds?: number;
  newsletter?: {
    enabled?: boolean;
    title?: string;
    description?: string;
    placeholder?: string;
    buttonLabel?: string;
    actionUrl?: string;
  };
};
