# Publishing OpenFooter

OpenFooter publishes to npm using GitHub Actions and npm Trusted Publishing.

## One-Time npm Setup

On npmjs.com:

1. Open the `openfooter` package.
2. Go to package settings.
3. Add a Trusted Publisher.
4. Select GitHub Actions.
5. Set:
   - Owner: `prlaclede`
   - Repository: `OpenFooter`
   - Workflow filename: `publish.yml`

No long-lived npm token is required when Trusted Publishing is configured.

## Release Process

From local main:

```bash
git checkout main
git pull origin main
npm version patch
git push origin main
git push origin --tags
```

For minor/major:

```bash
npm version minor
npm version major
```

Pushing a tag like `v0.1.1` triggers `.github/workflows/publish.yml`.

## Verify Publish

After the workflow completes:

```bash
npm view openfooter version
```

Then verify CDN:

```txt
https://cdn.jsdelivr.net/npm/openfooter@VERSION/dist/openfooter.iife.min.js
https://unpkg.com/openfooter@VERSION/dist/openfooter.iife.min.js
```

Use pinned versions in production:

```html
<script src="https://cdn.jsdelivr.net/npm/openfooter@VERSION/dist/openfooter.iife.min.js"></script>
```
