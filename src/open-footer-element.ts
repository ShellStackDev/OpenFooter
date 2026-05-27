import type { OpenFooterConfig } from './schema';
import { getStyles } from './styles';
import { getGoogleSheetData } from './google-sheet';
import { buildFooterHtml } from './render';

const defaults: OpenFooterConfig = { theme: 'dark', layout: 'columns-brand', cacheTtlSeconds: 0, brandImageShape: 'rounded' };

export class OpenFooterElement extends HTMLElement {
  static get observedAttributes() { return ['url','sheet-gid','cache-ttl-seconds','disable-cache','brand-name','brand-tagline','brand-message','brand-image-url','brand-image-alt','brand-image-shape','copyright-name','show-powered-by','theme','layout']; }
  private root = this.attachShadow({ mode: 'open' });
  config: OpenFooterConfig = { ...defaults };
  private hasConnected = false;
  private renderQueued = false;
  private lastRequestKey?: string;

  connectedCallback() { this.hasConnected = true; this.syncAttributes(); this.requestRender(false); }
  attributeChangedCallback() { this.syncAttributes(); if (this.hasConnected) this.requestRender(false); }

  private syncAttributes() {
    this.config = { ...this.config,
      url: this.getAttribute('url') ?? this.config.url,
      sheetGid: this.getAttribute('sheet-gid') ?? this.config.sheetGid,
      cacheTtlSeconds: this.getAttribute('cache-ttl-seconds') != null ? Number(this.getAttribute('cache-ttl-seconds')) : this.config.cacheTtlSeconds,
      disableCache: this.getAttribute('disable-cache') != null ? this.getAttribute('disable-cache') !== 'false' : this.config.disableCache,
      brandName: this.getAttribute('brand-name') ?? this.config.brandName,
      brandTagline: this.getAttribute('brand-tagline') ?? this.config.brandTagline,
      brandMessage: this.getAttribute('brand-message') ?? this.config.brandMessage,
      brandImageUrl: this.getAttribute('brand-image-url') ?? this.config.brandImageUrl,
      brandImageAlt: this.getAttribute('brand-image-alt') ?? this.config.brandImageAlt,
      brandImageShape: (this.getAttribute('brand-image-shape') as OpenFooterConfig['brandImageShape']) ?? this.config.brandImageShape,
      copyrightName: this.getAttribute('copyright-name') ?? this.config.copyrightName,
      showPoweredBy: this.getAttribute('show-powered-by') != null ? this.getAttribute('show-powered-by') !== 'false' : this.config.showPoweredBy,
      theme: (this.getAttribute('theme') as OpenFooterConfig['theme']) ?? this.config.theme,
      layout: (this.getAttribute('layout') as OpenFooterConfig['layout']) ?? this.config.layout };
  }

  private requestRender(force: boolean) { if (this.renderQueued) return; this.renderQueued = true; queueMicrotask(() => { this.renderQueued = false; void this.refresh(force); }); }

  async refresh(force = true) {
    const requestKey = `${this.config.url ?? ''}:${this.config.sheetGid ?? ''}`;
    if (!force && this.lastRequestKey === requestKey) return;

    const data = await getGoogleSheetData({ ...this.config, cacheTtlSeconds: this.config.cacheTtlSeconds ?? 0 }, force);
    const mergedConfig: OpenFooterConfig = { ...data.config, ...this.config };

    this.lastRequestKey = requestKey;
    this.root.innerHTML = `<style>${getStyles()}</style>${buildFooterHtml(mergedConfig, data.links)}`;
  }
}
