#!/usr/bin/env node

import process from 'process';
import { timed } from './scripts/utils/time.js';

const [, , cmd] = process.argv;

const task = timed(cmd, (await import(`./scripts/${cmd}.js`)).default);

await task(
  Object.fromEntries(
    process.argv.filter((_) => _.startsWith('--')).map((_) => [_.substring('--'.length), true]),
  ),
);
