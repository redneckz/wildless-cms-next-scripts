import { execSync } from 'child_process';
import copyExtra from './extra.js';
import generate from './generate.js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; //? Only for build

export default async function build({ gen, extra }) {
  if (gen) {
    await generate();
  }

  if (extra) {
    await copyExtra();
  }

  execSync('npx next build', { stdio: 'inherit' });
}
