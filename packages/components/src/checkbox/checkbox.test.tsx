/**
 * Checkbox tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox';

describe('Checkbox — render', () => {
  it('renders with label', () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
  });

  it('renders without label (no crash)', () => {
    const { container } = render(<Checkbox />);
    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
  });

  for (const size of ['sm', 'md', 'lg'] as const) {
    it(`renders size=${size}`, () => {
      render(<Checkbox size={size} label={`Size ${size}`} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  }
});

describe('Checkbox — interaction', () => {
  it('calls onChange with true when checked', async () => {
    const handleChange = vi.fn();
    render(<Checkbox label="Accept" onChange={handleChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when unchecked', async () => {
    const handleChange = vi.fn();
    render(
      <Checkbox label="Accept" defaultChecked onChange={handleChange} />
    );
    await userEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledWith(false);
  });
});

describe('Checkbox — disabled', () => {
  it('is disabled when disabled=true', () => {
    render(<Checkbox label="Option" disabled />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});

describe('Checkbox — helper text', () => {
  it('renders helper text', () => {
    render(<Checkbox label="Subscribe" helper="We won't spam you" />);
    expect(screen.getByText("We won't spam you")).toBeInTheDocument();
  });

  it('links helper via aria-describedby', () => {
    render(<Checkbox label="Subscribe" helper="Helper text here" />);
    const checkbox = screen.getByRole('checkbox');
    const helperId = checkbox.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    expect(document.getElementById(helperId!)).toHaveTextContent('Helper text here');
  });
});

describe('Checkbox — indeterminate', () => {
  it('sets indeterminate DOM property', () => {
    render(<Checkbox label="Select all" indeterminate />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });
});

describe('Checkbox — defaults', () => {
  it('displayName is Checkbox', () => {
    expect(Checkbox.displayName).toBe('Checkbox');
  });
});
