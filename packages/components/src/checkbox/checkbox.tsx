/**
 * Checkbox — Universal DS
 *
 * Anatomy (horizontal, top-aligned):
 *   Box (visual square) + Label stack (label + optional helper)
 *
 * Uses native <input type="checkbox"> for full a11y support.
 * Indeterminate state set via ref.
 *
 * Variants: 3 sizes × 4 states × 3 checked = 36 Figma cells
 * States driven by CSS :checked, :indeterminate, :focus-visible, :disabled
 *
 * Accessibility (checkbox.md §Accessibility):
 *   - Wrapped label for full-row click area
 *   - aria-describedby → helper
 *   - indeterminate via ref DOM property
 *   - soft-disabled: aria-disabled + stays in tab order (for toolbar contexts)
 *   - For forms, standard disabled is fine (not soft-disabled by default here)
 */

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, MinusSignIcon } from '@hugeicons/core-free-icons';
import { cn } from '../utils/cn';

// --- Types ---

export type CheckboxSize = 'sm' | 'md' | 'lg';

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type' | 'size' | 'onChange'> {
  /** Visible label text */
  label?: string;

  /** Helper text below the label */
  helper?: string;

  /** Indeterminate state — set programmatically after mount */
  indeterminate?: boolean;

  /** Change handler — receives the new boolean checked state */
  onChange?: (checked: boolean) => void;

  /** Size */
  size?: CheckboxSize;

  /** Soft-disabled (F-9): aria-disabled, stays in tab order */
  softDisabled?: boolean;

  /** Standard native disabled */
  disabled?: boolean;

  /** className for outer container */
  className?: string;
}

// Box sizes: sm=16, md=20, lg=24
const BOX_SIZE: Record<CheckboxSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

// Icon size per checkbox size
const ICON_SIZE: Record<CheckboxSize, number> = {
  sm: 10,
  md: 12,
  lg: 14,
};

// --- Component ---

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      helper,
      indeterminate = false,
      onChange,
      size = 'md',
      softDisabled = false,
      disabled = false,
      className,
      id: propId,
      checked,
      defaultChecked,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = React.useId();
    const checkboxId = propId ?? `uds-checkbox-${generatedId}`;
    const helperId = `${checkboxId}-helper`;

    // Internal ref for indeterminate DOM property
    const internalRef = React.useRef<HTMLInputElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLInputElement>;

    // Set indeterminate DOM property (not an HTML attribute)
    React.useEffect(() => {
      if (ref.current) {
        ref.current.indeterminate = indeterminate;
      }
    }, [indeterminate, ref]);

    const isDisabled = disabled || softDisabled;

    return (
      <div className={cn('flex items-start gap-2', className)}>
        {/* Visual box wrapping the native checkbox */}
        <span
          className={cn(
            'relative flex-shrink-0 mt-0.5',
            BOX_SIZE[size]
          )}
        >
          {/* Hidden native checkbox (provides a11y behavior) */}
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={!softDisabled && disabled}
            aria-disabled={softDisabled ? true : undefined}
            aria-describedby={helper ? helperId : undefined}
            onChange={(e) => {
              if (isDisabled) return;
              onChange?.(e.target.checked);
            }}
            className={cn(
              // Position over visual box
              'absolute inset-0 opacity-0 cursor-pointer',
              isDisabled && 'cursor-not-allowed',
              // peer for styling the visual box via CSS sibling selectors
              'peer'
            )}
            {...props}
          />

          {/* Visual box — styles driven by peer states */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'border rounded-(--uds-radius-control-sm)',
              'transition-colors duration-100',
              // Default unchecked
              'border-(--uds-color-border-default)',
              'bg-(--uds-color-background-surface)',
              // Hover (unchecked)
              'peer-hover:border-(--uds-color-border-strong,var(--uds-color-border-default))',
              'peer-hover:bg-(--uds-color-background-subtle-hovered)',
              // Checked: primary bold fill
              'peer-checked:bg-(--uds-color-background-primary-bold)',
              'peer-checked:border-transparent',
              'peer-checked:hover:bg-(--uds-color-background-primary-bold-hovered)',
              // Focus visible ring (on the hidden input, via peer)
              'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-[2px]',
              'peer-focus-visible:ring-(--uds-color-border-focused)',
              'peer-focus-visible:ring-offset-(--uds-color-background-page)',
              // Disabled
              (disabled || softDisabled) && [
                'bg-(--uds-color-background-disabled)',
                'border-(--uds-color-border-disabled,var(--uds-color-border-default))',
              ]
            )}
          >
            {/* Check/dash icon */}
            {(checked !== false || defaultChecked !== false || indeterminate) && (
              indeterminate
                ? <HugeiconsIcon
                    icon={MinusSignIcon}
                    size={ICON_SIZE[size]}
                    aria-hidden="true"
                    className="text-white"
                    strokeWidth={2.5}
                  />
                : <HugeiconsIcon
                    icon={Tick01Icon}
                    size={ICON_SIZE[size]}
                    aria-hidden="true"
                    className="text-white"
                    strokeWidth={2.5}
                  />
            )}
          </span>
        </span>

        {/* Label + helper */}
        {(label || helper) && (
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'leading-5 select-none cursor-pointer',
                  size === 'lg' ? 'text-base' : 'text-sm',
                  'text-(--uds-color-text-default)',
                  isDisabled && 'text-(--uds-color-text-disabled) cursor-not-allowed'
                )}
              >
                {label}
              </label>
            )}
            {helper && (
              <p
                id={helperId}
                className={cn(
                  'text-xs leading-4',
                  'text-(--uds-color-text-secondary,var(--uds-color-text-default))',
                  isDisabled && 'text-(--uds-color-text-disabled)'
                )}
              >
                {helper}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
