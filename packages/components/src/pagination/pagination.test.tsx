/**
 * Pagination tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from './pagination';

describe('Pagination — render', () => {
  it('renders nav landmark', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders prev and next buttons', () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });
});

describe('Pagination — numbered style', () => {
  it('shows page numbers', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} paginationStyle="numbered" />);
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
  });

  it('marks current page with aria-current', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} paginationStyle="numbered" />);
    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('aria-current', 'page');
  });
});

describe('Pagination — compact style', () => {
  it('shows page indicator', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} paginationStyle="compact" />);
    expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
  });
});

describe('Pagination — disabled states', () => {
  it('disables prev on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('disables next on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
});

describe('Pagination — interaction', () => {
  it('calls onPageChange on next click', async () => {
    const handleChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handleChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange on prev click', async () => {
    const handleChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={handleChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(handleChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange on page number click', async () => {
    const handleChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={handleChange} paginationStyle="numbered" />);
    await userEvent.click(screen.getByRole('button', { name: '4' }));
    expect(handleChange).toHaveBeenCalledWith(4);
  });
});

describe('Pagination — defaults', () => {
  it('displayName is Pagination', () => {
    expect(Pagination.displayName).toBe('Pagination');
  });
});
