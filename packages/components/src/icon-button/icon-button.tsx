/**
 * IconButton — Universal DS
 *
 * Anatomy: Square button with centered icon. Optional loading state (Spinner overlay).
 * Focus ring: outline-offset: 2px pattern (2px transparent gap + 2px ring).
 *
 * Variants: 5 intents × 5 sizes = 25 base cells; plus states via CSS.
 * States: default / hovered / pressed / focused / disabled / loading
 *
 * Accessibility (icon-button.md §Accessibility):
 *   - aria-label is MANDATORY — enforced at TypeScript level
 *   - Soft-disabled pattern (F-9): aria-disabled="true" + stays in tab order
 *   - aria-busy="true" while loading
 *   - icon is decorative: aria-hidden="true"
 *   - :focus-visible only ring
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';
import { Spinner } from '../spinner/spinner';

// --- CVA schema ---

const iconButtonVariants = cva(
  [
    // Layout: square, centered icon
    'relative inline-flex items-center justify-center flex-shrink-0',
    // Shape
    'rounded-(--uds-radius-control-sm)',
    // Interaction
    'cursor-pointer select-none',
    // Transitions
    'transition-colors duration-100',
    // Focus ring (canonical DS: 2px gap + 2px stroke)
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-[2px]',
    'focus-visible:ring-(--uds-color-border-focused)',
    'focus-visible:ring-offset-(--uds-color-background-page)',
    // Border base
    'border',
  ].join(' '),
  {
    variants: {
      intent: {
        primary: [
          'bg-(--uds-color-background-primary-bold)',
          'text-(--uds-color-text-on-primary-bold,#fff)',
          'border-transparent',
          'hover:bg-(--uds-color-background-primary-bold-hovered)',
          'active:bg-(--uds-color-background-primary-bold-pressed)',
          'data-[disabled]:bg-(--uds-color-background-disabled)',
          'data-[disabled]:text-(--uds-color-text-disabled)',
          'data-[disabled]:border-transparent',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),

        secondary: [
          'bg-(--uds-color-background-surface)',
          'text-(--uds-color-text-default)',
          'border-(--uds-color-border-default)',
          'hover:bg-(--uds-color-background-subtle-hovered)',
          'hover:border-(--uds-color-border-strong,var(--uds-color-border-default))',
          'active:bg-(--uds-color-background-subtle-pressed)',
          'data-[disabled]:bg-(--uds-color-background-disabled)',
          'data-[disabled]:text-(--uds-color-text-disabled)',
          'data-[disabled]:border-(--uds-color-border-disabled,var(--uds-color-border-default))',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),

        ghost: [
          'bg-transparent',
          'text-(--uds-color-text-default)',
          'border-transparent',
          'hover:bg-(--uds-color-background-ghost-hovered)',
          'active:bg-(--uds-color-background-ghost-pressed)',
          'data-[disabled]:bg-transparent',
          'data-[disabled]:text-(--uds-color-text-disabled)',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),

        danger: [
          'bg-(--uds-color-background-danger-bold)',
          'text-(--uds-color-text-on-danger-bold,#fff)',
          'border-transparent',
          'hover:bg-(--uds-color-background-danger-bold-hovered)',
          'active:bg-(--uds-color-background-danger-bold-pressed)',
          'data-[disabled]:bg-(--uds-color-background-disabled)',
          'data-[disabled]:text-(--uds-color-text-disabled)',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),

        'danger-ghost': [
          'bg-transparent',
          'text-(--uds-color-text-danger,var(--uds-color-background-danger-bold))',
          'border-transparent',
          'hover:bg-(--uds-color-background-danger-subtle-hovered)',
          'active:bg-(--uds-color-background-danger-subtle-pressed)',
          'data-[disabled]:bg-transparent',
          'data-[disabled]:text-(--uds-color-text-disabled)',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),
      },

      size: {
        '2xs': 'h-5 w-5 [&_svg]:h-3 [&_svg]:w-3',       // 20×20, icon 12
        xs:    'h-6 w-6 [&_svg]:h-4 [&_svg]:w-4',         // 24×24, icon 16
        sm:    'h-8 w-8 [&_svg]:h-5 [&_svg]:w-5',         // 32×32, icon 20
        md:    'h-10 w-10 [&_svg]:h-6 [&_svg]:w-6',       // 40×40, icon 24
        lg:    'h-12 w-12 [&_svg]:h-6 [&_svg]:w-6',       // 48×48, icon 24
      },
    },
    defaultVariants: {
      intent: 'secondary',
      size: 'md',
    },
  }
);

// --- Types ---

export type IconButtonIntent = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-ghost';
export type IconButtonSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg';

export interface IconButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children'>,
    VariantProps<typeof iconButtonVariants> {
  /**
   * MANDATORY accessible name (verb-object pair: "Close dialog", "Send message").
   * The icon is decorative — this prop is the accessible name.
   */
  'aria-label': string;

  /**
   * The icon to display. Typically a Lucide or Hugeicons SVG element.
   * Will be rendered with aria-hidden="true".
   */
  children: React.ReactNode;

  /** Visual intent */
  intent?: IconButtonIntent;

  /** Size */
  size?: IconButtonSize;

  /** Loading state: shows spinner, sets aria-busy, prevents interaction */
  loading?: boolean;

  /** Soft-disabled (F-9): aria-disabled, stays in tab order */
  disabled?: boolean;
}

// Spinner size matching per DS spec: 2xs/xs → sm, sm → sm, md/lg → md
const SPINNER_SIZE_MAP: Record<IconButtonSize, 'sm' | 'md'> = {
  '2xs': 'sm',
  xs:    'sm',
  sm:    'sm',
  md:    'md',
  lg:    'md',
};

// --- Component ---

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      intent = 'secondary',
      size = 'md',
      loading = false,
      disabled = false,
      children,
      onClick,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      },
      [disabled, loading, onClick]
    );

    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
        data-disabled={disabled ? '' : undefined}
        data-loading={loading ? '' : undefined}
        className={cn(iconButtonVariants({ intent, size }), className)}
        onClick={handleClick}
        {...props}
      >
        {/* Icon — hidden during loading */}
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex items-center justify-center',
            loading && 'opacity-0'
          )}
        >
          {children}
        </span>

        {/* Spinner overlay during loading */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner
              size={SPINNER_SIZE_MAP[size as IconButtonSize]}
              aria-hidden="true"
            />
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton, iconButtonVariants };
