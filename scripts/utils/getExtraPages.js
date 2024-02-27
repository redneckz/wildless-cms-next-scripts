import glob from 'glob';
import { promisify } from 'util';
import { EXTRA_DIR } from './env.js';

const findFiles = promisify(glob);

export const getExtraPages = async () =>
  (await findFiles(`${EXTRA_DIR}/**/*`)).map((_) => _.slice(EXTRA_DIR.length)).join(',');
