/**
 * Menu tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Menu } from './menu';

const BookmarkIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" />;
const TrashIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" />;

describe('Menu — render', () => {
  it('has role="menu"', () => {
    render(<Menu />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders Menu.Header', () => {
    render(
      <Menu>
        <Menu.Header>Group</Menu.Header>
      </Menu>
    );
    expect(screen.getByText('Group')).toBeInTheDocument();
  });

  it('renders Menu.Item', () => {
    render(
      <Menu>
        <Menu.Item>Bookmarks</Menu.Item>
      </Menu>
    );
    expect(screen.getByRole('menuitem', { name: 'Bookmarks' })).toBeInTheDocument();
  });

  it('renders Menu.Separator', () => {
    render(
      <Menu>
        <Menu.Item>A</Menu.Item>
        <Menu.Separator />
        <Menu.Item>B</Menu.Item>
      </Menu>
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});

describe('Menu — interaction', () => {
  it('calls onClick on item click', async () => {
    const handleClick = vi.fn();
    render(
      <Menu>
        <Menu.Item onClick={handleClick}>Action</Menu.Item>
      </Menu>
    );
    await userEvent.click(screen.getByRole('menuitem', { name: 'Action' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('Menu — sizes', () => {
  for (const size of ['sm', 'md', 'lg'] as const) {
    it(`renders size=${size}`, () => {
      render(<Menu size={size}><Menu.Item size={size}>Item</Menu.Item></Menu>);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  }
});

describe('Menu — defaults', () => {
  it('displayName is Menu', () => {
    expect(Menu.displayName).toBe('Menu');
  });
});
