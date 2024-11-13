import createInfoFile from './createInfoFile.js';
import removeDetached from './removeDetached.js';
import { BUILD_DIR, CONTENT_DIR, NEXT_DIR, PAGES_DIR, PUBLIC_DIR } from './utils/env.js';
import { gitClean } from './utils/gitClean.js';
import { rmrf } from './utils/rmrf.js';

export default async function prebuild({ ssg }) {
  await rmrf(BUILD_DIR, NEXT_DIR);
  await gitClean(CONTENT_DIR, PUBLIC_DIR, PAGES_DIR);

  try {
    if (ssg) {
      await removeDetached();
    }
  } catch (ex) {
    // Do nothing
  }

  await createInfoFile();
}
