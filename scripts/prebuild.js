import copyfiles from 'copyfiles';
import rimraf from 'rimraf';
import { CleanOptions, simpleGit } from 'simple-git';
import { promisify } from 'util';
import { BUILD_DIR, CONTENT_DIR, NEXT_DIR, PAGES_DIR, PUBLIC_DIR } from './dirs.js';

const rmrf = promisify(rimraf);
const copy = promisify(copyfiles);

export default async function prebuild() {
  await rmrf(BUILD_DIR);
  await cleanup();

  await copy([`${CONTENT_DIR}/wcms-resources/**/*`, PUBLIC_DIR], 1);
}

export async function cleanup() {
  await rmrf(NEXT_DIR);
  try {
    await simpleGit().clean(
      [CleanOptions.RECURSIVE, CleanOptions.FORCE, CleanOptions.IGNORED_ONLY],
      [PUBLIC_DIR, PAGES_DIR],
    );
  } catch (ex) {
    // Do nothing
  }
}
