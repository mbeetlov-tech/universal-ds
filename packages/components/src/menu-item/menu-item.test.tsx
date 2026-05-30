/**
 * MenuItem tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuItem } from './menu-item';

const TestIcon = () => <svg data-testid="icon" viewBox="0 0 24 24" aria-hidden="true" />;

describe('MenuItem — render', () => {
  it('renders label', () => {
    render(<MenuItem>Bookmarks</MenuItem>);
    expect(screen.getByRole('menuitem', { name: 'Bookmarks' })).toBeInTheDocument();
  });

  for (const size of ['sm', 'md', 'lg'] as const) {
    it(`renders size=${size}`, () => {
      render(<MenuItem size={size}>Item</MenuItem>);
      expect(screen.getByRole('menuitem')).toBeInTheDocument();
    });
  }

  it('renders destructive style', () => {
    render(<MenuItem menuStyle="destructive">Delete</MenuItem>);
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
  });
});

describe('MenuItem — icon', () => {
  it('renders iconLeft', () => {
    render(<MenuItem iconLeft={<TestIcon />}>Open</MenuItem>);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});

describe('MenuItem — trailing', () => {
  it('renders shortcut text', () => {
    render(<MenuItem trailingType="shortcut" shortcut="⌘K">Search</MenuItem>);
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });
});

describe('MenuItem — disabled', () => {
  it('has aria-disabled when disabled', () => {
    render(<MenuItem disabled>Disabled item</MenuItem>);
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('MenuItem — interaction', () => {
  it('calls onClick', async () => {
    const handleClick = vi.fn();
    render(<MenuItem onClick={handleClick}>Action</MenuItem>);
    await userEvent.click(screen.getByRole('menuitem', { name: 'Action' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('MenuItem — defaults', () => {
  it('displayName is MenuItem', () => {
    expect(MenuItem.displayName).toBe('MenuItem');
  });
});
