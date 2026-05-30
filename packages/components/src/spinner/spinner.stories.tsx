/**
 * Spinner stories — Universal DS
 * Figma: figma_set 989:8
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Spinner** indicates an async operation is in progress. Used standalone (page loading, lazy regions)
and inside Button loading state.

### Sizes
- **sm** — 16×16px: dense surfaces, inline inside Button sm/md
- **md** — 20×20px: default standalone
- **lg** — 24×24px: page-level loading

### Tokens
Stroke color inherits from \`currentColor\`. No component-tier color token — color flows from parent context.

### Accessibility
- Standalone: \`role="status"\` + \`aria-label\`
- Decorative (inside Button): \`aria-hidden="true"\`
- Reduced motion: animation slows to pulse
        `.trim(),
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'sm=16px / md=20px / lg=24px',
    },
  },
  args: {
    size: 'md',
    'aria-label': 'Loading',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" aria-label="Loading" />
        <span className="text-xs text-gray-500">sm (16px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="md" aria-label="Loading" />
        <span className="text-xs text-gray-500">md (20px)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" aria-label="Loading" />
        <span className="text-xs text-gray-500">lg (24px)</span>
      </div>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  name: 'On dark background (color inherit)',
  render: () => (
    <div
      className="flex items-center gap-4 p-6 rounded-lg"
      style={{ backgroundColor: '#1e293b', color: '#fff' }}
    >
      <Spinner size="sm" aria-label="Loading" />
      <Spinner size="md" aria-label="Loading" />
      <Spinner size="lg" aria-label="Loading" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Spinner uses currentColor — it adapts to any parent color context.',
      },
    },
  },
};

export const InsideButton: Story = {
  name: 'Inside Button (decorative)',
  render: () => (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 16px',
        height: '40px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
        opacity: 0.9,
      }}
      aria-busy="true"
      disabled
    >
      <Spinner size="sm" aria-hidden="true" />
      <span>Saving…</span>
    </button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inside interactive controls, Spinner is decorative — aria-hidden="true". The control\'s label is the accessible name.',
      },
    },
  },
};
