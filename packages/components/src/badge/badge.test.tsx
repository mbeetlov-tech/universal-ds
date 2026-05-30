/**
 * Badge tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Badge } from './badge';

describe('Badge — render (all variants)', () => {
  const sizes = ['sm', 'md'] as const;
  const styles = ['solid', 'subtle', 'outlined'] as const;
  const intents = ['neutral', 'info', 'success', 'warning', 'danger', 'primary'] as const;

  for (const size of sizes) {
    for (const style of styles) {
      for (const intent of intents) {
        it(`renders ${size}/${style}/${intent}`, () => {
          const { container } = render(
            <Badge size={size} badgeStyle={style} intent={intent}>
              Label
            </Badge>
          );
          expect(container.querySelector('span')).toBeInTheDocument();
          expect(container.textContent).toContain('Label');
        });
      }
    }
  }
});

describe('Badge — closable', () => {
  it('renders close button when closable=true', () => {
    render(<Badge closable onClose={() => {}}>Active</Badge>);
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  it('calls onClose when X is clicked', async () => {
    const handleClose = vi.fn();
    render(<Badge closable onClose={handleClose}>Active</Badge>);
    await userEvent.click(screen.getByRole('button', { name: /remove/i }));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('close button aria-label includes badge label', () => {
    render(<Badge closable onClose={() => {}}>Status: Active</Badge>);
    expect(screen.getByRole('button', { name: 'Remove Status: Active' })).toBeInTheDocument();
  });
});

describe('Badge — icons', () => {
  it('renders iconLeft', () => {
    render(
      <Badge iconLeft={<svg data-testid="icon-left" />}>Label</Badge>
    );
    expect(screen.getByTestId('icon-left')).toBeInTheDocument();
  });

  it('renders iconRight', () => {
    render(
      <Badge iconRight={<svg data-testid="icon-right" />}>Label</Badge>
    );
    expect(screen.getByTestId('icon-right')).toBeInTheDocument();
  });
});

describe('Badge — defaults', () => {
  it('displayName is Badge', () => {
    expect(Badge.displayName).toBe('Badge');
  });

  it('renders children', () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });
});
