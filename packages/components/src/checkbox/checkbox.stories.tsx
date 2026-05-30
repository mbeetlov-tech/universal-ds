/**
 * Checkbox stories — Universal DS
 * Figma: figma_set 986:544
 * Variants: 3 sizes × 4 states × 3 checked-states = 36 cells
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Checkbox** is for binary or tri-state (indeterminate) selection in forms.

### Checkbox vs Switch
- Checkbox: deferred commit (form submit), multi-select, indeterminate support
- Switch: immediate commit (settings toggle), binary only

### Sizes
- \`sm\` (16px): dense table-row contexts only
- \`md\` (20px): default forms
- \`lg\` (24px): prominent settings

### Variants (Figma)
3 sizes × 4 states × 3 checked-states = 36 cells
        `.trim(),
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
  },
  args: {
    label: 'Accept terms and conditions',
    size: 'md',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox size="sm" label="Small (16px)" />
      <Checkbox size="md" label="Medium (20px — default)" />
      <Checkbox size="lg" label="Large (24px)" />
    </div>
  ),
};

export const WithHelper: Story = {
  name: 'With helper text',
  args: {
    label: 'Email notifications',
    helper: "We'll only send transactional emails.",
  },
};

export const Indeterminate: Story = {
  name: 'Indeterminate (select-all pattern)',
  render: () => {
    const [items, setItems] = React.useState([false, true, false]);
    const allChecked = items.every(Boolean);
    const noneChecked = items.every(v => !v);
    const indeterminate = !allChecked && !noneChecked;

    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          label={`Select all (${items.filter(Boolean).length} of ${items.length})`}
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={(val) => setItems(items.map(() => val))}
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item, i) => (
            <Checkbox
              key={i}
              label={`Item ${i + 1}`}
              checked={item}
              onChange={(val) => {
                const next = [...items];
                next[i] = val;
                setItems(next);
              }}
            />
          ))}
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled option',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  name: 'Disabled + checked',
  args: {
    label: 'Cannot uncheck',
    disabled: true,
    defaultChecked: true,
  },
};

// Full 36-variant matrix: 3 sizes × 4 states × 3 checked states
export const AllStatesMatrix: Story = {
  name: 'All states — 36 variant matrix',
  render: () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    type Row = { label: string; checked?: boolean; indeterminate?: boolean; disabled?: boolean };
    const rows: Row[] = [
      // Unchecked
      { label: 'Default unchecked',     checked: false },
      { label: 'Hovered unchecked',     checked: false },
      { label: 'Focused unchecked',     checked: false },
      { label: 'Disabled unchecked',    checked: false, disabled: true },
      // Checked
      { label: 'Default checked',       checked: true  },
      { label: 'Hovered checked',       checked: true  },
      { label: 'Focused checked',       checked: true  },
      { label: 'Disabled checked',      checked: true,  disabled: true },
      // Indeterminate
      { label: 'Default indeterminate', indeterminate: true  },
      { label: 'Hovered indeterminate', indeterminate: true  },
      { label: 'Focused indeterminate', indeterminate: true  },
      { label: 'Disabled indeterminate',indeterminate: true,  disabled: true },
    ];

    return (
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 border-b">State</th>
              {sizes.map(s => (
                <th key={s} className="px-4 py-2 text-left font-medium text-gray-500 border-b">
                  {s} ({s === 'sm' ? '16px' : s === 'md' ? '20px' : '24px'})
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, ...props }) => (
              <tr key={label} className="border-b border-gray-100">
                <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{label}</td>
                {sizes.map(size => (
                  <td key={size} className="px-4 py-3">
                    <Checkbox
                      size={size}
                      label={label}
                      onChange={() => {}}
                      {...props}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
};
