/**
 * MenuItem — Universal DS
 *
 * Foundation row: icon-left + label + trailing (shortcut / checkmark / chevron)
 * 30 variants: 3 sizes × 5 states × 2 styles
 *
 * Accessibility (menu-item.md §Accessibility):
 *   - role="menuitem" (or menuitemcheckbox/menuitemradio for selectable)
 *   - aria-disabled when disabled state
 *   - Arrow key navigation handled by parent Menu
 *   - :focus-visible ring
 */

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon, ChevronRightIcon } from '@hugeicons/core-free-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA ---

const menuItemVariants = cva(
  [
    'flex items-center w-full',
    'cursor-pointer select-none',
    'rounded-(--uds-radius-control-sm)',
    'transition-colors duration-100',
    // Focus ring
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-(--uds-color-border-focused)',
    // Disabled
    'aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none',
    'aria-disabled:text-(--uds-color-text-disabled)',
  ].join(' '),
  {
    variants: {
      menuStyle: {
        default:     [
          'text-(--uds-color-text-default)',
          'hover:bg-(--uds-color-background-subtle-hovered)',
          'data-[active=true]:bg-(--uds-color-background-primary-subtle)',
          'data-[active=true]:text-(--uds-color-text-default)',
        ].join(' '),
        destructive: [
          'text-(--uds-color-background-danger-bold)',
          'hover:bg-(--uds-color-background-danger-subtle)',
          'data-[active=true]:bg-(--uds-color-background-danger-subtle)',
        ].join(' '),
      },

      // Phase 5.7: text-sm / text-base removed — label typography is token-bound in JSX
      size: {
        sm: 'h-8  px-2 gap-2 [&_svg]:h-4 [&_svg]:w-4',   // 32px
        md: 'h-10 px-3 gap-2 [&_svg]:h-5 [&_svg]:w-5',   // 40px
        lg: 'h-12 px-4 gap-2 [&_svg]:h-5 [&_svg]:w-5',  // 48px
      },
    },
    defaultVariants: {
      menuStyle: 'default',
      size: 'md',
    },
  }
);

// --- Types ---

export type MenuItemStyle = 'default' | 'destructive';
export type MenuItemSize = 'sm' | 'md' | 'lg';
export type TrailingType = 'none' | 'shortcut' | 'checkmark' | 'chevron';

export interface MenuItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'>,
    VariantProps<typeof menuItemVariants> {
  /** Leading icon */
  iconLeft?: React.ReactNode;
  /** Whether this item is the current/selected option */
  active?: boolean;
  /** Trailing element type */
  trailingType?: TrailingType;
  /** Shortcut text (e.g. "⌘B") */
  shortcut?: string | undefined;
  /** Controlled disabled state */
  disabled?: boolean;
  /** Visual style */
  menuStyle?: MenuItemStyle;
  /** Size */
  size?: MenuItemSize;
  /** role override */
  role?: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
}


// --- Component ---

const MenuItem = React.forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    {
      iconLeft,
      active = false,
      trailingType = 'none',
      shortcut,
      disabled = false,
      menuStyle = 'default',
      size = 'md',
      role = 'menuitem',
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        role={role}
        aria-disabled={disabled || undefined}
        aria-checked={role !== 'menuitem' ? active : undefined}
        aria-current={role === 'menuitem' && active ? 'true' : undefined}
        data-active={active}
        tabIndex={disabled ? -1 : 0}
        className={cn(menuItemVariants({ menuStyle, size }), className)}
        {...props}
      >
        {/* Icon left */}
        {iconLeft && (
          <span aria-hidden="true" className="flex-shrink-0 text-(--uds-color-icon-default)">
            {iconLeft}
          </span>
        )}

        {/* Label — Phase 5.7: Caption/Medium (uniform all sizes) */}
        <span className={[
          'flex-1 text-left min-w-0 truncate',
          'text-(length:--uds-typography-caption-m-font-size)',
          'font-(number:--uds-typography-caption-m-font-weight)',
          'leading-(--uds-typography-caption-m-line-height)',
          'tracking-(--uds-typography-caption-m-letter-spacing)',
          '[font-family:var(--uds-typography-caption-m-font-family)]',
        ].join(' ')}>{children}</span>

        {/* Trailing */}
        {trailingType === 'shortcut' && shortcut && (
          // Phase 5.7: Kbd/S for sm, Kbd/M for md/lg
          <span
            className={cn(
              'flex-shrink-0 text-(--uds-color-text-secondary,var(--uds-color-text-disabled))',
              size === 'sm' ? [
                'text-(length:--uds-typography-kbd-s-font-size)',
                'font-(number:--uds-typography-kbd-s-font-weight)',
                'leading-(--uds-typography-kbd-s-line-height)',
                '[font-family:var(--uds-typography-kbd-s-font-family)]',
              ].join(' ') : [
                'text-(length:--uds-typography-kbd-m-font-size)',
                'font-(number:--uds-typography-kbd-m-font-weight)',
                'leading-(--uds-typography-kbd-m-line-height)',
                '[font-family:var(--uds-typography-kbd-m-font-family)]',
              ].join(' ')
            )}
            aria-hidden="true"
          >
            {shortcut}
          </span>
        )}
        {trailingType === 'checkmark' && (
          <HugeiconsIcon
            icon={Tick01Icon}
            size={16}
            className="flex-shrink-0 text-(--uds-color-text-default)"
            aria-hidden="true"
            strokeWidth={2}
          />
        )}
        {trailingType === 'chevron' && (
          <HugeiconsIcon
            icon={ChevronRightIcon}
            size={16}
            className="flex-shrink-0 text-(--uds-color-icon-default)"
            aria-hidden="true"
            strokeWidth={2}
          />
        )}
      </button>
    );
  }
);

MenuItem.displayName = 'MenuItem';

export { MenuItem, menuItemVariants };
