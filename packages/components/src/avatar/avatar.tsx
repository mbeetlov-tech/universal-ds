/**
 * Avatar — Universal DS
 *
 * Anatomy:
 *   body (circle/square, clipped) + optional status dot (absolute, bottom-right)
 *
 * Variants: 5 sizes × 3 types = 15 cells
 * Types: image / initials / icon
 *
 * Accessibility (avatar.md §Accessibility):
 *   - <img> with alt for image type
 *   - aria-label for initials/icon types
 *   - Status included in aria-label when visible
 */

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon as UserSvgIcon } from '@hugeicons/core-free-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA ---

const avatarBodyVariants = cva(
  [
    'relative flex-shrink-0 inline-flex items-center justify-center overflow-hidden',
    'border border-(color:--uds-avatar-border)',
  ].join(' '),
  {
    variants: {
      size: {
        xs: 'h-5 w-5',   // 20
        sm: 'h-6 w-6',   // 24
        md: 'h-8 w-8',   // 32
        lg: 'h-10 w-10', // 40
        xl: 'h-14 w-14', // 56
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-(--uds-avatar-radius-square)',
      },
      type: {
        image:    'bg-(--uds-avatar-bg-image)',
        initials: 'bg-(--uds-avatar-bg-initials)',
        icon:     'bg-(--uds-avatar-bg-icon)',
      },
    },
    defaultVariants: {
      size: 'md',
      shape: 'circle',
      type: 'initials',
    },
  }
);

// Status dot colors
const STATUS_COLORS = {
  online:  'bg-(--uds-avatar-status-online)',
  offline: 'bg-(--uds-avatar-status-offline)',
  busy:    'bg-(--uds-avatar-status-busy)',
  away:    'bg-(--uds-avatar-status-away)',
} as const;

// Status dot sizes per avatar size (px): xs/sm=6, md=8, lg=10, xl=14
const STATUS_DOT_SIZE = {
  xs: 6, sm: 6, md: 8, lg: 10, xl: 14,
} as const;

// Icon sizes per avatar size
const ICON_SIZE = {
  xs: 12, sm: 14, md: 18, lg: 22, xl: 30,
} as const;

// --- Types ---

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarType = 'image' | 'initials' | 'icon';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

// Phase 5.7: Initials typography — per-size token bindings (Avatar-Initials/{size} semantic roles)
const INITIALS_CLASSES: Record<AvatarSize, string> = {
  xs: [
    'text-(length:--uds-typography-avatar-initials-xs-font-size)',
    'font-(number:--uds-typography-avatar-initials-xs-font-weight)',
    'leading-(--uds-typography-avatar-initials-xs-line-height)',
    'tracking-(--uds-typography-avatar-initials-xs-letter-spacing)',
    '[font-family:var(--uds-typography-avatar-initials-xs-font-family)]',
  ].join(' '),
  sm: [
    'text-(length:--uds-typography-avatar-initials-sm-font-size)',
    'font-(number:--uds-typography-avatar-initials-sm-font-weight)',
    'leading-(--uds-typography-avatar-initials-sm-line-height)',
    'tracking-(--uds-typography-avatar-initials-sm-letter-spacing)',
    '[font-family:var(--uds-typography-avatar-initials-sm-font-family)]',
  ].join(' '),
  md: [
    'text-(length:--uds-typography-avatar-initials-md-font-size)',
    'font-(number:--uds-typography-avatar-initials-md-font-weight)',
    'leading-(--uds-typography-avatar-initials-md-line-height)',
    'tracking-(--uds-typography-avatar-initials-md-letter-spacing)',
    '[font-family:var(--uds-typography-avatar-initials-md-font-family)]',
  ].join(' '),
  lg: [
    'text-(length:--uds-typography-avatar-initials-lg-font-size)',
    'font-(number:--uds-typography-avatar-initials-lg-font-weight)',
    'leading-(--uds-typography-avatar-initials-lg-line-height)',
    'tracking-(--uds-typography-avatar-initials-lg-letter-spacing)',
    '[font-family:var(--uds-typography-avatar-initials-lg-font-family)]',
  ].join(' '),
  xl: [
    'text-(length:--uds-typography-avatar-initials-xl-font-size)',
    'font-(number:--uds-typography-avatar-initials-xl-font-weight)',
    'leading-(--uds-typography-avatar-initials-xl-line-height)',
    'tracking-(--uds-typography-avatar-initials-xl-letter-spacing)',
    '[font-family:var(--uds-typography-avatar-initials-xl-font-family)]',
  ].join(' '),
};

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'type'>,
    VariantProps<typeof avatarBodyVariants> {
  /** Avatar size */
  size?: AvatarSize;
  /** Rendering type: image / initials / icon */
  type?: AvatarType;
  /** Image source URL (type="image") */
  src?: string;
  /** Alt text for image, or accessible label for initials/icon types */
  alt: string;
  /** Name to derive initials from (type="initials") */
  name?: string;
  /** Explicit initials override (max 2 chars) */
  initials?: string;
  /** Custom icon for type="icon" */
  icon?: React.ReactNode;
  /** Online status indicator */
  status?: AvatarStatus;
  /** Shape (circle default) */
  shape?: 'circle' | 'square';
  className?: string;
}

// Derive initials from a name string
function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0]![0]?.toUpperCase() ?? '?';
  return ((parts[0]![0] ?? '') + (parts[parts.length - 1]![0] ?? '')).toUpperCase();
}

// Default user silhouette icon using Hugeicons User
const UserSilhouette = ({ size }: { size: number }) => (
  <HugeiconsIcon
    icon={UserSvgIcon}
    size={size}
    aria-hidden="true"
    strokeWidth={1.5}
  />
);

// --- Component ---

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      size = 'md',
      type = 'initials',
      src,
      alt,
      name,
      initials: initProp,
      icon,
      status,
      shape = 'circle',
      className,
      ...props
    },
    ref
  ) => {
    const dotSize = STATUS_DOT_SIZE[size];
    const initialsClasses = INITIALS_CLASSES[size];
    const iconSize = ICON_SIZE[size];
    const initText = initProp ?? (name ? deriveInitials(name) : 'JD');

    // Effective type: if src provided, always image
    const effectiveType: AvatarType = src ? 'image' : type;

    return (
      <span
        ref={ref}
        className={cn(
          'relative inline-flex',
          className
        )}
        aria-label={alt}
        {...props}
      >
        {/* Body */}
        <span
          className={cn(avatarBodyVariants({ size, shape, type: effectiveType }))}
        >
          {effectiveType === 'image' && src ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
            />
          ) : effectiveType === 'initials' ? (
            // Phase 5.7: Avatar-Initials/{size} semantic role — token-bound, no inline style
            <span
              className={cn(initialsClasses, 'text-(color:--uds-avatar-text) select-none')}
              aria-hidden="true"
            >
              {initText}
            </span>
          ) : (
            // icon / image-placeholder
            <span className="text-(color:--uds-avatar-icon)" aria-hidden="true">
              {icon ?? <UserSilhouette size={iconSize} />}
            </span>
          )}
        </span>

        {/* Status dot */}
        {status && (
          <span
            aria-hidden="true"
            className={cn(
              'absolute bottom-0 right-0',
              'rounded-full',
              'ring-[2px] ring-(--uds-avatar-status-border)',
              STATUS_COLORS[status]
            )}
            style={{ width: dotSize, height: dotSize }}
          />
        )}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar, avatarBodyVariants };
