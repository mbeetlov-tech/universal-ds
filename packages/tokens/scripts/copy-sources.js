#!/usr/bin/env node
// Копирует source JSON из knowledge/ в src/ перед build'ом.
// knowledge/design-system/tokens/ — owned by ds-architect, protected by DS-write-guard.
// Этот скрипт — read-only consumer, никогда не пишет в knowledge/.

import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Canonical source: knowledge/ is 4 levels up from packages/tokens/ (code/packages/tokens → code → internal-universal-ds → knowledge)
const src = resolve(__dirname, '../../../../knowledge/design-system/tokens');
const dest = resolve(__dirname, '../src');

mkdirSync(dest, { recursive: true });

copyFileSync(resolve(src, 'tokens.json'), resolve(dest, 'tokens.json'));
copyFileSync(resolve(src, 'tokens.dark.json'), resolve(dest, 'tokens.dark.json'));

console.log('Copied tokens.json + tokens.dark.json → packages/tokens/src/');
