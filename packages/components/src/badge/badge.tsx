/**
 * Badge — Universal DS
 *
 * Anatomy: pill container with optional icon-left, label, icon-right, close-X
 * Variants: 2 sizes × 3 styles × 6 intents = 36 cells
 * Always pill-shaped (radius: full).
 *
 * Accessibility (badge.md §Accessibility):
 *   - Static badges: no role needed (content label)
 *   - Close X: <button> with aria-label="Remove [badge label]"
 *   - Color is not the only signal (icons + text carry meaning)
 */

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA schema ---

const badgeVariants = cva(
  // Base
  [
    'inline-flex items-center font-medium select-none',
    'rounded-(--uds-badge-radius)',
  ].join(' '),
  {
    variants: {
      // Phase 5.7: Label/Medium-tight (12/16/500) — uniform for both sm + md per Figma source
      size: {
        sm: [
          'h-(--uds-badge-sm-height) px-(--uds-badge-sm-padding-x) gap-(--uds-badge-sm-gap)',
          'text-(length:--uds-typography-label-medium-tight-font-size)',
          'leading-(--uds-typography-label-medium-tight-line-height)',
          'font-(number:--uds-typography-label-medium-tight-font-weight)',
          'tracking-(--uds-typography-label-medium-tight-letter-spacing)',
          '[font-family:var(--uds-typography-label-medium-tight-font-family)]',
        ].join(' '),
        md: [
          'h-(--uds-badge-md-height) px-(--uds-badge-md-padding-x) gap-(--uds-badge-md-gap)',
          'text-(length:--uds-typography-label-medium-tight-font-size)',
          'leading-(--uds-typography-label-medium-tight-line-height)',
          'font-(number:--uds-typography-label-medium-tight-font-weight)',
          'tracking-(--uds-typography-label-medium-tight-letter-spacing)',
          '[font-family:var(--uds-typography-label-medium-tight-font-family)]',
        ].join(' '),
      },

      style: {
        solid:    '',
        subtle:   '',
        outlined: 'border',
      },

      intent: {
        neutral: '',
        info:    '',
        success: '',
        warning: '',
        danger:  '',
        primary: '',
      },
    },
    compoundVariants: [
      // --- SOLID ---
      { style: 'solid', intent: 'neutral', className: 'bg-(--uds-badge-solid-neutral-bg) text-(color:--uds-badge-solid-neutral-text)' },
      { style: 'solid', intent: 'info',    className: 'bg-(--uds-badge-solid-info-bg) text-(color:--uds-badge-solid-info-text)' },
      { style: 'solid', intent: 'success', className: 'bg-(--uds-badge-solid-success-bg) text-(color:--uds-badge-solid-success-text)' },
      { style: 'solid', intent: 'warning', className: 'bg-(--uds-badge-solid-warning-bg) text-(color:--uds-badge-solid-warning-text)' },
      { style: 'solid', intent: 'danger',  className: 'bg-(--uds-badge-solid-danger-bg,var(--uds-color-background-danger-bold)) text-white' },
      { style: 'solid', intent: 'primary', className: 'bg-(--uds-color-background-primary-bold) text-white' },

      // --- SUBTLE ---
      { style: 'subtle', intent: 'neutral', className: 'bg-(--uds-badge-subtle-neutral-bg,var(--uds-color-background-neutral-subtle)) text-(--uds-color-text-default)' },
      { style: 'subtle', intent: 'info',    className: 'bg-(--uds-color-background-info-subtle) text-(--uds-color-background-info-bold)' },
      { style: 'subtle', intent: 'success', className: 'bg-(--uds-color-background-success-subtle) text-(--uds-color-background-success-bold)' },
      { style: 'subtle', intent: 'warning', className: 'bg-(--uds-color-background-warning-subtle) text-(--uds-color-background-warning-bold)' },
      { style: 'subtle', intent: 'danger',  className: 'bg-(--uds-color-background-danger-subtle) text-(--uds-color-background-danger-bold)' },
      { style: 'subtle', intent: 'primary', className: 'bg-(--uds-color-background-primary-subtle) text-(--uds-color-background-primary-bold)' },

      // --- OUTLINED ---
      { style: 'outlined', intent: 'neutral', className: 'border-(--uds-color-border-default) text-(--uds-color-text-default)' },
      { style: 'outlined', intent: 'info',    className: 'border-(--uds-color-background-info-bold) text-(--uds-color-background-info-bold)' },
      { style: 'outlined', intent: 'success', className: 'border-(--uds-color-background-success-bold) text-(--uds-color-background-success-bold)' },
      { style: 'outlined', intent: 'warning', className: 'border-(--uds-color-background-warning-bold) text-(--uds-color-background-warning-bold)' },
      { style: 'outlined', intent: 'danger',  className: 'border-(--uds-color-background-danger-bold) text-(--uds-color-background-danger-bold)' },
      { style: 'outlined', intent: 'primary', className: 'border-(--uds-color-border-focused) text-(--uds-color-background-primary-bold)' },
    ],
    defaultVariants: {
      size: 'md',
      style: 'subtle',
      intent: 'neutral',
    },
  }
);

// --- Types ---

export type BadgeSize = 'sm' | 'md';
export type BadgeStyle = 'solid' | 'subtle' | 'outlined';
export type BadgeIntent = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'primary';

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'>,
    Omit<VariantProps<typeof badgeVariants>, 'style'> {
  size?: BadgeSize;
  /** Visual style */
  badgeStyle?: BadgeStyle;
  intent?: BadgeIntent;
  /** Optional leading icon */
  iconLeft?: React.ReactNode;
  /** Optional trailing icon */
  iconRight?: React.ReactNode;
  /** Show close/dismiss X button */
  closable?: boolean;
  /** Called when close X is clicked */
  onClose?: () => void;
}


// --- Component ---

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      size = 'md',
      badgeStyle = 'subtle',
      intent = 'neutral',
      iconLeft,
      iconRight,
      closable = false,
      onClose,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const iconSizePx = size === 'sm' ? 12 : 14;

    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ size, style: badgeStyle, intent }), className)}
        {...props}
      >
        {iconLeft && (
          <span
            aria-hidden="true"
            className="flex-shrink-0"
            style={{ width: iconSizePx, height: iconSizePx }}
          >
            {iconLeft}
          </span>
        )}

        <span>{children}</span>

        {iconRight && (
          <span
            aria-hidden="true"
            className="flex-shrink-0"
            style={{ width: iconSizePx, height: iconSizePx }}
          >
            {iconRight}
          </span>
        )}

        {closable && (
          <button
            type="button"
            onClick={onClose}
            aria-label={
              typeof children === 'string'
                ? `Remove ${children}`
                : 'Remove'
            }
            className="flex-shrink-0 flex items-center justify-center -mr-0.5 cursor-pointer rounded-sm hover:opacity-70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={10} aria-hidden="true" strokeWidth={2} />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
