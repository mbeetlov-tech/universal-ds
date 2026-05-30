/**
 * Card — Universal DS
 *
 * Compound component pattern (CA-1, CA-8):
 *   Card / Card.Header / Card.Body / Card.Footer / Card.Divider
 *
 * Variants: 3 paddings × 3 styles = 9 cells
 * Styles: elevated (shadow) / outlined (border) / filled (subtle bg)
 *
 * Accessibility (card.md §Accessibility):
 *   - Card itself has no role (content, not affordance)
 *   - Title should be rendered at appropriate heading level by consumer
 *   - When whole card is clickable: wrap in <a> or <button>
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- CVA ---

const cardVariants = cva(
  [
    'flex flex-col',
    'gap-(--uds-card-gap)',
    'rounded-(--uds-card-radius)',
    'overflow-hidden',
    'w-full',
  ].join(' '),
  {
    variants: {
      padding: {
        sm: 'p-(--uds-card-sm-padding)',
        md: 'p-(--uds-card-md-padding)',
        lg: 'p-(--uds-card-lg-padding)',
      },
      cardStyle: {
        elevated: 'bg-(--uds-card-bg-elevated) shadow-(--uds-card-shadow-elevated)',
        outlined: 'bg-(--uds-card-bg-outlined) border border-(color:--uds-card-border-outlined)',
        filled:   'bg-(--uds-card-bg-filled)',
      },
    },
    defaultVariants: {
      padding: 'md',
      cardStyle: 'elevated',
    },
  }
);

// --- Types ---

export type CardPadding = 'sm' | 'md' | 'lg';
export type CardStyle = 'elevated' | 'outlined' | 'filled';

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>,
    VariantProps<typeof cardVariants> {
  padding?: CardPadding;
  /** Visual style — NOTE: prop name is `cardStyle` to avoid collision with HTML style attr */
  cardStyle?: CardStyle;
}

// --- Card.Header ---

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  /** Override the heading element (default: 'h3') */
  as?: 'h2' | 'h3' | 'h4';
}

function CardHeader({ title, subtitle, action, as: Heading = 'h3', className, children, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex items-start gap-(--uds-card-header-gap)', className)}
      {...props}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-(--uds-card-header-text-gap)">
        {title && (
          // Phase 5.7: Caption/Strong — token-bound
          <Heading className={[
            'text-(length:--uds-typography-caption-strong-font-size)',
            'font-(number:--uds-typography-caption-strong-font-weight)',
            'leading-(--uds-typography-caption-strong-line-height)',
            'tracking-(--uds-typography-caption-strong-letter-spacing)',
            '[font-family:var(--uds-typography-caption-strong-font-family)]',
            'text-(color:--uds-card-title)',
            'truncate',
          ].join(' ')}>
            {title}
          </Heading>
        )}
        {subtitle && (
          // Phase 5.7: Caption/Medium — token-bound
          <p className={[
            'text-(length:--uds-typography-caption-m-font-size)',
            'font-(number:--uds-typography-caption-m-font-weight)',
            'leading-(--uds-typography-caption-m-line-height)',
            'tracking-(--uds-typography-caption-m-letter-spacing)',
            '[font-family:var(--uds-typography-caption-m-font-family)]',
            'text-(color:--uds-card-subtitle)',
          ].join(' ')}>{subtitle}</p>
        )}
        {children}
      </div>
      {action && (
        <div className="flex-shrink-0">{action}</div>
      )}
    </div>
  );
}
CardHeader.displayName = 'Card.Header';

// --- Card.Body ---

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardBody({ className, children, ...props }: CardBodyProps) {
  return (
    <div
      className={cn('flex flex-col gap-(--uds-card-body-gap)', className)}
      {...props}
    >
      {children}
    </div>
  );
}
CardBody.displayName = 'Card.Body';

// --- Card.Footer ---

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div
      className={cn('flex items-center justify-end gap-(--uds-card-footer-gap)', className)}
      {...props}
    >
      {children}
    </div>
  );
}
CardFooter.displayName = 'Card.Footer';

// --- Card.Divider ---

function CardDivider({ className }: { className?: string }) {
  return (
    <hr
      className={cn(
        'border-0 border-t border-(color:--uds-card-divider)',
        className
      )}
    />
  );
}
CardDivider.displayName = 'Card.Divider';

// --- Card root (with compound parts) ---

type CardComponent = React.ForwardRefExoticComponent<
  CardProps & React.RefAttributes<HTMLDivElement>
> & {
  Header: typeof CardHeader;
  Body:   typeof CardBody;
  Footer: typeof CardFooter;
  Divider: typeof CardDivider;
};

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ padding = 'md', cardStyle = 'elevated', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ padding, cardStyle }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
) as CardComponent;

Card.displayName = 'Card';
Card.Header  = CardHeader;
Card.Body    = CardBody;
Card.Footer  = CardFooter;
Card.Divider = CardDivider;

export { Card, cardVariants };
