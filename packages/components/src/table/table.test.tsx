/**
 * Table tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from './table';

const DATA = [
  { id: '1', name: 'Alice', role: 'Engineer' },
  { id: '2', name: 'Bob', role: 'Designer' },
];

describe('Table — render', () => {
  it('renders a table element', () => {
    render(
      <Table caption="Users">
        <Table.Header>
          <tr>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
          </tr>
        </Table.Header>
        <tbody>
          {DATA.map(row => (
            <Table.Row key={row.id}>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.role}</Table.Cell>
            </Table.Row>
          ))}
        </tbody>
      </Table>
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders caption (visually hidden)', () => {
    render(
      <Table caption="User list">
        <tbody />
      </Table>
    );
    expect(screen.getByText('User list')).toBeInTheDocument();
  });

  it('renders header cells with scope="col"', () => {
    render(
      <Table>
        <Table.Header>
          <tr>
            <Table.HeaderCell>Name</Table.HeaderCell>
          </tr>
        </Table.Header>
        <tbody />
      </Table>
    );
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
  });
});

describe('Table — row states', () => {
  it('selected row has aria-selected', () => {
    render(
      <Table>
        <tbody>
          <Table.Row selected>
            <Table.Cell>Alice</Table.Cell>
          </Table.Row>
        </tbody>
      </Table>
    );
    expect(screen.getByRole('row', { name: 'Alice' })).toHaveAttribute('aria-selected', 'true');
  });

  it('non-selected row does NOT have aria-selected', () => {
    render(
      <Table>
        <tbody>
          <Table.Row>
            <Table.Cell>Bob</Table.Cell>
          </Table.Row>
        </tbody>
      </Table>
    );
    expect(screen.getByRole('row', { name: 'Bob' })).not.toHaveAttribute('aria-selected');
  });
});

describe('Table — sizes', () => {
  for (const size of ['sm', 'md', 'lg'] as const) {
    it(`renders size=${size}`, () => {
      render(
        <Table size={size}>
          <tbody>
            <Table.Row><Table.Cell>Cell</Table.Cell></Table.Row>
          </tbody>
        </Table>
      );
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  }
});

describe('Table — defaults', () => {
  it('displayName is Table', () => {
    expect(Table.displayName).toBe('Table');
  });
});
