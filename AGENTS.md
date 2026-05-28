AGENTS.md

OpenFooter — Agent Development Guide

Project Identity

OpenFooter is a lightweight, framework-agnostic footer platform powered entirely by Google Sheets.

The project intentionally prioritizes:

- simplicity
- portability
- CDN embedding
- low configuration overhead
- framework independence
- modern UI aesthetics
- maintainability
- easy onboarding

OpenFooter is not intended to become:

- a CMS
- a database platform
- a multi-source content engine
- a framework-specific UI library
- an enterprise configuration platform

The project intentionally moved away from:

- inline JSON
- remote JSON
- generic adapters
- Supabase integrations
- complex data pipelines

to focus on:

«"A modern embeddable footer powered by a Google Sheet."»

---

Core Product Philosophy

The One-Source Rule

OpenFooter has exactly one content source:

<open-footer
  url="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing">
</open-footer>

The system should always optimize around:

- this being easy to explain
- this being easy to debug
- this being easy to document
- this being easy to onboard
- this being easy to test

Avoid introducing:

- alternative providers
- adapter abstractions
- generic content source systems
- plugin ecosystems
- unnecessary configuration complexity

If future features violate this simplicity, reconsider them carefully.

---

Technical Architecture

Stack

Core Runtime

- TypeScript
- Vite
- Native Web Components
- Shadow DOM
- Vanilla CSS
- No framework dependency

Distribution

- npm
- jsDelivr
- unpkg

Supported Platforms

Primary:

- CDN embeds
- Vanilla HTML
- React
- Next.js

Secondary:

- Vue
- Astro
- Svelte

---

Architectural Priorities

1. Framework Agnostic First

The Web Component is the primary runtime.

React/Next wrappers are convenience layers.

Never make the core runtime depend on:

- React
- Next.js
- Vue
- Tailwind
- Bootstrap

---

2. Lightweight First

OpenFooter should remain:

- fast
- small
- dependency-light
- CDN-friendly

Avoid:

- large runtime dependencies
- heavy animation systems
- runtime CSS frameworks
- unnecessary abstraction layers

---

3. Simplicity Over Flexibility

Prefer:

- obvious systems
- explicit behavior
- fewer configuration options

Avoid:

- deeply nested configuration
- plugin registries
- inversion-of-control patterns
- complex runtime state systems

---

Current Data Flow

Google Sheets Share URL
        ↓
Normalize URL
        ↓
Fetch CSV via gviz endpoint
        ↓
Parse CSV
        ↓
Extract metadata rows
        ↓
Extract link rows
        ↓
Group by category
        ↓
Render layouts

---

Google Sheets Rules

Supported Input

Users provide:

https://docs.google.com/spreadsheets/d/.../edit?usp=sharing

Internally convert to:

https://docs.google.com/spreadsheets/d/{id}/gviz/tq?tqx=out:csv&gid=0

Do NOT reintroduce:

- JSON providers
- alternative APIs
- adapter systems

---

CSV Schema

Metadata Rows

type,key,value
meta,brandName,OpenFooter
meta,theme,dark
meta,layout,columns-brand

Link Rows

type,label,url,category
social,GitHub,https://github.com,Developer

Metadata rows configure the footer.

Link rows render the footer.

---

UI / Design Philosophy

Design Goals

OpenFooter should feel:

- modern
- premium
- flat
- clean
- minimal
- polished

Inspired by:

- Vercel
- Linear
- Framer
- modern SaaS products

Avoid:

- old Bootstrap aesthetics
- corporate enterprise styling
- clutter
- visual noise

---

Theme System

Built-in Themes

- dark
- light
- minimal
- auto

Color System

Support:

- primary color
- accent color
- secondary accent color

Use these to derive:

- gradients
- hover colors
- muted backgrounds
- elevated panels
- subtle glows

Do NOT use:

- harsh gradients
- neon aesthetics
- over-saturated palettes

---

Layout Philosophy

columns-brand

Primary flagship layout.

Should feel:

- premium
- balanced
- content-rich
- modern

---

compact

Optimized for:

- small sites
- simple embeds
- tight layouts

---

newsletter

Should feel:

- modern SaaS
- clean CTA section
- elegant email field
- polished panel styling

---

React / Next.js Integration

The Web Component remains the core runtime.

React support should exist via:

import { OpenFooter } from "openfooter/react";

The React wrapper should:

- remain lightweight
- avoid SSR crashes
- use "React.createElement"
- avoid requiring JSX intrinsic declarations

Do NOT rewrite the project into a React-first architecture.

---

Performance Rules

Priorities

- minimize bundle size
- minimize runtime allocations
- avoid unnecessary re-renders
- avoid duplicate fetches
- keep DOM output efficient

---

Caching Rules

Google Sheets should:

- bypass local cache by default
- use cache-busting query params
- dedupe in-flight requests

---

Accessibility Rules

Maintain:

- semantic HTML
- keyboard accessibility
- proper contrast
- aria labels where appropriate
- screen reader friendliness

---

Security Rules

Never trust:

- sheet URLs
- image URLs
- raw HTML
- CSV content

Always sanitize:

- URLs
- image sources
- text rendering

Never allow:

- javascript: URLs
- HTML injection
- unsafe SVG execution

---

Repository Structure

Preferred structure:

src/
├── index.ts
├── open-footer-element.ts
├── google-sheet.ts
├── render.ts
├── styles.ts
├── schema.ts
├── react/
└── utils/

Avoid reintroducing:

- adapters/
- providers/
- source registries

---

Build / Release Workflow

CI

GitHub Actions:

- typecheck
- build
- pack validation

Publishing

npm Trusted Publishing via GitHub Actions.

Release flow:

npm version patch
git push origin main
git push origin --tags

---

CDN Philosophy

CDN usage is a first-class feature.

This should always work:

<script src="https://cdn.jsdelivr.net/npm/openfooter@VERSION/dist/openfooter.iife.min.js"></script>

The CDN path should remain stable.

---

Documentation Philosophy

README should optimize for:

- onboarding speed
- simplicity
- copy/paste examples
- visual examples
- practical setup

Avoid:

- overengineering docs
- deep architectural jargon
- unnecessary abstraction explanations

---

Examples Philosophy

Examples should:

- demonstrate realistic usage
- use Google Sheets only
- showcase layouts/themes/colors
- remain visually polished

Avoid:

- outdated examples
- JSON source examples
- debug-only demos

---

Anti-Goals

Do NOT evolve OpenFooter into:

- a CMS
- a generic data platform
- a page builder
- a theme engine framework
- a component framework
- a heavy UI toolkit

---

Future Development Priorities

High Priority

- polished design system
- better gradients/themes
- stronger responsive layouts
- improved accessibility
- stronger React wrapper
- Vue wrapper
- Astro integration docs
- better animations/transitions
- improved social icon system

Medium Priority

- advanced newsletter layouts
- analytics hooks
- optional telemetry hooks
- customizable social icon packs

Low Priority

- admin interfaces
- visual editors
- additional providers
- authenticated/private sheets

---

Agent Guidance

When modifying OpenFooter:

Always Preserve

- simplicity
- portability
- lightweight runtime
- Google-Sheets-first architecture
- framework independence

Prefer

- direct implementations
- readable code
- explicit systems
- low abstraction
- maintainable CSS

Avoid

- unnecessary patterns
- premature abstraction
- framework lock-in
- dependency bloat
- enterprise complexity

---

Final Principle

OpenFooter succeeds if:

- a user can set it up in minutes
- it works on almost any website
- it looks modern by default
- it stays lightweight
- it remains easy to maintain

If a feature threatens those goals, reconsider it carefully.
