/**
 * Sidebar — Universal DS
 *
 * Persistent navigation container: 2 modes (collapsed=64px / expanded=240px)
 * Optional header (logo + app name) and footer (avatar + user info).
 * Items are composed via SidebarItem children.
 *
 * Accessibility (sidebar.md §Accessibility):
 *   - <nav> with aria-label="Main"
 *   - Collapse/expand: aria-live announcement by parent
 *   - Reduced motion: honor prefers-reduced-motion for width transition
 */

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA ---

const sidebarVariants = cva(
  [
    'flex flex-col h-screen',
    'bg-(--uds-color-background-surface)',
    'border-r border-(--uds-color-border-subtle)',
    'p-2',
    'overflow-hidden',
    'transition-[width] duration-200 ease-in-out motion-reduce:transition-none',
  ].join(' '),
  {
    variants: {
      mode: {
        collapsed: 'w-16 items-center',  // 64px
        expanded:  'w-60',               // 240px
      },
    },
    defaultVariants: {
      mode: 'expanded',
    },
  }
);

// --- Types ---

export type SidebarMode = 'collapsed' | 'expanded';

export interface SidebarUser {
  name: string;
  email?: string;
  avatar?: string;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  /** Collapsed or expanded */
  mode?: SidebarMode;
  /** App logo (Icon component at Size=24) */
  logo?: React.ReactNode;
  /** App name (expanded mode only) */
  appName?: string;
  /** Whether to show header */
  showHeader?: boolean;
  /** User info for footer */
  user?: SidebarUser;
  /** Whether to show footer */
  showFooter?: boolean;
  /** Navigation aria-label */
  'aria-label'?: string;
}

// --- Avatar placeholder ---

function SmallAvatar({ name, src }: { name: string; src?: string | undefined }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <span
      className="flex-shrink-0 h-8 w-8 rounded-full bg-(--uds-color-background-primary-subtle) flex items-center justify-center overflow-hidden"
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-semibold text-(--uds-color-background-primary-bold)">
          {initials}
        </span>
      )}
    </span>
  );
}

// --- Component ---

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  (
    {
      mode = 'expanded',
      logo,
      appName,
      showHeader = true,
      user,
      showFooter = true,
      className,
      children,
      'aria-label': ariaLabel = 'Main navigation',
      ...props
    },
    ref
  ) => {
    const isExpanded = mode === 'expanded';

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        className={cn(sidebarVariants({ mode }), className)}
        {...props}
      >
        {/* Header */}
        {showHeader && (
          <>
            <div
              className={cn(
                'flex items-center px-2 py-2 mb-1',
                isExpanded ? 'gap-2' : 'justify-center'
              )}
            >
              {logo && (
                <span aria-hidden="true" className="flex-shrink-0 text-(--uds-color-text-default)">
                  {logo}
                </span>
              )}
              {isExpanded && appName && (
                <span className="text-sm font-semibold text-(--uds-color-text-default) truncate">
                  {appName}
                </span>
              )}
            </div>
            <hr className="border-0 border-t border-(--uds-color-border-subtle) mb-1" />
          </>
        )}

        {/* Items slot */}
        <div className={cn('flex flex-col gap-1 flex-1 overflow-y-auto', !isExpanded && 'items-center w-full')}>
          {children}
        </div>

        {/* Footer */}
        {showFooter && user && (
          <>
            <hr className="border-0 border-t border-(--uds-color-border-subtle) mt-1 mb-1" />
            <div
              className={cn(
                'flex items-center px-2 py-2',
                isExpanded ? 'gap-2' : 'justify-center'
              )}
            >
              <SmallAvatar name={user.name} src={user.avatar ?? undefined} />
              {isExpanded && (
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-xs font-medium text-(--uds-color-text-default) truncate">
                    {user.name}
                  </span>
                  {user.email && (
                    <span className="text-xs text-(--uds-color-text-secondary,var(--uds-color-text-disabled)) truncate">
                      {user.email}
                    </span>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export { Sidebar, sidebarVariants };
