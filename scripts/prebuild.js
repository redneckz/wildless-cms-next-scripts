import { BUILD_DIR, NEXT_DIR, PUBLIC_DIR } from './utils/env.js';
import { gitClean } from './utils/gitClean.js';
import { rmrf } from './utils/rmrf.js';

export default async function prebuild() {
  await rmrf(BUILD_DIR, NEXT_DIR);
  await gitClean(PUBLIC_DIR);
}
