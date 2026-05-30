/**
 * Table stories
 */

import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Table } from './table';
import { Badge } from '../badge/badge';

const USERS = [
  { id: '1', name: 'Alice Johnson', role: 'Engineer', status: 'active', joined: '2023-03-15' },
  { id: '2', name: 'Bob Chen', role: 'Designer', status: 'inactive', joined: '2023-07-01' },
  { id: '3', name: 'Carol Smith', role: 'Manager', status: 'active', joined: '2022-11-20' },
  { id: '4', name: 'Dave Williams', role: 'Engineer', status: 'active', joined: '2024-01-08' },
];

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: { description: { component: '**Table** is a composition of TableHeader + TableRow for structured data display.' } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Table caption="Users" size="md">
      <Table.Header>
        <tr>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Joined</Table.HeaderCell>
        </tr>
      </Table.Header>
      <tbody>
        {USERS.map(user => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.name}</Table.Cell>
            <Table.Cell>{user.role}</Table.Cell>
            <Table.Cell>
              <Badge
                intent={user.status === 'active' ? 'success' : 'neutral'}
                badgeStyle="subtle"
              >
                {user.status}
              </Badge>
            </Table.Cell>
            <Table.Cell>{user.joined}</Table.Cell>
          </Table.Row>
        ))}
      </tbody>
    </Table>
  ),
};

export const RowStates: Story = {
  name: 'Row states',
  render: () => (
    <Table>
      <Table.Header>
        <tr>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>State</Table.HeaderCell>
        </tr>
      </Table.Header>
      <tbody>
        <Table.Row state="default"><Table.Cell>Alice</Table.Cell><Table.Cell>default</Table.Cell></Table.Row>
        <Table.Row state="hovered"><Table.Cell>Bob</Table.Cell><Table.Cell>hovered</Table.Cell></Table.Row>
        <Table.Row selected><Table.Cell>Carol</Table.Cell><Table.Cell>selected</Table.Cell></Table.Row>
        <Table.Row state="disabled"><Table.Cell>Dave</Table.Cell><Table.Cell>disabled</Table.Cell></Table.Row>
      </tbody>
    </Table>
  ),
};

export const Sortable: Story = {
  name: 'Sortable headers',
  render: () => {
    const [sort, setSort] = React.useState<{ col: string; dir: 'ascending' | 'descending' | 'none' }>({ col: '', dir: 'none' });
    const toggle = (col: string) => setSort(prev =>
      prev.col === col ? { col, dir: prev.dir === 'ascending' ? 'descending' : 'ascending' } : { col, dir: 'ascending' }
    );
    return (
      <Table>
        <Table.Header>
          <tr>
            <Table.HeaderCell sortable sortDirection={sort.col === 'name' ? sort.dir : 'none'} onSort={() => toggle('name')}>Name</Table.HeaderCell>
            <Table.HeaderCell sortable sortDirection={sort.col === 'role' ? sort.dir : 'none'} onSort={() => toggle('role')}>Role</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </tr>
        </Table.Header>
        <tbody>
          {USERS.map(u => <Table.Row key={u.id}><Table.Cell>{u.name}</Table.Cell><Table.Cell>{u.role}</Table.Cell><Table.Cell>{u.status}</Table.Cell></Table.Row>)}
        </tbody>
      </Table>
    );
  },
};
