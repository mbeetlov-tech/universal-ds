/**
 * Card stories — Universal DS
 * Figma: figma_set 544:2012
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';
import { Badge } from '../badge/badge';
import { Button } from '../button/button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Card** is the primary content composition primitive — groups related content under a visual surface.

### Compound parts
- \`Card.Header\`: title + subtitle + optional action
- \`Card.Body\`: content slot (always present)
- \`Card.Footer\`: action row (right-aligned)
- \`Card.Divider\`: 1px subtle separator

### Styles
- \`elevated\`: shadow (dashboards)
- \`outlined\`: border (directories, lists)
- \`filled\`: subtle bg (sub-cards, settings)
        `.trim(),
      },
    },
  },
  argTypes: {
    padding: { control: 'select', options: ['sm', 'md', 'lg'] },
    cardStyle: { control: 'select', options: ['elevated', 'outlined', 'filled'] },
  },
  args: {
    padding: 'md',
    cardStyle: 'elevated',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <Card.Header title="Card Title" subtitle="Optional subtitle text" />
      <Card.Divider />
      <Card.Body>
        <p className="text-sm text-gray-600">
          Body content goes here. Replace with real content in your instance.
        </p>
      </Card.Body>
      <Card.Divider />
      <Card.Footer>
        <Button intent="secondary" size="sm">Cancel</Button>
        <Button intent="primary" size="sm">Save</Button>
      </Card.Footer>
    </Card>
  ),
};

export const KPICard: Story = {
  name: 'KPI / metric card',
  render: () => (
    <Card cardStyle="elevated" padding="md" className="w-64">
      <Card.Body>
        <p className="text-xs text-gray-500 uppercase tracking-wide">Monthly Revenue</p>
        <p className="text-3xl font-bold text-gray-900">$42,851</p>
        <Badge intent="success" badgeStyle="subtle">+12.5% this month</Badge>
      </Card.Body>
    </Card>
  ),
};

export const AllStyles: Story = {
  name: 'All styles',
  render: () => (
    <div className="flex gap-4">
      {(['elevated', 'outlined', 'filled'] as const).map(s => (
        <Card key={s} cardStyle={s} className="w-52">
          <Card.Header title={s.charAt(0).toUpperCase() + s.slice(1)} />
          <Card.Body>
            <p className="text-sm text-gray-600">Card content</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
};

export const AllPaddings: Story = {
  name: 'All paddings',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map(p => (
        <Card key={p} padding={p} cardStyle="outlined" className="w-80">
          <Card.Header title={`Padding ${p}`} />
          <Card.Body>
            <p className="text-sm text-gray-600">Content area</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  ),
};

export const SettingsCard: Story = {
  name: 'Settings card',
  render: () => (
    <Card cardStyle="outlined" padding="md" className="w-96">
      <Card.Header
        title="Notification settings"
        subtitle="Choose how you want to be notified"
      />
      <Card.Divider />
      <Card.Body>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" defaultChecked /> Email notifications
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" /> Push notifications
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" defaultChecked /> SMS alerts
          </label>
        </div>
      </Card.Body>
      <Card.Divider />
      <Card.Footer>
        <Button intent="secondary" size="sm">Cancel</Button>
        <Button intent="primary" size="sm">Save preferences</Button>
      </Card.Footer>
    </Card>
  ),
};
