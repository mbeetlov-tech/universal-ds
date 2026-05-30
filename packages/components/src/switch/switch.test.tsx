/**
 * Switch tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './switch';

describe('Switch — render', () => {
  it('renders with label', () => {
    render(<Switch label="Email notifications" />);
    expect(screen.getByRole('switch', { name: 'Email notifications' })).toBeInTheDocument();
  });

  for (const size of ['sm', 'md'] as const) {
    it(`renders size=${size}`, () => {
      render(<Switch size={size} label={`Size ${size}`} />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
  }
});

describe('Switch — aria-checked', () => {
  it('is aria-checked=false by default', () => {
    render(<Switch label="Toggle" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('is aria-checked=true when checked', () => {
    render(<Switch label="Toggle" checked onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});

describe('Switch — interaction', () => {
  it('calls onChange on click', async () => {
    const handleChange = vi.fn();
    render(<Switch label="Toggle" onChange={handleChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('toggles off → on → off', async () => {
    const handleChange = vi.fn();
    render(<Switch label="Toggle" onChange={handleChange} />);
    const sw = screen.getByRole('switch');
    await userEvent.click(sw);
    expect(handleChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(sw);
    expect(handleChange).toHaveBeenLastCalledWith(false);
  });
});

describe('Switch — disabled', () => {
  it('is disabled when disabled=true', () => {
    render(<Switch label="Toggle" disabled />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });
});

describe('Switch — helper text', () => {
  it('renders helper text', () => {
    render(<Switch label="Auto-save" helper="Saves every 30 seconds" />);
    expect(screen.getByText('Saves every 30 seconds')).toBeInTheDocument();
  });
});

describe('Switch — defaults', () => {
  it('displayName is Switch', () => {
    expect(Switch.displayName).toBe('Switch');
  });
});
