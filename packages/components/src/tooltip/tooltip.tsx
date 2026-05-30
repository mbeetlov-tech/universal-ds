/**
 * Tooltip — Universal DS
 *
 * Floating label on hover/focus of an anchor element.
 * 8 variants: 2 sizes × 4 positions
 *
 * Tokens: 13 component-tier tokens (tooltip.md §Tokens):
 *   - Geometry per size: padding-x/y, gap, max-width (8 tokens)
 *   - Arrow geometry: size, offset (2 tokens)
 *   - Color: bg, text (2 tokens)
 *   - Radius (1 token)
 *
 * Accessibility (tooltip.md §Accessibility):
 *   - role="tooltip" on the tooltip content
 *   - aria-describedby on trigger pointing to tooltip id
 *   - Visible on :focus-visible (WCAG 1.4.13)
 *   - Escape dismissal (handled by Radix in production)
 *   - prefers-reduced-motion: instant appearance
 *
 * Note: This is a CSS-hover implementation for Storybook. Production
 * use should integrate @radix-ui/react-tooltip for proper portal,
 * viewport-flip, and escape handling.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA: tooltip body ---
// Padding and max-width use CSS vars from component tokens per size.
// Arrow gap is 6px (--uds-tooltip-arrow-size) — we position body 6px
// beyond the anchor edge to leave room for the arrow between anchor + body.

const tooltipBodyVariants = cva(
  [
    'absolute z-50 pointer-events-none',
    'flex flex-col',
    // Colors from component tokens — use Tailwind v4 CSS var shorthand with explicit type hint
    // to disambiguate text-(--var): without (color:) Tailwind v4 treats it as font-size context
    // when the var name doesn't match a color namespace. (color:) forces color: var(--x) output.
    'bg-(--uds-tooltip-bg)',
    'text-(color:--uds-tooltip-text)',
    // Font family: pin to semantic typography var (resolves to Inter) so tooltip is not
    // affected by any consumer root override. Reset inherited weight from ancestor headings.
    // [font-family:var(...)] arbitrary property syntax — avoids comma-parsing issues that
    // affect font-[...] utility shorthand in Tailwind v4.
    '[font-family:var(--uds-typography-label-m-font-family)] font-normal',
    // Radius from component token
    'rounded-(--uds-tooltip-radius)',
    // Shadow from semantic shadow overlay
    'shadow-(--uds-shadow-overlay-tooltip)',
    // Animation
    'transition-opacity duration-150 motion-reduce:transition-none',
    'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
    // Width strategy: w-max (= width: max-content) means the body expands to fit the widest
    // single-line content. max-w-(--token) then caps that at the token value (200/280px).
    // This matches Figma HUG + max-width behavior: body is as wide as content, never over cap.
    // Without w-max, flex-col containers use min-content (longest word width) causing
    // excessive wrapping when description is wider than title.
    'w-max whitespace-normal',
  ].join(' '),
  {
    variants: {
      size: {
        sm: [
          'px-(--uds-tooltip-sm-padding-x)',
          'py-(--uds-tooltip-sm-padding-y)',
          'gap-(--uds-tooltip-sm-gap)',
          // max-width via Tailwind v4 shorthand — caps body at 200px per spec
          'max-w-(--uds-tooltip-sm-max-width)',
          // Label/S semantic binding: 11px / 16px / 500 / 0.5px
          // font-size: (length:) type hint required — text-(--var) without it defaults to color
          'text-(length:--uds-typography-label-s-font-size)',
          'leading-(--uds-typography-label-s-line-height)',
          'tracking-(--uds-typography-label-s-letter-spacing)',
        ].join(' '),
        md: [
          'px-(--uds-tooltip-md-padding-x)',
          'py-(--uds-tooltip-md-padding-y)',
          'gap-(--uds-tooltip-md-gap)',
          // max-width via Tailwind v4 shorthand — caps body at 280px per spec
          'max-w-(--uds-tooltip-md-max-width)',
          // Label/M semantic binding: 12px / 16px / 500 / 0.25px
          // font-size: (length:) type hint required — text-(--var) without it defaults to color
          'text-(length:--uds-typography-label-m-font-size)',
          'leading-(--uds-typography-label-m-line-height)',
          'tracking-(--uds-typography-label-m-letter-spacing)',
        ].join(' '),
      },
      position: {
        // Each body position accounts for 6px arrow depth (--uds-tooltip-arrow-size)
        // so the total gap between anchor edge and body edge = 6px (filled by arrow).
        top:    'bottom-[calc(100%+var(--uds-tooltip-arrow-size,6px))] left-1/2 -translate-x-1/2',
        bottom: 'top-[calc(100%+var(--uds-tooltip-arrow-size,6px))] left-1/2 -translate-x-1/2',
        left:   'right-[calc(100%+var(--uds-tooltip-arrow-size,6px))] top-1/2 -translate-y-1/2',
        right:  'left-[calc(100%+var(--uds-tooltip-arrow-size,6px))] top-1/2 -translate-y-1/2',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'bottom',
    },
  }
);

// --- Types ---

export type TooltipSize = 'sm' | 'md';
export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'content' | 'title'>,
    VariantProps<typeof tooltipBodyVariants> {
  /** The element that triggers the tooltip */
  children: React.ReactNode;

  /** Single-line tooltip text (shorthand for title) */
  content?: React.ReactNode;

  /** Tooltip title (shown in bold when description also present) */
  title?: React.ReactNode;

  /** Optional description below title */
  description?: React.ReactNode;

  /** Show arrow pointing at anchor (default: true) */
  hasArrow?: boolean;

  /** Tooltip size */
  size?: TooltipSize;

  /** Which side tooltip appears */
  position?: TooltipPosition;

  /** Delay before showing (ms) — CSS hover handles this natively */
  delayDuration?: number;

  /**
   * Force the tooltip body to remain visible regardless of hover/focus state.
   * Intended for Storybook documentation only — never use in production.
   */
  forceVisible?: boolean;
}

// --- Arrow classes per position ---
//
// Arrow geometry: base 12px, depth 6px (2:1 ratio, per tooltip.md §Anatomy).
// Position=top: tooltip above anchor. Arrow at bottom of body, pointing DOWN (toward anchor).
//   border-t-[6px] border-t-[color] + border-l/r-[6px] transparent = downward triangle.
// Position=bottom: tooltip below anchor. Arrow at top of body, pointing UP (toward anchor).
//   border-b-[6px] border-b-[color] + border-l/r-[6px] transparent = upward triangle.
// Position=right: tooltip right of anchor. Arrow at left of body, pointing LEFT (toward anchor).
//   border-r-[6px] border-r-[color] + border-t/b-[6px] transparent = leftward triangle.
// Position=left: tooltip left of anchor. Arrow at right of body, pointing RIGHT (toward anchor).
//   border-l-[6px] border-l-[color] + border-t/b-[6px] transparent = rightward triangle.
//
// Centering (per Phase 5.3): top/bottom arrows centered horizontally (left-1/2 -translate-x-1/2).
// right/left arrows centered vertically (top-1/2 -translate-y-1/2).

const ARROW_CLASSES: Record<TooltipPosition, string> = {
  top: [
    'absolute left-1/2 -translate-x-1/2',
    'top-full',   // below the body (body is above anchor)
    'w-0 h-0',
    'border-l-[6px] border-l-transparent',
    'border-r-[6px] border-r-transparent',
    // Tailwind v4 CSS var shorthand — border-t color from tooltip bg token
    'border-t-[6px] border-t-(--uds-tooltip-bg)',
  ].join(' '),

  bottom: [
    'absolute left-1/2 -translate-x-1/2',
    'bottom-full', // above the body (body is below anchor)
    'w-0 h-0',
    'border-l-[6px] border-l-transparent',
    'border-r-[6px] border-r-transparent',
    'border-b-[6px] border-b-(--uds-tooltip-bg)',
  ].join(' '),

  right: [
    'absolute top-1/2 -translate-y-1/2',
    'right-full', // left of the body (body is right of anchor)
    'w-0 h-0',
    'border-t-[6px] border-t-transparent',
    'border-b-[6px] border-b-transparent',
    'border-r-[6px] border-r-(--uds-tooltip-bg)',
  ].join(' '),

  left: [
    'absolute top-1/2 -translate-y-1/2',
    'left-full',  // right of the body (body is left of anchor)
    'w-0 h-0',
    'border-t-[6px] border-t-transparent',
    'border-b-[6px] border-b-transparent',
    'border-l-[6px] border-l-(--uds-tooltip-bg)',
  ].join(' '),
};

// --- Component ---

const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  (
    {
      children,
      content,
      title,
      description,
      hasArrow = true,
      size = 'md',
      position = 'bottom',
      delayDuration,
      forceVisible = false,
      className,
      ...props
    },
    ref
  ) => {
    const tooltipId = React.useId();
    const titleText = title ?? content;

    return (
      <span
        ref={ref}
        className={cn('group relative inline-flex', className)}
        {...props}
      >
        {/* Trigger — forward aria-describedby to the triggering element */}
        {React.isValidElement(children) ? (
          React.cloneElement(
            children as React.ReactElement<{ 'aria-describedby'?: string }>,
            { 'aria-describedby': tooltipId }
          )
        ) : (
          <span aria-describedby={tooltipId}>{children}</span>
        )}

        {/* Tooltip body */}
        <span
          id={tooltipId}
          role="tooltip"
          className={cn(
            tooltipBodyVariants({ size, position }),
            forceVisible && '!opacity-100',
          )}
        >
          {/* Arrow — positioned between body edge and anchor */}
          {hasArrow && (
            <span aria-hidden="true" className={ARROW_CLASSES[position]} />
          )}

          {/* Title / content */}
          {/* Font-weight from semantic typography var (500 = medium) for both Label/S and Label/M.
              Font-size and line-height are already set on the body variant class (inherited here).
              (number:) type hint required — font-(--var) without it defaults to font-family in v4. */}
          {titleText && (
            <span className="font-(number:--uds-typography-label-m-font-weight)">
              {titleText}
            </span>
          )}

          {/* Description */}
          {/* sm: Caption/S semantic binding — 11px / 16px / 400 / 0px letter-spacing.
              Fixes Phase 5.6 delta: Label/S tracking was 0.5px vs Figma's 0px.
              Caption/S matches all four values exactly (font-size + line-height + weight + tracking).
              md: Body/S semantic binding — 14px / 20px / 400 / 0px tracking. */}
          {description && (
            <span className={cn(
              size === 'md'
                ? [
                    'text-(length:--uds-typography-body-s-font-size)',
                    'leading-(--uds-typography-body-s-line-height)',
                    'font-(number:--uds-typography-body-s-font-weight)',
                    'tracking-(--uds-typography-body-s-letter-spacing)',
                  ].join(' ')
                : [
                    // sm description: Caption/S — 11px / 16px / 400 / 0px (exact Figma match)
                    'text-(length:--uds-typography-caption-s-font-size)',
                    'leading-(--uds-typography-caption-s-line-height)',
                    'font-(number:--uds-typography-caption-s-font-weight)',
                    'tracking-(--uds-typography-caption-s-letter-spacing)',
                  ].join(' '),
            )}>
              {description}
            </span>
          )}
        </span>
      </span>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export { Tooltip, tooltipBodyVariants };
