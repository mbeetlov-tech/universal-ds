/**
 * Spinner tests
 * Strategy: behavior + a11y (TE-1, TE-2, TE-3)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';

describe('Spinner — render', () => {
  const sizes = ['sm', 'md', 'lg'] as const;
  for (const size of sizes) {
    it(`renders size=${size} without error`, () => {
      const { container } = render(<Spinner size={size} aria-label="Loading" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  }
});

describe('Spinner — accessibility (standalone)', () => {
  it('has role="status" when aria-label is provided', () => {
    render(<Spinner size="md" aria-label="Loading" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has the provided aria-label', () => {
    render(<Spinner aria-label="Saving changes" />);
    expect(screen.getByLabelText('Saving changes')).toBeInTheDocument();
  });
});

describe('Spinner — accessibility (decorative)', () => {
  it('has aria-hidden="true" when no aria-label', () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('does NOT have role="status" when decorative', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('[role="status"]')).not.toBeInTheDocument();
  });
});

describe('Spinner — defaults', () => {
  it('displayName is Spinner', () => {
    expect(Spinner.displayName).toBe('Spinner');
  });

  it('applies className override', () => {
    const { container } = render(<Spinner className="custom-class" />);
    // SVG className is an SVGAnimatedString — use getAttribute instead
    expect(container.querySelector('svg')?.getAttribute('class')).toContain('custom-class');
  });
});
