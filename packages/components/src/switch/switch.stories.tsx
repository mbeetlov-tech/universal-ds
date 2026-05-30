/**
 * Switch stories — Universal DS
 * Figma: figma_set 986:545
 * Variants: 2 sizes × 4 states × 2 on/off = 16 cells
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Switch } from './switch';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Switch** is for immediate-effect binary toggles (settings, preferences, feature flags).

### Key rule
The change applies immediately on click — no Save button needed.
Use Checkbox instead when change should be deferred to form submit.

### Labels
Use stative labels: "Email notifications", "Two-factor auth" — not "Enable email notifications".
The switch position carries the verb.

### Variants
2 sizes × 4 states × 2 on/off = 16 Figma cells
        `.trim(),
      },
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Email notifications',
    size: 'md',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Playground — uncontrolled, click works
export const Playground: Story = {
  render: (args) => {
    const [on, setOn] = React.useState(false);
    return (
      <Switch
        {...args}
        checked={on}
        onChange={setOn}
        helper={on ? 'ON' : 'OFF'}
      />
    );
  },
};

export const Sizes: Story = {
  name: 'Both sizes',
  render: () => (
    <div className="flex flex-col gap-4">
      <Switch size="sm" label="Small (28×16px)" defaultChecked />
      <Switch size="md" label="Medium (36×20px — default)" defaultChecked />
    </div>
  ),
};

export const WithHelper: Story = {
  name: 'With helper text',
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <Switch
        label="Auto-save drafts"
        helper="Saves every 30 seconds while typing"
        checked={on}
        onChange={setOn}
      />
    );
  },
};

export const ControlledOnOff: Story = {
  name: 'Controlled (on/off)',
  render: () => {
    const [on, setOn] = React.useState(false);
    return (
      <Switch
        label="Email notifications"
        checked={on}
        onChange={setOn}
        helper={on ? 'Notifications are ON' : 'Notifications are OFF'}
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Switch label="Disabled OFF" disabled />
      <Switch label="Disabled ON" disabled defaultChecked />
    </div>
  ),
};

export const SettingsGroup: Story = {
  name: 'Settings group',
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Switch label="Email notifications" defaultChecked />
      <Switch label="Push notifications" />
      <Switch label="SMS alerts" defaultChecked />
      <Switch label="Marketing emails" disabled helper="Account setting locked by admin" />
    </div>
  ),
};

// Full 16-variant matrix (2 sizes × 4 states × 2 on/off)
export const AllStatesMatrix: Story = {
  name: 'All states — 16 variant matrix',
  render: () => {
    const sizes = ['sm', 'md'] as const;
    const states: Array<{ label: string; props: object }> = [
      { label: 'Default OFF',  props: { defaultChecked: false } },
      { label: 'Default ON',   props: { defaultChecked: true  } },
      { label: 'Hovered (CSS)', props: { defaultChecked: false, className: 'data-hover' } },
      { label: 'Hovered ON',  props: { defaultChecked: true,  className: 'data-hover' } },
      { label: 'Focused',     props: { defaultChecked: false } },
      { label: 'Focused ON',  props: { defaultChecked: true  } },
      { label: 'Disabled OFF', props: { disabled: true,  defaultChecked: false } },
      { label: 'Disabled ON',  props: { disabled: true,  defaultChecked: true  } },
    ];

    return (
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 border-b">State</th>
              {sizes.map(s => (
                <th key={s} className="px-4 py-2 text-left font-medium text-gray-500 border-b">
                  Size: {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {states.map(({ label, props }) => (
              <tr key={label} className="border-b border-gray-100">
                <td className="px-3 py-3 text-xs text-gray-400 whitespace-nowrap">{label}</td>
                {sizes.map(size => (
                  <td key={size} className="px-4 py-3">
                    <Switch size={size} label={label} {...props} />
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
