/**
 * Switch — Universal DS
 *
 * Anatomy (horizontal, top-aligned):
 *   Track wrap (fixed pill) with absolute-positioned thumb + Label stack
 *
 * Variants: 2 sizes × 4 states × 2 on/off = 16 Figma cells
 * States driven by CSS :checked, :focus-visible, :disabled
 *
 * Uses native <input type="checkbox" role="switch"> per WAI-ARIA 1.2.
 * Thumb position animated via CSS transition on transform.
 *
 * Accessibility (switch.md §Accessibility):
 *   - role="switch" + aria-checked
 *   - soft-disabled supported
 *   - :focus-visible ring on track
 *   - prefers-reduced-motion: instant snap
 *   - label required
 */

import * as React from 'react';
import { cn } from '../utils/cn';

export type SwitchSize = 'sm' | 'md';

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type' | 'size' | 'onChange'> {
  /** Visible label text */
  label?: string;

  /** Helper text below the label */
  helper?: string;

  /** Controlled checked state */
  checked?: boolean;

  /** Default state (uncontrolled) */
  defaultChecked?: boolean;

  /** Change handler — receives new boolean state */
  onChange?: (checked: boolean) => void;

  /** Size */
  size?: SwitchSize;

  /** Soft-disabled (F-9) */
  softDisabled?: boolean;

  /** Standard native disabled */
  disabled?: boolean;

  className?: string;
}

// Track dimensions: sm=28×16, md=36×20
const TRACK_CLASSES: Record<SwitchSize, { track: string; thumb: string; thumbOn: string }> = {
  sm: {
    track: 'w-7 h-4',          // 28×16px
    thumb: 'h-3 w-3',          // 12×12px
    thumbOn: 'translate-x-4',  // 28 - 12 - 2*2 = 12px = 3rem offset (approx translate-x-4 = 16px → use 3)
  },
  md: {
    track: 'w-9 h-5',          // 36×20px
    thumb: 'h-4 w-4',          // 16×16px
    thumbOn: 'translate-x-4',  // 36 - 16 - 2*2 = 16px = 4rem (translate-x-4)
  },
};

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      helper,
      checked,
      defaultChecked,
      onChange,
      size = 'md',
      softDisabled = false,
      disabled = false,
      className,
      id: propId,
      ...props
    },
    forwardedRef
  ) => {
    const generatedId = React.useId();
    const switchId = propId ?? `uds-switch-${generatedId}`;
    const helperId = `${switchId}-helper`;

    const isDisabled = disabled || softDisabled;
    const { track, thumb, thumbOn } = TRACK_CLASSES[size];

    // Internal state for uncontrolled mode
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
    const isChecked = checked !== undefined ? checked : internalChecked;

    return (
      <div className={cn('flex items-start gap-2', className)}>
        {/* Track container */}
        <span className={cn('relative flex-shrink-0 mt-0.5', track)}>
          {/* Native checkbox (hidden, provides a11y) */}
          <input
            ref={forwardedRef}
            id={switchId}
            type="checkbox"
            role="switch"
            checked={isChecked}
            disabled={!softDisabled && disabled}
            aria-disabled={softDisabled ? true : undefined}
            aria-checked={isChecked}
            aria-describedby={helper ? helperId : undefined}
            onChange={(e) => {
              if (isDisabled) return;
              const next = e.target.checked;
              if (checked === undefined) setInternalChecked(next);
              onChange?.(next);
            }}
            className="absolute inset-0 opacity-0 cursor-pointer peer"
            {...props}
          />

          {/* Visual track */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-0 rounded-full transition-colors duration-150',
              // Default (off): neutral subtle
              'bg-(--uds-color-background-neutral-subtle)',
              'hover:bg-(--uds-color-background-neutral-subtle-hovered)',
              // Focus ring via peer
              'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-[2px]',
              'peer-focus-visible:ring-(--uds-color-border-focused)',
              'peer-focus-visible:ring-offset-(--uds-color-background-page)',
              // Disabled
              isDisabled && 'bg-(--uds-color-background-disabled)',
            )}
          />

          {/* Track when checked (on) */}
          {isChecked && !isDisabled && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-(--uds-color-background-primary-bold) transition-colors duration-150"
            />
          )}

          {/* Thumb */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-0.5 left-0.5',
              thumb,
              'rounded-full bg-white shadow-sm',
              'transition-transform duration-150 motion-reduce:transition-none',
              isChecked ? thumbOn : 'translate-x-0',
              isDisabled && 'bg-(--uds-color-background-disabled)'
            )}
          />
        </span>

        {/* Label + helper */}
        {(label || helper) && (
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            {label && (
              <label
                htmlFor={switchId}
                className={cn(
                  'leading-5 select-none cursor-pointer',
                  size === 'md' ? 'text-base' : 'text-sm',
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

Switch.displayName = 'Switch';

export { Switch };
