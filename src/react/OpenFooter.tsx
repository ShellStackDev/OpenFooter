"use client";

import React, { useEffect, useMemo } from "react";

export type OpenFooterReactProps = {
  url: string;
  sheetGid?: string | number;
  brandName?: string;
  brandTagline?: string;
  brandMessage?: string;
  brandImageUrl?: string;
  brandImageAlt?: string;
  brandImageShape?: "circle" | "rounded" | "square";
  copyrightName?: string;
  theme?: "light" | "dark" | "minimal" | "auto";
  layout?: "simple" | "centered" | "social" | "columns" | "columns-brand" | "newsletter" | "compact";
  primaryColor?: string;
  accentColor?: string;
  accentColor2?: string;
  backgroundStyle?: "solid" | "gradient" | "mesh" | "minimal" | "dark";
  disableCache?: boolean;
  showPoweredBy?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export const OpenFooter: React.FC<OpenFooterReactProps> = (props) => {
  useEffect(() => {
    void import("../index");
  }, []);

  const attrs = useMemo(() => {
    const result: Record<string, unknown> = {
      url: props.url,
      "sheet-gid": props.sheetGid,
      "brand-name": props.brandName,
      "brand-tagline": props.brandTagline,
      "brand-message": props.brandMessage,
      "brand-image-url": props.brandImageUrl,
      "brand-image-alt": props.brandImageAlt,
      "brand-image-shape": props.brandImageShape,
      "copyright-name": props.copyrightName,
      theme: props.theme,
      layout: props.layout,
      "primary-color": props.primaryColor,
      "accent-color": props.accentColor,
      "accent-color-2": props.accentColor2,
      "background-style": props.backgroundStyle,
      "disable-cache": props.disableCache == null ? undefined : String(props.disableCache),
      "show-powered-by": props.showPoweredBy == null ? undefined : String(props.showPoweredBy),
      className: props.className,
      style: props.style
    };

    return Object.fromEntries(Object.entries(result).filter(([, value]) => value !== undefined));
  }, [props]);

  return React.createElement("open-footer", attrs);
};

export default OpenFooter;
