/**
 * Tabs tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './tabs';

describe('Tabs — render', () => {
  it('renders tabs list and triggers', () => {
    render(
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="active">Active</Tabs.Trigger>
          <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all"><p>All items</p></Tabs.Content>
        <Tabs.Content value="active"><p>Active items</p></Tabs.Content>
        <Tabs.Content value="archived"><p>Archived items</p></Tabs.Content>
      </Tabs>
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('shows active tab content', () => {
    render(
      <Tabs defaultValue="active">
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="active">Active</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all"><p>All items</p></Tabs.Content>
        <Tabs.Content value="active"><p>Active items</p></Tabs.Content>
      </Tabs>
    );
    expect(screen.getByText('Active items')).toBeInTheDocument();
    expect(screen.queryByText('All items')).not.toBeInTheDocument();
  });
});

describe('Tabs — a11y', () => {
  it('active tab has aria-selected=true', () => {
    render(
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="active">Active</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('aria-selected', 'false');
  });

  it('active tab has tabIndex=0, inactive has tabIndex=-1', () => {
    render(
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="active">Active</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Active' })).toHaveAttribute('tabindex', '-1');
  });
});

describe('Tabs — interaction', () => {
  it('switches tab on click', async () => {
    render(
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="active">Active</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="all"><p>All content</p></Tabs.Content>
        <Tabs.Content value="active"><p>Active content</p></Tabs.Content>
      </Tabs>
    );
    await userEvent.click(screen.getByRole('tab', { name: 'Active' }));
    expect(screen.getByText('Active content')).toBeInTheDocument();
    expect(screen.queryByText('All content')).not.toBeInTheDocument();
  });

  it('calls onValueChange', async () => {
    const handleChange = vi.fn();
    render(
      <Tabs defaultValue="all" onValueChange={handleChange}>
        <Tabs.List>
          <Tabs.Trigger value="all">All</Tabs.Trigger>
          <Tabs.Trigger value="active">Active</Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    );
    await userEvent.click(screen.getByRole('tab', { name: 'Active' }));
    expect(handleChange).toHaveBeenCalledWith('active');
  });
});

describe('Tabs — styles', () => {
  for (const style of ['line', 'pill', 'segmented'] as const) {
    it(`renders style=${style}`, () => {
      render(
        <Tabs defaultValue="a" tabsStyle={style}>
          <Tabs.List>
            <Tabs.Trigger value="a">A</Tabs.Trigger>
            <Tabs.Trigger value="b">B</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      );
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
  }
});

describe('Tabs — defaults', () => {
  it('displayName is Tabs', () => {
    expect(Tabs.displayName).toBe('Tabs');
  });
});
