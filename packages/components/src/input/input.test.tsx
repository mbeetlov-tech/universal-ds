/**
 * Input tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './input';

describe('Input — render (sizes)', () => {
  for (const size of ['sm', 'md', 'lg'] as const) {
    it(`renders size=${size}`, () => {
      render(<Input label="Email" size={size} />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });
  }
});

describe('Input — label association', () => {
  it('associates label with input via htmlFor/id', () => {
    render(<Input label="Username" />);
    const input = screen.getByLabelText('Username');
    expect(input).toBeInTheDocument();
    expect(input.tagName.toLowerCase()).toBe('input');
  });

  it('uses provided id', () => {
    render(<Input label="Email" id="email-field" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('id', 'email-field');
  });
});

describe('Input — helper text', () => {
  it('renders helper text', () => {
    render(<Input label="Email" helper="Enter a valid email" />);
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('links helper to input via aria-describedby', () => {
    render(<Input label="Email" helper="Enter a valid email" />);
    const input = screen.getByLabelText('Email');
    const helperId = input.getAttribute('aria-describedby');
    expect(helperId).toBeTruthy();
    const helperEl = document.getElementById(helperId!);
    expect(helperEl).toHaveTextContent('Enter a valid email');
  });
});

describe('Input — error state', () => {
  it('has aria-invalid="true" in error state', () => {
    render(<Input label="Email" state="error" helper="Invalid email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does NOT have aria-invalid in default state', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
  });
});

describe('Input — disabled (soft-disabled F-9)', () => {
  it('has aria-disabled="true"', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-disabled', 'true');
  });

  it('is not natively disabled (stays in tab order)', () => {
    render(<Input label="Email" disabled />);
    expect(screen.getByLabelText('Email')).not.toBeDisabled();
  });

  it('suppresses onChange when disabled', async () => {
    const handleChange = vi.fn();
    render(<Input label="Email" disabled onChange={handleChange} />);
    // Typing should not trigger onChange
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    input.focus();
    await userEvent.keyboard('test');
    // With soft-disabled we intercept onChange
    expect(handleChange).not.toHaveBeenCalled();
  });
});

describe('Input — read-only', () => {
  it('has readOnly attribute', () => {
    render(<Input label="API Key" readOnly value="abc123" onChange={() => {}} />);
    expect(screen.getByLabelText('API Key')).toHaveAttribute('readonly');
  });
});

describe('Input — defaults', () => {
  it('displayName is Input', () => {
    expect(Input.displayName).toBe('Input');
  });
});

describe('Input — action button slot', () => {
  it('renders actionButton inside the field', () => {
    render(
      <Input
        label="Search"
        actionButton={<button aria-label="Search">🔍</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });
});
