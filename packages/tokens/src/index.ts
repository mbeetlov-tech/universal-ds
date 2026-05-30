/**
 * Universal DS — Token TypeScript exports
 * Generated 2026-05-30. Do not edit directly.
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
export const TOKEN_COUNT = 513 as const;

/**
 * Resolve a UDS CSS variable name to a var() reference.
 * @example cssVar('semantic-color-background-primary-bold') → 'var(--uds-semantic-color-background-primary-bold)'
 */
export function cssVar(name: string): string {
  return `var(${UDS_VAR_PREFIX}${name})`;
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
