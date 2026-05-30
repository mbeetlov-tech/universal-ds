/**
 * Pagination — Universal DS
 *
 * Composition of Button instances for prev/next/page navigation.
 * 6 variants: 3 sizes × 2 styles (numbered / compact)
 *
 * Accessibility (pagination.md §Accessibility):
 *   - <nav aria-label="Pagination">
 *   - aria-current="page" on current page button
 *   - aria-label on prev/next
 *   - aria-disabled on disabled buttons
 *   - aria-live for page indicator (compact style)
 */

import * as React from 'react';
import { cn } from '../utils/cn';

// --- Types ---

export type PaginationSize = 'sm' | 'md' | 'lg';
export type PaginationStyle = 'numbered' | 'compact';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  size?: PaginationSize;
  paginationStyle?: PaginationStyle;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

// Gap per size
const GAP_CLASSES: Record<PaginationSize, string> = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-2',
};

// Page button height per size (matches Button heights)
const BTN_HEIGHT: Record<PaginationSize, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

const BTN_TEXT: Record<PaginationSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

// --- Page button ---

interface PageButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  current?: boolean;
  size: PaginationSize;
  ariaLabel?: string;
}

function PageButton({ label, onClick, disabled, current, size, ariaLabel }: PageButtonProps) {
  return (
    <button
      type="button"
      aria-current={current ? 'page' : undefined}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center',
        BTN_HEIGHT[size],
        BTN_TEXT[size],
        'min-w-(--_btn-w) px-2',
        '[--_btn-w:2rem]',
        'rounded-(--uds-radius-control-sm)',
        'border border-(--uds-color-border-default)',
        'transition-colors duration-100',
        'cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--uds-color-border-focused) focus-visible:ring-offset-1',
        // Ghost style (default)
        'bg-transparent text-(--uds-color-text-default)',
        'hover:bg-(--uds-color-background-subtle-hovered)',
        // Current page: primary
        current && 'bg-(--uds-color-background-primary-bold) text-white border-(--uds-color-background-primary-bold) hover:bg-(--uds-color-background-primary-bold-hovered)',
        // Disabled
        disabled && 'text-(--uds-color-text-disabled) border-(--uds-color-border-disabled) cursor-not-allowed hover:bg-transparent',
      )}
    >
      {label}
    </button>
  );
}

// Compute page numbers to show (with ellipsis)
function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [1];
  if (current > 3) pages.push('...');
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
}

// --- Component ---

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      size = 'md',
      paginationStyle = 'numbered',
      currentPage,
      totalPages,
      onPageChange,
      className,
      ...props
    },
    ref
  ) => {
    const isFirst = currentPage <= 1;
    const isLast  = currentPage >= totalPages;
    const pages   = getPageNumbers(currentPage, totalPages);

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn('flex items-center', GAP_CLASSES[size], className)}
        {...props}
      >
        {/* Prev */}
        <PageButton
          label="← Prev"
          ariaLabel="Previous page"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
          size={size}
        />

        {paginationStyle === 'numbered' ? (
          // Numbered: page buttons + ellipsis
          <div className={cn('flex items-center', GAP_CLASSES[size])}>
            {pages.map((p, i) =>
              p === '...' ? (
                <span
                  key={`ellipsis-${i}`}
                  className={cn(
                    BTN_TEXT[size],
                    'px-1 text-(--uds-color-text-secondary,var(--uds-color-text-disabled)) select-none'
                  )}
                  aria-hidden="true"
                >
                  …
                </span>
              ) : (
                <PageButton
                  key={p}
                  label={String(p)}
                  current={p === currentPage}
                  onClick={() => onPageChange(p as number)}
                  size={size}
                />
              )
            )}
          </div>
        ) : (
          // Compact: "Page X of N" indicator
          <span
            aria-live="polite"
            className={cn(
              BTN_TEXT[size],
              'px-2 text-(--uds-color-text-default) select-none'
            )}
          >
            Page {currentPage} of {totalPages}
          </span>
        )}

        {/* Next */}
        <PageButton
          label="Next →"
          ariaLabel="Next page"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
          size={size}
        />
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';

export { Pagination };
