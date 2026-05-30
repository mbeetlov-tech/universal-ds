/**
 * Select — Universal DS
 *
 * Uses native <select> for full a11y, then custom-styled trigger visually.
 * For production, consider @radix-ui/react-select (once installed).
 *
 * Anatomy: label + trigger (value/placeholder + chevron) + helper
 * 15 variants: 3 sizes × 5 states
 *
 * Accessibility (select.md §Accessibility):
 *   - <label> associated via htmlFor
 *   - aria-invalid in error state
 *   - aria-describedby → helper
 *   - aria-required
 *   - :focus-visible ring on trigger
 */

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronDownIcon } from '@hugeicons/core-free-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA: trigger ---

const selectTriggerVariants = cva(
  [
    'relative flex items-center w-full',
    'border rounded-(--uds-radius-control-sm)',
    'cursor-pointer bg-(--uds-color-background-surface)',
    'transition-colors duration-100',
    // Focus ring
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-(--uds-color-border-focused) focus-within:ring-offset-0',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-8  px-3 gap-2 text-sm  [--_icon-size:16px]',
        md: 'h-10 px-3 gap-2 text-sm  [--_icon-size:20px]',
        lg: 'h-12 px-4 gap-2 text-base [--_icon-size:20px]',
      },
      state: {
        default:  'border-(color:--uds-input-border-default)',
        hovered:  'border-(color:--uds-input-border-hovered)',
        focused:  'border-(color:--uds-input-border-focused)',
        error:    'border-(color:--uds-input-border-error)',
        disabled: 'border-(color:--uds-input-border-disabled) bg-(--uds-color-background-disabled) cursor-not-allowed',
      },
    },
    defaultVariants: {
      size: 'md',
      state: 'default',
    },
  }
);

// --- Types ---

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectState = 'default' | 'hovered' | 'focused' | 'error' | 'disabled';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.ComponentPropsWithoutRef<'select'>, 'size'>,
    VariantProps<typeof selectTriggerVariants> {
  /** Visible label */
  label?: string;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Helper text */
  helper?: string;
  /** Options array */
  options?: SelectOption[];
  /** Select size */
  size?: SelectSize;
  /** Visual state */
  state?: SelectState;
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  required?: boolean;
}

// Chevron indicator for select trigger
const SelectChevron = () => (
  <HugeiconsIcon
    icon={ChevronDownIcon}
    aria-hidden="true"
    className="flex-shrink-0 text-(--uds-color-icon-default,currentColor)"
    style={{ width: 'var(--_icon-size, 20px)', height: 'var(--_icon-size, 20px)' }}
    strokeWidth={1.5}
  />
);

// --- Component ---

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      placeholder,
      helper,
      options = [],
      size = 'md',
      state = 'default',
      disabled = false,
      required = false,
      className,
      id: propId,
      value,
      defaultValue,
      onChange,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = propId ?? `uds-select-${generatedId}`;
    const helperId = `${selectId}-helper`;

    const effectiveState: SelectState = disabled ? 'disabled' : state;
    const isInvalid = effectiveState === 'error';

    const describedBy = [ariaDescribedBy, helper ? helperId : undefined]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', className)}>
        {/* Label — Phase 5.7: per-size token binding (mirrors Input) */}
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
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
              disabled && 'text-(--uds-color-text-disabled)'
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-(--uds-color-background-danger-bold)" aria-hidden="true">*</span>}
          </label>
        )}

        {/* Trigger wrapper */}
        <div className={cn(selectTriggerVariants({ size, state: effectiveState }))}>
          {/* Native select (overlay — provides real a11y) */}
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            className={cn(
              'absolute inset-0 opacity-0 w-full h-full cursor-pointer',
              disabled && 'cursor-not-allowed'
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(opt => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Visual trigger */}
          <span
            className={cn(
              'flex-1 min-w-0 text-sm truncate pointer-events-none select-none',
              // Show placeholder color when no value
              !value && !defaultValue
                ? 'text-(color:--uds-input-text-placeholder)'
                : 'text-(color:--uds-input-text-default)',
              disabled && 'text-(--uds-color-text-disabled)'
            )}
          >
            {value
              ? (options.find(o => o.value === value)?.label ?? placeholder ?? 'Select…')
              : placeholder ?? 'Select…'}
          </span>

          <SelectChevron />
        </div>

        {/* Helper — Phase 5.7: Caption/Medium (all sizes) */}
        {helper && (
          <p
            id={helperId}
            className={cn(
              'text-(length:--uds-typography-caption-m-font-size)',
              'font-(number:--uds-typography-caption-m-font-weight)',
              'leading-(--uds-typography-caption-m-line-height)',
              'tracking-(--uds-typography-caption-m-letter-spacing)',
              '[font-family:var(--uds-typography-caption-m-font-family)]',
              'text-(color:--uds-input-helper-text-default)',
              isInvalid && 'text-(color:--uds-input-helper-text-error)'
            )}
          >
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select, selectTriggerVariants };
