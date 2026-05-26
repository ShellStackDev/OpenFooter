# OpenFooter

OpenFooter is a framework-agnostic, embeddable Web Component + vanilla JS library for one unified professional footer across many websites.

## Quick Start (Fastest Path)

```html
<script src="https://cdn.jsdelivr.net/npm/openfooter/dist/openfooter.iife.min.js"></script>

<open-footer
  source="google-sheet-csv"
  url="YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL"
  brand-name="Your Brand"
  theme="dark">
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

Google lets owners/editors publish Sheets to the web and stop publishing later. Use published view links (CSV output), not editable links.

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
- `templates/sample-social-links.csv`

## JSON Template
- `templates/openfooter-template.json`

## Install from npm
```bash
npm install openfooter
```

## CDN
```html
<script src="https://cdn.jsdelivr.net/npm/openfooter/dist/openfooter.iife.min.js"></script>
<script src="https://unpkg.com/openfooter/dist/openfooter.iife.min.js"></script>
```

## Web Component Example
```html
<open-footer
  source="google-sheet-csv"
  url="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
  brand-name="TurtlesStudios"
  brand-tagline="Music, tech, projects, and creative experiments"
  theme="dark"
  layout="columns">
</open-footer>
```

## Vanilla JS Example
```html
<div id="brand-footer"></div>
<script src="https://cdn.jsdelivr.net/npm/openfooter/dist/openfooter.iife.min.js"></script>
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
Add in a Custom HTML block:
```html
<script src="https://cdn.jsdelivr.net/npm/openfooter/dist/openfooter.iife.min.js"></script>
<open-footer source="google-sheet-csv" url="YOUR_CSV_URL" brand-name="Your Brand"></open-footer>
```

## Webflow Example
Add script in page footer custom code and place embed block:
```html
<open-footer source="google-sheet-csv" url="YOUR_CSV_URL" brand-name="Your Brand"></open-footer>
```

## Plain HTML Example
See `examples/plain-html/index.html`.

## Next.js Example
In `app/layout.tsx` use a script tag for IIFE bundle and render `<open-footer ... />` in layout body.

## Helper Scripts
- `npm run create-template -- ./my-starter`
- `npm run validate -- ./templates/openfooter-template.csv`
- `npm run generate`
- `npm run demo`

## Troubleshooting
| Problem | Likely Cause | Fix |
|---|---|---|
| Footer does not show | Script missing or blocked | Confirm CDN script loaded |
| No links show | CSV columns are wrong | Use the official template |
| Google Sheet returns HTML | Sheet not published as CSV | Publish as comma-separated values |
| Updates do not appear | Cache still active | Lower `cacheTtlSeconds` or wait |
| Some links missing | `is_active` is false | Set `is_active` to `true` |
| Link blocked | Unsafe URL | Use `https`, `mailto`, or `tel` |

## Security Notes
Unsafe URLs (`javascript:`, `data:text/html`, empty URLs) are blocked, and labels/descriptions are escaped.

## Publishing to npm/CDN
1. `npm run build`
2. `npm publish --access public`
3. Use jsDelivr/unpkg snippets above.

## Contributing
See `CONTRIBUTING.md`.
