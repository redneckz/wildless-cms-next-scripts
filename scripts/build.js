import { execSync } from 'child_process';
import copyExtra from './extra.js';
import generate from './generate.js';
import stats from './stats.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; //? Only for build

export default async function build({ gen, extra }) {
  try {
    await stats();
  } catch (ex) {
    console.warn('Failed to generate stats', ex);
  }

  if (gen) {
    await generate();
  }

  if (extra) {
    await copyExtra();
  }

  execSync('npx next build', { stdio: 'inherit' });
}
