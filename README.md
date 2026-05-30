# Universal DS

[![npm version](https://img.shields.io/npm/v/@uds/tokens)](https://www.npmjs.com/package/@uds/tokens)
[![Build](https://img.shields.io/github/actions/workflow/status/mikhail-s-projects9/universal-ds/ci.yml)](https://github.com/mikhail-s-projects9/universal-ds/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

A brand-neutral design system. Tokens as an npm package, components as copy-paste source — own what you ship.

---

## What is Universal DS

Universal DS is a framework-agnostic design system built for teams that need a solid foundation without locking into a visual identity. Token values are exposed as CSS custom properties (`--uds-*`) so they work in any stack that understands CSS. Components are React + TypeScript, distributed copy-paste (shadcn-style) so you own the source and can adapt freely.

Hybrid distribution means you can adopt incrementally: take only the tokens, take select components, or take everything.

---

## Quickstart

### 1. Install tokens

```bash
pnpm add @uds/tokens
# or: npm install @uds/tokens
```

Import once in your app root:

```html
<!-- HTML -->
<link rel="stylesheet" href="node_modules/@uds/tokens/dist/tokens.css" />
```

```ts
// or via JS import
import '@uds/tokens/css';
```

### 2. Use components (copy-paste)

Copy any component source from `packages/components/src/<name>/` into your project. No registry tool required — the files are plain TypeScript with no hidden dependencies beyond `@uds/tokens`, React 18, `clsx`/`tailwind-merge`, and `@hugeicons/react` + `@hugeicons/core-free-icons` (icon library — Phase 5.8 amendment, replacing Lucide for Figma ↔ Storybook visual parity; see [CHANGELOG.md](./CHANGELOG.md) Unreleased § "Icon library: Lucide → Hugeicons").

```tsx
import '@uds/tokens/css';           // tokens loaded once at app root
import { Button } from './button';  // your local copy

<Button intent="primary" size="md" onClick={handleSave}>
  Save changes
</Button>

<Button intent="danger" leftIcon={<TrashIcon />}>
  Delete forever
</Button>

<Button intent="primary" loading>
  Saving...
</Button>

// Polymorphic — renders as <a>
<Button asChild intent="secondary">
  <a href="/dashboard">Go to dashboard</a>
</Button>
```

### Or install components via npm

```bash
pnpm add @uds/components
```

```tsx
import '@uds/tokens/css';
import { Button } from '@uds/components';
```

Both paths are equivalent. Copy-paste gives you full ownership; npm install gives you version-managed updates.

---

## What's included

### Components — 19 total

**Foundations**
Button, IconButton, Icon, Spinner

**Inputs**
Input, Checkbox, Switch, Select

**Display**
Badge, Avatar, Card, Tooltip

**Navigation**
Tabs, SidebarItem, Sidebar, MenuItem, Menu, Pagination

**Data**
TableRow, TableHeader

Every component ships with:
- cva-based variant system (`intent`, `size`, and component-specific props)
- Full state coverage: default, hover, focus, active, disabled, loading (where applicable)
- Accessible markup: ARIA attributes, focus management, keyboard support via Radix Primitives
- Complete `--uds-*` token binding — no hardcoded values

### Tokens — 1,067 variables

3-tier architecture: Primitive → Semantic → Component. Semantic tokens are what components consume. You override at the semantic layer; primitives stay stable.

| Collection | Description |
|---|---|
| Color (primitive + semantic) | Full palette + role-based aliases |
| Spacing (primitive + semantic) | Scale + contextual names |
| Radius (primitive + semantic) | Scale + role aliases |
| Typography (primitive + semantic) | Type scale + role aliases |
| Component | Per-component overrides |
| Stroke | Border widths, 2-tier |

### Accessibility

All components pass axe-core at the Critical and Serious levels. A11y is a CI gate — builds fail on regressions. WCAG 2.2 AA is the target; AAA where the component type supports it.

---

## Browse the components

Storybook playground: [https://universal-ds.vercel.app](https://universal-ds.vercel.app)

Each story includes:
- All variants rendered side by side
- Dark/light theme toggle
- Interactive controls
- Accessibility audit panel (axe-core)

> The Storybook URL above is the production preview. Per-PR preview URLs are posted automatically by the Vercel GitHub integration.

---

## Customization

### Dark mode

Toggle dark theme on any element (or the root `<html>`):

```html
<html data-theme="dark">
```

The `[data-theme="dark"]` selector flips semantic token values. Components follow automatically — no class changes needed on individual components.

### Density modes

Three spacing densities are available via a CSS variable override:

```css
:root {
  /* compact | comfortable (default) | spacious */
  --uds-density: comfortable;
}
```

### Override tokens

Override any `--uds-*` variable in your app's CSS. Targeting semantic tokens (not primitives) keeps overrides narrow:

```css
/* Apply your brand color */
:root {
  --uds-color-background-primary-bold: #7C3AED;
  --uds-color-border-focused: #7C3AED;
}

[data-theme="dark"] {
  --uds-color-background-primary-bold: #A78BFA;
}
```

No fork needed. Overriding CSS variables at the semantic layer is the supported customization path — component source stays untouched.

### Zone theming (post-MVR)

Scoping theme overrides to sub-tree zones (e.g., a sidebar with a different surface color) is planned for v0.2. For now, `data-theme` applies to the full subtree from the element it's set on.

---

## Roadmap

| Release | Status | Description |
|---|---|---|
| v0.1.0-beta | Current | 19 components, tokens, Storybook, CI/CD |
| Phase 5.4 cleanup | Pending Figma MCP fix | TableRow variant labels, Patterns page cosmetics |
| v0.2 | Planned | Zone theming, Code Connect mapping, additional components (Combobox, DatePicker, Slider, DataGrid candidates) |
| Post-publish | Discovery | Informed by adopter feedback — what's missing, what's wrong |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

Key points:
- Each new component must pass the [14-point acceptance checklist](../knowledge/design-system/guidelines/component-acceptance-checklist.md) before merge
- A11y axe-tests at Critical/Serious are a hard gate
- Token binding is required — no hardcoded color, spacing, or radius values in component source

---

## License

MIT — see [LICENSE](./LICENSE).

---

## Acknowledgements

Built using a multi-agent [Claude Code](https://claude.ai/code) system: researcher, product manager, ds-architect, designer, frontend-dev, and copywriter working across Figma and code in coordinated handoffs. This project is the primary validation artifact for that system.
