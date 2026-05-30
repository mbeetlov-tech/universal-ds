/**
 * Menu — Universal DS
 *
 * Compound component: Menu / Menu.Header / Menu.Item / Menu.Separator
 * 3 variants: sm / md / lg (size determines MenuItem size)
 *
 * Accessibility (menu.md §Accessibility):
 *   - role="menu" on container
 *   - aria-labelledby when header visible
 *   - Focus management: opening focuses first item (consumer responsibility)
 *   - Escape to close (consumer responsibility)
 */

import * as React from 'react';
import { cn } from '../utils/cn';
import { MenuItem, type MenuItemSize, type MenuItemStyle } from '../menu-item/menu-item';

// --- Types ---

export type MenuSize = 'sm' | 'md' | 'lg';

export interface MenuProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: MenuSize;
}

// Padding per size (per menu.md tokens)
const MENU_PADDING: Record<MenuSize, string> = {
  sm: 'p-1',
  md: 'p-1.5',
  lg: 'p-2',
};

// --- Menu.Header ---

interface MenuHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
}

function MenuHeader({ id, className, children, ...props }: MenuHeaderProps) {
  return (
    <div
      id={id}
      role="presentation"
      className={cn(
        'px-3 py-1.5 text-xs font-medium uppercase tracking-wide',
        'text-(--uds-color-text-secondary,var(--uds-color-text-disabled))',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
MenuHeader.displayName = 'Menu.Header';

// --- Menu.Item (re-exports MenuItem with Menu context) ---

interface MenuItemWrapperProps {
  size?: MenuSize;
  active?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  trailingType?: 'none' | 'shortcut' | 'checkmark' | 'chevron';
  shortcut?: string;
  style?: MenuItemStyle;
  children: React.ReactNode;
  onClick?: () => void;
  role?: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio';
}

function MenuItemWrapper({
  size = 'md',
  active = false,
  disabled = false,
  iconLeft,
  trailingType = 'none',
  shortcut,
  style: menuStyle = 'default',
  children,
  onClick,
  role,
}: MenuItemWrapperProps) {
  return (
    <MenuItem
      size={size as MenuItemSize}
      active={active}
      disabled={disabled}
      iconLeft={iconLeft}
      trailingType={trailingType}
      {...(shortcut !== undefined ? { shortcut } : {})}
      menuStyle={menuStyle}
      onClick={onClick}
      role={role ?? 'menuitem'}
    >
      {children}
    </MenuItem>
  );
}
MenuItemWrapper.displayName = 'Menu.Item';

// --- Menu.Separator ---

function MenuSeparator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn('my-1 border-0 border-t border-(--uds-color-border-subtle)', className)}
    />
  );
}
MenuSeparator.displayName = 'Menu.Separator';

// --- Menu root ---

type MenuComponent = React.ForwardRefExoticComponent<
  MenuProps & React.RefAttributes<HTMLDivElement>
> & {
  Header:    typeof MenuHeader;
  Item:      typeof MenuItemWrapper;
  Separator: typeof MenuSeparator;
};

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="menu"
        className={cn(
          'min-w-[240px] w-full',
          'bg-(--uds-color-background-surface)',
          'border border-(--uds-color-border-subtle)',
          'rounded-(--uds-radius-control-md)',
          'shadow-(--uds-shadow-overlay-tooltip)',
          MENU_PADDING[size],
          className
        )}
        {...props}
      >
        {/* Pass size to MenuItem children via context would be cleaner;
            for now, MenuItem children receive size directly in usage */}
        {children}
      </div>
    );
  }
) as MenuComponent;

Menu.displayName = 'Menu';
Menu.Header    = MenuHeader;
Menu.Item      = MenuItemWrapper;
Menu.Separator = MenuSeparator;

export { Menu };
