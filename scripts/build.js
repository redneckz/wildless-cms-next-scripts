import { execSync } from 'child_process';
import rimraf from 'rimraf';
import { promisify } from 'util';
import { BUILD_DIR } from './dirs.js';
import generate from './generate.js';

const rmrf = promisify(rimraf);

export default async function build(isMobile) {
  await rmrf('./.next');
  await generate(isMobile);
  execSync('npx next build', { stdio: 'inherit' });
  execSync(`npx next export -o ./${BUILD_DIR}/${isMobile ? 'mobile/' : ''}`, { stdio: 'inherit' });
}
