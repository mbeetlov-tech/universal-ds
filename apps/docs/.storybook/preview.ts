import type { Preview } from '@storybook/react';

/**
 * Global Storybook preview config.
 *
 * Token CSS is imported here so all stories render with correct UDS tokens.
 * In production apps, consumers import '@uds/tokens/css' in their app root.
 */
// Tailwind v4 utilities — must load before token CSS so utility classes are available
// @ts-expect-error — CSS import handled by Vite
import './tailwind.css';
// @ts-expect-error — CSS import handled by Vite
import '@uds/tokens/css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // a11y addon config — axe rules configuration
    a11y: {
      config: {
        rules: [
          {
            // Storybook docs iframes may fail this; suppress at app level, not component level
            id: 'landmark-one-main',
            enabled: false,
          },
        ],
      },
    },
    // Dark mode via data-theme attribute
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F8FAFC' }, // --uds-color-background-page light
        { name: 'dark', value: '#020617' },   // --uds-color-background-page dark
      ],
    },
  },
  // Theme decorator — applies data-theme="dark" when dark background selected
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === '#020617';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
      }
      return Story();
    },
  ],
};

export default preview;
