# OpenFooter

OpenFooter is a drop-in website footer powered by a Google Sheet.

## 2-minute setup
1. Copy `templates/openfooter-template.csv` into Google Sheets.
2. Fill metadata rows and link rows.
3. Click **Share** and set **Anyone with the link**.
4. Copy the normal share URL.
5. Paste it into `<open-footer url="...">`.

## CDN Embed

```html
<script src="https://cdn.jsdelivr.net/npm/openfooter@VERSION/dist/openfooter.iife.min.js"></script>

<open-footer
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
  sheet-gid="0"
  theme="dark"
  layout="columns-brand">
</open-footer>
```

## Google Sheet Schema

```csv
type,key,value,label,url,icon,category,priority,is_active,is_featured,description,start_date,end_date
meta,brandName,OpenFooter Demo,,,,,,,,,,
meta,brandTagline,"Unified footers from one Google Sheet",,,,,,,,,,
meta,brandMessage,"Manage links and brand profile from one sheet.",,,,,,,,,,
meta,brandImageUrl,https://placehold.co/96x96?text=OF,,,,,,,,,,
meta,brandImageAlt,OpenFooter logo,,,,,,,,,,
meta,brandImageShape,rounded,,,,,,,,,,
meta,copyrightName,OpenFooter Demo,,,,,,,,,,
meta,theme,dark,,,,,,,,,,
meta,layout,columns-brand,,,,,,,,,,
social,,,GitHub,https://github.com/prlaclede/OpenFooter,github,Developer,1,true,false,Open-source repository,,
```

- `type=meta` rows configure the footer and do not render as links.
- Link rows keep `key` and `value` empty.
- Columns are generated from `category`.

## Brand image fields
- `brandName`
- `brandTagline`
- `brandMessage`
- `brandImageUrl`
- `brandImageAlt`
- `brandImageShape` (`rounded`, `circle`, `square`)

HTML attributes:
- `brand-name`
- `brand-tagline`
- `brand-message`
- `brand-image-url`
- `brand-image-alt`
- `brand-image-shape`

## Themes and layouts
Themes: `dark`, `light`, `minimal`, `auto`.
Layouts: `columns-brand`, `centered`, `compact`, plus additional presets.

## Running examples locally
```bash
npm install
npm run build
npm run serve:examples
```
Open: `http://localhost:5173/examples/`

## Caching
Google Sheets caching is disabled by default (`cacheTtlSeconds=0`) and requests use cache-busting `_of_cache_bust`.
Optional:
- `cache-ttl-seconds="300"`
- `disable-cache="true"`

## Troubleshooting
- Sheet must be publicly viewable.
- Use `sheet-gid` to select a specific tab.
- Google propagation can be delayed briefly.
- Unsafe URLs are blocked (`javascript:`, `data:text/html`).

## Publishing
```bash
npm run typecheck
npm run build
npm run pack:check
npm publish
```


## Releasing / Publishing

OpenFooter uses GitHub Actions to publish tagged releases to npm.

```bash
npm version patch
git push origin main
git push origin --tags
```

See `docs/PUBLISHING.md` for the full process.
