/**
 * Button — Universal DS
 *
 * Anatomy:
 *   [Icon left?] Label [Icon right?] [Focus ring overlay] [Spinner overlay]
 *
 * Variants: 5 intents × 3 sizes = 15 base classes.
 * States: default / hovered / pressed / focused / disabled / loading
 *   — hover + focus + pressed via CSS pseudo-classes + data attributes
 *   — disabled via aria-disabled pattern (soft-disabled — remains focusable per F-9)
 *   — loading via loading prop
 *
 * Tokens consumed:
 *   CSS vars: --uds-button-{intent}-{property}-{state}
 *   Pattern: bg-(--uds-button-primary-background-default) etc.
 *
 * Accessibility per button.md §Accessibility:
 *   - aria-disabled="true" (soft-disabled, stays in tab order)
 *   - aria-busy="true" while loading
 *   - :focus-visible only (no mouse-click ring)
 *   - Icons aria-hidden="true" (decorative)
 *   - Spinner aria-hidden="true" (label is accessible name)
 *
 * asChild pattern: Radix Slot for polymorphic rendering (CA-4).
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Spinner } from '../spinner/spinner';
import { cn } from '../utils/cn';

// --- CVA variant schema ---

const buttonVariants = cva(
  // Base classes — shared across all variants
  [
    // Layout
    'relative inline-flex items-center justify-center gap-(--_btn-gap)',
    // Typography
    'font-medium leading-(--_btn-lh) tracking-normal',
    // Shape
    'rounded-(--_btn-radius) border border-transparent',
    // Interaction
    'cursor-pointer select-none',
    // Transitions
    'transition-colors duration-100',
    // Focus ring: outline-based (canonical CSS equivalent of Figma overlay rect)
    // 2px gap + 2px stroke = outline-offset: 2px + outline: 2px solid
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-[2px]',
    'focus-visible:ring-(--uds-color-border-focused)',
    'focus-visible:ring-offset-(--uds-color-background-page)',
  ].join(' '),
  {
    variants: {
      intent: {
        primary: [
          'bg-(--uds-button-primary-background-default)',
          'text-(color:--uds-button-primary-text-default)',
          // Hover / pressed via pseudo-classes
          'hover:bg-(--uds-button-primary-background-hovered)',
          'active:bg-(--uds-button-primary-background-pressed)',
          // Disabled state (applied via data-disabled attribute from soft-disabled pattern)
          'data-[disabled]:bg-(--uds-button-primary-background-disabled)',
          'data-[disabled]:text-(color:--uds-button-primary-text-disabled)',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),

        secondary: [
          'bg-(--uds-button-secondary-background-default)',
          'text-(color:--uds-button-secondary-text-default)',
          'border-(color:--uds-button-secondary-border-default)',
          'hover:bg-(--uds-button-secondary-background-hovered)',
          'hover:border-(color:--uds-button-secondary-border-hovered)',
          'active:bg-(--uds-button-secondary-background-pressed)',
          'active:border-(color:--uds-button-secondary-border-pressed)',
          'data-[disabled]:bg-(--uds-button-secondary-background-disabled)',
          'data-[disabled]:text-(color:--uds-button-secondary-text-disabled)',
          'data-[disabled]:border-(color:--uds-button-secondary-border-disabled)',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),

        tertiary: [
          'bg-(--uds-button-tertiary-background-default)',
          'text-(color:--uds-button-tertiary-text-default)',
          'hover:bg-(--uds-button-tertiary-background-hovered)',
          'active:bg-(--uds-button-tertiary-background-pressed)',
          'data-[disabled]:bg-(--uds-button-tertiary-background-disabled)',
          'data-[disabled]:text-(color:--uds-button-tertiary-text-disabled)',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),

        danger: [
          'bg-(--uds-button-danger-background-default)',
          'text-(color:--uds-button-danger-text-default)',
          'hover:bg-(--uds-button-danger-background-hovered)',
          'active:bg-(--uds-button-danger-background-pressed)',
          'data-[disabled]:bg-(--uds-button-danger-background-disabled)',
          'data-[disabled]:text-(color:--uds-button-danger-text-disabled)',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),

        ghost: [
          'bg-(--uds-button-ghost-background-default)',
          'text-(color:--uds-button-ghost-text-default)',
          'hover:bg-(--uds-button-ghost-background-hovered)',
          'active:bg-(--uds-button-ghost-background-pressed)',
          'data-[disabled]:bg-transparent',
          'data-[disabled]:text-(color:--uds-button-ghost-text-disabled)',
          'data-[disabled]:cursor-not-allowed',
          'data-[disabled]:pointer-events-none',
        ].join(' '),
      },

      size: {
        sm: [
          // CSS custom properties scoped to this variant for DRY gap/radius/lh
          '[--_btn-gap:var(--uds-button-size-sm-gap)]',
          '[--_btn-radius:var(--uds-button-radius)]',
          '[--_btn-lh:var(--uds-button-size-sm-line-height)]',
          // Height + padding
          'h-(--uds-button-size-sm-height)',
          'px-(--uds-button-size-sm-padding-x)',
          // Typography
          'text-[length:var(--uds-button-size-sm-font-size)]',
          // Icon size (applied to SVG children)
          '[&_svg]:h-(--uds-button-size-sm-icon-size)',
          '[&_svg]:w-(--uds-button-size-sm-icon-size)',
          '[&_svg]:flex-shrink-0',
        ].join(' '),

        md: [
          '[--_btn-gap:var(--uds-button-size-md-gap)]',
          '[--_btn-radius:var(--uds-button-radius)]',
          '[--_btn-lh:var(--uds-button-size-md-line-height)]',
          'h-(--uds-button-size-md-height)',
          'px-(--uds-button-size-md-padding-x)',
          'text-[length:var(--uds-button-size-md-font-size)]',
          '[&_svg]:h-(--uds-button-size-md-icon-size)',
          '[&_svg]:w-(--uds-button-size-md-icon-size)',
          '[&_svg]:flex-shrink-0',
        ].join(' '),

        lg: [
          '[--_btn-gap:var(--uds-button-size-lg-gap)]',
          '[--_btn-radius:var(--uds-button-radius)]',
          '[--_btn-lh:var(--uds-button-size-lg-line-height)]',
          'h-(--uds-button-size-lg-height)',
          'px-(--uds-button-size-lg-padding-x)',
          'text-[length:var(--uds-button-size-lg-font-size)]',
          '[&_svg]:h-(--uds-button-size-lg-icon-size)',
          '[&_svg]:w-(--uds-button-size-lg-icon-size)',
          '[&_svg]:flex-shrink-0',
        ].join(' '),
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
);

// --- Spinner sub-component (loading state) ---

/**
 * Inline spinner — sized to match current button icon size.
 * Positioned absolute, centered over the button content.
 * aria-hidden: label text is preserved for screen readers (opacity 0 only visual).
 */
function ButtonSpinner({ className, size }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  // Map button size to spinner size (sm/md use sm spinner, lg uses md)
  const spinnerSize = size === 'lg' ? 'md' : 'sm';
  return (
    <span
      aria-hidden="true"
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        className
      )}
    >
      <Spinner size={spinnerSize} aria-hidden="true" />
    </span>
  );
}

// --- Props ---

export type ButtonIntent = 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<'button'>,
    VariantProps<typeof buttonVariants> {
  /**
   * Intent (visual style) of the button.
   * Maps to Figma component property Intent.
   */
  intent?: ButtonIntent;

  /**
   * Size of the button.
   * Maps to Figma component property Size.
   */
  size?: ButtonSize;

  /**
   * Icon rendered to the left of the label.
   * Must be aria-hidden (decorative — label is accessible name).
   * Maps to Figma Show Left Icon = true.
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon rendered to the right of the label.
   * Must be aria-hidden (decorative).
   * Maps to Figma Show Right Icon = true.
   */
  rightIcon?: React.ReactNode;

  /**
   * Loading state — shows spinner, hides label visually (preserved for a11y),
   * sets aria-busy="true", prevents interaction.
   * Maps to Figma State = loading.
   */
  loading?: boolean;

  /**
   * Soft-disabled pattern (F-9): button stays in tab order.
   * Uses aria-disabled="true" instead of native disabled attribute.
   * Click handler is suppressed internally.
   */
  disabled?: boolean;

  /**
   * Render the button as a child component (Radix Slot pattern, CA-4).
   * Useful for rendering as <a> or Link while keeping Button styles.
   * @example <Button asChild><a href="/dashboard">Go</a></Button>
   */
  asChild?: boolean;
}

// --- Component ---

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      intent = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      loading = false,
      disabled = false,
      asChild = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    // Soft-disabled: suppress click, keep in tab order
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

    const sharedProps = {
      'aria-disabled': disabled || undefined,
      'aria-busy': loading || undefined,
      'data-disabled': disabled ? ('' as const) : undefined,
      'data-loading': loading ? ('' as const) : undefined,
      className: cn(buttonVariants({ intent, size }), className),
      onClick: handleClick,
    } as const;

    // asChild — consumer renders their own element (e.g. <a>).
    // Slot requires a single child element, so we pass children directly.
    // Icon slots + loading state are not supported in asChild mode
    // (consumer owns the internal structure of their element).
    if (asChild) {
      return (
        <Slot ref={ref} {...sharedProps} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        type={props.type ?? 'button'}
        {...sharedProps}
        {...props}
      >
        {/* Left icon slot */}
        {leftIcon && (
          <span aria-hidden="true" className="flex-shrink-0">
            {leftIcon}
          </span>
        )}

        {/* Label — visually hidden during loading but preserved for a11y */}
        <span
          className={cn(
            'flex-1',
            // Only when there are NO icons, text is truly centered
            !leftIcon && !rightIcon && 'flex-none',
            loading && 'opacity-0'
          )}
        >
          {children}
        </span>

        {/* Right icon slot */}
        {rightIcon && (
          <span aria-hidden="true" className="flex-shrink-0">
            {rightIcon}
          </span>
        )}

        {/* Spinner overlay — centered, visible only during loading */}
        {loading && <ButtonSpinner size={size} />}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
