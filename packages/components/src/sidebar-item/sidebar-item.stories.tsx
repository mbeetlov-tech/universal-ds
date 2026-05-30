/**
 * SidebarItem stories — Universal DS
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { InboxIcon as InboxSvgIcon, GridViewIcon, Settings01Icon } from '@hugeicons/core-free-icons';
import { SidebarItem } from './sidebar-item';

const InboxIcon = () => <HugeiconsIcon icon={InboxSvgIcon} size={20} aria-hidden="true" strokeWidth={1.5} />;
const GridIcon = () => <HugeiconsIcon icon={GridViewIcon} size={20} aria-hidden="true" strokeWidth={1.5} />;
const SettingsIcon = () => <HugeiconsIcon icon={Settings01Icon} size={20} aria-hidden="true" strokeWidth={1.5} />;

const meta: Meta<typeof SidebarItem> = {
  title: 'Components/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  name: 'Expanded mode — all states',
  render: () => (
    <div className="flex flex-col gap-1 w-56 p-2 bg-white border rounded-lg">
      <SidebarItem href="/dashboard" icon={<GridIcon />} mode="expanded" active sidebarStyle="line">Dashboard</SidebarItem>
      <SidebarItem href="/inbox" icon={<InboxIcon />} mode="expanded" badge={5} sidebarStyle="line">Inbox</SidebarItem>
      <SidebarItem href="/settings" icon={<SettingsIcon />} mode="expanded" sidebarStyle="line">Settings</SidebarItem>
      <SidebarItem href="/disabled" icon={<GridIcon />} mode="expanded" disabled sidebarStyle="line">Disabled</SidebarItem>
    </div>
  ),
};

export const Collapsed: Story = {
  name: 'Collapsed mode',
  render: () => (
    <div className="flex flex-col gap-1 w-16 p-2 bg-white border rounded-lg items-center">
      <SidebarItem href="/dashboard" icon={<GridIcon />} mode="collapsed" active sidebarStyle="line">Dashboard</SidebarItem>
      <SidebarItem href="/inbox" icon={<InboxIcon />} mode="collapsed" badge={5} sidebarStyle="line">Inbox</SidebarItem>
      <SidebarItem href="/settings" icon={<SettingsIcon />} mode="collapsed" sidebarStyle="line">Settings</SidebarItem>
    </div>
  ),
};

export const PillStyle: Story = {
  name: 'Pill style',
  render: () => (
    <div className="flex flex-col gap-1 w-56 p-2 bg-white border rounded-lg">
      <SidebarItem href="/dashboard" icon={<GridIcon />} mode="expanded" active sidebarStyle="pill">Dashboard</SidebarItem>
      <SidebarItem href="/inbox" icon={<InboxIcon />} mode="expanded" sidebarStyle="pill">Inbox</SidebarItem>
      <SidebarItem href="/settings" icon={<SettingsIcon />} mode="expanded" sidebarStyle="pill">Settings</SidebarItem>
    </div>
  ),
};
