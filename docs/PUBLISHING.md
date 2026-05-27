# Publishing OpenFooter

## Pre-publish Checklist

- [ ] Version updated in `package.json`
- [ ] CHANGELOG.md updated
- [ ] LICENSE exists
- [ ] README examples match current package name/version
- [ ] `npm install` works
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] `npm run pack:check` shows `dist/`, README, LICENSE, and CHANGELOG
- [ ] `dist/openfooter.iife.min.js` exists
- [ ] `dist/openfooter.es.js` exists
- [ ] `dist/index.d.ts` exists
- [ ] Plain HTML example works locally
- [ ] CDN examples are documented

## Publish

```bash
npm login
npm publish
```

## Verify CDN

After publishing:

```txt
https://cdn.jsdelivr.net/npm/openfooter@VERSION/dist/openfooter.iife.min.js
https://unpkg.com/openfooter@VERSION/dist/openfooter.iife.min.js
```
