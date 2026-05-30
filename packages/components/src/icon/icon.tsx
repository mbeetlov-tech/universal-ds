/**
 * Icon — Universal DS
 *
 * Thin wrapper around Hugeicons glyphs (both code and Figma use Hugeicons as of Phase 5.8).
 * Standardizes sizing tokens (12/16/20/24) and color binding via currentColor.
 *
 * Anatomy:
 *   import { HugeiconsIcon } from '@hugeicons/react';
 *   import { Search01Icon } from '@hugeicons/core-free-icons';
 *
 *   <Icon size={20}><HugeiconsIcon icon={Search01Icon} size={20} /></Icon>
 *   — or direct (preferred for simple standalone usage, tree-shakeable) —
 *   <HugeiconsIcon icon={Search01Icon} size={20} aria-hidden="true" strokeWidth={1.5} />
 *
 * Color: `currentColor` via CSS color inheritance. Set color on a parent element.
 * Accessibility: Icons are decorative by default — aria-hidden="true".
 *   For meaningful icons (no accompanying text), parent sets aria-label.
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// Size tokens: 12/16/20/24 (per icon.md)
const iconVariants = cva('inline-flex flex-shrink-0', {
  variants: {
    size: {
      12: 'h-3 w-3',     // 12×12
      16: 'h-4 w-4',     // 16×16
      20: 'h-5 w-5',     // 20×20
      24: 'h-6 w-6',     // 24×24
    },
  },
  defaultVariants: {
    size: 16,
  },
});

export type IconSize = 12 | 16 | 20 | 24;

export interface IconProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof iconVariants> {
  /**
   * The icon element — a HugeiconsIcon component.
   * @example
   *   import { HugeiconsIcon } from '@hugeicons/react';
   *   import { Search01Icon } from '@hugeicons/core-free-icons';
   *   <Icon size={20}><HugeiconsIcon icon={Search01Icon} size={20} /></Icon>
   */
  children: React.ReactNode;

  /**
   * Size of the icon wrapper (and the glyph inside).
   * 12 / 16 / 20 / 24 — matches DS size scale.
   */
  size?: IconSize;
}

/**
 * Icon wrapper component.
 * Sets width/height and color context via currentColor.
 *
 * @example
 *   import { HugeiconsIcon } from '@hugeicons/react';
 *   import { Search01Icon } from '@hugeicons/core-free-icons';
 *
 *   // Via wrapper
 *   <Icon size={20}><HugeiconsIcon icon={Search01Icon} size={20} /></Icon>
 *
 *   // Direct (tree-shakeable, recommended for simple standalone usage)
 *   <HugeiconsIcon icon={Search01Icon} size={20} aria-hidden="true" strokeWidth={1.5} />
 */
const Icon = React.forwardRef<HTMLSpanElement, IconProps>(
  ({ size = 16, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        aria-hidden="true"
        className={cn(iconVariants({ size }), className)}
        {...props}
      >
        {/* Ensure child SVG fills the wrapper */}
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<React.SVGProps<SVGSVGElement>>, {
              width: size,
              height: size,
              'aria-hidden': 'true',
            })
          : children}
      </span>
    );
  }
);

Icon.displayName = 'Icon';

export { Icon, iconVariants };
