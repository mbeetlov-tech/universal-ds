/**
 * MenuItem stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Bookmark01Icon, Delete01Icon } from '@hugeicons/core-free-icons';
import { MenuItem } from './menu-item';

const BookmarkIcon = () => <HugeiconsIcon icon={Bookmark01Icon} className="h-full w-full" aria-hidden="true" strokeWidth={1.5} />;
const TrashIcon = () => <HugeiconsIcon icon={Delete01Icon} className="h-full w-full" aria-hidden="true" strokeWidth={1.5} />;

const meta: Meta<typeof MenuItem> = {
  title: 'Components/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: '**MenuItem** is the foundation row for Menu and Select dropdowns.' } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Bookmarks', iconLeft: <BookmarkIcon />, trailingType: 'shortcut', shortcut: '⌘B' } };

export const AllStyles: Story = {
  render: () => (
    <div className="flex flex-col w-64 gap-1 p-2 border rounded-lg">
      <MenuItem iconLeft={<BookmarkIcon />} trailingType="shortcut" shortcut="⌘B">Bookmarks</MenuItem>
      <MenuItem active>Current item (active)</MenuItem>
      <MenuItem disabled>Disabled item</MenuItem>
      <div className="my-1 border-t border-gray-100" />
      <MenuItem menuStyle="destructive" iconLeft={<TrashIcon />} trailingType="shortcut" shortcut="⌘⌫">Delete</MenuItem>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <div key={size} className="w-56 border rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1">Size: {size}</p>
          <MenuItem size={size} iconLeft={<BookmarkIcon />}>Menu item</MenuItem>
          <MenuItem size={size} menuStyle="destructive" iconLeft={<TrashIcon />}>Delete</MenuItem>
        </div>
      ))}
    </div>
  ),
};
