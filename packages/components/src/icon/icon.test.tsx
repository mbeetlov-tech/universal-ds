/**
 * Icon tests
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Icon } from './icon';

const TestSvg = () => (
  <svg data-testid="test-icon" viewBox="0 0 24 24" fill="none" />
);

describe('Icon — render', () => {
  const sizes = [12, 16, 20, 24] as const;
  for (const size of sizes) {
    it(`renders size=${size} without error`, () => {
      const { container } = render(
        <Icon size={size}>
          <TestSvg />
        </Icon>
      );
      expect(container.querySelector('span')).toBeInTheDocument();
    });
  }
});

describe('Icon — accessibility', () => {
  it('wrapper has aria-hidden="true" (decorative)', () => {
    const { container } = render(
      <Icon>
        <TestSvg />
      </Icon>
    );
    expect(container.querySelector('span')).toHaveAttribute('aria-hidden', 'true');
  });
});

describe('Icon — defaults', () => {
  it('displayName is Icon', () => {
    expect(Icon.displayName).toBe('Icon');
  });
});
