/**
 * Badge stories — Universal DS
 * Figma: figma_set 535:1273
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick01Icon } from '@hugeicons/core-free-icons';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Badge** is a compact inline label for status, categories, counts, and filter chips.

### Intents
- \`neutral\`: no connotation (Draft, Q3)
- \`info\`: ambient (New, Beta)
- \`success\`: positive (Active, Paid)
- \`warning\`: attention (Pending, Trial ending)
- \`danger\`: critical (Overdue, Failed)
- \`primary\`: brand highlight (Pro, Featured)

### Styles
- \`subtle\`: default — carries intent without dominating
- \`solid\`: maximum prominence (counts, urgent status)
- \`outlined\`: lowest weight (busy surfaces)
        `.trim(),
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    badgeStyle: { control: 'select', options: ['solid', 'subtle', 'outlined'] },
    intent: { control: 'select', options: ['neutral', 'info', 'success', 'warning', 'danger', 'primary'] },
    closable: { control: 'boolean' },
  },
  args: {
    children: 'Badge',
    size: 'md',
    badgeStyle: 'subtle',
    intent: 'neutral',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllIntents: Story = {
  name: 'All intents (subtle)',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge intent="neutral">Neutral</Badge>
      <Badge intent="info">Info</Badge>
      <Badge intent="success">Success</Badge>
      <Badge intent="warning">Warning</Badge>
      <Badge intent="danger">Danger</Badge>
      <Badge intent="primary">Primary</Badge>
    </div>
  ),
};

export const AllStyles: Story = {
  name: 'All styles (success intent)',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge intent="success" badgeStyle="solid">Solid</Badge>
      <Badge intent="success" badgeStyle="subtle">Subtle</Badge>
      <Badge intent="success" badgeStyle="outlined">Outlined</Badge>
    </div>
  ),
};

export const SolidIntents: Story = {
  name: 'Solid — all intents',
  render: () => (
    <div className="flex flex-wrap gap-2">
      {(['neutral', 'info', 'success', 'warning', 'danger', 'primary'] as const).map(intent => (
        <Badge key={intent} badgeStyle="solid" intent={intent}>
          {intent.charAt(0).toUpperCase() + intent.slice(1)}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  name: 'With leading icon',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge intent="success" iconLeft={<HugeiconsIcon icon={Tick01Icon} size={12} aria-hidden="true" strokeWidth={1.5} />}>Verified</Badge>
      <Badge intent="primary" iconLeft={<HugeiconsIcon icon={Tick01Icon} size={12} aria-hidden="true" strokeWidth={1.5} />}>Pro</Badge>
    </div>
  ),
};

export const FilterChips: Story = {
  name: 'Closable filter chips',
  render: () => {
    const [filters, setFilters] = React.useState(['Status: Active', 'Team: Engineering', 'Priority: High']);
    return (
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <Badge
            key={f}
            badgeStyle="subtle"
            intent="info"
            closable
            onClose={() => setFilters(filters.filter(x => x !== f))}
          >
            {f}
          </Badge>
        ))}
        {filters.length === 0 && <span className="text-sm text-gray-400">All filters removed</span>}
      </div>
    );
  },
};

export const Sizes: Story = {
  name: 'Both sizes',
  render: () => (
    <div className="flex items-center gap-3">
      <Badge size="sm" intent="primary" badgeStyle="solid">12</Badge>
      <Badge size="md" intent="primary" badgeStyle="solid">12</Badge>
    </div>
  ),
};
