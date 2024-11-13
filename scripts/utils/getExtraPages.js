import { glob } from 'glob';
import { EXTRA_DIR } from './env.js';

export const getExtraPages = async () =>
  (await glob(`${EXTRA_DIR}/**/*`)).map((_) => _.slice(EXTRA_DIR.length)).join(',');
