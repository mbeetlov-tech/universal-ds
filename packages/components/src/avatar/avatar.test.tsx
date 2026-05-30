/**
 * Avatar tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from './avatar';

describe('Avatar — render (sizes)', () => {
  for (const size of ['xs', 'sm', 'md', 'lg', 'xl'] as const) {
    it(`renders size=${size}`, () => {
      render(<Avatar size={size} alt="Test user" name="Test User" />);
      expect(screen.getByLabelText('Test user')).toBeInTheDocument();
    });
  }
});

describe('Avatar — types', () => {
  it('renders initials from name', () => {
    render(<Avatar alt="John Doe" name="John Doe" type="initials" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders explicit initials override', () => {
    render(<Avatar alt="User" initials="AB" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    render(<Avatar alt="Alex Morgan" src="/alex.jpg" type="image" />);
    expect(screen.getByRole('img', { name: 'Alex Morgan' })).toBeInTheDocument();
  });

  it('renders icon type without crash', () => {
    render(<Avatar alt="System account" type="icon" />);
    expect(screen.getByLabelText('System account')).toBeInTheDocument();
  });
});

describe('Avatar — status', () => {
  it('renders status dot when status is provided', () => {
    const { container } = render(
      <Avatar alt="Alex" name="Alex" status="online" />
    );
    // Status dot is aria-hidden, not a role — check for its CSS class presence
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });
});

describe('Avatar — initials derivation', () => {
  it('derives single-word initials', () => {
    render(<Avatar alt="alice" name="Alice" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('derives two-word initials', () => {
    render(<Avatar alt="jane doe" name="Jane Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });
});

describe('Avatar — defaults', () => {
  it('displayName is Avatar', () => {
    expect(Avatar.displayName).toBe('Avatar');
  });
});
