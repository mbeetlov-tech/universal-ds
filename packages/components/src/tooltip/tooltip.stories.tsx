/**
 * Tooltip stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, PencilEdit01Icon } from '@hugeicons/core-free-icons';
import { Tooltip } from './tooltip';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';

const SearchIcon = () => <HugeiconsIcon icon={Search01Icon} aria-hidden="true" strokeWidth={1.5} />;
const EditIcon = () => <HugeiconsIcon icon={PencilEdit01Icon} aria-hidden="true" strokeWidth={1.5} />;

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: '**Tooltip** shows supplementary info on hover/focus. 8 variants: 2 sizes × 4 positions.' } },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    position: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
    hasArrow: { control: 'boolean' },
  },
  args: {
    content: 'Tooltip text',
    size: 'md',
    position: 'bottom',
    hasArrow: true,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="p-12">
      <Tooltip {...args}>
        <Button intent="secondary">Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const AllPositions: Story = {
  name: 'All positions',
  render: () => (
    <div className="grid grid-cols-2 gap-12 p-16">
      {(['top', 'right', 'bottom', 'left'] as const).map(pos => (
        <Tooltip key={pos} content={`Position: ${pos}`} position={pos}>
          <Button intent="secondary" size="sm">{pos}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const KeyboardShortcut: Story = {
  name: 'Keyboard shortcut (sm)',
  render: () => (
    <div className="p-12">
      <Tooltip size="sm" content="⌘K" position="bottom">
        <IconButton intent="secondary" aria-label="Search">
          <SearchIcon />
        </IconButton>
      </Tooltip>
    </div>
  ),
};

export const WithDescription: Story = {
  name: 'Title + description (md)',
  render: () => (
    <div className="p-12">
      <Tooltip
        title="Save to library"
        description="Save selection to your shared library."
        position="bottom"
      >
        <Button intent="secondary">Save</Button>
      </Tooltip>
    </div>
  ),
};

export const NoArrow: Story = {
  name: 'No arrow',
  render: () => (
    <div className="p-12">
      <Tooltip content="No arrow variant" hasArrow={false} position="bottom">
        <Button intent="secondary">Hover</Button>
      </Tooltip>
    </div>
  ),
};

export const BothSizes: Story = {
  name: 'Both sizes',
  render: () => (
    <div className="flex gap-8 p-12">
      <Tooltip size="sm" content="sm (11px)" position="bottom">
        <Button intent="secondary" size="sm">sm tooltip</Button>
      </Tooltip>
      <Tooltip size="md" content="md (12px)" position="bottom">
        <Button intent="secondary" size="md">md tooltip</Button>
      </Tooltip>
    </div>
  ),
};

/**
 * Visual reference — all 8 variants always visible (forceVisible=true).
 * Intended for design QA; not a usage example.
 */
export const VisualReference: Story = {
  name: 'Visual reference (all 8 variants)',
  render: () => (
    <div className="grid grid-cols-4 gap-x-16 gap-y-20 p-20">
      {(['top', 'right', 'bottom', 'left'] as const).map(pos => (
        <div key={`sm-${pos}`} className="flex flex-col items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">sm/{pos}</span>
          <div className="relative inline-flex items-center justify-center h-10 w-24">
            {/* Content uses no spaces to prevent spurious word-wrap in the sm tooltip body */}
            <Tooltip size="sm" content={`sm·${pos}`} position={pos} forceVisible>
              <Button intent="secondary" size="sm">{pos}</Button>
            </Tooltip>
          </div>
        </div>
      ))}
      {(['top', 'right', 'bottom', 'left'] as const).map(pos => (
        <div key={`md-${pos}`} className="flex flex-col items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">md/{pos}</span>
          <div className="relative inline-flex items-center justify-center h-10 w-24">
            <Tooltip size="md" content={`md·${pos}`} position={pos} forceVisible>
              <Button intent="secondary" size="sm">{pos}</Button>
            </Tooltip>
          </div>
        </div>
      ))}
      <div className="col-span-4 flex flex-col items-start gap-3 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-400 font-mono">md / title + description</span>
        <div className="relative inline-flex items-center justify-center h-10">
          {/* intent="secondary" matches Figma canonical — anchor is neutral, not accent */}
          <Tooltip
            size="md"
            title="Save to library"
            description="Save selection to your shared library."
            position="bottom"
            forceVisible
          >
            <Button intent="secondary">Save</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};
