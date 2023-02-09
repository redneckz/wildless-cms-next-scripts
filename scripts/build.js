import { execSync } from 'child_process';
import { BUILD_DIR, NEXT_DIR, PAGES_DIR } from './dirs.js';
import { rmrf } from './utils/rmrf.js';
import generate from './generate.js';
import { gitClean } from './utils/gitClean.js';

export default async function build(isMobile, noIndex) {
  await cleanup();
  await generate(isMobile, noIndex);
  execSync('npx next build', { stdio: 'inherit' });
  execSync(`npx next export -o ./${BUILD_DIR}/${isMobile ? 'mobile/' : ''}`, { stdio: 'inherit' });
}

async function cleanup() {
  await rmrf(NEXT_DIR);
  await gitClean(PAGES_DIR);
}
