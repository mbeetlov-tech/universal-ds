/**
 * Input — Universal DS
 *
 * Anatomy (vertical stack):
 *   [Header row: label icon-left | label text | label icon-right | spacer | header action]
 *   Field row: [value/placeholder text | action-spacer] + [action button (absolute)]
 *   [Helper text]
 *
 * Variants: 3 sizes × 7 states = 21 cells
 * Phase 0.8.0: `filled` state removed. Content state via `value` prop (standard React).
 *
 * Accessibility (input.md §Accessibility):
 *   - Label required (visible or aria-label)
 *   - aria-invalid="true" in error state
 *   - aria-describedby → helper element
 *   - aria-disabled + tabIndex={0} for soft-disabled
 *   - readonly native attribute for read-only state
 *   - :focus-visible ring via box-shadow
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA: field container ---

const inputFieldVariants = cva(
  [
    'relative flex items-center w-full',
    'border rounded-(--uds-radius-control-sm)',
    'transition-colors duration-100',
    // Focus ring via box-shadow (canonical outside ring)
    'focus-within:ring-2 focus-within:ring-(--uds-color-border-focused) focus-within:ring-offset-0',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-(--uds-input-height-sm) px-(--uds-spacing-inset-sm)',
        md: 'h-(--uds-input-height-md) px-(--uds-spacing-inset-md)',
        lg: 'h-(--uds-input-height-lg) px-(--uds-spacing-inset-lg)',
      },
      state: {
        default:    'bg-(--uds-input-background-default) border-(color:--uds-input-border-default)',
        hovered:    'bg-(--uds-input-background-default) border-(color:--uds-input-border-hovered)',
        focused:    'bg-(--uds-input-background-default) border-(color:--uds-input-border-focused)',
        disabled:   'bg-(--uds-input-background-disabled) border-(color:--uds-input-border-disabled) cursor-not-allowed',
        'read-only':'bg-(--uds-input-background-disabled) border-(color:--uds-input-border-default) cursor-text',
        error:      'bg-(--uds-input-background-default) border-(color:--uds-input-border-error)',
        success:    'bg-(--uds-input-background-default) border-(--uds-color-border-success,var(--uds-color-background-success-bold))',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

// --- Types ---

export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'hovered' | 'focused' | 'disabled' | 'read-only' | 'error' | 'success';

export interface InputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size'>,
    VariantProps<typeof inputFieldVariants> {
  /** Field label (visible). Required for accessibility. */
  label?: string;

  /** Optional icon to the left of the label text */
  labelIconLeft?: React.ReactNode;

  /** Optional icon to the right of the label text (e.g. info/tooltip affordance) */
  labelIconRight?: React.ReactNode;

  /** Optional action icon at the far right of the header row */
  headerAction?: React.ReactNode;

  /** Helper text below the field (error message, format hint) */
  helper?: string;

  /**
   * Inline action button inside the field (right-aligned, absolute-positioned).
   * Use IconButton sized to match field: sm→2xs, md→sm, lg→md.
   */
  actionButton?: React.ReactNode;

  /**
   * Trailing icon slot — a non-interactive icon rendered on the right edge of the field.
   * Use for status indicators (checkmark, warning), input type icons (search, lock), etc.
   * If the icon needs to be interactive, use actionButton instead.
   */
  trailingIcon?: React.ReactNode;

  /** Input size */
  size?: InputSize;

  /**
   * Visual/semantic state for design system purposes.
   * Note: actual focus state is derived from CSS :focus-within.
   */
  state?: InputState;

  /** Native readOnly — renders read-only visual state */
  readOnly?: boolean;

  /** Soft-disabled (F-9): aria-disabled, stays in tab order */
  disabled?: boolean;
}

// Helper text colors per state
const HELPER_COLOR: Partial<Record<InputState, string>> = {
  error:   'text-(color:--uds-input-helper-text-error)',
  success: 'text-(--uds-color-text-success,var(--uds-color-background-success-bold))',
};

// --- Component ---

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelIconLeft,
      labelIconRight,
      headerAction,
      helper,
      actionButton,
      trailingIcon,
      size = 'md',
      state = 'default',
      readOnly,
      disabled = false,
      className,
      id: propId,
      'aria-describedby': ariaDescribedBy,
      onChange,
      ...props
    },
    ref
  ) => {
    // Generate stable IDs for label/helper association
    const generatedId = React.useId();
    const inputId = propId ?? `uds-input-${generatedId}`;
    const helperId = `${inputId}-helper`;

    const effectiveState: InputState = disabled
      ? 'disabled'
      : readOnly
      ? 'read-only'
      : state;

    // Native input attributes
    const inputIsDisabled = effectiveState === 'disabled';
    const inputIsReadOnly = effectiveState === 'read-only' || readOnly;
    const inputIsInvalid  = effectiveState === 'error';

    // Helper aria-describedby
    const describedBy = [ariaDescribedBy, helper ? helperId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (inputIsDisabled) return;
        onChange?.(e);
      },
      [inputIsDisabled, onChange]
    );

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {/* Header row */}
        {(label || labelIconLeft || labelIconRight || headerAction) && (
          <div className="flex items-center gap-1">
            {labelIconLeft && (
              <span aria-hidden="true" className="text-(--uds-color-icon-default) flex-shrink-0">
                {labelIconLeft}
              </span>
            )}
            {label && (
              // Phase 5.7: label typography — per-size bindings
              <label
                htmlFor={inputId}
                className={cn(
                  // sm → Label/Medium-tight; md → Label/L; lg → Heading/Inline
                  size === 'sm' && [
                    'text-(length:--uds-typography-label-medium-tight-font-size)',
                    'font-(number:--uds-typography-label-medium-tight-font-weight)',
                    'leading-(--uds-typography-label-medium-tight-line-height)',
                    'tracking-(--uds-typography-label-medium-tight-letter-spacing)',
                    '[font-family:var(--uds-typography-label-medium-tight-font-family)]',
                  ].join(' '),
                  size === 'lg' && [
                    'text-(length:--uds-typography-heading-inline-font-size)',
                    'font-(number:--uds-typography-heading-inline-font-weight)',
                    'leading-(--uds-typography-heading-inline-line-height)',
                    'tracking-(--uds-typography-heading-inline-letter-spacing)',
                    '[font-family:var(--uds-typography-heading-inline-font-family)]',
                  ].join(' '),
                  (!size || size === 'md') && [
                    'text-(length:--uds-typography-label-l-font-size)',
                    'font-(number:--uds-typography-label-l-font-weight)',
                    'leading-(--uds-typography-label-l-line-height)',
                    'tracking-(--uds-typography-label-l-letter-spacing)',
                    '[font-family:var(--uds-typography-label-l-font-family)]',
                  ].join(' '),
                  'text-(color:--uds-input-label-text)',
                  inputIsDisabled && 'text-(--uds-color-text-disabled)'
                )}
              >
                {label}
              </label>
            )}
            {labelIconRight && (
              <span aria-hidden="true" className="text-(--uds-color-icon-default) flex-shrink-0">
                {labelIconRight}
              </span>
            )}
            {headerAction && (
              <span className="ml-auto flex-shrink-0">{headerAction}</span>
            )}
          </div>
        )}

        {/* Field row */}
        <div className={cn(inputFieldVariants({ size, state: effectiveState }))}>
          <input
            ref={ref}
            id={inputId}
            // Phase 5.7: value slot — Body/Small (sm/md) or Body/Medium (lg)
            className={cn(
              'flex-1 bg-transparent border-none outline-none min-w-0',
              'text-(color:--uds-input-text-default) placeholder:text-(color:--uds-input-text-placeholder)',
              size === 'lg' ? [
                'text-(length:--uds-typography-body-m-font-size)',
                'font-(number:--uds-typography-body-m-font-weight)',
                'leading-(--uds-typography-body-m-line-height)',
                '[font-family:var(--uds-typography-body-m-font-family)]',
              ].join(' ') : [
                'text-(length:--uds-typography-body-s-font-size)',
                'font-(number:--uds-typography-body-s-font-weight)',
                'leading-(--uds-typography-body-s-line-height)',
                '[font-family:var(--uds-typography-body-s-font-family)]',
              ].join(' '),
              inputIsDisabled && 'text-(color:--uds-input-text-disabled) placeholder:text-(color:--uds-input-text-disabled)',
            )}
            aria-disabled={inputIsDisabled || undefined}
            aria-invalid={inputIsInvalid || undefined}
            aria-describedby={describedBy}
            readOnly={inputIsReadOnly}
            tabIndex={inputIsDisabled ? 0 : undefined}
            onChange={handleChange}
            {...props}
          />

          {/* Trailing icon — non-interactive, inline flow on the right edge */}
          {trailingIcon && !actionButton && (
            <span
              aria-hidden="true"
              className="flex-shrink-0 text-(--uds-color-icon-default) ml-1.5"
            >
              {trailingIcon}
            </span>
          )}

          {/* Action button (absolute-positioned — see input.md anatomy) */}
          {actionButton && (
            <span className="absolute right-0 inset-y-0 flex items-center pr-1">
              {actionButton}
            </span>
          )}
        </div>

        {/* Helper text */}
        {helper && (
          // Phase 5.7: helper text — Caption/Medium (all sizes)
          <p
            id={helperId}
            className={cn(
              'text-(length:--uds-typography-caption-m-font-size)',
              'font-(number:--uds-typography-caption-m-font-weight)',
              'leading-(--uds-typography-caption-m-line-height)',
              'tracking-(--uds-typography-caption-m-letter-spacing)',
              '[font-family:var(--uds-typography-caption-m-font-family)]',
              'text-(color:--uds-input-helper-text-default)',
              HELPER_COLOR[effectiveState]
            )}
          >
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputFieldVariants };
