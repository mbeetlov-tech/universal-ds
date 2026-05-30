# Contributing to Universal DS

## Setup

```bash
# Clone the repo
git clone https://github.com/antigravity/universal-ds.git
cd universal-ds/code

# Install dependencies (requires Node 22 + corepack)
corepack enable
pnpm install

# Start Storybook (visual playground)
pnpm storybook
```

---

## Conventional commits

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type | When to use |
|---|---|
| `feat` | New component, new token, new feature |
| `fix` | Bug fix in component or token |
| `docs` | Documentation update (Storybook story, README, component spec) |
| `chore` | Build, config, dependency updates |
| `refactor` | Code restructure without behavior change |
| `test` | Test additions or fixes |
| `perf` | Performance improvement |
| `build` | Build system changes |

### Examples

```
feat(button): add loading state with inline Spinner
fix(tokens): correct dark theme danger-bold-pressed hex
docs(button): add VariantMatrix story with all 15 combos
chore: update tsup to 8.3.0
refactor(cn): extract to shared utils package
test(button): add asChild polymorphism coverage
```

### Scope

Use the component or package name as scope. Skip scope for cross-cutting changes.

### Commit message size

- Subject line: 72 chars max
- Body: optional, explains WHY (not what — that's in the diff)

---

## Changeset workflow

Every PR that changes a publishable package (`@uds/tokens`, `@uds/components`) needs a changeset.

```bash
# After making your changes:
pnpm changeset

# Interactive prompt:
# 1. Select changed packages (spacebar to select)
# 2. Choose version bump: patch / minor / major
#    - patch: bug fixes, non-breaking tweaks
#    - minor: new component, new variant, new token
#    - major: breaking API change, token rename
# 3. Enter one-line summary (this appears in CHANGELOG)

# Commit the generated .changeset/*.md file with your PR
git add .changeset
git commit -m "chore: add changeset for button loading state"
```

### What goes in the changeset summary

Follow Carbon's per-component changelog style:
- "Add loading state to Button (aria-busy, Spinner overlay)"
- "Fix: dark theme secondary button border incorrect hex"
- "Breaking: rename ButtonProps.variant → ButtonProps.intent"

### CHANGELOG generation

CI runs `changeset version` on merge to main, which:
1. Bumps package versions per changeset entries
2. Updates CHANGELOG.md per package
3. Opens a "Version Packages" PR

Merge that PR to publish.

---

## Branch conventions

```
main          — production, protected
feat/<name>   — new feature or component
fix/<name>    — bug fix
chore/<name>  — maintenance
docs/<name>   — documentation only
```

PRs target `main`. All PRs need passing CI (tests + typecheck + build + bundle size).

---

## Code-side acceptance gates (per component)

Before a component PR is mergeable:

- [ ] **TypeScript strict**: `pnpm --filter @uds/components typecheck` — zero errors
- [ ] **Tests**: `pnpm --filter @uds/components test:run` — all pass
  - Integration tests covering all intents/sizes
  - Disabled/loading state behavior (click suppression, aria attrs)
  - Accessible name correctness (getByRole queries pass)
- [ ] **Storybook**: Stories render all variants, including disabled/loading
- [ ] **a11y**: Storybook Accessibility panel shows 0 Critical/Serious violations per story
- [ ] **Changeset**: `.changeset/*.md` file added
- [ ] **CVA pattern**: variants use `cva()`, not inline conditionals
- [ ] **Tokens**: all colors from `var(--uds-*)` CSS vars — zero hardcoded hex
- [ ] **Icons**: use `lucide-react` — no hand-drawn inline SVG (exception: Spinner arc)
- [ ] **forwardRef + displayName**: both present on exported components
- [ ] **Component docs**: `knowledge/design-system/components/{name}.md` exists

---

## Architecture reminders

**Tokens are owned by ds-architect.** `knowledge/design-system/` is read-only for frontend-dev. If you need a new token, open an issue for ds-architect — do not add to tokens.json directly.

**Component isolation**: components consume `--uds-{component}-*` CSS vars, not semantic vars directly. The component tier is the isolation layer.

**Soft-disabled (F-9)**: never use native `disabled` attribute on interactive elements. Use `aria-disabled="true"` + click suppression so keyboard users can still find the element.

**Test query priority (TE-3)**: `getByRole` → `getByLabelText` → `getByText`. Never `getByTestId` unless genuinely ambiguous (data grid identical rows).
