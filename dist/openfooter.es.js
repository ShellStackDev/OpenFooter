const getStyles = () => `
:host{--of-bg:#101114;--of-text:#f2f2f2;--of-muted:#b6bdc7;--of-link:#83b8ff;--of-link-hover:#b9d4ff;--of-border:#2b313b;--of-radius:12px;--of-max-width:1100px;--of-font-family:Inter,system-ui,sans-serif;--of-column-gap:24px;--of-row-gap:16px;--of-padding:24px 16px;--of-brand-image-size:48px;--of-brand-image-radius:var(--of-radius);--of-brand-message-max-width:36rem;display:block}
:host([theme="light"]){--of-bg:#fff;--of-text:#1a1d21;--of-muted:#5f6773;--of-link:#0057d8;--of-link-hover:#003e9b;--of-border:#e3e8ef}
:host([theme="minimal"]){--of-bg:transparent;--of-border:transparent}
.wrap{background:var(--of-bg);color:var(--of-text);font-family:var(--of-font-family);border-top:1px solid var(--of-border)}
.inner{max-width:var(--of-max-width);margin:0 auto;padding:var(--of-padding);display:grid;gap:var(--of-row-gap)}
.layout{display:grid;gap:var(--of-row-gap)}
.layout.simple,.layout.columns-brand,.layout.newsletter{grid-template-columns:1fr 2fr;align-items:start}
.layout.centered{text-align:center}.layout.centered .openfooter-brand-main{justify-content:center;text-align:center}
.inline-links{display:flex;flex-wrap:wrap;gap:12px}.inline-links.centered{justify-content:center}
.grid.columns{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--of-row-gap) var(--of-column-gap)}
a{color:var(--of-link)}a:hover{color:var(--of-link-hover)}
.small{font-size:.88rem;color:var(--of-muted)} ul{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.social-row{display:flex;gap:10px;flex-wrap:wrap}.social-link{padding:6px 10px;border:1px solid var(--of-border);border-radius:999px;text-decoration:none}
.openfooter-brand{display:grid;gap:8px}.openfooter-brand-main{display:flex;gap:12px;align-items:flex-start}.openfooter-brand-image{width:var(--of-brand-image-size);height:var(--of-brand-image-size);object-fit:cover;border:1px solid var(--of-border)}.openfooter-brand-image.shape-circle{border-radius:999px}.openfooter-brand-image.shape-rounded{border-radius:var(--of-brand-image-radius)}.openfooter-brand-image.shape-square{border-radius:0}.openfooter-brand-name{font-weight:700}.openfooter-brand-tagline{color:var(--of-muted)}.openfooter-brand-message{max-width:var(--of-brand-message-max-width);color:var(--of-muted)}
.newsletter form{display:flex;gap:8px;flex-wrap:wrap}.newsletter input{padding:8px;border-radius:8px;border:1px solid var(--of-border);background:transparent;color:var(--of-text)}.newsletter button{padding:8px 12px;border-radius:8px;border:1px solid var(--of-border);background:var(--of-link);color:#fff}
@media (max-width: 840px){.layout.simple,.layout.columns-brand,.layout.newsletter{grid-template-columns:1fr}}
`;
const parseBool = (v) => ["true", "yes", "1", "y"].includes((v ?? "").trim().toLowerCase());
const splitCsvLine = (line) => {
  const out = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  out.push(current.trim());
  return out;
};
const META_KEYS = /* @__PURE__ */ new Set([
  "brandName",
  "brandTagline",
  "brandMessage",
  "brandImageUrl",
  "brandImageAlt",
  "brandImageShape",
  "copyrightName",
  "theme",
  "layout",
  "showPoweredBy"
]);
const parseCsv = (csv) => {
  const [headerLine, ...lines] = csv.split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(headerLine || "");
  const config = {};
  const links = [];
  lines.forEach((line) => {
    const cols = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = cols[i] ?? "";
    });
    if ((row.type || "").toLowerCase() === "meta") {
      const key = row.key;
      if (!META_KEYS.has(key)) return;
      const value = row.value;
      if (key === "showPoweredBy") {
        config.showPoweredBy = parseBool(value);
        return;
      }
      config[key] = value;
      return;
    }
    links.push({
      type: row.type || "custom",
      label: row.label,
      url: row.url,
      icon: row.icon,
      category: row.category,
      priority: row.priority ? Number(row.priority) : void 0,
      isActive: row.is_active ? parseBool(row.is_active) : true,
      isFeatured: row.is_featured ? parseBool(row.is_featured) : void 0,
      description: row.description,
      startDate: row.start_date,
      endDate: row.end_date
    });
  });
  return { config, links };
};
const prefix = "openfooter:";
const readCache = (key, ttlSeconds) => {
  try {
    const raw = localStorage.getItem(prefix + key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const fresh = Date.now() - parsed.ts < ttlSeconds * 1e3;
    return { data: parsed.data, fresh };
  } catch {
    return null;
  }
};
const writeCache = (key, data) => {
  try {
    localStorage.setItem(prefix + key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
  }
};
const normalizeGoogleSheetUrl = (url, gid) => {
  var _a;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid Google Sheets URL. Expected a docs.google.com/spreadsheets URL.");
  }
  if (parsed.hostname !== "docs.google.com" || !parsed.pathname.startsWith("/spreadsheets/")) {
    throw new Error("URL must be a Google Sheets docs URL (docs.google.com/spreadsheets/...).");
  }
  if (parsed.pathname.includes("/spreadsheets/d/e/") && parsed.pathname.includes("/pub")) {
    return parsed.toString();
  }
  const gvizMatch = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)\/gviz\/tq/i);
  const sheetMatch = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)/i);
  const sheetId = (gvizMatch == null ? void 0 : gvizMatch[1]) || (sheetMatch == null ? void 0 : sheetMatch[1]);
  if (!sheetId) throw new Error("Could not determine spreadsheet ID from URL.");
  const hashGid = (_a = parsed.hash.match(/gid=(\d+)/)) == null ? void 0 : _a[1];
  const queryGid = parsed.searchParams.get("gid") ?? void 0;
  const resolvedGid = String(gid ?? queryGid ?? hashGid ?? "0");
  if (gvizMatch && gid === void 0) return parsed.toString();
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${encodeURIComponent(resolvedGid)}`;
};
const inFlightDataRequests = /* @__PURE__ */ new Map();
const inFlightTextRequests = /* @__PURE__ */ new Map();
const withCacheBust = (url) => {
  const u = new URL(url);
  u.searchParams.set("_of_cache_bust", String(Date.now()));
  return u.toString();
};
const fetchTextOnce = async (dedupeKeyUrl, requestUrl) => {
  const existing = inFlightTextRequests.get(dedupeKeyUrl);
  if (existing) return existing;
  const promise = fetch(requestUrl, { redirect: "follow" }).then(async (response) => {
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    return response.text();
  }).finally(() => {
    inFlightTextRequests.delete(dedupeKeyUrl);
  });
  inFlightTextRequests.set(dedupeKeyUrl, promise);
  return promise;
};
async function getGoogleSheetData(config, forceFresh = false) {
  if (!config.url) return { config: {}, links: [] };
  const normalizedUrl = normalizeGoogleSheetUrl(config.url, config.sheetGid);
  const ttl = config.disableCache ? 0 : config.cacheTtlSeconds ?? 0;
  const key = `csv:${normalizedUrl}`;
  const dedupeKey = forceFresh ? `${normalizedUrl}:force:${Date.now()}` : normalizedUrl;
  const existing = inFlightDataRequests.get(dedupeKey);
  if (existing) return existing;
  const task = (async () => {
    const cached = forceFresh || ttl <= 0 ? null : readCache(key, ttl);
    if ((cached == null ? void 0 : cached.fresh) && cached.data) return cached.data;
    try {
      const text = await fetchTextOnce(dedupeKey, withCacheBust(normalizedUrl));
      const maybeHtml = /^\s*<!doctype html/i.test(text) || /^\s*<html/i.test(text) || /<title>Google Sheets<\/title>/i.test(text);
      if (maybeHtml) throw new Error('OpenFooter could not load this Google Sheet as CSV.\n\nMake sure:\n1. The sheet is shared with "Anyone with the link can view", or\n2. The sheet is published to the web, and\n3. The selected sheet tab/gid exists.');
      const parsed = parseCsv(text);
      if (!forceFresh && ttl > 0) writeCache(key, parsed);
      return parsed;
    } catch {
      if (cached == null ? void 0 : cached.data) return cached.data;
      return { config: {}, links: [] };
    }
  })();
  inFlightDataRequests.set(dedupeKey, task);
  try {
    return await task;
  } finally {
    inFlightDataRequests.delete(dedupeKey);
  }
}
const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const SAFE_DATA_IMAGE = /^data:image\/(png|jpeg|jpg|webp|svg\+xml);/i;
const isSafeUrl = (value) => {
  var _a;
  const url = value.trim();
  if (!url) return false;
  const lowered = url.toLowerCase();
  if (lowered.startsWith("javascript:") || lowered.startsWith("data:text/html")) return false;
  if (SAFE_DATA_IMAGE.test(url)) return true;
  try {
    const parsed = new URL(url, ((_a = globalThis.location) == null ? void 0 : _a.origin) ?? "https://example.com");
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};
const isActiveNow = (l) => {
  if (l.isActive === false) return false;
  const now = /* @__PURE__ */ new Date();
  if (l.startDate && new Date(l.startDate) > now) return false;
  if (l.endDate && new Date(l.endDate) < now) return false;
  return true;
};
const normalizeLinks = (links) => links.filter((l) => l.label && isSafeUrl(l.url) && isActiveNow(l)).sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
const groupLinksByCategory = (links) => normalizeLinks(links).reduce((acc, l) => {
  const key = l.category || l.type || "Links";
  (acc[key] || (acc[key] = [])).push(l);
  return acc;
}, {});
const renderBrandBlock = (config) => {
  if (!config.brandName && !config.brandTagline && !config.brandMessage && !config.brandImageUrl) return "";
  const imageAlt = config.brandImageAlt || `${config.brandName || "OpenFooter"} logo`;
  const shape = config.brandImageShape || "rounded";
  const image = config.brandImageUrl && isSafeUrl(config.brandImageUrl) ? `<img class="openfooter-brand-image shape-${shape}" src="${escapeHtml(config.brandImageUrl)}" alt="${escapeHtml(imageAlt)}" loading="lazy" onerror="this.style.display='none'" />` : "";
  return `<div class="openfooter-brand"><div class="openfooter-brand-main">${image}<div><div class="openfooter-brand-name">${escapeHtml(config.brandName || "")}</div>${config.brandTagline ? `<div class="openfooter-brand-tagline">${escapeHtml(config.brandTagline)}</div>` : ""}${config.brandMessage ? `<div class="openfooter-brand-message">${escapeHtml(config.brandMessage)}</div>` : ""}</div></div></div>`;
};
const renderLinks = (items) => `<ul>${items.map((l) => `<li><a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>${l.description ? `<div class="small">${escapeHtml(l.description)}</div>` : ""}</li>`).join("")}</ul>`;
const renderColumns = (grouped) => Object.entries(grouped).map(([name, items]) => `<section><h4>${escapeHtml(name)}</h4>${renderLinks(items)}</section>`).join("");
const buildFooterHtml = (config, links) => {
  var _a;
  const normalized = normalizeLinks(links);
  const grouped = groupLinksByCategory(links);
  const sections = renderColumns(grouped);
  if (!sections && !normalized.length) return '<div class="wrap"><div class="inner">Unable to load footer links right now.</div></div>';
  const layout = config.layout ?? "compact";
  const brand = renderBrandBlock(config);
  const socials = normalized.filter((l) => l.type === "social");
  const socialRow = socials.length ? `<div class="social-row">${socials.map((s) => `<a class="social-link" href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.icon || s.label)}</a>`).join("")}</div>` : "";
  const newsletter = ((_a = config.newsletter) == null ? void 0 : _a.enabled) ? `<section class="newsletter"><h4>${escapeHtml(config.newsletter.title ?? "Subscribe")}</h4><p class="small">${escapeHtml(config.newsletter.description ?? "Get updates in your inbox.")}</p><form method="post" action="${escapeHtml(config.newsletter.actionUrl ?? "#")}"><input type="email" placeholder="${escapeHtml(config.newsletter.placeholder ?? "Email address")}" /><button type="submit">${escapeHtml(config.newsletter.buttonLabel ?? "Subscribe")}</button></form></section>` : "";
  const body = {
    simple: `<div class="layout simple">${brand}<nav class="inline-links">${normalized.map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`).join("")}</nav></div>`,
    centered: `<div class="layout centered">${brand}<nav class="inline-links centered">${normalized.map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`).join("")}</nav></div>`,
    social: `<div class="layout social">${brand}${socialRow}<div class="grid columns">${sections}</div></div>`,
    columns: `<div class="layout columns">${brand}<div class="grid columns">${sections}</div></div>`,
    "columns-brand": `<div class="layout columns-brand">${brand}<div class="grid columns">${sections}</div></div>`,
    newsletter: `<div class="layout newsletter">${brand}<div class="grid columns">${sections}</div>${newsletter}</div>`,
    compact: `<div class="layout compact">${brand}<nav class="inline-links">${normalized.map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>`).join("")}</nav></div>`
  };
  return `<div class="wrap"><div class="inner">${body[layout] ?? body.compact}<div class="small copyright">© ${(/* @__PURE__ */ new Date()).getFullYear()} ${escapeHtml(config.copyrightName ?? config.brandName ?? "OpenFooter")}${config.showPoweredBy === false ? "" : ` • <a href="https://github.com" target="_blank" rel="noopener noreferrer">Powered by OpenFooter</a>`}</div></div></div>`;
};
const defaults = { theme: "dark", layout: "columns-brand", cacheTtlSeconds: 0, brandImageShape: "rounded" };
class OpenFooterElement extends HTMLElement {
  constructor() {
    super(...arguments);
    this.root = this.attachShadow({ mode: "open" });
    this.config = { ...defaults };
    this.hasConnected = false;
    this.renderQueued = false;
  }
  static get observedAttributes() {
    return ["url", "sheet-gid", "cache-ttl-seconds", "disable-cache", "brand-name", "brand-tagline", "brand-message", "brand-image-url", "brand-image-alt", "brand-image-shape", "copyright-name", "show-powered-by", "theme", "layout"];
  }
  connectedCallback() {
    this.hasConnected = true;
    this.syncAttributes();
    this.requestRender(false);
  }
  attributeChangedCallback() {
    this.syncAttributes();
    if (this.hasConnected) this.requestRender(false);
  }
  syncAttributes() {
    this.config = {
      ...this.config,
      url: this.getAttribute("url") ?? this.config.url,
      sheetGid: this.getAttribute("sheet-gid") ?? this.config.sheetGid,
      cacheTtlSeconds: this.getAttribute("cache-ttl-seconds") != null ? Number(this.getAttribute("cache-ttl-seconds")) : this.config.cacheTtlSeconds,
      disableCache: this.getAttribute("disable-cache") != null ? this.getAttribute("disable-cache") !== "false" : this.config.disableCache,
      brandName: this.getAttribute("brand-name") ?? this.config.brandName,
      brandTagline: this.getAttribute("brand-tagline") ?? this.config.brandTagline,
      brandMessage: this.getAttribute("brand-message") ?? this.config.brandMessage,
      brandImageUrl: this.getAttribute("brand-image-url") ?? this.config.brandImageUrl,
      brandImageAlt: this.getAttribute("brand-image-alt") ?? this.config.brandImageAlt,
      brandImageShape: this.getAttribute("brand-image-shape") ?? this.config.brandImageShape,
      copyrightName: this.getAttribute("copyright-name") ?? this.config.copyrightName,
      showPoweredBy: this.getAttribute("show-powered-by") != null ? this.getAttribute("show-powered-by") !== "false" : this.config.showPoweredBy,
      theme: this.getAttribute("theme") ?? this.config.theme,
      layout: this.getAttribute("layout") ?? this.config.layout
    };
  }
  requestRender(force) {
    if (this.renderQueued) return;
    this.renderQueued = true;
    queueMicrotask(() => {
      this.renderQueued = false;
      void this.refresh(force);
    });
  }
  async refresh(force = true) {
    const requestKey = `${this.config.url ?? ""}:${this.config.sheetGid ?? ""}`;
    if (!force && this.lastRequestKey === requestKey) return;
    const data = await getGoogleSheetData({ ...this.config, cacheTtlSeconds: this.config.cacheTtlSeconds ?? 0 }, force);
    const mergedConfig = { ...data.config, ...this.config };
    this.lastRequestKey = requestKey;
    this.root.innerHTML = `<style>${getStyles()}</style>${buildFooterHtml(mergedConfig, data.links)}`;
  }
}
if (!customElements.get("open-footer")) customElements.define("open-footer", OpenFooterElement);
const resolveEl = (selectorOrElement) => {
  if (!selectorOrElement) return document.querySelector("open-footer");
  return typeof selectorOrElement === "string" ? document.querySelector(selectorOrElement) : selectorOrElement;
};
const OpenFooter = {
  version: "0.1.0",
  refresh(selectorOrElement) {
    const target = resolveEl(selectorOrElement);
    if (target instanceof OpenFooterElement) void target.refresh(true);
  }
};
window.OpenFooter = OpenFooter;
export {
  OpenFooter
};
