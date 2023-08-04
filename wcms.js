#!/usr/bin/env node

import process from 'process';

const [, , cmd] = process.argv;

const task = await import(`./scripts/${cmd}.js`);

await task.default({
  isMobile: process.argv.includes('--mobile'),
  sitemap: process.argv.includes('--sitemap'),
});
