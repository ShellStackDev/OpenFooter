import type { OpenFooterConfig, OpenFooterLink } from './schema';
import { escapeHtml, isSafeUrl } from './utils/sanitize';

const isActiveNow = (l: OpenFooterLink) => {
  if (l.isActive === false) return false;
  const now = new Date();
  if (l.startDate && new Date(l.startDate) > now) return false;
  if (l.endDate && new Date(l.endDate) < now) return false;
  return true;
};

const normalize = (links: OpenFooterLink[]) => links
  .filter((l) => l.label && isSafeUrl(l.url) && isActiveNow(l))
  .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

export const buildFooterHtml = (config: OpenFooterConfig, links: OpenFooterLink[]): string => {
  const grouped = normalize(links).reduce<Record<string, OpenFooterLink[]>>((acc, l) => {
    const key = l.category || l.type || 'Links';
    (acc[key] ||= []).push(l);
    return acc;
  }, {});

  const sections = Object.entries(grouped).map(([name, items]) => `<section><h4>${escapeHtml(name)}</h4><ul>${items.map((l) => `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>${l.description ? `<div class="small">${escapeHtml(l.description)}</div>` : ''}</li>`).join('')}</ul></section>`).join('');

  if (!sections) return '<div class="wrap"><div class="inner">Unable to load footer links right now.</div></div>';

  return `<div class="wrap"><div class="inner"><div><h3>${escapeHtml(config.brandName ?? 'OpenFooter')}</h3>${config.brandTagline ? `<p class="small">${escapeHtml(config.brandTagline)}</p>` : ''}</div><div class="grid ${config.layout === 'columns' ? 'columns' : ''}">${sections}</div><div class="small">© ${new Date().getFullYear()} ${escapeHtml(config.copyrightName ?? config.brandName ?? 'OpenFooter')}${config.showPoweredBy === false ? '' : ` • <a href="https://github.com" target="_blank" rel="noopener noreferrer">Powered by OpenFooter</a>`}</div></div></div>`;
};
