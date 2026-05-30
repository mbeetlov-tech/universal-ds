/**
 * @uds/tokens — build output validation tests
 *
 * Tests verify that the token build produces correct CSS variables
 * with proper values (no unresolved aliases, correct hex colors, correct px values).
 *
 * Test strategy (TE-1/TE-2 principles):
 * - Integration-level: read actual build output files, not mocks
 * - Assert on observable artifact correctness, not internal build mechanics
 * - Run `pnpm --filter @uds/tokens build` before running tests (CI does this)
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect, beforeAll } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');

// Build output files — must exist before test run
let tokensCss = '';
let lightCss = '';
let darkCss = '';

beforeAll(() => {
  // Ensure build has been run
  const tokensPath = resolve(DIST, 'tokens.css');
  if (!existsSync(tokensPath)) {
    throw new Error(
      'dist/tokens.css not found. Run `pnpm --filter @uds/tokens build` first.'
    );
  }
  tokensCss = readFileSync(tokensPath, 'utf8');
  lightCss = readFileSync(resolve(DIST, 'tokens.light.css'), 'utf8');
  darkCss = readFileSync(resolve(DIST, 'tokens.dark.css'), 'utf8');
});

// --- Helper ---
function extractVar(css: string, varName: string): string | null {
  const regex = new RegExp(`${varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*([^;]+);`);
  const match = css.match(regex);
  return match ? match[1].trim() : null;
}

// --- Structural tests ---

describe('tokens.css structure', () => {
  it('contains :root block', () => {
    expect(tokensCss).toContain(':root {');
  });

  it('contains [data-theme="dark"] block', () => {
    expect(tokensCss).toContain('[data-theme="dark"] {');
  });

  it('does not contain unresolved alias references', () => {
    // No literal {} references should appear in CSS output
    const unresolved = tokensCss.match(/var\s*=\s*\{[^}]+\}/g);
    expect(unresolved).toBeNull();
  });

  it('does not expose palette primitives as CSS vars', () => {
    // palette.* must NOT be emitted (per architecture §5)
    expect(tokensCss).not.toContain('--uds-palette-');
  });

  it('generates both light and dark standalone files', () => {
    expect(lightCss).toContain(':root {');
    expect(darkCss).toContain(':root {');
  });
});

// --- Semantic color tokens (most critical) ---

describe('semantic color — background tokens (light)', () => {
  it('page background = slate.50 (#F8FAFC)', () => {
    expect(extractVar(lightCss, '--uds-color-background-page')).toBe('#F8FAFC');
  });

  it('surface background = white (#FFFFFF)', () => {
    expect(extractVar(lightCss, '--uds-color-background-surface')).toBe('#FFFFFF');
  });

  it('primary bold background = blue.600 (#2563EB)', () => {
    expect(extractVar(lightCss, '--uds-color-background-primary-bold')).toBe('#2563EB');
  });

  it('primary bold hovered = blue.700 (#1D4ED8)', () => {
    expect(extractVar(lightCss, '--uds-color-background-primary-bold-hovered')).toBe('#1D4ED8');
  });

  it('danger bold = red.600 (#DC2626)', () => {
    expect(extractVar(lightCss, '--uds-color-background-danger-bold')).toBe('#DC2626');
  });

  it('disabled background = slate.100 (#F1F5F9)', () => {
    expect(extractVar(lightCss, '--uds-color-background-disabled')).toBe('#F1F5F9');
  });
});

describe('semantic color — dark theme overrides', () => {
  it('page background dark = slate.950 (#020617)', () => {
    expect(extractVar(darkCss, '--uds-color-background-page')).toBe('#020617');
  });

  it('surface background dark = slate.900 (#0F172A)', () => {
    expect(extractVar(darkCss, '--uds-color-background-surface')).toBe('#0F172A');
  });

  it('primary bold dark = blue.500 (#3B82F6)', () => {
    expect(extractVar(darkCss, '--uds-color-background-primary-bold')).toBe('#3B82F6');
  });
});

describe('semantic color — text on-* pairs', () => {
  it('on-primary-bold = white (#FFFFFF) for AA contrast', () => {
    expect(extractVar(lightCss, '--uds-color-text-on-primary-bold')).toBe('#FFFFFF');
  });

  it('on-danger-bold = white (#FFFFFF)', () => {
    expect(extractVar(lightCss, '--uds-color-text-on-danger-bold')).toBe('#FFFFFF');
  });
});

// --- Button component tokens ---

describe('component button tokens', () => {
  it('button radius = 8px (semanticRadius.control.md)', () => {
    expect(extractVar(lightCss, '--uds-button-radius')).toBe('8px');
  });

  it('button sm height = 32px', () => {
    expect(extractVar(lightCss, '--uds-button-size-sm-height')).toBe('32px');
  });

  it('button md height = 40px', () => {
    expect(extractVar(lightCss, '--uds-button-size-md-height')).toBe('40px');
  });

  it('button lg height = 48px', () => {
    expect(extractVar(lightCss, '--uds-button-size-lg-height')).toBe('48px');
  });

  it('button primary background default = blue.600 (#2563EB)', () => {
    expect(extractVar(lightCss, '--uds-button-primary-background-default')).toBe('#2563EB');
  });

  it('button primary background hovered = blue.700 (#1D4ED8)', () => {
    expect(extractVar(lightCss, '--uds-button-primary-background-hovered')).toBe('#1D4ED8');
  });

  it('button primary background pressed = blue.800 (#1E40AF)', () => {
    expect(extractVar(lightCss, '--uds-button-primary-background-pressed')).toBe('#1E40AF');
  });

  it('button primary text default = white (#FFFFFF)', () => {
    expect(extractVar(lightCss, '--uds-button-primary-text-default')).toBe('#FFFFFF');
  });

  it('button danger background default = red.600 (#DC2626)', () => {
    expect(extractVar(lightCss, '--uds-button-danger-background-default')).toBe('#DC2626');
  });

  it('button ghost background default = transparent', () => {
    expect(extractVar(lightCss, '--uds-button-ghost-background-default')).toBe('transparent');
  });

  it('button focus ring width = 2px', () => {
    expect(extractVar(lightCss, '--uds-button-focus-ring-width')).toBe('2px');
  });

  it('button focus ring offset = 2px', () => {
    expect(extractVar(lightCss, '--uds-button-focus-ring-offset')).toBe('2px');
  });

  it('button focus ring color = blue.600 (#2563EB)', () => {
    expect(extractVar(lightCss, '--uds-button-focus-ring-color')).toBe('#2563EB');
  });
});

// --- Spacing semantic tokens ---

describe('semantic spacing tokens', () => {
  it('spacing inset md = 12px', () => {
    expect(extractVar(lightCss, '--uds-spacing-inset-md')).toBe('12px');
  });

  it('spacing inset lg = 16px', () => {
    expect(extractVar(lightCss, '--uds-spacing-inset-lg')).toBe('16px');
  });

  it('spacing inline xs = 4px (icon-label gap)', () => {
    expect(extractVar(lightCss, '--uds-spacing-inline-xs')).toBe('4px');
  });
});

// --- Radius semantic tokens ---

describe('semantic radius tokens', () => {
  it('radius control sm = 4px (Button sm)', () => {
    expect(extractVar(lightCss, '--uds-radius-control-sm')).toBe('4px');
  });

  it('radius control md = 8px (Button md default)', () => {
    expect(extractVar(lightCss, '--uds-radius-control-md')).toBe('8px');
  });

  it('radius control lg = 12px (Button lg)', () => {
    expect(extractVar(lightCss, '--uds-radius-control-lg')).toBe('12px');
  });

  it('radius pill = 9999px', () => {
    expect(extractVar(lightCss, '--uds-radius-pill')).toBe('9999px');
  });
});

// --- Token count sanity ---

describe('token count', () => {
  it('light theme has at least 300 CSS variables', () => {
    const varCount = (lightCss.match(/--uds-/g) ?? []).length;
    expect(varCount).toBeGreaterThanOrEqual(300);
  });

  it('dark theme has at least 60 override variables', () => {
    const varCount = (darkCss.match(/--uds-/g) ?? []).length;
    expect(varCount).toBeGreaterThanOrEqual(60);
  });
});
