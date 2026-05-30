/**
 * Select stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './select';

const countries = [
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: '**Select** is for single-value selection from a known list of 5–30 options.' } },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    state: { control: 'select', options: ['default', 'hovered', 'focused', 'error', 'disabled'] },
  },
  args: {
    label: 'Country',
    placeholder: 'Select country',
    options: countries,
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
    <div className="flex flex-col gap-4 w-64">
      <Select label="Small" size="sm" placeholder="Select…" options={countries} />
      <Select label="Medium (default)" size="md" placeholder="Select…" options={countries} />
      <Select label="Large" size="lg" placeholder="Select…" options={countries} />
    </div>
  ),
};

export const States: Story = {
  name: 'All states',
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select label="Default" state="default" placeholder="Select…" options={countries} />
      <Select label="Error" state="error" placeholder="Select…" options={countries} helper="Please select a country" />
      <Select label="Disabled" disabled placeholder="Select…" options={countries} />
    </div>
  ),
};

export const WithHelper: Story = {
  args: {
    label: 'Shipping region',
    helper: 'Required for international orders',
  },
};
