/**
 * Input stories — Universal DS
 * Figma: figma_set 986:543
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, InformationCircleIcon, ViewIcon, LockIcon, CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { Input } from './input';

const SearchIcon = () => <HugeiconsIcon icon={Search01Icon} size={16} aria-hidden="true" strokeWidth={1.5} />;
const InfoIcon = () => <HugeiconsIcon icon={InformationCircleIcon} size={14} aria-hidden="true" strokeWidth={1.5} />;

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Input** is the standard single-line text entry control. Provides label, field, helper text,
and optional action button as an integrated unit.

### Key principles
- Always pair with a visible label (accessibility requirement)
- Use \`helper\` for format hints, constraints, or error messages
- Use \`error\` state with a specific helper message (never just a red border)
- Phase 0.8.0: \`filled\` state removed — content state via standard React \`value\` prop
        `.trim(),
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    state: { control: 'select', options: ['default', 'hovered', 'focused', 'disabled', 'read-only', 'error', 'success'] },
    label: { control: 'text' },
    helper: { control: 'text' },
  },
  args: {
    label: 'Email address',
    placeholder: 'you@example.com',
    size: 'md',
    state: 'default',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Small" size="sm" placeholder="Small input" />
      <Input label="Medium (default)" size="md" placeholder="Medium input" />
      <Input label="Large" size="lg" placeholder="Large input" />
    </div>
  ),
};

export const States: Story = {
  name: 'All states',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Default" state="default" placeholder="Default" />
      <Input label="Error" state="error" placeholder="Invalid email" helper="Enter a valid email address" />
      <Input label="Success" state="success" placeholder="Valid" helper="Email is available" />
      <Input label="Disabled" disabled placeholder="Cannot edit" helper="This field is locked" />
      <Input label="Read-only" readOnly value="readonly-value@example.com" onChange={() => {}} />
    </div>
  ),
};

export const WithHelper: Story = {
  args: {
    label: 'Password',
    placeholder: '••••••••',
    helper: '8+ characters, one number, one symbol',
  },
};

export const ErrorState: Story = {
  name: 'Error state',
  args: {
    label: 'Email',
    value: 'not-an-email',
    state: 'error',
    helper: 'Enter a valid email address',
  },
};

export const WithLabelIcons: Story = {
  name: 'With label icons',
  render: () => (
    <div className="w-80">
      <Input
        label="Search query"
        labelIconLeft={<SearchIcon />}
        labelIconRight={<InfoIcon />}
        placeholder="Search components…"
      />
    </div>
  ),
};

export const WithActionButton: Story = {
  name: 'With inline action button',
  render: () => (
    <div className="w-80">
      <Input
        label="Search"
        placeholder="Search components"
        actionButton={
          <button
            aria-label="Search"
            className="p-1 rounded text-gray-400 hover:text-gray-600"
            type="button"
          >
            <HugeiconsIcon icon={Search01Icon} size={16} aria-hidden="true" strokeWidth={1.5} />
          </button>
        }
      />
    </div>
  ),
};

export const WithTrailingIcon: Story = {
  name: 'With trailing icon (right edge)',
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        trailingIcon={<HugeiconsIcon icon={ViewIcon} size={16} strokeWidth={1.5} />}
      />
      <Input
        label="Account ID"
        placeholder="Read-only locked"
        readOnly
        value="acct_1234567890"
        onChange={() => {}}
        trailingIcon={<HugeiconsIcon icon={LockIcon} size={14} strokeWidth={1.5} />}
      />
      <Input
        label="Username"
        value="johndoe"
        state="success"
        onChange={() => {}}
        trailingIcon={<HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} strokeWidth={1.5} className="text-[var(--uds-color-background-success-bold)]" />}
        helper="Username is available"
      />
    </div>
  ),
};

export const NoLabel: Story = {
  name: 'No label (use aria-label)',
  args: {
    label: undefined,
    'aria-label': 'Search',
    placeholder: 'Search…',
  },
};
