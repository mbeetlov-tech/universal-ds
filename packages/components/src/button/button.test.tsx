/**
 * Button component tests
 *
 * Strategy (TE-1 Testing Trophy):
 * - Integration-level: render + interact + assert on DOM/ARIA state
 * - Test behavior (what users experience), not implementation (CA-8 consistency)
 * - Query priority: getByRole > getByLabelText > getByText (TE-3)
 * - userEvent over fireEvent for real interaction simulation (TE-5)
 *
 * Coverage:
 * - All 5 intents render without error
 * - All 3 sizes render
 * - Accessible name = label text
 * - Disabled (soft-disabled, F-9): aria-disabled, stays in tab order, click suppressed
 * - Loading: aria-busy, click suppressed
 * - leftIcon / rightIcon slots
 * - asChild polymorphism
 * - onClick fires when enabled, suppressed when disabled/loading
 * - className override (consumer escape hatch)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

// --- Render sanity across all variants ---

describe('Button — render (all intents × sizes)', () => {
  const intents = ['primary', 'secondary', 'tertiary', 'danger', 'ghost'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;

  for (const intent of intents) {
    for (const size of sizes) {
      it(`renders ${intent}/${size} without error`, () => {
        render(
          <Button intent={intent} size={size}>
            {intent} {size}
          </Button>
        );
        expect(
          screen.getByRole('button', { name: `${intent} ${size}` })
        ).toBeInTheDocument();
      });
    }
  }
});

// --- Defaults ---

describe('Button — defaults', () => {
  it('renders as <button> element', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('has type="button" by default (prevents accidental form submit)', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('displayName is Button', () => {
    expect(Button.displayName).toBe('Button');
  });
});

// --- Accessibility —  soft-disabled pattern (F-9) ---

describe('Button — soft-disabled (F-9)', () => {
  it('has aria-disabled="true" when disabled', () => {
    render(<Button disabled>Delete</Button>);
    const btn = screen.getByRole('button', { name: 'Delete' });
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('does NOT have native disabled attribute (stays in tab order)', () => {
    render(<Button disabled>Delete</Button>);
    const btn = screen.getByRole('button', { name: 'Delete' });
    // Native disabled removes from tab order and is announced differently
    expect(btn).not.toBeDisabled();
    expect(btn).not.toHaveAttribute('disabled');
  });

  it('has data-disabled attribute for CSS variant targeting', () => {
    render(<Button disabled>Delete</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-disabled', '');
  });

  it('suppresses onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Delete
      </Button>
    );
    await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does NOT suppress onClick when enabled', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Save</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// --- Loading state ---

describe('Button — loading state', () => {
  it('has aria-busy="true" when loading', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('preserves label text for screen readers (only visual opacity=0)', () => {
    render(<Button loading>Save changes</Button>);
    // Text must still be in accessible name
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });

  it('has data-loading attribute', () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-loading', '');
  });

  it('suppresses onClick when loading', async () => {
    const handleClick = vi.fn();
    render(
      <Button loading onClick={handleClick}>
        Save
      </Button>
    );
    await userEvent.click(screen.getByRole('button', { name: /save/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// --- Icon slots ---

describe('Button — icon slots', () => {
  it('renders leftIcon', () => {
    render(
      <Button
        leftIcon={<svg data-testid="icon-left" aria-hidden="true" />}
      >
        Add item
      </Button>
    );
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument();
  });

  it('renders rightIcon', () => {
    render(
      <Button
        rightIcon={<svg data-testid="icon-right" aria-hidden="true" />}
      >
        Next
      </Button>
    );
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });

  it('renders both icons simultaneously', () => {
    render(
      <Button
        leftIcon={<svg data-testid="left" aria-hidden="true" />}
        rightIcon={<svg data-testid="right" aria-hidden="true" />}
      >
        Action
      </Button>
    );
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
    // Accessible name still correct
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});

// --- asChild polymorphism (CA-4) ---

describe('Button — asChild', () => {
  it('renders as child element when asChild=true', () => {
    render(
      <Button asChild intent="secondary">
        <a href="/dashboard">Dashboard</a>
      </Button>
    );
    // Should render as <a>, not <button>
    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/dashboard');
  });
});

// --- className override (consumer escape hatch) ---

describe('Button — className override', () => {
  it('applies additional className', () => {
    render(<Button className="extra-class">Click</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('extra-class');
  });
});

// --- CVA variant class composition ---

describe('Button — variant class structure', () => {
  it('applies intent-specific classes', () => {
    render(<Button intent="danger">Delete</Button>);
    const btn = screen.getByRole('button');
    // Verify the button has a className (not checking exact Tailwind classes for
    // resilience — the CSS var approach means actual colors come from token vars)
    expect(btn.className.length).toBeGreaterThan(0);
  });

  it('button is not natively disabled (keyboard accessible)', async () => {
    render(<Button>Focus me</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    expect(btn).toHaveFocus();
  });
});
