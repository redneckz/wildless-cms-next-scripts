import { execSync } from 'child_process';
import { BUILD_DIR } from './dirs.js';
import generate from './generate.js';
import { cleanup } from './prebuild.js';

export default async function build(isMobile, noIndex) {
  await cleanup();
  await generate(isMobile, noIndex);
  execSync('npx next build', { stdio: 'inherit' });
  execSync(`npx next export -o ./${BUILD_DIR}/${isMobile ? 'mobile/' : ''}`, { stdio: 'inherit' });
}
