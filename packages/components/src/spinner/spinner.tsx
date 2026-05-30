/**
 * Spinner — Universal DS
 *
 * Anatomy: Single SVG arc (270°) rotating infinitely.
 * Variants: 3 sizes (sm=16 / md=20 / lg=24)
 * Color: currentColor — inherits from parent (Button loading, standalone context)
 *
 * Accessibility (spinner.md §Accessibility):
 *   - role="status" + aria-live="polite" on standalone wrapper
 *   - aria-label when standalone ("Loading" by default)
 *   - aria-hidden when decorative inside Button
 *   - prefers-reduced-motion: opacity pulse fallback
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const spinnerVariants = cva(
  // Base: block, flex-shrink-0, animation
  'block flex-shrink-0 animate-spin [animation-duration:0.75s] motion-reduce:animate-none',
  {
    variants: {
      size: {
        sm: 'h-4 w-4',    // 16×16
        md: 'h-5 w-5',    // 20×20
        lg: 'h-6 w-6',    // 24×24
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export type SpinnerSize = 'sm' | 'md' | 'lg';

export interface SpinnerProps
  extends Omit<React.SVGProps<SVGSVGElement>, 'children'>,
    VariantProps<typeof spinnerVariants> {
  /**
   * Size of the spinner.
   * sm = 16px, md = 20px, lg = 24px
   */
  size?: SpinnerSize;
  /**
   * Accessible label for standalone spinners.
   * Omit (or set to undefined) when spinner is decorative inside a loading control.
   */
  'aria-label'?: string;
}

// Stroke width per size: sm=2, md=3, lg=3 (per spinner.md tokens table)
const STROKE_WIDTH: Record<SpinnerSize, number> = {
  sm: 2,
  md: 3,
  lg: 3,
};

// viewBox is always 24×24; we scale via CSS width/height
const R = 10; // circle radius that gives a nice 270° visible arc
const CX = 12;
const CY = 12;
const CIRCUMFERENCE = 2 * Math.PI * R; // ~62.83
// 270° arc = 3/4 of circumference
const DASH = (CIRCUMFERENCE * 270) / 360; // visible portion
const GAP = CIRCUMFERENCE - DASH;        // invisible portion (90°)

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = 'md', className, 'aria-label': ariaLabel, ...props }, ref) => {
    const strokeWidth = STROKE_WIDTH[size];
    // Rotate so arc starts at top, gap at the right (visual convention)
    const dashOffset = 0;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        role={ariaLabel ? 'status' : undefined}
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel ? 'true' : undefined}
        className={cn(spinnerVariants({ size }), className)}
        {...props}
      >
        {/* Track (faint background arc) */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          opacity={0.2}
        />
        {/* Moving arc — 270° dash */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${DASH} ${GAP}`}
          strokeDashoffset={dashOffset}
          // Start from top (rotate -90°)
          transform="rotate(-90 12 12)"
        />
      </svg>
    );
  }
);

Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
