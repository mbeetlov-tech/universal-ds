/**
 * Menu stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Bookmark01Icon, PencilEdit01Icon, Delete01Icon, TickDouble01Icon } from '@hugeicons/core-free-icons';
import { Menu } from './menu';

const BookmarkIcon = () => <HugeiconsIcon icon={Bookmark01Icon} className="h-full w-full" aria-hidden="true" strokeWidth={1.5} />;
const EditIcon = () => <HugeiconsIcon icon={PencilEdit01Icon} className="h-full w-full" aria-hidden="true" strokeWidth={1.5} />;
const TrashIcon = () => <HugeiconsIcon icon={Delete01Icon} className="h-full w-full" aria-hidden="true" strokeWidth={1.5} />;
const CheckAllIcon = () => <HugeiconsIcon icon={TickDouble01Icon} className="h-full w-full" aria-hidden="true" strokeWidth={1.5} />;

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: '**Menu** is a popover container composing MenuItem rows. 3 sizes.' } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu size="md">
      <Menu.Header>Group</Menu.Header>
      <Menu.Item iconLeft={<CheckAllIcon />} active>All items</Menu.Item>
      <Menu.Item iconLeft={<BookmarkIcon />} trailingType="shortcut" shortcut="⌘B">Bookmarks</Menu.Item>
      <Menu.Item>Hidden</Menu.Item>
      <Menu.Separator />
      <Menu.Item iconLeft={<EditIcon />} trailingType="shortcut" shortcut="⌘E">Edit</Menu.Item>
      <Menu.Item style="destructive" iconLeft={<TrashIcon />} trailingType="shortcut" shortcut="⌘⌫">Delete</Menu.Item>
    </Menu>
  ),
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex gap-4 items-start">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Menu key={size} size={size} className="max-w-[200px]">
          <Menu.Header>Size: {size}</Menu.Header>
          <Menu.Item size={size} iconLeft={<EditIcon />}>Edit</Menu.Item>
          <Menu.Item size={size} style="destructive" iconLeft={<TrashIcon />}>Delete</Menu.Item>
        </Menu>
      ))}
    </div>
  ),
};
