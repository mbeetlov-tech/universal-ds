/**
 * Card tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './card';

describe('Card — render (all variants)', () => {
  const paddings = ['sm', 'md', 'lg'] as const;
  const styles = ['elevated', 'outlined', 'filled'] as const;

  for (const padding of paddings) {
    for (const style of styles) {
      it(`renders padding=${padding} cardStyle=${style}`, () => {
        const { container } = render(
          <Card padding={padding} cardStyle={style}>
            <p>Content</p>
          </Card>
        );
        expect(container.querySelector('div')).toBeInTheDocument();
        expect(container.textContent).toContain('Content');
      });
    }
  }
});

describe('Card — compound parts', () => {
  it('renders Card.Header', () => {
    render(
      <Card>
        <Card.Header title="Card Title" subtitle="Subtitle here" />
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle here')).toBeInTheDocument();
  });

  it('renders Card.Body', () => {
    render(
      <Card>
        <Card.Body>
          <p>Body content</p>
        </Card.Body>
      </Card>
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('renders Card.Footer', () => {
    render(
      <Card>
        <Card.Footer>
          <button>Save</button>
          <button>Cancel</button>
        </Card.Footer>
      </Card>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders Card.Divider', () => {
    const { container } = render(
      <Card>
        <Card.Header title="Title" />
        <Card.Divider />
        <Card.Body><p>Body</p></Card.Body>
      </Card>
    );
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('renders full anatomy', () => {
    render(
      <Card>
        <Card.Header title="Settings" subtitle="Account preferences" />
        <Card.Divider />
        <Card.Body><p>Form content</p></Card.Body>
        <Card.Divider />
        <Card.Footer>
          <button>Save</button>
        </Card.Footer>
      </Card>
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Form content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});

describe('Card — defaults', () => {
  it('displayName is Card', () => {
    expect(Card.displayName).toBe('Card');
  });
});
