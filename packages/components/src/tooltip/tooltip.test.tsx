/**
 * Tooltip tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip } from './tooltip';

describe('Tooltip — render', () => {
  it('renders children', () => {
    render(
      <Tooltip content="Edit">
        <button>Edit button</button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'Edit button' })).toBeInTheDocument();
  });

  it('renders tooltip with role="tooltip"', () => {
    render(
      <Tooltip content="Edit">
        <button>Edit button</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('tooltip text is rendered', () => {
    render(
      <Tooltip content="Close dialog">
        <button>X</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Close dialog');
  });
});

describe('Tooltip — aria-describedby', () => {
  it('trigger has aria-describedby pointing to tooltip', () => {
    render(
      <Tooltip content="Save">
        <button>💾</button>
      </Tooltip>
    );
    const button = screen.getByRole('button');
    const tooltipId = button.getAttribute('aria-describedby');
    expect(tooltipId).toBeTruthy();
    expect(screen.getByRole('tooltip')).toHaveAttribute('id', tooltipId);
  });
});

describe('Tooltip — sizes and positions', () => {
  for (const size of ['sm', 'md'] as const) {
    it(`renders size=${size}`, () => {
      render(
        <Tooltip size={size} content={`${size} tooltip`}>
          <button>Trigger</button>
        </Tooltip>
      );
      expect(screen.getByRole('tooltip')).toHaveTextContent(`${size} tooltip`);
    });
  }

  for (const position of ['top', 'right', 'bottom', 'left'] as const) {
    it(`renders position=${position}`, () => {
      render(
        <Tooltip position={position} content="Tooltip">
          <button>Trigger</button>
        </Tooltip>
      );
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  }
});

describe('Tooltip — title + description', () => {
  it('renders both title and description', () => {
    render(
      <Tooltip title="Save to library" description="Saves to shared library">
        <button>Save</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Save to library');
    expect(screen.getByRole('tooltip')).toHaveTextContent('Saves to shared library');
  });
});

describe('Tooltip — defaults', () => {
  it('displayName is Tooltip', () => {
    expect(Tooltip.displayName).toBe('Tooltip');
  });
});
