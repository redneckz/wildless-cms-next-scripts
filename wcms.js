#!/usr/bin/env node

import process from 'process';
import { timed } from './scripts/utils/time.js';

const [, , cmd] = process.argv;

const task = timed(cmd, (await import(`./scripts/${cmd}.js`)).default);

await task({
  isMobile: process.argv.includes('--mobile'),
  sitemap: process.argv.includes('--sitemap'),
  gen: process.argv.includes('--gen'),
  extra: process.argv.includes('--extra'),
  ssg: process.argv.includes('--ssg'),
});
