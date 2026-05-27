import type { OpenFooterConfig, OpenFooterLink } from './schema';
import { getStyles } from './styles';
import { getInlineLinks } from './adapters/inline-json';
import { getRemoteJsonLinks } from './adapters/remote-json';
import { getGoogleSheetData } from './adapters/google-sheet-csv';
import { buildFooterHtml } from './render';
import { isGoogleSheetSource } from './utils/google-sheet';

const defaults: OpenFooterConfig = { source: 'inline-json', theme: 'dark', layout: 'compact', cacheTtlSeconds: 300, brandImageShape: 'rounded' };

export class OpenFooterElement extends HTMLElement {
  static get observedAttributes() { return ['source','url','sheet-gid','cache-ttl-seconds','disable-cache','brand-name','brand-tagline','brand-message','brand-image-url','brand-image-alt','brand-image-shape','theme','layout']; }
  private root = this.attachShadow({ mode: 'open' });
  config: OpenFooterConfig = { ...defaults };
  private hasConnected = false;
  private renderQueued = false;
  private lastRequestKey?: string;

  connectedCallback() { this.hasConnected = true; this.syncAttributes(); this.requestRender(false); }
  attributeChangedCallback() { this.syncAttributes(); if (this.hasConnected) this.requestRender(false); }

  private syncAttributes() {
    this.config = { ...this.config,
      source: (this.getAttribute('source') as OpenFooterConfig['source']) ?? this.config.source,
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
      theme: (this.getAttribute('theme') as OpenFooterConfig['theme']) ?? this.config.theme,
      layout: (this.getAttribute('layout') as OpenFooterConfig['layout']) ?? this.config.layout };
  }

  private requestRender(force: boolean) { if (this.renderQueued) return; this.renderQueued = true; queueMicrotask(() => { this.renderQueued = false; void this.refresh(force); }); }

  async refresh(force = true) {
    const sourceKey = isGoogleSheetSource(this.config.source) ? 'google-sheet-csv' : (this.config.source ?? 'inline-json');
    const requestKey = `${sourceKey}:${this.config.url ?? ''}:${this.config.sheetGid ?? ''}`;
    if (!force && this.lastRequestKey === requestKey) return;

    let links: OpenFooterLink[] = [];
    let mergedConfig: OpenFooterConfig = { ...this.config };
    if (sourceKey === 'remote-json') links = await getRemoteJsonLinks(mergedConfig, force);
    else if (sourceKey === 'google-sheet-csv') {
      const data = await getGoogleSheetData(mergedConfig, force);
      mergedConfig = { ...data.config, ...mergedConfig };
      links = data.links;
    } else links = getInlineLinks(mergedConfig);

    this.lastRequestKey = requestKey;
    this.root.innerHTML = `<style>${getStyles()}</style>${buildFooterHtml(mergedConfig, links)}`;
  }
}
