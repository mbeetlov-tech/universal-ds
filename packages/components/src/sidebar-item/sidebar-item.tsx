/**
 * SidebarItem — Universal DS
 *
 * Navigation row: icon + label (expanded) or icon-only (collapsed).
 * 20 variants: 5 states × 2 styles × 2 modes
 *
 * Accessibility:
 *   - Renders as <a> (navigation) or <button> (action)
 *   - aria-current="page" for active route
 *   - aria-label for collapsed mode (icon-only)
 *   - Badge count in aria-label
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA ---

const sidebarItemVariants = cva(
  [
    'relative flex items-center',
    'h-10',             // 40px height
    'rounded-(--uds-radius-control-sm)',
    'cursor-pointer select-none',
    'transition-colors duration-100',
    // No border by default (outline-none prevents browser default outline on <a>/<button>)
    'outline-none border-0',
    // Focus ring — keyboard only
    'focus-visible:ring-2 focus-visible:ring-offset-[2px]',
    'focus-visible:ring-(--uds-color-border-focused)',
    'focus-visible:ring-offset-(--uds-color-background-page)',
    // Disabled
    'aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none',
    'aria-disabled:text-(--uds-color-text-disabled)',
  ].join(' '),
  {
    variants: {
      sidebarStyle: {
        line: [
          'text-(--uds-color-text-secondary)',
          'hover:bg-(--uds-color-background-subtle-hovered) hover:text-(--uds-color-text-default)',
          // Active via aria-current
          'aria-[current=page]:bg-(--uds-color-background-subtle) aria-[current=page]:text-(--uds-color-text-default) aria-[current=page]:font-medium',
          // Active indicator (left bar)
          'aria-[current=page]:before:absolute aria-[current=page]:before:left-0 aria-[current=page]:before:top-1/2 aria-[current=page]:before:-translate-y-1/2',
          'aria-[current=page]:before:w-[3px] aria-[current=page]:before:h-5',
          'aria-[current=page]:before:rounded-sm',
          'aria-[current=page]:before:bg-(--uds-color-border-focused)',
          'aria-[current=page]:before:content-[""]',
        ].join(' '),

        pill: [
          'text-(--uds-color-text-secondary)',
          'hover:bg-(--uds-color-background-subtle-hovered) hover:text-(--uds-color-text-default)',
          'aria-[current=page]:bg-(--uds-color-background-primary-subtle) aria-[current=page]:text-(--uds-color-text-default) aria-[current=page]:font-medium',
        ].join(' '),
      },

      mode: {
        collapsed: 'w-10 justify-center px-0',
        expanded:  'w-full px-3 gap-2',
      },
    },
    defaultVariants: {
      sidebarStyle: 'line',
      mode: 'expanded',
    },
  }
);

// --- Types ---

export type SidebarItemStyle = 'line' | 'pill';
export type SidebarItemMode = 'collapsed' | 'expanded';

export interface SidebarItemProps
  extends Omit<React.ComponentPropsWithoutRef<'a'>, 'style'>,
    VariantProps<typeof sidebarItemVariants> {
  /** Icon element (Icon main wrapper at Size=20) */
  icon: React.ReactNode;
  /** Whether this item is the current active route */
  active?: boolean;
  /** Badge count (shown as pill in expanded, dot in collapsed) */
  badge?: number | string;
  /** Sidebar style — match parent Sidebar */
  sidebarStyle?: SidebarItemStyle;
  /** Mode — collapsed (icon-only) or expanded (icon + label) */
  mode?: SidebarItemMode;
  /** If true, render as a <button> instead of <a> */
  asButton?: boolean;
  /** Accessible label for collapsed mode (icon-only) */
  'aria-label'?: string;
  disabled?: boolean;
}

// --- Component ---

const SidebarItem = React.forwardRef<HTMLAnchorElement, SidebarItemProps>(
  (
    {
      icon,
      active = false,
      badge,
      sidebarStyle = 'line',
      mode = 'expanded',
      asButton = false,
      disabled = false,
      className,
      children,
      href,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const sharedClassName = cn(sidebarItemVariants({ sidebarStyle, mode }), className);
    const sharedAria = {
      'aria-current': (active ? 'page' : undefined) as 'page' | undefined,
      'aria-disabled': disabled || undefined,
      'aria-label':
        mode === 'collapsed'
          ? (ariaLabel ?? (typeof children === 'string' ? children : undefined))
          : ariaLabel,
    };

    if (asButton) {
      return (
        <button
          type="button"
          {...sharedAria}
          className={sharedClassName}
          {...(props as React.ComponentPropsWithoutRef<'button'>)}
        >
          {/* Icon */}
          <span aria-hidden="true" className="flex-shrink-0 text-(--uds-color-icon-default)">
            {icon}
          </span>
          {mode === 'expanded' && <span className="flex-1 min-w-0 text-sm truncate">{children}</span>}
          {mode === 'expanded' && badge !== undefined && badge !== 0 && (
            <span className="ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-medium bg-(--uds-color-background-primary-bold) text-white" aria-hidden="true">{badge}</span>
          )}
          {mode === 'collapsed' && badge !== undefined && badge !== 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-(--uds-color-background-primary-bold)" aria-hidden="true" />
          )}
        </button>
      );
    }

    return (
      <a
        ref={ref}
        href={href}
        {...sharedAria}
        className={sharedClassName}
        {...(props as React.ComponentPropsWithoutRef<'a'>)}
      >
        {/* Icon */}
        <span aria-hidden="true" className="flex-shrink-0 text-(--uds-color-icon-default)">
          {icon}
        </span>

        {/* Label (expanded only) */}
        {mode === 'expanded' && (
          <span className="flex-1 min-w-0 text-sm truncate">{children}</span>
        )}

        {/* Badge (expanded) */}
        {mode === 'expanded' && badge !== undefined && badge !== 0 && (
          <span
            className="ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-medium bg-(--uds-color-background-primary-bold) text-white"
            aria-hidden="true"
          >
            {badge}
          </span>
        )}

        {/* Badge dot (collapsed) */}
        {mode === 'collapsed' && badge !== undefined && badge !== 0 && (
          <span
            className="absolute top-1 right-1 h-2 w-2 rounded-full bg-(--uds-color-background-primary-bold)"
            aria-hidden="true"
          />
        )}
      </a>
    );
  }
);

SidebarItem.displayName = 'SidebarItem';

export { SidebarItem, sidebarItemVariants };
