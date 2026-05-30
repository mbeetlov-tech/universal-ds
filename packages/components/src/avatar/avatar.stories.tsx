/**
 * Avatar stories — Universal DS
 * Figma: figma_set 541:2209
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Avatar** represents a person, organization, or entity with graceful fallback (initials → icon).

### Types
- **image**: real photo (\`src\` prop)
- **initials**: derived from \`name\` prop ("Jane Doe" → "JD") or explicit \`initials\`
- **icon**: generic silhouette for non-person entities

### Status
- \`online\` / \`offline\` / \`busy\` / \`away\` — presence indicator dot
        `.trim(),
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    type: { control: 'select', options: ['image', 'initials', 'icon'] },
    status: { control: 'select', options: [undefined, 'online', 'offline', 'busy', 'away'] },
    shape: { control: 'select', options: ['circle', 'square'] },
  },
  args: {
    alt: 'Alex Morgan',
    name: 'Alex Morgan',
    size: 'md',
    type: 'initials',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-end gap-4">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size} alt="Jane Doe" name="Jane Doe" />
          <span className="text-xs text-gray-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Types: Story = {
  name: 'All types',
  render: () => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg" alt="Jane Doe" name="Jane Doe" type="initials" />
        <span className="text-xs text-gray-500">initials</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg" alt="System" type="icon" />
        <span className="text-xs text-gray-500">icon</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar size="lg" alt="Loading" type="image" />
        <span className="text-xs text-gray-500">image (no src)</span>
      </div>
    </div>
  ),
};

export const WithStatus: Story = {
  name: 'With status indicators',
  render: () => (
    <div className="flex items-center gap-4">
      {(['online', 'offline', 'busy', 'away'] as const).map(s => (
        <div key={s} className="flex flex-col items-center gap-2">
          <Avatar size="lg" alt={`User — ${s}`} name="Alex M" status={s} />
          <span className="text-xs text-gray-500">{s}</span>
        </div>
      ))}
    </div>
  ),
};

export const InContext: Story = {
  name: 'In a user row',
  render: () => (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200">
      <Avatar size="md" alt="Alex Morgan" name="Alex Morgan" status="online" />
      <div>
        <p className="text-sm font-medium text-gray-900">Alex Morgan</p>
        <p className="text-xs text-gray-500">alex@example.com</p>
      </div>
    </div>
  ),
};
