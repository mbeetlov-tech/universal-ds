/**
 * Table — Universal DS
 *
 * Compound component: Table / Table.Header / Table.Row / Table.Cell / Table.HeaderCell
 * Sub-components TableRow (15 variants) and TableHeader (3 variants).
 *
 * Anatomy: <table> with <thead>/<tbody>; consumer composes cells.
 *
 * Accessibility (table.md §Accessibility):
 *   - <table> with <caption> (visually hidden when not needed)
 *   - <th scope="col"> for header cells
 *   - aria-sort on sortable headers
 *   - aria-selected on selected rows
 *   - row state: default/hovered/selected/focused/disabled
 */

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ChevronUpIcon, ChevronDownIcon, ChevronsDownUpIcon } from '@hugeicons/core-free-icons';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

// --- Types ---

export type TableSize = 'sm' | 'md' | 'lg';
export type TableRowState = 'default' | 'hovered' | 'selected' | 'focused' | 'disabled';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  size?: TableSize;
  caption?: string;
}

// --- CVA: TableRow ---

const tableRowVariants = cva(
  [
    'border-b border-(--uds-color-border-subtle) transition-colors duration-100',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
    'focus-visible:ring-(--uds-color-border-focused)',
  ].join(' '),
  {
    variants: {
      state: {
        default:  'bg-(--uds-color-background-surface)',
        hovered:  'bg-(--uds-color-background-subtle-hovered)',
        selected: 'bg-(--uds-color-background-primary-subtle)',
        focused:  'bg-(--uds-color-background-surface)',
        disabled: 'bg-(--uds-color-background-disabled) text-(--uds-color-text-disabled)',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

// Row height + cell padding per size
const ROW_CLASSES: Record<TableSize, { row: string; cell: string }> = {
  sm: { row: 'h-8',  cell: 'px-2 py-1' },
  md: { row: 'h-10', cell: 'px-3 py-2' },
  lg: { row: 'h-12', cell: 'px-4 py-3' },
};

// --- Table context ---

const TableContext = React.createContext<{ size: TableSize }>({ size: 'md' });

// --- Table root ---

type TableComponent = React.ForwardRefExoticComponent<
  TableProps & React.RefAttributes<HTMLTableElement>
> & {
  Header:     typeof TableHeaderComponent;
  Row:        typeof TableRowComponent;
  Cell:       typeof TableCell;
  HeaderCell: typeof TableHeaderCell;
};

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ size = 'md', caption, className, children, ...props }, ref) => {
    return (
      <TableContext.Provider value={{ size }}>
        <div className="w-full overflow-auto rounded-(--uds-radius-surface-sm) border border-(--uds-color-border-subtle)">
          <table
            ref={ref}
            className={cn('w-full border-collapse text-sm', className)}
            {...props}
          >
            {caption && (
              <caption className="sr-only">{caption}</caption>
            )}
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
) as TableComponent;

Table.displayName = 'Table';

// --- Table.Header ---

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

function TableHeaderComponent({ className, children, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn(
        'bg-(--uds-color-background-subtle)',
        'text-(--uds-color-text-secondary,var(--uds-color-text-default))',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}
TableHeaderComponent.displayName = 'Table.Header';

// --- Table.Row ---

interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {
  state?: TableRowState;
  selected?: boolean;
}

function TableRowComponent({
  state = 'default',
  selected = false,
  className,
  children,
  ...props
}: TableRowProps) {
  const effectiveState: TableRowState = selected ? 'selected' : state;
  return (
    <tr
      aria-selected={selected || undefined}
      className={cn(tableRowVariants({ state: effectiveState }), className)}
      {...props}
    >
      {children}
    </tr>
  );
}
TableRowComponent.displayName = 'Table.Row';

// --- Table.Cell ---

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

function TableCell({ className, children, ...props }: TableCellProps) {
  const { size } = React.useContext(TableContext);
  const { cell } = ROW_CLASSES[size];
  return (
    <td
      className={cn(
        cell,
        'text-(--uds-color-text-default) text-left align-middle',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}
TableCell.displayName = 'Table.Cell';

// --- Table.HeaderCell ---

interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: 'ascending' | 'descending' | 'none';
  onSort?: () => void;
}

function TableHeaderCell({
  sortable = false,
  sortDirection = 'none',
  onSort,
  className,
  children,
  ...props
}: TableHeaderCellProps) {
  const { size } = React.useContext(TableContext);
  const { cell } = ROW_CLASSES[size];
  return (
    <th
      scope="col"
      aria-sort={sortable ? sortDirection : undefined}
      className={cn(
        cell,
        'text-left font-medium text-xs uppercase tracking-wide',
        'text-(--uds-color-text-secondary,var(--uds-color-text-default))',
        sortable && 'cursor-pointer hover:text-(--uds-color-text-default)',
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <span className="flex items-center gap-1">
        {children}
        {sortable && (
          sortDirection === 'ascending' ? (
            <HugeiconsIcon icon={ChevronUpIcon} size={12} className="flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
          ) : sortDirection === 'descending' ? (
            <HugeiconsIcon icon={ChevronDownIcon} size={12} className="flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
          ) : (
            <HugeiconsIcon icon={ChevronsDownUpIcon} size={12} className="flex-shrink-0" aria-hidden="true" strokeWidth={1.5} />
          )
        )}
      </span>
    </th>
  );
}
TableHeaderCell.displayName = 'Table.HeaderCell';

Table.Header     = TableHeaderComponent;
Table.Row        = TableRowComponent;
Table.Cell       = TableCell;
Table.HeaderCell = TableHeaderCell;

export { Table, tableRowVariants };
