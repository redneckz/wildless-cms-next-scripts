#!/usr/bin/env node

import process from 'process';

const [, , cmd] = process.argv;

const task = await import(`./scripts/${cmd}.js`);
await task.default(process.argv.includes('--mobile'));
