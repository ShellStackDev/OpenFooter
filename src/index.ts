import { OpenFooterElement } from './open-footer-element';

if (!customElements.get('open-footer')) customElements.define('open-footer', OpenFooterElement);

const resolveEl = (selectorOrElement?: string | Element | null) => {
  if (!selectorOrElement) return document.querySelector('open-footer');
  return typeof selectorOrElement === 'string' ? document.querySelector(selectorOrElement) : selectorOrElement;
};

export const OpenFooter = {
  version: '0.1.2',
  refresh(selectorOrElement?: string | Element) {
    const target = resolveEl(selectorOrElement);
    if (target instanceof OpenFooterElement) void target.refresh(true);
  }
};

(window as any).OpenFooter = OpenFooter;
export * from './schema';
