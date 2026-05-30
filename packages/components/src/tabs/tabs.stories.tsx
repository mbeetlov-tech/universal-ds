/**
 * Tabs stories — Universal DS
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GridViewIcon } from '@hugeicons/core-free-icons';
import { Tabs } from './tabs';

const GridIcon = () => <HugeiconsIcon icon={GridViewIcon} aria-hidden="true" strokeWidth={1.5} />;

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Tabs** switches between sibling views. Covers 18 Figma variants (2 orientations × 3 styles × 3 sizes).

### Styles
- \`line\`: lowest weight, content-led contexts
- \`pill\`: utility pickers, toolbar toggles
- \`segmented\`: short fixed sets (Day/Week/Month), highest weight
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="all" tabsStyle="line" size="md">
      <Tabs.List>
        <Tabs.Trigger value="all">All</Tabs.Trigger>
        <Tabs.Trigger value="active">Active</Tabs.Trigger>
        <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
        <Tabs.Trigger value="drafts" disabled>Drafts</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all" className="pt-4"><p className="text-sm text-gray-600">All items content</p></Tabs.Content>
      <Tabs.Content value="active" className="pt-4"><p className="text-sm text-gray-600">Active items</p></Tabs.Content>
      <Tabs.Content value="archived" className="pt-4"><p className="text-sm text-gray-600">Archived items</p></Tabs.Content>
    </Tabs>
  ),
};

export const Pill: Story = {
  render: () => (
    <Tabs defaultValue="files" tabsStyle="pill" size="md">
      <Tabs.List>
        <Tabs.Trigger value="files">Files</Tabs.Trigger>
        <Tabs.Trigger value="people">People</Tabs.Trigger>
        <Tabs.Trigger value="tags">Tags</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="files" className="pt-4"><p className="text-sm text-gray-600">Files view</p></Tabs.Content>
      <Tabs.Content value="people" className="pt-4"><p className="text-sm text-gray-600">People view</p></Tabs.Content>
      <Tabs.Content value="tags" className="pt-4"><p className="text-sm text-gray-600">Tags view</p></Tabs.Content>
    </Tabs>
  ),
};

export const Segmented: Story = {
  render: () => (
    <Tabs defaultValue="week" tabsStyle="segmented" size="md">
      <Tabs.List>
        <Tabs.Trigger value="day">Day</Tabs.Trigger>
        <Tabs.Trigger value="week">Week</Tabs.Trigger>
        <Tabs.Trigger value="month">Month</Tabs.Trigger>
      </Tabs.List>
    </Tabs>
  ),
};

export const WithIcons: Story = {
  name: 'With icons',
  render: () => (
    <Tabs defaultValue="all" tabsStyle="line" size="md">
      <Tabs.List>
        <Tabs.Trigger value="all" icon={<GridIcon />}>All</Tabs.Trigger>
        <Tabs.Trigger value="active">Active</Tabs.Trigger>
        <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="all" className="pt-4"><p className="text-sm">All items</p></Tabs.Content>
      <Tabs.Content value="active" className="pt-4"><p className="text-sm">Active</p></Tabs.Content>
      <Tabs.Content value="archived" className="pt-4"><p className="text-sm">Archived</p></Tabs.Content>
    </Tabs>
  ),
};

export const AllSizes: Story = {
  name: 'All sizes (line style)',
  render: () => (
    <div className="flex flex-col gap-6">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Tabs key={size} defaultValue="a" tabsStyle="line" size={size}>
          <Tabs.List>
            <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
            <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
            <Tabs.Trigger value="c">Tab C</Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      ))}
    </div>
  ),
};
