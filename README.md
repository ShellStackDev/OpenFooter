# OpenFooter

OpenFooter is a framework-agnostic Web Component and vanilla JavaScript library for rendering a professional, unified footer across many websites.

## Why it exists
Manage links once (JSON, Google Sheets CSV, or inline config) and embed everywhere with one script tag.

## Install
```bash
npm install openfooter
```

## CDN
```html
<script src="https://cdn.jsdelivr.net/npm/openfooter/dist/openfooter.iife.min.js"></script>
<script src="https://unpkg.com/openfooter/dist/openfooter.iife.min.js"></script>
```

## Web Component example
```html
<open-footer source="remote-json" url="/openfooter.links.json" brand-name="TurtlesStudios" theme="dark"></open-footer>
```

## Vanilla JS example
```html
<div id="brand-footer"></div>
<script src="https://cdn.jsdelivr.net/npm/openfooter/dist/openfooter.iife.min.js"></script>
<script>
OpenFooter.render('#brand-footer', { source:'remote-json', url:'/openfooter.links.json', brandName:'TurtlesStudios', theme:'dark' });
</script>
```

## Google Sheet setup
Publish sheet as CSV and use the public URL with `source="google-sheet-csv"`. Supported columns: `type,label,url,icon,category,priority,is_active,is_featured,description,start_date,end_date`.

## Remote JSON
Provide `OpenFooterLink[]` JSON at a URL and set `source: "remote-json"`.

## Theme customization
Use CSS vars: `--of-bg`, `--of-text`, `--of-muted`, `--of-link`, `--of-link-hover`, `--of-border`, `--of-radius`, `--of-max-width`, `--of-font-family`.

## Security notes
Unsafe URLs (`javascript:`, `data:text/html`, empty URLs) are blocked. Labels and descriptions are escaped.

## Publishing
1. `npm run build`
2. `npm publish --access public`
3. Use jsDelivr/unpkg URLs from CDN section.

## Contributing
See `CONTRIBUTING.md`.
