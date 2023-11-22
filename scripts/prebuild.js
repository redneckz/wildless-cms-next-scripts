import copyfiles from 'copyfiles';
import { promisify } from 'util';
import createInfoFile from './createInfoFile.js';
import { BUILD_DIR, CONTENT_DIR, NEXT_DIR, PUBLIC_DIR } from './dirs.js';
import removeDetached from './removeDetached.js';
import { gitClean } from './utils/gitClean.js';
import { rmrf } from './utils/rmrf.js';

export default async function prebuild() {
  await rmrf(BUILD_DIR, NEXT_DIR);
  await gitClean(PUBLIC_DIR);

  try {
    await removeDetached();
  } catch (ex) {
    // Do nothing
  }

  await createInfoFile();
}
