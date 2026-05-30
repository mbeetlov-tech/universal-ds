/**
 * Tabs — Universal DS
 *
 * Compound component: Tabs / Tabs.List / Tabs.Trigger / Tabs.Content
 * Uses native HTML + WAI-ARIA tablist/tab/tabpanel pattern.
 *
 * Variants: 2 orientations × 3 styles × 3 sizes = 18 Figma cells
 *
 * Accessibility (tabs.md §Accessibility):
 *   - role="tablist" on Tabs.List
 *   - role="tab" + aria-selected on each Tabs.Trigger
 *   - role="tabpanel" + aria-labelledby on Tabs.Content
 *   - Arrow keys for navigation within tablist
 *   - Only active tab in tab order (inactive: tabIndex=-1)
 *   - :focus-visible ring
 */

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- Context ---

interface TabsContextValue {
  activeValue: string;
  setActiveValue: (v: string) => void;
  orientation: 'horizontal' | 'vertical';
  tabsStyle: 'line' | 'pill' | 'segmented';
  size: 'sm' | 'md' | 'lg';
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs subcomponents must be used inside <Tabs>');
  return ctx;
}

// --- CVA: tab trigger ---

const tabTriggerVariants = cva(
  [
    'inline-flex items-center justify-center gap-(--_tab-gap)',
    'font-medium cursor-pointer select-none',
    'border-0 bg-transparent',
    'transition-colors duration-100',
    // Focus ring
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
    'focus-visible:ring-(--uds-color-border-focused)',
    'focus-visible:ring-offset-(--uds-color-background-page)',
    // Disabled
    'aria-disabled:cursor-not-allowed aria-disabled:text-(--uds-color-text-disabled)',
    'aria-disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      tabsStyle: {
        line: [
          'text-(--uds-color-text-secondary)',
          'hover:text-(--uds-color-text-default)',
          // Active: blue underline (handled via data-active)
          'data-[active=true]:text-(--uds-color-text-default) data-[active=true]:font-semibold',
          'relative data-[active=true]:after:absolute data-[active=true]:after:bottom-0 data-[active=true]:after:left-0',
          'data-[active=true]:after:right-0 data-[active=true]:after:h-0.5',
          'data-[active=true]:after:bg-(--uds-color-border-focused)',
        ].join(' '),

        pill: [
          'rounded-(--uds-radius-control-sm)',
          'text-(--uds-color-text-secondary)',
          'hover:text-(--uds-color-text-default) hover:bg-(--uds-color-background-subtle-hovered)',
          'data-[active=true]:bg-(--uds-color-background-primary-subtle)',
          'data-[active=true]:text-(--uds-color-text-default) data-[active=true]:font-semibold',
        ].join(' '),

        segmented: [
          'rounded-(--uds-radius-control-sm)',
          'text-(--uds-color-text-secondary)',
          'hover:bg-(--uds-color-background-subtle-hovered)',
          'hover:text-(--uds-color-text-default)',
          // Active: raised surface
          'data-[active=true]:bg-(--uds-color-background-surface)',
          'data-[active=true]:text-(--uds-color-text-default) data-[active=true]:font-semibold',
          'data-[active=true]:shadow-sm',
        ].join(' '),
      },

      size: {
        sm: [
          '[--_tab-gap:var(--uds-spacing-inline-xs)]',
          'h-8 px-3 text-sm',
          '[&_svg]:h-4 [&_svg]:w-4',
        ].join(' '),
        md: [
          '[--_tab-gap:var(--uds-spacing-inline-sm)]',
          'h-10 px-4 text-sm',
          '[&_svg]:h-5 [&_svg]:w-5',
        ].join(' '),
        lg: [
          '[--_tab-gap:var(--uds-spacing-inline-sm)]',
          'h-12 px-5 text-base',
          '[&_svg]:h-5 [&_svg]:w-5',
        ].join(' '),
      },
    },
    defaultVariants: {
      tabsStyle: 'line',
      size: 'md',
    },
  }
);

// --- Types ---

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsStyle = 'line' | 'pill' | 'segmented';
export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Default selected value (uncontrolled) */
  defaultValue?: string;
  /** Controlled selected value */
  value?: string;
  /** Change handler */
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  /** Visual style */
  tabsStyle?: TabsStyle;
  size?: TabsSize;
}

// --- Tabs root ---

type TabsComponent = React.ForwardRefExoticComponent<
  TabsProps & React.RefAttributes<HTMLDivElement>
> & {
  List:    typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
};

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue,
      value: controlledValue,
      onValueChange,
      orientation = 'horizontal',
      tabsStyle = 'line',
      size = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? '');
    const activeValue = controlledValue ?? internalValue;

    const setActiveValue = React.useCallback(
      (v: string) => {
        if (controlledValue === undefined) setInternalValue(v);
        onValueChange?.(v);
      },
      [controlledValue, onValueChange]
    );

    return (
      <TabsContext.Provider value={{ activeValue, setActiveValue, orientation, tabsStyle, size }}>
        <div
          ref={ref}
          data-orientation={orientation}
          className={cn(
            orientation === 'vertical' && 'flex gap-4',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
) as TabsComponent;

Tabs.displayName = 'Tabs';

// --- Tabs.List ---

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

function TabsList({ className, children, ...props }: TabsListProps) {
  const { orientation, tabsStyle } = useTabsContext();

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        tabsStyle === 'segmented' && [
          'bg-(--uds-color-background-subtle)',
          'rounded-(--uds-radius-control-md)',
          'p-1',
        ],
        tabsStyle === 'line' && orientation === 'horizontal' && 'border-b border-(--uds-color-border-subtle)',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
TabsList.displayName = 'Tabs.List';

// --- Tabs.Trigger ---

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The value this tab represents */
  value: string;
  /** Optional icon */
  icon?: React.ReactNode;
  disabled?: boolean;
}

function TabsTrigger({
  value,
  icon,
  disabled = false,
  className,
  children,
  onClick,
  ...props
}: TabsTriggerProps) {
  const { activeValue, setActiveValue, tabsStyle, size } = useTabsContext();
  const isActive = activeValue === value;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) setActiveValue(value);
    }
  };

  return (
    <button
      type="button"
      role="tab"
      id={`tab-${value}`}
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      aria-disabled={disabled || undefined}
      tabIndex={isActive ? 0 : -1}
      data-active={isActive}
      onClick={(e) => {
        if (!disabled) {
          setActiveValue(value);
          onClick?.(e);
        }
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        tabTriggerVariants({ tabsStyle, size }),
        className
      )}
      {...props}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}
TabsTrigger.displayName = 'Tabs.Trigger';

// --- Tabs.Content ---

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { activeValue } = useTabsContext();
  const isActive = activeValue === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      tabIndex={0}
      className={cn('focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  );
}
TabsContent.displayName = 'Tabs.Content';

Tabs.List    = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { Tabs, tabTriggerVariants };
