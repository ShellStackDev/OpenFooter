import type { OpenFooterConfig, OpenFooterLink } from './schema';
import { escapeHtml, isSafeUrl } from './utils/sanitize';

const isActiveNow = (l: OpenFooterLink) => {
  if (l.isActive === false) return false;
  const now = new Date();
  if (l.startDate && new Date(l.startDate) > now) return false;
  if (l.endDate && new Date(l.endDate) < now) return false;
  return true;
};

const normalizeLinks = (links: OpenFooterLink[]) => links
  .filter((l) => l.label && isSafeUrl(l.url) && isActiveNow(l))
  .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));

export const groupLinksByCategory = (links: OpenFooterLink[]): Record<string, OpenFooterLink[]> => normalizeLinks(links)
  .reduce<Record<string, OpenFooterLink[]>>((acc, l) => {
    const key = l.category || l.type || 'Links';
    (acc[key] ||= []).push(l);
    return acc;
  }, {});

export const renderBrandBlock = (config: OpenFooterConfig): string => {
  if (!config.brandName && !config.brandTagline && !config.brandMessage && !config.brandImageUrl) return '';
  const imageAlt = config.brandImageAlt || `${config.brandName || 'OpenFooter'} logo`;
  const shape = config.brandImageShape || 'rounded';
  const image = config.brandImageUrl && isSafeUrl(config.brandImageUrl)
    ? `<img class="openfooter-brand-image shape-${shape}" src="${escapeHtml(config.brandImageUrl)}" alt="${escapeHtml(imageAlt)}" loading="lazy" onerror="this.style.display='none'" />`
    : '';
  return `<div class="openfooter-brand"><div class="openfooter-brand-main">${image}<div><div class="openfooter-brand-name">${escapeHtml(config.brandName || '')}</div>${config.brandTagline ? `<div class="openfooter-brand-tagline">${escapeHtml(config.brandTagline)}</div>` : ''}${config.brandMessage ? `<div class="openfooter-brand-message">${escapeHtml(config.brandMessage)}</div>` : ''}</div></div></div>`;
};

const renderLinks = (items: OpenFooterLink[]) => `<ul>${items.map((l) => `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>${l.description ? `<div class="small">${escapeHtml(l.description)}</div>` : ''}</li>`).join('')}</ul>`;
const renderColumns = (grouped: Record<string, OpenFooterLink[]>) => Object.entries(grouped).map(([name, items]) => `<section><h4>${escapeHtml(name)}</h4>${renderLinks(items)}</section>`).join('');

export const buildFooterHtml = (config: OpenFooterConfig, links: OpenFooterLink[]): string => {
  const normalized = normalizeLinks(links);
  const grouped = groupLinksByCategory(links);
  const sections = renderColumns(grouped);
  if (!sections && !normalized.length) return '<div class="wrap"><div class="inner">Unable to load footer links right now.</div></div>';
  const layout = config.layout ?? 'compact';
  const brand = renderBrandBlock(config);
  const socials = normalized.filter((l) => l.type === 'social');
  const socialRow = socials.length ? `<div class="social-row">${socials.map((s) => `<a class="social-link" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.icon || s.label)}</a>`).join('')}</div>` : '';
  const newsletter = config.newsletter?.enabled ? `<section class="newsletter"><h4>${escapeHtml(config.newsletter.title ?? 'Subscribe')}</h4><p class="small">${escapeHtml(config.newsletter.description ?? 'Get updates in your inbox.')}</p><form method="post" action="${escapeHtml(config.newsletter.actionUrl ?? '#')}"><input type="email" placeholder="${escapeHtml(config.newsletter.placeholder ?? 'Email address')}" /><button type="submit">${escapeHtml(config.newsletter.buttonLabel ?? 'Subscribe')}</button></form></section>` : '';

  const body: Record<string,string> = {
    simple: `<div class="layout simple">${brand}<nav class="inline-links">${normalized.map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`).join('')}</nav></div>`,
    centered: `<div class="layout centered">${brand}<nav class="inline-links centered">${normalized.map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`).join('')}</nav></div>`,
    social: `<div class="layout social">${brand}${socialRow}<div class="grid columns">${sections}</div></div>`,
    columns: `<div class="layout columns">${brand}<div class="grid columns">${sections}</div></div>`,
    'columns-brand': `<div class="layout columns-brand">${brand}<div class="grid columns">${sections}</div></div>`,
    newsletter: `<div class="layout newsletter">${brand}<div class="grid columns">${sections}</div>${newsletter}</div>`,
    compact: `<div class="layout compact">${brand}<nav class="inline-links">${normalized.map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`).join('')}</nav></div>`
  };

  return `<div class="wrap"><div class="inner">${body[layout] ?? body.compact}<div class="small copyright">© ${new Date().getFullYear()} ${escapeHtml(config.copyrightName ?? config.brandName ?? 'OpenFooter')}${config.showPoweredBy === false ? '' : ` • <a href="https://github.com" target="_blank" rel="noopener noreferrer">Powered by OpenFooter</a>`}</div></div></div>`;
};
