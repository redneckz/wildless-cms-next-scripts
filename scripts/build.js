import { execSync } from 'child_process';
import { NEXT_DIR, PAGES_DIR } from './dirs.js';
import generate from './generate.js';
import stats from './stats.js';
import { gitClean } from './utils/gitClean.js';
import { rmrf } from './utils/rmrf.js';

export default async function build({ isMobile, sitemap }) {
  await cleanup();

  await generate({ isMobile });

  try {
    await stats();
  } catch (ex) {
    console.warn('Failed to generate stats', ex);
  }

  execSync('npx next build', { stdio: 'inherit' });
  if (sitemap) {
    execSync('npx next-sitemap', { stdio: 'inherit' });
  }
}

async function cleanup() {
  await rmrf(NEXT_DIR);
  await gitClean(PAGES_DIR);
}
