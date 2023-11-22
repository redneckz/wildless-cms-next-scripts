#!/usr/bin/env node

import process from 'process';
import { dotenv } from './scripts/utils/dotenv.js';
import { timed } from './scripts/utils/time.js';

dotenv();

const [, , cmd] = process.argv;

const task = timed(cmd, (await import(`./scripts/${cmd}.js`)).default);

await task({
  isMobile: process.argv.includes('--mobile'),
  sitemap: process.argv.includes('--sitemap'),
});
