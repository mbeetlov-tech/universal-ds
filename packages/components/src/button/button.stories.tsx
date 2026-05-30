/**
 * Button — Universal DS
 *
 * Figma: https://www.figma.com/design/CtsUh71ahd8yksZ4fzSAw4/
 * Component: Button (5 intents × 3 sizes × 6 states = 90 variant cells)
 *
 * Token mapping:
 *   CSS vars consumed: --uds-button-{intent}-{property}-{state}
 *   All resolved from: knowledge/design-system/tokens/tokens.json
 *
 * Testing with a11y addon:
 *   Each story should show 0 Critical/Serious violations in the Accessibility panel.
 *   Run axe check: Storybook → Accessibility tab → check "Violations".
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, ArrowRight01Icon, Delete01Icon } from '@hugeicons/core-free-icons';
import { Button } from './button';

// --- Meta ---

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Button** triggers an action. The most common interactive control — submit forms,
open dialogs, navigate, or perform destructive operations.

### Variants
- **5 intents:** primary / secondary / tertiary / danger / ghost
- **3 sizes:** sm / md / lg
- **6 states:** default / hovered / pressed / focused / disabled / loading

### Tokens consumed
All visual styles derive from \`--uds-button-*\` CSS custom properties
(defined in \`@uds/tokens\`). No hardcoded colors.

### Accessibility
- Soft-disabled pattern (F-9): \`aria-disabled\` keeps button in tab order
- Loading: \`aria-busy="true"\`, label preserved as accessible name
- Focus ring: \`outline-offset: 2px\` (canonical UDS pattern)
- Icons: \`aria-hidden="true"\` (decorative — label is accessible name)
        `.trim(),
      },
    },
  },
  argTypes: {
    intent: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'danger', 'ghost'],
      description: 'Visual intent — maps to Figma Intent property',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size — maps to Figma Size property',
    },
    loading: {
      control: 'boolean',
      description: 'Shows spinner + sets aria-busy. Label preserved for a11y.',
    },
    disabled: {
      control: 'boolean',
      description: 'Soft-disabled: aria-disabled, stays focusable (F-9).',
    },
    children: {
      control: 'text',
      description: 'Button label text',
    },
  },
  args: {
    intent: 'primary',
    size: 'md',
    children: 'Button',
    loading: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// --- Playground (interactive controls) ---

export const Playground: Story = {
  name: 'Playground',
};

// --- Intent variants ---

export const Primary: Story = {
  name: 'Primary',
  args: { intent: 'primary', children: 'Save changes' },
};

export const Secondary: Story = {
  name: 'Secondary',
  args: { intent: 'secondary', children: 'Cancel' },
};

export const Tertiary: Story = {
  name: 'Tertiary',
  args: { intent: 'tertiary', children: 'Learn more' },
};

export const Danger: Story = {
  name: 'Danger',
  args: { intent: 'danger', children: 'Delete account' },
};

export const Ghost: Story = {
  name: 'Ghost',
  args: { intent: 'ghost', children: 'More options' },
};

// --- Sizes ---

export const Sizes: Story = {
  name: 'Sizes',
  render: () => (
    <div className="flex items-center gap-4">
      <Button intent="primary" size="sm">Small</Button>
      <Button intent="primary" size="md">Medium</Button>
      <Button intent="primary" size="lg">Large</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'sm = 32px height (dense UIs), md = 40px (default), lg = 48px (hero CTAs)',
      },
    },
  },
};

// --- States ---

export const Loading: Story = {
  name: 'Loading state',
  args: { loading: true, children: 'Saving…' },
  parameters: {
    docs: {
      description: {
        story: 'aria-busy="true". Label preserved as accessible name (opacity:0 visual only).',
      },
    },
  },
};

export const Disabled: Story = {
  name: 'Disabled (soft)',
  args: { disabled: true, children: 'Disabled' },
  parameters: {
    docs: {
      description: {
        story: 'Soft-disabled pattern (F-9): aria-disabled="true", stays in tab order. NOT native disabled.',
      },
    },
  },
};

// --- Icons ---

export const WithLeftIcon: Story = {
  name: 'With left icon',
  args: {
    leftIcon: <HugeiconsIcon icon={PlusSignIcon} size={16} aria-hidden="true" strokeWidth={1.5} />,
    children: 'Add item',
  },
};

export const WithRightIcon: Story = {
  name: 'With right icon',
  args: {
    rightIcon: <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden="true" strokeWidth={1.5} />,
    children: 'Continue',
  },
};

export const WithBothIcons: Story = {
  name: 'With both icons',
  args: {
    leftIcon: <HugeiconsIcon icon={PlusSignIcon} size={16} aria-hidden="true" strokeWidth={1.5} />,
    rightIcon: <HugeiconsIcon icon={ArrowRight01Icon} size={16} aria-hidden="true" strokeWidth={1.5} />,
    children: 'New item',
  },
};

// --- All intents grid ---

export const AllIntents: Story = {
  name: 'All intents',
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button intent="primary">Primary</Button>
        <Button intent="secondary">Secondary</Button>
        <Button intent="tertiary">Tertiary</Button>
        <Button intent="danger">Danger</Button>
        <Button intent="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button intent="primary" disabled>Primary</Button>
        <Button intent="secondary" disabled>Secondary</Button>
        <Button intent="tertiary" disabled>Tertiary</Button>
        <Button intent="danger" disabled>Danger</Button>
        <Button intent="ghost" disabled>Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button intent="primary" loading>Primary</Button>
        <Button intent="secondary" loading>Secondary</Button>
        <Button intent="tertiary" loading>Tertiary</Button>
        <Button intent="danger" loading>Danger</Button>
        <Button intent="ghost" loading>Ghost</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Row 1: default state. Row 2: disabled. Row 3: loading.',
      },
    },
  },
};

// --- Danger with icon ---

export const DangerWithIcon: Story = {
  name: 'Danger + icon',
  args: {
    intent: 'danger',
    leftIcon: <HugeiconsIcon icon={Delete01Icon} size={16} aria-hidden="true" strokeWidth={1.5} />,
    children: 'Delete project',
  },
};

// --- Full variant matrix (all 15 intent × size combos) ---

export const VariantMatrix: Story = {
  name: 'Variant matrix (15 combos)',
  render: () => {
    const intents = ['primary', 'secondary', 'tertiary', 'danger', 'ghost'] as const;
    const sizes = ['sm', 'md', 'lg'] as const;

    return (
      <div className="overflow-auto">
        <table className="border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-3 text-left font-medium border border-gray-200">Intent / Size</th>
              {sizes.map(size => (
                <th key={size} className="p-3 text-left font-medium border border-gray-200">
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {intents.map(intent => (
              <tr key={intent}>
                <td className="p-3 border border-gray-200 font-mono text-xs">{intent}</td>
                {sizes.map(size => (
                  <td key={size} className="p-3 border border-gray-200">
                    <Button intent={intent} size={size}>
                      {intent}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        story: '15 combinations = 5 intents × 3 sizes. Verify color and sizing tokens resolve correctly.',
      },
    },
  },
};
