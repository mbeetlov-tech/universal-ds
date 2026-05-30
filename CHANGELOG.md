# Changelog

All notable changes to Universal DS packages are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versioning: [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Changed — BREAKING for copy-paste consumers

**Icon library: Lucide → Hugeicons (Phase 5.8, 2026-05-30)**

Code-side icon library switched from `lucide-react` to `@hugeicons/react` + `@hugeicons/core-free-icons` for visual parity with Figma DS library (single icon library Figma + code = zero visual drift).

**Impact on copy-paste consumers of `@uds/components`:** any component that imported from `lucide-react` now imports from `@hugeicons/react`. Migration:

```diff
- import { ChevronDown, Check, Trash, Eye } from 'lucide-react';
+ import { HugeiconsIcon } from '@hugeicons/react';
+ import {
+   ArrowDown01Icon as ChevronDown,
+   Tick01Icon as Check,
+   Delete02Icon as Trash,
+   View01Icon as Eye,
+ } from '@hugeicons/core-free-icons';
```

Rendering:

```diff
- <ChevronDown className="size-4" aria-hidden />
+ <HugeiconsIcon icon={ChevronDown} className="size-4" aria-hidden />
```

**Lucide → Hugeicons mapping table** (Phase 5.8 9 new curated icons):

| Lucide | Hugeicons npm | DS curated name (Figma) |
|---|---|---|
| `ChevronUp` | `ArrowUp01Icon` | `chevron-up` |
| `ChevronDown` | `ArrowDown01Icon` | `chevron-down` |
| `ChevronRight` | `ArrowRight01Icon` | `chevron-right` |
| `ChevronsUpDown` | `ArrowDataTransferVerticalIcon` | `chevrons-up-down` |
| `Check` | `Tick01Icon` / `Tick02Icon` | `check` |
| `CheckCircle` | `CheckmarkCircle01Icon` | `check-circle` |
| `CheckCheck` | `TickDouble01Icon` | `check-double` |
| `Eye` | `View01Icon` | `eye` |
| `Trash` / `Trash2` | `Delete02Icon` | `trash` |

Full mapping for the 84 previously-curated icons unchanged — all 93 (84 + 9) are documented in `knowledge/design-system/components/icon.md` Categories table.

**Rationale:** Phase 0.2 ratified Lucide for code-side while Figma used Hugeicons (separate libraries). Phase 5.8 reverses this after user-driven visual-parity review during frontend-dev iter 9 confirmed cross-library deltas were unacceptable. Single icon library = zero drift.

**Frontend-dev iter 10 owns code migration.** See `STATUS.md` Phase 0.2 stack amendment + `knowledge/design-system/changelog.md` Phase 5.8 entry for full context.

---

## [0.1.0-beta] — 2026-05-29

First public release. Tokens npm package + 19 components (copy-paste).

### Added

**Tokens — `@uds/tokens` v0.1.0**
- 11 token collections: 4 Primitive tiers (color, spacing, radius, typography), 4 Semantic tiers (color, spacing, radius, typography), 1 Component tier, Stroke 2-tier — 1,067 variables total
- CSS custom properties under `--uds-*` namespace, output to `dist/tokens.css`
- Light and dark theme files (`tokens.light.css`, `tokens.dark.css`); dark theme activated via `[data-theme="dark"]` selector
- TypeScript type exports for token paths
- Tailwind v4 integration via CSS variable references (no config file required)

**Components — `@uds/components` v0.1.0 (copy-paste / shadcn-style)**

19 components, each with: cva variants, Radix headless primitives, full `--uds-*` token binding, a11y-tested states (default / hover / focus / active / disabled / loading where applicable).

Foundations: Icon, Spinner  
Inputs: Button, IconButton, Input, Checkbox, Switch, Select  
Display: Badge, Avatar, Card, Tooltip  
Navigation: Tabs, SidebarItem, Sidebar, MenuItem, Menu, Pagination  
Data: TableRow, TableHeader

**Documentation**
- Storybook 8.6 at `apps/docs/` — interactive playground for all 19 components, dark/light theme toggle, a11y panel per story
- Per-component acceptance gates: 14-point checklist (a11y, token binding, binding discipline, visual craft) — all components passing at publish

**Infrastructure**
- pnpm 9 monorepo, tsup build, Vitest unit + integration tests
- GitHub Actions CI: type-check, test, Storybook build on every PR
- Vercel preview deployments per PR (Storybook)
- Changesets for release management

### Known issues

- **TableRow placeholder content** — 15 variants use "John Doe — Engineer" placeholder text instead of realistic team-workspace names. Cosmetic only; component behavior and API unaffected. Tracked: [backlog.md — Phase 5.4](../projects/mvr-spec/artifacts/backlog.md)
- **Patterns page stale labels** — 10 Card-clone rows on the Figma Patterns page carry placeholder naming from an earlier Figma library iteration. No code impact. Tracked: same backlog entry
- **Italic text styles** — Figma API limitation prevents programmatic italic style creation; italic variants not shipped in this release. Will be added as a standalone increment when the API supports it
- **Phase 5.4 resolution blocked** — the above two Figma cleanup tasks are pending a Figma MCP server-side fix (`use_figma` write tool unavailable since 2026-05-29). Filed with Figma support. No code-side impact

### Migration

First public release — no migration needed.

Both packages use the same distribution split:

| Package | Distribution | Install |
|---|---|---|
| `@uds/tokens` | npm | `pnpm add @uds/tokens` |
| `@uds/components` | copy-paste (or npm) | copy from `packages/components/src/` or `pnpm add @uds/components` |

See [MIGRATION.md](./MIGRATION.md) for the adopting guide and future version migration tables.

### Acknowledgements

Universal DS was built using a multi-agent Claude Code system — researcher, product manager, ds-architect, designer, frontend-dev, and copywriter working in coordinated handoffs across Figma and code. This release is the primary validation artifact for that system.

---

[0.1.0-beta]: https://github.com/mikhail-s-projects9/universal-ds/releases/tag/v0.1.0-beta
