/**
 * Icon stories — Universal DS
 * Figma: icon.md
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Settings01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { Icon } from './icon';

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
**Icon** is a thin wrapper around stroke-based SVG glyphs. It standardizes sizing (12/16/20/24 px)
and color (currentColor inheritance) for consistent consumption across components.

### Usage
- Wrap any SVG icon: \`<Icon size={20}><HugeiconsIcon icon={Search01Icon} size={20} /></Icon>\`
- Direct import: \`<HugeiconsIcon icon={Search01Icon} size={20} aria-hidden="true" strokeWidth={1.5} />\`
- Color flows from parent via \`currentColor\`

### Sizes
12px (dense inline), 16px (default body), 20px (medium), 24px (navigation)
        `.trim(),
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex items-end gap-6">
      {([12, 16, 20, 24] as const).map(size => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Icon size={size}><HugeiconsIcon icon={Search01Icon} size={size} strokeWidth={1.5} /></Icon>
          <span className="text-xs text-gray-500">{size}px</span>
        </div>
      ))}
    </div>
  ),
};

export const ColorInheritance: Story = {
  name: 'Color inheritance (currentColor)',
  render: () => (
    <div className="flex items-center gap-6">
      <span style={{ color: '#2563eb' }}>
        <Icon size={20}><HugeiconsIcon icon={Search01Icon} size={20} strokeWidth={1.5} /></Icon>
      </span>
      <span style={{ color: '#dc2626' }}>
        <Icon size={20}><HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={1.5} /></Icon>
      </span>
      <span style={{ color: '#15803d' }}>
        <Icon size={20}><HugeiconsIcon icon={Settings01Icon} size={20} strokeWidth={1.5} /></Icon>
      </span>
    </div>
  ),
};

export const CommonGlyphs: Story = {
  name: 'Common glyphs across sizes',
  render: () => (
    <div className="flex flex-col gap-4">
      {([12, 16, 20, 24] as const).map(size => (
        <div key={size} className="flex items-center gap-4">
          <span className="text-xs text-gray-400 w-8">{size}px</span>
          <Icon size={size}><HugeiconsIcon icon={Search01Icon} size={size} strokeWidth={1.5} /></Icon>
          <Icon size={size}><HugeiconsIcon icon={Settings01Icon} size={size} strokeWidth={1.5} /></Icon>
          <Icon size={size}><HugeiconsIcon icon={Cancel01Icon} size={size} strokeWidth={1.5} /></Icon>
        </div>
      ))}
    </div>
  ),
};
