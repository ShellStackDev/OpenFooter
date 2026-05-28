# OpenFooter React / Next.js Example

Use the React wrapper to avoid `JSX.IntrinsicElements` typing issues.

```tsx
"use client";

import { OpenFooter } from "openfooter/react";

export default function OpenFooterWrapper() {
  return (
    <OpenFooter
      url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing"
      sheetGid="0"
      theme="dark"
      layout="columns-brand"
      brandName="TurtlesStudios"
      brandTagline="Music, tech, gaming, and creative projects"
      primaryColor="#2563eb"
      accentColor="#7c3aed"
      accentColor2="#06b6d4"
      backgroundStyle="mesh"
    />
  );
}
```
