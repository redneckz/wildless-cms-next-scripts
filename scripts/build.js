import { execSync } from 'child_process';
import stats from './stats.js';

export default async function build({ sitemap }) {
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
