import copyfiles from 'copyfiles';
import rimraf from 'rimraf';
import { CleanOptions, simpleGit } from 'simple-git';
import { promisify } from 'util';
import { BUILD_DIR, CONTENT_DIR, PUBLIC_DIR } from './dirs.js';

const rmrf = promisify(rimraf);
const copy = promisify(copyfiles);

export default async function prebuild() {
  await rmrf(BUILD_DIR);
  try {
    await simpleGit().clean(
      [CleanOptions.RECURSIVE, CleanOptions.FORCE, CleanOptions.IGNORED_ONLY],
      [PUBLIC_DIR],
    );
  } catch (ex) {
    // Do nothing
  }

  await copy([`${CONTENT_DIR}/manifest.json`, `${CONTENT_DIR}/wcms-resources/**/*`, PUBLIC_DIR], 1);
  await copy(
    ['./node_modules/@redneckz/wildless-cms-uni-blocks/cosmos-static/icons/**/*', PUBLIC_DIR],
    4,
  );
}
