/**
 * Pagination stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Pagination } from './pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: { description: { component: '**Pagination** navigates between pages. 6 variants: 3 sizes × 2 styles.' } },
  },
  argTypes: {
    paginationStyle: { control: 'select', options: ['numbered', 'compact'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    currentPage: { control: { type: 'number', min: 1, max: 50 } },
    totalPages: { control: { type: 'number', min: 1, max: 50 } },
  },
  args: {
    currentPage: 3,
    totalPages: 10,
    paginationStyle: 'numbered',
    size: 'md',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [page, setPage] = React.useState(args.currentPage);
    return <Pagination {...args} currentPage={page} onPageChange={setPage} />;
  },
};

export const Numbered: Story = {
  name: 'Numbered (interactive)',
  render: () => {
    const [page, setPage] = React.useState(3);
    return <Pagination currentPage={page} totalPages={10} onPageChange={setPage} paginationStyle="numbered" size="md" />;
  },
};

export const Compact: Story = {
  name: 'Compact (interactive)',
  render: () => {
    const [page, setPage] = React.useState(5);
    return <Pagination currentPage={page} totalPages={42} onPageChange={setPage} paginationStyle="compact" size="md" />;
  },
};

export const AllSizes: Story = {
  name: 'All sizes',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Pagination key={size} size={size} currentPage={3} totalPages={7} onPageChange={() => {}} paginationStyle="numbered" />
      ))}
    </div>
  ),
};

export const EdgeCases: Story = {
  name: 'Edge cases (first / last page)',
  render: () => (
    <div className="flex flex-col gap-4">
      <Pagination currentPage={1} totalPages={10} onPageChange={() => {}} paginationStyle="numbered" />
      <Pagination currentPage={10} totalPages={10} onPageChange={() => {}} paginationStyle="numbered" />
    </div>
  ),
};
