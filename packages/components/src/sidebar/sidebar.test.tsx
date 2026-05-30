/**
 * Sidebar tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './sidebar';
import { SidebarItem } from '../sidebar-item/sidebar-item';

const DashIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" />;

describe('Sidebar — render', () => {
  it('renders as nav landmark', () => {
    render(<Sidebar />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    render(<Sidebar aria-label="App sidebar" />);
    expect(screen.getByRole('navigation', { name: 'App sidebar' })).toBeInTheDocument();
  });

  it('renders app name in expanded mode', () => {
    render(<Sidebar mode="expanded" appName="Acme" showHeader />);
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('does NOT render app name in collapsed mode', () => {
    render(<Sidebar mode="collapsed" appName="Acme" showHeader />);
    expect(screen.queryByText('Acme')).not.toBeInTheDocument();
  });
});

describe('Sidebar — children', () => {
  it('renders SidebarItem children', () => {
    render(
      <Sidebar mode="expanded">
        <SidebarItem href="/dashboard" icon={<DashIcon />}>Dashboard</SidebarItem>
        <SidebarItem href="/settings" icon={<DashIcon />}>Settings</SidebarItem>
      </Sidebar>
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Settings' })).toBeInTheDocument();
  });
});

describe('Sidebar — footer', () => {
  it('renders user info in expanded mode', () => {
    render(
      <Sidebar mode="expanded" user={{ name: 'Jamie Diaz', email: 'jamie@acme.co' }} showFooter />
    );
    expect(screen.getByText('Jamie Diaz')).toBeInTheDocument();
    expect(screen.getByText('jamie@acme.co')).toBeInTheDocument();
  });
});

describe('Sidebar — defaults', () => {
  it('displayName is Sidebar', () => {
    expect(Sidebar.displayName).toBe('Sidebar');
  });
});
