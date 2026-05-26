export const getStyles = () => `
:host{--of-bg:#101114;--of-text:#f2f2f2;--of-muted:#b6bdc7;--of-link:#83b8ff;--of-link-hover:#b9d4ff;--of-border:#2b313b;--of-radius:12px;--of-max-width:1100px;--of-font-family:Inter,system-ui,sans-serif;display:block}
:host([theme="light"]){--of-bg:#fff;--of-text:#1a1d21;--of-muted:#5f6773;--of-link:#0057d8;--of-link-hover:#003e9b;--of-border:#e3e8ef}
:host([theme="minimal"]){--of-bg:transparent;--of-border:transparent}
.wrap{background:var(--of-bg);color:var(--of-text);font-family:var(--of-font-family);border-top:1px solid var(--of-border)}
.inner{max-width:var(--of-max-width);margin:0 auto;padding:24px 16px;display:grid;gap:16px}.grid{display:grid;gap:16px}
.grid.columns{grid-template-columns:repeat(auto-fit,minmax(180px,1fr))} a{color:var(--of-link)} a:hover{color:var(--of-link-hover)}
.small{font-size:.88rem;color:var(--of-muted)} ul{list-style:none;padding:0;margin:0;display:grid;gap:8px}
`;
