/**
 * IconButton tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from './icon-button';

const TestIcon = () => <svg data-testid="test-icon" viewBox="0 0 24 24" aria-hidden="true" />;

describe('IconButton — render (variants)', () => {
  const intents = ['primary', 'secondary', 'ghost', 'danger', 'danger-ghost'] as const;
  const sizes = ['2xs', 'xs', 'sm', 'md', 'lg'] as const;

  for (const intent of intents) {
    it(`renders intent=${intent} without error`, () => {
      render(
        <IconButton intent={intent} aria-label={`${intent} action`}>
          <TestIcon />
        </IconButton>
      );
      expect(screen.getByRole('button', { name: `${intent} action` })).toBeInTheDocument();
    });
  }

  for (const size of sizes) {
    it(`renders size=${size} without error`, () => {
      render(
        <IconButton size={size} aria-label={`size ${size}`}>
          <TestIcon />
        </IconButton>
      );
      expect(screen.getByRole('button', { name: `size ${size}` })).toBeInTheDocument();
    });
  }
});

describe('IconButton — aria-label (mandatory)', () => {
  it('uses aria-label as the accessible name', () => {
    render(
      <IconButton aria-label="Close dialog">
        <TestIcon />
      </IconButton>
    );
    expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
  });
});

describe('IconButton — soft-disabled (F-9)', () => {
  it('has aria-disabled="true" when disabled', () => {
    render(
      <IconButton disabled aria-label="Delete">
        <TestIcon />
      </IconButton>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('stays focusable when disabled (no native disabled)', () => {
    render(
      <IconButton disabled aria-label="Delete">
        <TestIcon />
      </IconButton>
    );
    expect(screen.getByRole('button')).not.toBeDisabled();
  });

  it('suppresses onClick when disabled', async () => {
    const handleClick = vi.fn();
    render(
      <IconButton disabled aria-label="Delete" onClick={handleClick}>
        <TestIcon />
      </IconButton>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('IconButton — loading state', () => {
  it('has aria-busy="true" when loading', () => {
    render(
      <IconButton loading aria-label="Send message">
        <TestIcon />
      </IconButton>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('accessible name is preserved during loading', () => {
    render(
      <IconButton loading aria-label="Send message">
        <TestIcon />
      </IconButton>
    );
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument();
  });

  it('suppresses onClick when loading', async () => {
    const handleClick = vi.fn();
    render(
      <IconButton loading aria-label="Send" onClick={handleClick}>
        <TestIcon />
      </IconButton>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('IconButton — defaults', () => {
  it('displayName is IconButton', () => {
    expect(IconButton.displayName).toBe('IconButton');
  });

  it('has type="button" by default', () => {
    render(
      <IconButton aria-label="Action">
        <TestIcon />
      </IconButton>
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });
});
