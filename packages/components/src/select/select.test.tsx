/**
 * Select tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './select';

const OPTIONS = [
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany' },
];

describe('Select — render', () => {
  it('renders with label', () => {
    render(<Select label="Country" options={OPTIONS} />);
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  for (const size of ['sm', 'md', 'lg'] as const) {
    it(`renders size=${size}`, () => {
      render(<Select size={size} label={`Size ${size}`} options={OPTIONS} />);
      expect(screen.getByLabelText(`Size ${size}`)).toBeInTheDocument();
    });
  }
});

describe('Select — helper text', () => {
  it('renders helper text', () => {
    render(<Select label="Country" helper="Required for shipping" options={OPTIONS} />);
    expect(screen.getByText('Required for shipping')).toBeInTheDocument();
  });
});

describe('Select — error state', () => {
  it('has aria-invalid in error state', () => {
    render(<Select label="Country" state="error" helper="Required" options={OPTIONS} />);
    expect(screen.getByLabelText('Country')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('Select — disabled', () => {
  it('is disabled when disabled=true', () => {
    render(<Select label="Country" disabled options={OPTIONS} />);
    expect(screen.getByLabelText('Country')).toBeDisabled();
  });
});

describe('Select — interaction', () => {
  it('calls onChange on selection', async () => {
    const handleChange = vi.fn();
    render(<Select label="Country" options={OPTIONS} onChange={handleChange} />);
    await userEvent.selectOptions(screen.getByLabelText('Country'), 'us');
    expect(handleChange).toHaveBeenCalled();
  });
});

describe('Select — defaults', () => {
  it('displayName is Select', () => {
    expect(Select.displayName).toBe('Select');
  });
});
