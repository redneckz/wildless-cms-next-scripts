#!/usr/bin/env node

import process from 'process';

const [, , cmd] = process.argv;

const task = await import(`./scripts/${cmd}.js`);

switch (cmd) {
  case 'build':
    await task.default(process.argv.includes('--mobile'), process.argv.includes('--no-index'));
    break;
  default:
    await task.default();
}
