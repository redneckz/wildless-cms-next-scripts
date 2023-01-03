import copyfiles from 'copyfiles';
import { promisify } from 'util';
import { BUILD_DIR, EXTRA_DIR } from './dirs.js';

const copy = promisify(copyfiles);

export default async function extra() {
  await copy([`${EXTRA_DIR}/**/*`, BUILD_DIR], 1);
}
