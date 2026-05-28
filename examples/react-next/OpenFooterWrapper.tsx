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
      primaryColor="#2563eb"
      accentColor="#7c3aed"
      accentColor2="#06b6d4"
      backgroundStyle="mesh"
    />
  );
}
