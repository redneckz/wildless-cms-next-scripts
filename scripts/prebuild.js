import copyfiles from 'copyfiles';
import { promisify } from 'util';
import { BUILD_DIR, CONTENT_DIR, NEXT_DIR, PAGES_DIR, PUBLIC_DIR } from './dirs.js';
import { gitClean } from './utils/gitClean.js';
import { rmrf } from './utils/rmrf.js';

const copy = promisify(copyfiles);

export default async function prebuild() {
  await rmrf(BUILD_DIR, NEXT_DIR);
  await gitClean(PUBLIC_DIR, PAGES_DIR);

  await copy([`${CONTENT_DIR}/wcms-resources/**/*`, PUBLIC_DIR], 1);
}
