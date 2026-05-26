import type { OpenFooterConfig, OpenFooterLink } from './schema';
import { getStyles } from './styles';
import { getInlineLinks } from './adapters/inline-json';
import { getRemoteJsonLinks } from './adapters/remote-json';
import { getGoogleSheetLinks } from './adapters/google-sheet-csv';
import { buildFooterHtml } from './render';

const defaults: OpenFooterConfig = { source: 'inline-json', theme: 'dark', layout: 'full', cacheTtlSeconds: 300 };

export class OpenFooterElement extends HTMLElement {
  static get observedAttributes() { return ['source','url','brand-name','brand-tagline','theme','layout']; }
  private root = this.attachShadow({ mode: 'open' });
  config: OpenFooterConfig = { ...defaults };

  connectedCallback() { this.syncAttributes(); void this.refresh(); }
  attributeChangedCallback() { this.syncAttributes(); void this.refresh(); }

  private syncAttributes() {
    this.config = {
      ...this.config,
      source: (this.getAttribute('source') as OpenFooterConfig['source']) ?? this.config.source,
      url: this.getAttribute('url') ?? this.config.url,
      brandName: this.getAttribute('brand-name') ?? this.config.brandName,
      brandTagline: this.getAttribute('brand-tagline') ?? this.config.brandTagline,
      theme: (this.getAttribute('theme') as OpenFooterConfig['theme']) ?? this.config.theme,
      layout: (this.getAttribute('layout') as OpenFooterConfig['layout']) ?? this.config.layout
    };
  }

  async refresh() {
    let links: OpenFooterLink[] = [];
    if (this.config.source === 'remote-json') links = await getRemoteJsonLinks(this.config);
    else if (this.config.source === 'google-sheet-csv') links = await getGoogleSheetLinks(this.config);
    else links = getInlineLinks(this.config);
    this.root.innerHTML = `<style>${getStyles()}</style>${buildFooterHtml(this.config, links)}`;
  }
}
