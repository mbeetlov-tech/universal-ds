/**
 * Sidebar stories — Universal DS
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GridViewIcon, InboxIcon as InboxSvgIcon, Calendar01Icon } from '@hugeicons/core-free-icons';
import { Sidebar } from './sidebar';
import { SidebarItem } from '../sidebar-item/sidebar-item';

const GridIcon = () => <HugeiconsIcon icon={GridViewIcon} size={20} aria-hidden="true" strokeWidth={1.5} />;
const InboxIcon = () => <HugeiconsIcon icon={InboxSvgIcon} size={20} aria-hidden="true" strokeWidth={1.5} />;
const CalIcon = () => <HugeiconsIcon icon={Calendar01Icon} size={20} aria-hidden="true" strokeWidth={1.5} />;
// Logo uses a grid-like icon for the demo
const LogoIcon = () => <HugeiconsIcon icon={GridViewIcon} size={24} aria-hidden="true" strokeWidth={1.5} />;

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: '**Sidebar** provides primary app navigation. Two modes: expanded (240px) and collapsed (64px).' } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar
        mode="expanded"
        logo={<LogoIcon />}
        appName="Acme"
        showHeader
        showFooter
        user={{ name: 'Jamie Diaz', email: 'jamie@acme.co' }}
      >
        <SidebarItem href="/dashboard" icon={<GridIcon />} active sidebarStyle="line" mode="expanded">Dashboard</SidebarItem>
        <SidebarItem href="/inbox" icon={<InboxIcon />} badge={5} sidebarStyle="line" mode="expanded">Inbox</SidebarItem>
        <SidebarItem href="/calendar" icon={<CalIcon />} sidebarStyle="line" mode="expanded">Calendar</SidebarItem>
      </Sidebar>
      <main className="flex-1 p-6 bg-gray-50">
        <p className="text-sm text-gray-600">Main content area</p>
      </main>
    </div>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <div style={{ height: '100vh', display: 'flex' }}>
      <Sidebar
        mode="collapsed"
        logo={<LogoIcon />}
        showHeader
        showFooter
        user={{ name: 'Jamie Diaz' }}
      >
        <SidebarItem href="/dashboard" icon={<GridIcon />} active sidebarStyle="line" mode="collapsed">Dashboard</SidebarItem>
        <SidebarItem href="/inbox" icon={<InboxIcon />} badge={5} sidebarStyle="line" mode="collapsed">Inbox</SidebarItem>
        <SidebarItem href="/calendar" icon={<CalIcon />} sidebarStyle="line" mode="collapsed">Calendar</SidebarItem>
      </Sidebar>
      <main className="flex-1 p-6 bg-gray-50">
        <p className="text-sm text-gray-600">Main content area</p>
      </main>
    </div>
  ),
};

export const TogglableMode: Story = {
  name: 'Togglable (expanded / collapsed)',
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Sidebar
          mode={collapsed ? 'collapsed' : 'expanded'}
          logo={<LogoIcon />}
          appName="Acme"
          showHeader
        >
          <SidebarItem href="/dashboard" icon={<GridIcon />} active sidebarStyle="pill" mode={collapsed ? 'collapsed' : 'expanded'}>Dashboard</SidebarItem>
          <SidebarItem href="/inbox" icon={<InboxIcon />} sidebarStyle="pill" mode={collapsed ? 'collapsed' : 'expanded'}>Inbox</SidebarItem>
        </Sidebar>
        <main className="flex-1 p-6 bg-gray-50">
          <button
            onClick={() => setCollapsed(c => !c)}
            className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-gray-50"
          >
            {collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          </button>
        </main>
      </div>
    );
  },
};
