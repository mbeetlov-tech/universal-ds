# Migration Guide

This document collects breaking-change migration steps for major and minor Universal DS releases. Patch releases do not require migration.

---

## v0.0.x to v0.1.0-beta

First public release. No migration needed.

### What shipped

| Package | Version | Distribution |
|---|---|---|
| `@uds/tokens` | 0.1.0 | npm |
| `@uds/components` | 0.1.0 | copy-paste or npm |

Storybook playground lives in `apps/docs/`.

### Adopting Universal DS for the first time

**Step 1 — Install tokens**

```bash
pnpm add @uds/tokens
```

Import the CSS file once at your app root. Any of these work depending on your setup:

```html
<!-- HTML root -->
<link rel="stylesheet" href="node_modules/@uds/tokens/dist/tokens.css" />
```

```ts
// JS/TS entry point
import '@uds/tokens/css';
```

```css
/* CSS entry point */
@import '@uds/tokens/css';
```

**Step 2 — Add components**

Copy-paste (recommended for ownership and control):

```
packages/components/src/<name>/
```

Copy the directory into your project. Dependencies per component are limited to `@uds/tokens`, React 18, `clsx`, and `tailwind-merge`. No hidden peer dependencies.

Or install via npm for version-managed updates:

```bash
pnpm add @uds/components
```

**Step 3 — Customize**

Override `--uds-*` CSS variables in your app's theme layer. Target semantic tokens to keep overrides narrow:

```css
:root {
  --uds-color-background-primary-bold: #your-brand-color;
}
```

Dark mode: set `data-theme="dark"` on any ancestor element (commonly `<html>`).

---

## Future versions

Breaking changes and migration steps for each release will be added here as separate sections. Token renames, API changes, and removed props will each get an explicit before/after table.
