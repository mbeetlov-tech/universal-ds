/**
 * SidebarItem tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SidebarItem } from './sidebar-item';

const TestIcon = () => <svg data-testid="icon" viewBox="0 0 24 24" aria-hidden="true" />;

describe('SidebarItem — render', () => {
  it('renders as anchor by default', () => {
    render(
      <SidebarItem href="/dashboard" icon={<TestIcon />}>Dashboard</SidebarItem>
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders as button when asButton=true', () => {
    render(
      <SidebarItem asButton icon={<TestIcon />}>Settings</SidebarItem>
    );
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });
});

describe('SidebarItem — active state', () => {
  it('has aria-current="page" when active', () => {
    render(
      <SidebarItem href="/dashboard" icon={<TestIcon />} active>Dashboard</SidebarItem>
    );
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });

  it('does NOT have aria-current when not active', () => {
    render(
      <SidebarItem href="/settings" icon={<TestIcon />}>Settings</SidebarItem>
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
  });
});

describe('SidebarItem — collapsed mode', () => {
  it('uses aria-label in collapsed mode', () => {
    render(
      <SidebarItem mode="collapsed" icon={<TestIcon />} href="/dashboard">Dashboard</SidebarItem>
    );
    // In collapsed mode, children text becomes aria-label
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
  });
});

describe('SidebarItem — badge', () => {
  it('renders badge count in expanded mode', () => {
    render(
      <SidebarItem href="/inbox" icon={<TestIcon />} badge={5} mode="expanded">Inbox</SidebarItem>
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});

describe('SidebarItem — defaults', () => {
  it('displayName is SidebarItem', () => {
    expect(SidebarItem.displayName).toBe('SidebarItem');
  });
});
