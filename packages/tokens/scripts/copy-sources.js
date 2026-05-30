#!/usr/bin/env node
// Копирует source JSON из knowledge/ в src/ перед build'ом — ONLY if canonical exists.
// knowledge/design-system/tokens/ — owned by ds-architect, protected by DS-write-guard.
// Этот скрипт — read-only consumer, никогда не пишет в knowledge/.
//
// In CI / standalone deploy (where knowledge/ outside repo scope), this script
// gracefully skips — uses existing src/*.json snapshot committed to repo.

import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Canonical source: knowledge/ is 4 levels up from packages/tokens/ (code/packages/tokens → code → internal-universal-ds → knowledge)
const src = resolve(__dirname, '../../../../knowledge/design-system/tokens');
const dest = resolve(__dirname, '../src');

const canonicalJson = resolve(src, 'tokens.json');

if (!existsSync(canonicalJson)) {
  console.log('Canonical tokens.json not found (standalone repo / CI deploy) — using committed src/ snapshot.');
  process.exit(0);
}

mkdirSync(dest, { recursive: true });

copyFileSync(canonicalJson, resolve(dest, 'tokens.json'));
copyFileSync(resolve(src, 'tokens.dark.json'), resolve(dest, 'tokens.dark.json'));

console.log('Copied tokens.json + tokens.dark.json → packages/tokens/src/');
