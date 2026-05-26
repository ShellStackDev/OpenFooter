export const getStyles = () => `
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
