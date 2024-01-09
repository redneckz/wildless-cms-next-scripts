import copyfiles from 'copyfiles';
import { promisify } from 'util';
import createInfoFile from './createInfoFile.js';
import {
  BUILD_DIR,
  CONTENT_DIR,
  NEXT_DIR,
  PAGES_DIR,
  PORTAL_RESOURCES_DIR,
  PUBLIC_DIR,
  WCMS_RESOURCES_DIR,
} from './dirs.js';
import removeDetached from './removeDetached.js';
import { gitClean } from './utils/gitClean.js';
import { rmrf } from './utils/rmrf.js';

const copy = promisify(copyfiles);

export default async function prebuild() {
  await rmrf(BUILD_DIR, NEXT_DIR);
  await gitClean(CONTENT_DIR, PUBLIC_DIR, PAGES_DIR);

  try {
    await removeDetached();
  } catch (ex) {
    // Do nothing
  }

  await createInfoFile();

  await copy([`${WCMS_RESOURCES_DIR}/**/*`, PUBLIC_DIR], 1);
  await copy([`${PORTAL_RESOURCES_DIR}/**/*`, PUBLIC_DIR], 1);
}
