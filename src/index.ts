import { OpenFooterElement } from './open-footer-element';
import type { OpenFooterConfig } from './schema';

if (!customElements.get('open-footer')) customElements.define('open-footer', OpenFooterElement);

const resolveEl = (selectorOrElement?: string | Element | null) => {
  if (!selectorOrElement) return document.querySelector('open-footer');
  return typeof selectorOrElement === 'string' ? document.querySelector(selectorOrElement) : selectorOrElement;
};

export const OpenFooter = {
  version: '0.1.0',
  render(selectorOrElement: string | Element, config: OpenFooterConfig) {
    const target = resolveEl(selectorOrElement);
    if (!target) return;
    if (target instanceof OpenFooterElement) {
      target.config = { ...target.config, ...config };
      void target.refresh();
      return;
    }
    const el = document.createElement('open-footer') as OpenFooterElement;
    el.config = config;
    target.appendChild(el);
  },
  refresh(selectorOrElement?: string | Element) {
    const target = resolveEl(selectorOrElement);
    if (target instanceof OpenFooterElement) void target.refresh();
  }
};

(window as any).OpenFooter = OpenFooter;
export * from './schema';
