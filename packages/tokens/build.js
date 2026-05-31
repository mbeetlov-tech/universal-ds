#!/usr/bin/env node
/**
 * Universal DS Token Build
 *
 * Reads tokens.json (light) + tokens.dark.json (dark overrides),
 * walks the token tree, resolves alias references, and emits:
 *   dist/tokens.css       — :root { } + [data-theme="dark"] { }
 *   dist/tokens.light.css — :root { } only (opt-in alt-path)
 *   dist/tokens.dark.css  — :root { } only, dark values
 *
 * CSS variable naming convention (per architecture.md §4):
 *   --uds-{tier}-{path-kebab-case}
 *   e.g. --uds-semantic-color-background-primary-bold
 *        --uds-component-button-background-primary-default
 *
 * Primitive tokens (palette.*) are NOT emitted as CSS variables per spec §5.
 * Spacing primitives (spacing.*) ARE emitted per spec §2.1.
 *
 * Decision: manual generation (не Style Dictionary) — simplest approach for
 * shadcn-style copy-paste distribution. Style Dictionary adds abstraction
 * overhead that adds value when there are 10+ consumers and multiple output
 * formats needed simultaneously. For now: ~200 LoC, zero extra dependencies.
 * Revisit if we add React Native or design token tooling integration.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, 'src');
const DIST = resolve(__dirname, 'dist');
mkdirSync(DIST, { recursive: true });

// --- Load sources ---
const lightTokens = JSON.parse(readFileSync(resolve(SRC, 'tokens.json'), 'utf8'));
const darkTokens  = JSON.parse(readFileSync(resolve(SRC, 'tokens.dark.json'), 'utf8'));

// --- Primitive palette: resolve references within the flat palette ---
// palette.* values are hex literals in tokens.json. We collect them for
// alias resolution but never emit them as CSS vars.
const palette = {};
for (const [family, steps] of Object.entries(lightTokens.palette ?? {})) {
  if (typeof steps === 'object' && steps.$value !== undefined) {
    // white / black — top-level
    palette[`palette.${family}`] = steps.$value;
  } else {
    for (const [step, token] of Object.entries(steps)) {
      if (step.startsWith('$')) continue;
      palette[`palette.${family}.${step}`] = token.$value;
    }
  }
}

/**
 * Walk a token tree node by a dot-separated path, handling the case where
 * some object keys themselves contain dots (e.g. "bold.hovered").
 *
 * Strategy: greedy left-to-right matching. At each step, try the longest
 * possible remaining key that exists in the current object, then recurse.
 * This handles tokens.json where "bold.hovered" is a literal key inside
 * the "primary" object, not a further nested level.
 */
function walkPath(node, parts, fromIndex = 0) {
  if (fromIndex >= parts.length) return node;
  if (node == null || typeof node !== 'object') return null;

  // Try successively longer key segments starting at fromIndex
  for (let end = parts.length; end > fromIndex; end--) {
    const segment = parts.slice(fromIndex, end).join('.');
    if (Object.prototype.hasOwnProperty.call(node, segment)) {
      const child = node[segment];
      const result = walkPath(child, parts, end);
      if (result !== null && result !== undefined) return result;
    }
  }
  return null;
}

/**
 * Resolve a {reference} alias in the token tree.
 * Supports chained aliases: {foo.bar} → looks up foo.bar in the token tree.
 * Handles literal-dot keys like "bold.hovered" in the JSON.
 * Returns the resolved raw value (hex, px, etc.).
 */
function resolveAlias(ref, source) {
  // ref is like "{palette.blue.600}" or "{color.background.primary.bold.hovered}"
  const key = ref.slice(1, -1); // strip { }

  // First try palette (primitive colors)
  if (palette[key] !== undefined) return palette[key];

  // Walk the token tree with dot-key awareness
  const parts = key.split('.');
  const node = walkPath(source, parts);
  if (node == null) return null;

  // If the node has $value, return it (resolving further aliases if needed)
  if (typeof node === 'object' && '$value' in node) {
    const val = node.$value;
    if (typeof val === 'string' && val.startsWith('{') && val.endsWith('}')) {
      // Chain: resolve further, trying both source and lightTokens
      const chained = resolveAlias(val, source) ?? resolveAlias(val, lightTokens);
      return chained;
    }
    return typeof val === 'string' ? val : null;
  }

  return null;
}

/**
 * Walk the token tree and emit CSS variable declarations.
 *
 * Rules:
 * - Skip $-prefixed metadata keys ($description, $value, $type, $version, $schema)
 * - Skip palette.* top-level group (not emitted as CSS vars per spec)
 * - Emit all other terminal tokens (those with $value)
 * - Derive variable name from path + tier prefix
 */
function* walkTokens(node, path, source, tier) {
  if (typeof node !== 'object' || node === null) return;

  // Terminal token node
  if ('$value' in node) {
    const rawValue = node.$value;
    let resolved;

    if (typeof rawValue === 'string' && rawValue.startsWith('{') && rawValue.endsWith('}')) {
      resolved = resolveAlias(rawValue, source);
      if (resolved === null) {
        // Attempt to resolve against light source (dark file references palette
        // which only exists in lightTokens)
        resolved = resolveAlias(rawValue, lightTokens);
      }
      if (resolved === null) {
        console.warn(`  Unresolved alias: ${rawValue} at ${path.join('.')}`);
        return;
      }
    } else if (typeof rawValue === 'object') {
      // Composite typography token — emit as individual CSS vars per property.
      // DTCG typography composites have: fontFamily, fontSize, fontWeight, lineHeight, letterSpacing.
      // Each property value is an alias reference string like "{font.size.xs}".
      // We emit --uds-{path}-{camelCase-to-kebab-property}: resolved-value.
      //
      // Property → CSS var suffix mapping:
      //   fontFamily    → font-family
      //   fontSize      → font-size
      //   fontWeight    → font-weight
      //   lineHeight    → line-height
      //   letterSpacing → letter-spacing
      const propSuffixMap = {
        fontFamily:    'font-family',
        fontSize:      'font-size',
        fontWeight:    'font-weight',
        lineHeight:    'line-height',
        letterSpacing: 'letter-spacing',
      };
      for (const [prop, suffix] of Object.entries(propSuffixMap)) {
        const propVal = rawValue[prop];
        if (propVal === undefined) continue;
        let resolvedProp;
        if (typeof propVal === 'string' && propVal.startsWith('{') && propVal.endsWith('}')) {
          resolvedProp = resolveAlias(propVal, source) ?? resolveAlias(propVal, lightTokens);
          if (resolvedProp === null) {
            console.warn(`  Unresolved alias: ${propVal} at ${path.join('.')}.${prop}`);
            continue;
          }
        } else {
          resolvedProp = String(propVal);
        }
        const cssName = '--uds-' + path.map(toKebab).join('-') + '-' + suffix;
        yield { name: cssName, value: resolvedProp };
      }
      return;
    } else if (typeof rawValue === 'number') {
      // Numeric dimension values — must be emitted as CSS length with px unit.
      // DTCG spec requires $type to determine how to format a raw number.
      const type = node.$type;
      if (type === 'dimension') {
        resolved = `${rawValue}px`;
      } else {
        resolved = String(rawValue);
      }
    } else {
      resolved = String(rawValue);
    }

    // CSS var name: --uds-{path segments in kebab}
    const cssName = '--uds-' + path.map(toKebab).join('-');
    yield { name: cssName, value: resolved };
    return;
  }

  // Group node — recurse
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    yield* walkTokens(child, [...path, key], source, tier);
  }
}

function toKebab(s) {
  return s.replace(/\./g, '-').toLowerCase();
}

/**
 * Determine whether a top-level token group should be emitted as CSS vars
 * and what tier prefix to use.
 */
// CSS var path strategy:
// - Primitive spacing/radius/font/shadow: --uds-primitive-{category}-{name}
//   → clear distinction from semantic roles
// - Semantic color: --uds-color-{path}  (most referenced, no tier prefix — matches spec examples)
// - Semantic spacing: --uds-spacing-{role}-{size}  (no 'semantic' prefix — matches spec)
// - Semantic radius: --uds-radius-{role}-{size}
// - Semantic shadow: --uds-shadow-{role}
// - Semantic typography: --uds-typography-{role}
// - Component: --uds-{component}-{path}  (no tier prefix — matches spec examples)
//
// Rationale: Architecture.md §4 shows --uds-semantic-color-* with tier prefix for color,
// but style-dictionary-spec.md §2.1 shows shorter --uds-color-* forms in the output examples.
// Decision: semantic color uses --uds-color-* (shorter, most consumed), all other semantic
// groups use their category name directly. Primitives get --uds-primitive-* to distinguish
// from semantic (which are the "public API" for consumers).
const TIER_MAP = {
  // Primitive groups — prefixed with 'primitive-' to distinguish from semantic
  spacing:         { emit: true,  tier: 'primitive', prefix: ['primitive', 'spacing'] },
  radius:          { emit: true,  tier: 'primitive', prefix: ['primitive', 'radius'] },
  size:            { emit: true,  tier: 'primitive', prefix: ['primitive', 'size'] },
  font:            { emit: true,  tier: 'primitive', prefix: ['primitive', 'font'] },
  shadow:          { emit: true,  tier: 'primitive', prefix: ['primitive', 'shadow'] },

  // Primitive palette NOT emitted (consumers cannot bypass to primitives per spec)
  palette:         { emit: false },

  // Semantic groups — short names without 'semantic-' prefix (public API)
  semanticSpacing: { emit: true,  tier: 'semantic',  prefix: ['spacing'] },
  semanticRadius:  { emit: true,  tier: 'semantic',  prefix: ['radius'] },
  semanticSize:    { emit: true,  tier: 'semantic',  prefix: ['size'] },
  semanticShadow:  { emit: true,  tier: 'semantic',  prefix: ['shadow'] },
  typography:      { emit: true,  tier: 'semantic',  prefix: ['typography'] },
  color:           { emit: true,  tier: 'semantic',  prefix: ['color'] },

  // Component tier — short names without 'component-' prefix
  button:          { emit: true,  tier: 'component', prefix: ['button'] },
  input:           { emit: true,  tier: 'component', prefix: ['input'] },
  card:            { emit: true,  tier: 'component', prefix: ['card'] },
  badge:           { emit: true,  tier: 'component', prefix: ['badge'] },
  tooltip:         { emit: true,  tier: 'component', prefix: ['tooltip'] },
  avatar:          { emit: true,  tier: 'component', prefix: ['avatar'] },
  dialog:          { emit: true,  tier: 'component', prefix: ['dialog'] },
  drawer:          { emit: true,  tier: 'component', prefix: ['drawer'] },
  popover:         { emit: true,  tier: 'component', prefix: ['popover'] },
};

// Dynamically handle any unknown top-level groups (future components)
function getTierEntry(key) {
  if (TIER_MAP[key]) return TIER_MAP[key];
  // Heuristic: if key starts with known patterns
  console.warn(`  Unknown top-level key "${key}" — emitting as component tier`);
  return { emit: true, tier: 'component', prefix: [key] };
}

/**
 * Generate all CSS var declarations from a token source (light or dark).
 * darkSource = true means we're processing the dark override file — it
 * doesn't contain palette/spacing/radius/font so skip those.
 */
function generateVars(source, isDark = false) {
  const lines = [];

  for (const [topKey, topNode] of Object.entries(source)) {
    if (topKey.startsWith('$')) continue;

    const entry = getTierEntry(topKey);
    if (!entry.emit) continue;

    // Dark file only contains color overrides; skip non-color groups
    if (isDark && !['color'].includes(topKey)) continue;

    for (const { name, value } of walkTokens(topNode, entry.prefix, source, entry.tier)) {
      lines.push(`  ${name}: ${value};`);
    }
  }

  return lines;
}

// --- Generate light vars ---
const lightVars = generateVars(lightTokens, false);
const darkVars  = generateVars(darkTokens, true);

// --- Assemble tokens.css ---
const now = new Date().toISOString().slice(0, 10);
const header = `/*
 * Universal DS — Design Tokens
 * Generated ${now} by packages/tokens/build.js
 * Source: knowledge/design-system/tokens/tokens.json
 * Do not edit directly.
 *
 * Usage:
 *   import '@uds/tokens/css';   // imports tokens.css (light + dark)
 *
 * Dark theme: set data-theme="dark" on <html> or any container element.
 */\n`;

const tokensCss = [
  header,
  ':root {',
  ...lightVars,
  '}',
  '',
  '[data-theme="dark"] {',
  '  /* Only semantic color tokens are overridden — spacing/radius/font are theme-invariant */',
  ...darkVars,
  '}',
].join('\n');

const lightOnlyCss = [
  header.replace('tokens.css', 'tokens.light.css'),
  ':root {',
  ...lightVars,
  '}',
].join('\n');

const darkOnlyCss = [
  header.replace('tokens.css', 'tokens.dark.css'),
  ':root {',
  ...darkVars,
  '}',
].join('\n');

writeFileSync(resolve(DIST, 'tokens.css'), tokensCss);
writeFileSync(resolve(DIST, 'tokens.light.css'), lightOnlyCss);
writeFileSync(resolve(DIST, 'tokens.dark.css'), darkOnlyCss);

console.log(`Generated:`);
console.log(`  dist/tokens.css       (${lightVars.length} light vars + ${darkVars.length} dark overrides)`);
console.log(`  dist/tokens.light.css`);
console.log(`  dist/tokens.dark.css`);

// --- Generate index.ts type stubs ---
// The TypeScript source file (src/index.ts) exports token names as typed constants
// for type-safe usage in components.
// Full generated types are deferred to Phase 2 of tokens work.
// For now: export the CSS var helper + named constants for semantic color tokens.
generateTypeSource(lightTokens, lightVars.length);

function generateTypeSource(source, varCount) {
  const colorBgTokens = [];
  const colorTextTokens = [];
  const colorBorderTokens = [];

  function collectLeaves(node, path) {
    if (typeof node !== 'object' || node === null) return;
    if ('$value' in node) {
      colorBgTokens.push(path);
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      collectLeaves(child, path ? `${path}.${key}` : key);
    }
  }

  // We'll generate a simpler typed module — full generation in Phase 2
  const tsContent = `/**
 * Universal DS — Token TypeScript exports
 * Generated ${now}. Do not edit directly.
 *
 * CSS variable helper — resolves a token name to its CSS var() reference.
 * Use in React components via inline style or CSS-in-JS where Tailwind is unavailable.
 *
 * Prefer using Tailwind classes (bg-[var(--uds-semantic-color-background-primary-bold)])
 * or CSS vars directly in your stylesheets over this helper for static usage.
 */

/** Prefix for all Universal DS CSS variables. */
export const UDS_VAR_PREFIX = '--uds-' as const;

/** Total token count generated from source (informational). */
export const TOKEN_COUNT = ${varCount} as const;

/**
 * Resolve a UDS CSS variable name to a var() reference.
 * @example cssVar('semantic-color-background-primary-bold') → 'var(--uds-semantic-color-background-primary-bold)'
 */
export function cssVar(name: string): string {
  return \`var(\${UDS_VAR_PREFIX}\${name})\`;
}

/**
 * Semantic color background token names (light + dark theme).
 * All are available as CSS vars: --uds-color-background-{token}
 */
export type ColorBackgroundToken =
  | 'page'
  | 'surface'
  | 'raised'
  | 'sunken'
  | 'subtle'
  | 'subtle-hovered'
  | 'subtle-pressed'
  | 'disabled'
  | 'ghost-hovered'
  | 'ghost-pressed'
  | 'primary-bold'
  | 'primary-bold-hovered'
  | 'primary-bold-pressed'
  | 'primary-subtle'
  | 'primary-subtle-hovered'
  | 'primary-subtle-pressed'
  | 'danger-bold'
  | 'danger-bold-hovered'
  | 'danger-bold-pressed'
  | 'danger-subtle'
  | 'danger-subtle-hovered'
  | 'danger-subtle-pressed'
  | 'success-bold'
  | 'success-bold-hovered'
  | 'success-subtle'
  | 'success-subtle-hovered'
  | 'warning-bold'
  | 'warning-bold-hovered'
  | 'warning-subtle'
  | 'warning-subtle-hovered'
  | 'info-bold'
  | 'info-bold-hovered'
  | 'info-subtle'
  | 'info-subtle-hovered'
  | 'neutral-bold'
  | 'neutral-bold-hovered'
  | 'neutral-subtle'
  | 'neutral-subtle-hovered';

/**
 * Semantic color text token names.
 * All are available as CSS vars: --uds-color-text-{token}
 */
export type ColorTextToken =
  | 'primary'
  | 'default'
  | 'secondary'
  | 'subtle'
  | 'disabled'
  | 'placeholder'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'link'
  | 'link-hovered'
  | 'on-primary-bold'
  | 'on-primary-subtle'
  | 'on-danger-bold'
  | 'on-danger-subtle'
  | 'on-success-bold'
  | 'on-success-subtle'
  | 'on-warning-bold'
  | 'on-warning-subtle'
  | 'on-info-bold'
  | 'on-info-subtle'
  | 'on-neutral-bold'
  | 'on-neutral-subtle';

/**
 * Semantic color border token names.
 * All are available as CSS vars: --uds-color-border-{token}
 */
export type ColorBorderToken =
  | 'default'
  | 'subtle'
  | 'strong'
  | 'strong-hovered'
  | 'focused'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'disabled';

/** Button intent values — mirrors the Figma component property. */
export type ButtonIntent = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';

/** Button size values — mirrors the Figma component property. */
export type ButtonSize = 'sm' | 'md' | 'lg';
`;

  writeFileSync(resolve(SRC, 'index.ts'), tsContent);
  console.log(`  src/index.ts          (TypeScript types + cssVar helper)`);
}
