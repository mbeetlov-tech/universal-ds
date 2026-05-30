/**
 * IconButton stories — Universal DS
 * Figma: figma_set 986:542
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Cancel01Icon, Delete01Icon, SentIcon } from '@hugeicons/core-free-icons';
import { IconButton } from './icon-button';

const SearchIcon = () => <HugeiconsIcon icon={Search01Icon} aria-hidden="true" strokeWidth={1.5} />;
const CloseIcon = () => <HugeiconsIcon icon={Cancel01Icon} aria-hidden="true" strokeWidth={1.5} />;
const TrashIcon = () => <HugeiconsIcon icon={Delete01Icon} aria-hidden="true" strokeWidth={1.5} />;
const SendIcon = () => <HugeiconsIcon icon={SentIcon} aria-hidden="true" strokeWidth={1.5} />;

const meta: Meta<typeof IconButton> = {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**IconButton** triggers an action using an icon alone. Distinct from Button: square aspect ratio,
no label spacing, and mandatory \`aria-label\`.

### Rules
- **aria-label is mandatory** — TypeScript enforces it.
- Use \`ghost\` inside surfaces with their own background (cards, table rows).
- Use \`md\` or \`lg\` for touch-accessible surfaces.

### Sizes
- \`2xs\` (20px): dense inside Input sm
- \`xs\` (24px): tight toolbars
- \`sm\` (32px): compact action bars
- \`md\` (40px): default standalone toolbar
- \`lg\` (48px): prominent / FAB-style
        `.trim(),
      },
    },
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'danger-ghost'],
    },
    size: {
      control: 'select',
      options: ['2xs', 'xs', 'sm', 'md', 'lg'],
    },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: {
    intent: 'secondary',
    size: 'md',
    'aria-label': 'Search',
    loading: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <IconButton {...args}>
      <SearchIcon />
    </IconButton>
  ),
};

export const AllIntents: Story = {
  name: 'All intents',
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton intent="primary" aria-label="Primary action">
        <SendIcon />
      </IconButton>
      <IconButton intent="secondary" aria-label="Secondary action">
        <SearchIcon />
      </IconButton>
      <IconButton intent="ghost" aria-label="Ghost action">
        <SearchIcon />
      </IconButton>
      <IconButton intent="danger" aria-label="Delete">
        <TrashIcon />
      </IconButton>
      <IconButton intent="danger-ghost" aria-label="Delete (ghost)">
        <TrashIcon />
      </IconButton>
    </div>
  ),
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-end gap-3">
      {(['2xs', 'xs', 'sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconButton size={size} intent="secondary" aria-label={`${size} action`}>
            <CloseIcon />
          </IconButton>
          <span className="text-xs text-gray-500">{size}</span>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    'aria-label': 'Disabled action',
  },
  render: (args) => (
    <IconButton {...args}>
      <TrashIcon />
    </IconButton>
  ),
};

export const Loading: Story = {
  args: {
    loading: true,
    intent: 'primary',
    'aria-label': 'Sending',
  },
  render: (args) => (
    <IconButton {...args}>
      <SendIcon />
    </IconButton>
  ),
};
