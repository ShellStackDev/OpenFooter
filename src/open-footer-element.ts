import type { OpenFooterConfig, OpenFooterLink } from './schema';
import { getStyles } from './styles';
import { getInlineLinks } from './adapters/inline-json';
import { getRemoteJsonLinks } from './adapters/remote-json';
import { getGoogleSheetLinks } from './adapters/google-sheet-csv';
import { buildFooterHtml } from './render';
import { isGoogleSheetSource } from './utils/google-sheet';

const defaults: OpenFooterConfig = { source: 'inline-json', theme: 'dark', layout: 'full', cacheTtlSeconds: 300 };

export class OpenFooterElement extends HTMLElement {
  static get observedAttributes() { return ['source','url','sheet-gid','brand-name','brand-tagline','theme','layout']; }
  private root = this.attachShadow({ mode: 'open' });
  config: OpenFooterConfig = { ...defaults };
  private hasConnected = false;
  private renderQueued = false;
  private lastRequestKey?: string;

  connectedCallback() {
    this.hasConnected = true;
    this.syncAttributes();
    this.requestRender(false);
  }

  attributeChangedCallback() {
    this.syncAttributes();
    if (this.hasConnected) this.requestRender(false);
  }

  private syncAttributes() {
    this.config = {
      ...this.config,
      source: (this.getAttribute('source') as OpenFooterConfig['source']) ?? this.config.source,
      url: this.getAttribute('url') ?? this.config.url,
      sheetGid: this.getAttribute('sheet-gid') ?? this.config.sheetGid,
      brandName: this.getAttribute('brand-name') ?? this.config.brandName,
      brandTagline: this.getAttribute('brand-tagline') ?? this.config.brandTagline,
      theme: (this.getAttribute('theme') as OpenFooterConfig['theme']) ?? this.config.theme,
      layout: (this.getAttribute('layout') as OpenFooterConfig['layout']) ?? this.config.layout
    };
  }

  private requestRender(force: boolean) {
    if (this.renderQueued) return;
    this.renderQueued = true;
    queueMicrotask(() => {
      this.renderQueued = false;
      void this.refresh(force);
    });
  }

  async refresh(force = true) {
    const sourceKey = isGoogleSheetSource(this.config.source) ? 'google-sheet-csv' : (this.config.source ?? 'inline-json');
    const requestKey = `${sourceKey}:${this.config.url ?? ''}:${this.config.sheetGid ?? ''}`;
    if (!force && this.lastRequestKey === requestKey) return;

    let links: OpenFooterLink[] = [];
    if (sourceKey === 'remote-json') links = await getRemoteJsonLinks(this.config);
    else if (sourceKey === 'google-sheet-csv') links = await getGoogleSheetLinks(this.config);
    else links = getInlineLinks(this.config);

    this.lastRequestKey = requestKey;
    this.root.innerHTML = `<style>${getStyles()}</style>${buildFooterHtml(this.config, links)}`;
  }
}
