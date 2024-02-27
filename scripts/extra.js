import copyfiles from 'copyfiles';
import { promisify } from 'util';
import { EXTRA_DIR, PUBLIC_DIR } from './utils/env.js';

const copy = promisify(copyfiles);

export default async function extra() {
  await copy([`${EXTRA_DIR}/**/*`, PUBLIC_DIR], 1);
}
