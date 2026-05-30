import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'button/index': 'src/button/index.ts',
    'spinner/index': 'src/spinner/index.ts',
    'icon/index': 'src/icon/index.ts',
    'icon-button/index': 'src/icon-button/index.ts',
    'input/index': 'src/input/index.ts',
    'checkbox/index': 'src/checkbox/index.ts',
    'switch/index': 'src/switch/index.ts',
    'badge/index': 'src/badge/index.ts',
    'avatar/index': 'src/avatar/index.ts',
    'card/index': 'src/card/index.ts',
    'tabs/index': 'src/tabs/index.ts',
    'sidebar-item/index': 'src/sidebar-item/index.ts',
    'sidebar/index': 'src/sidebar/index.ts',
    'menu-item/index': 'src/menu-item/index.ts',
    'menu/index': 'src/menu/index.ts',
    'select/index': 'src/select/index.ts',
    'table/index': 'src/table/index.ts',
    'pagination/index': 'src/pagination/index.ts',
    'tooltip/index': 'src/tooltip/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Treeshake — consumers bundle only what they import
  treeshake: true,
  // shadcn-style: components are meant to be copied, but also installable
  banner: {
    js: '// @uds/components — Universal DS React components',
  },
});
