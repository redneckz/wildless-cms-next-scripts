#!/usr/bin/env node

import process from 'process';

const [, , cmd] = process.argv;

const task = await import(`./scripts/${cmd}.js`);

await task.default({
  isMobile: process.argv.includes('--mobile'),
  noIndex: process.argv.includes('--no-index'),
  sitemap: process.argv.includes('--sitemap'),
});
