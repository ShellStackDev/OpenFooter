# OpenFooter

OpenFooter is a framework-agnostic, embeddable Web Component + vanilla JS library for one unified professional footer across many websites.

## Quick Start (Fastest Path)

```html
<script src="https://cdn.jsdelivr.net/npm/openfooter@0.1.0/dist/openfooter.iife.min.js"></script>

<open-footer
  source="google-sheet"
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
  brand-name="Your Brand"
  theme="dark">
</open-footer>
```

## Use OpenFooter from a CDN

jsDelivr (recommended with pinned versions in production):

```html
<script src="https://cdn.jsdelivr.net/npm/openfooter@0.1.0/dist/openfooter.iife.min.js"></script>

<open-footer
  source="google-sheet"
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
  brand-name="Your Brand"
  theme="dark"
  layout="columns">
</open-footer>
```

unpkg:

```html
<script src="https://unpkg.com/openfooter@0.1.0/dist/openfooter.iife.min.js"></script>
```

Unpinned URLs (without `@0.1.0`) load the latest package version and may change unexpectedly. Pin versions for production stability.

- You can paste a normal Google Sheets share/edit URL.
- OpenFooter automatically converts share/edit URLs to CSV export URLs.
- The sheet must be public/viewable or published to the web.
- If using multiple tabs, pass `sheet-gid`.

```html
<open-footer
  source="google-sheet"
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
  sheet-gid="0">
</open-footer>
```

## 2-Minute Setup
1. Copy `templates/openfooter-template.csv` into Google Sheets.
2. Replace sample links with your own.
3. Publish that tab as CSV.
4. Paste the published CSV URL into `<open-footer url="...">`.

## Google Sheet Setup (Happy Path)
1. Copy the OpenFooter Google Sheet template.
2. Add/edit links.
3. Go to **File → Share → Publish to web**.
4. Select the specific sheet/tab.
5. Choose **Comma-separated values (.csv)**.
6. Click **Publish**.
7. Copy the generated CSV URL.
8. Paste it into `<open-footer url="...">`.

Google lets owners/editors publish Sheets to the web and stop publishing later. Use published CSV links, not editable links.

### Permissions / Privacy Notes
- The sheet used by OpenFooter must be published to the web.
- Only publish data intended to be public.
- Never include private emails, tokens, API keys, drafts, or unreleased URLs.
- Publishing to web does not require sharing the editable sheet with everyone.
- Publish only the footer tab instead of the entire spreadsheet.
- Enable automatic republishing so changes flow without manual republish steps.

Template placeholder link: `TODO_ADD_PUBLIC_TEMPLATE_LINK`

## CSV Template
- `templates/openfooter-template.csv`

## JSON Template
- `templates/openfooter-template.json`

## Install from npm
```bash
npm install openfooter
```

## Web Component Example
```html
<open-footer
  source="google-sheet"
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
  sheet-gid="0"
  brand-name="TurtlesStudios"
  brand-tagline="Music, tech, projects, and creative experiments"
  theme="dark"
  layout="columns">
</open-footer>
```

## Vanilla JS Example
```html
<div id="brand-footer"></div>
<script src="https://cdn.jsdelivr.net/npm/openfooter@0.1.0/dist/openfooter.iife.min.js"></script>
<script>
OpenFooter.render('#brand-footer', {
  source: 'remote-json',
  url: '/openfooter.links.json',
  brandName: 'TurtlesStudios',
  theme: 'dark'
});
</script>
```

## WordPress Example
```html
<script src="https://cdn.jsdelivr.net/npm/openfooter@0.1.0/dist/openfooter.iife.min.js"></script>
<open-footer source="google-sheet" url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing" sheet-gid="0" brand-name="Your Brand"></open-footer>
```

## Webflow Example
```html
<open-footer source="google-sheet" url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing" sheet-gid="0" brand-name="Your Brand"></open-footer>
```

## Plain HTML Example
See `examples/plain-html/index.html`.

## Next.js Example
In `app/layout.tsx`, add the IIFE script and use `<open-footer ... />`.

## Troubleshooting
| Problem | Likely Cause | Fix |
|---|---|---|
| Footer does not show | Script missing or blocked | Confirm CDN script loaded |
| No links show | CSV columns are wrong | Use the official template |
| Google Sheet returns HTML | Sheet not published as CSV | Publish as comma-separated values |
| Updates do not appear | Cache still active | Lower `cacheTtlSeconds` or wait |
| Some links missing | `is_active` is false | Set `is_active` to `true` |
| Link blocked | Unsafe URL | Use `https`, `mailto`, or `tel` |

## Publishing to npm

```bash
npm install
npm run typecheck
npm run build
npm run pack:check
npm login
npm publish
```

- `npm pack --dry-run` confirms which files will be published.
- `prepublishOnly` runs typecheck + build before publish.
- After publishing, jsDelivr and unpkg can serve OpenFooter from npm package versions.
- Use pinned versions such as `openfooter@0.1.0` for production embeds.

Detailed checklist: `docs/PUBLISHING.md`.

## Security Notes
Unsafe URLs (`javascript:`, `data:text/html`, empty URLs) are blocked, and labels/descriptions are escaped.

## Contributing
See `CONTRIBUTING.md`.


## Local Development

```bash
git clone https://github.com/prlaclede/OpenFooter.git
cd OpenFooter
npm install
npm run build
npm run serve:examples
```

Then open example pages through the local server (do not use `file://` for fetch-based examples).

## Testing the Local CDN Bundle

```bash
npm run build
npm run serve:examples
```

Open:

```txt
examples/local-inline/index.html
examples/local-json/index.html
examples/cdn-local/index.html
examples/google-sheet/index.html
```

`examples/cdn-local/index.html` uses `dist/openfooter.iife.min.js`, which is the same file path expected from npm/CDN delivery after publishing.

## Local Verification Before Publishing

```bash
npm run test:local
```

This runs:
- TypeScript type checking
- Production build
- Smoke checks for build artifacts/examples
- npm package dry run (`npm pack --dry-run`)

## Local Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Footer does not render | Build file missing | Run `npm run build` |
| `OpenFooter is not defined` | Script path is wrong | Confirm `../../dist/openfooter.iife.min.js` exists |
| Local JSON does not load | Browser blocked `file://` fetch | Run `npm run serve:examples` |
| Google Sheet links do not show | Sheet is private or not CSV-viewable | Share publicly/view-only or publish to web as CSV |
| Changes do not appear | Cache is active | Lower `cacheTtlSeconds` or clear localStorage |
| Custom element already defined | Script loaded twice | Load OpenFooter once per page |

## Footer Layouts

OpenFooter supports these layout presets:
- `simple`
- `centered`
- `social`
- `columns`
- `columns-brand`
- `newsletter`
- `compact`

`columns`, `columns-brand`, and `newsletter` automatically generate columns from each link's `category` field (fallback: `type`, then `Links`).

Use `newsletter` with optional config:

```js
{
  newsletter: {
    enabled: true,
    title: 'Stay up to date',
    description: 'Monthly product updates.',
    placeholder: 'Email address',
    buttonLabel: 'Subscribe',
    actionUrl: 'https://example.com/newsletter'
  }
}
```

Layout examples are available in `examples/layouts/`.

## Brand Profile

OpenFooter supports a richer brand profile block with brand name, tagline, message, and image.

### Attribute-based setup

```html
<open-footer
  source="google-sheet"
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
  brand-name="TurtlesStudios"
  brand-tagline="Music, tech, gaming, and creative projects"
  brand-message="Music, gear reviews, dev experiments, gaming, and creative builds."
  brand-image-url="https://example.com/logo.png"
  brand-image-shape="rounded"
  theme="dark"
  layout="columns-brand">
</open-footer>
```

### CSV / Google Sheet metadata setup

```csv
type,key,value,label,url,icon,category,priority,is_active,is_featured,description,start_date,end_date
meta,brandName,TurtlesStudios,,,,,,,,,,
meta,brandTagline,"Music, tech, gaming, and creative projects",,,,,,,,,,
meta,brandMessage,"Music, gear reviews, dev experiments, gaming, and creative builds.",,,,,,,,,,
meta,brandImageUrl,https://example.com/logo.png,,,,,,,,,,
meta,brandImageShape,rounded,,,,,,,,,,
```

Metadata rows are optional and are not rendered as links.

## Running Examples Locally

```bash
npm install
npm run build
npm run serve:examples
```

Then open:

```txt
http://localhost:5173/examples/
```

## Layout Examples

See `examples/layouts/` and `examples/index.html`. Column-based layouts generate sections from each link's `category` field (fallback: `type`, then `Links`).

## Themes and Custom Colors

Use built-in themes:

```html
<open-footer theme="dark"></open-footer>
```

Or customize with CSS variables:

```css
open-footer {
  --of-bg: #111827;
  --of-text: #f9fafb;
  --of-link: #60a5fa;
}
```

See `examples/themes/` for `light`, `dark`, `minimal`, `auto`, and `custom-colors` demos.


| Problem | Likely Cause | Fix |
|---|---|---|
| 307 redirect then 400 Bad Request | Using the wrong export endpoint | OpenFooter uses `gviz/tq?tqx=out:csv` internally |
| Response looks like Google Sheets HTML | Sheet is not public/exportable | Share as “Anyone with the link can view” or publish to web |
| No links appear | Wrong tab/gid | Check the sheet tab gid |
| Links appear multiple times or URL requested repeatedly | Duplicate lifecycle fetches | Use request dedupe and render guards |

### Google Sheets and Caching

OpenFooter disables local caching for Google Sheets by default so changes in your sheet appear quickly.

If you want to cache Google Sheets responses anyway:

```html
<open-footer
  source="google-sheet"
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
  cache-ttl-seconds="300">
</open-footer>
```

To force no cache:

```html
<open-footer
  source="google-sheet"
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
  disable-cache="true">
</open-footer>
```

| Issue | Cause | Fix |
|---|---|---|
| Google Sheet updates take too long to appear | Browser/CDN/local cache | Google Sheets uses cache-busting by default; also try `disable-cache="true"` |
| Refresh still shows old data | Google’s backend may delay export updates | Wait briefly, reload, or verify the sheet’s CSV export URL directly |
