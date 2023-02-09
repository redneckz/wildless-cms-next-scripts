import _rimraf from 'rimraf';
import { promisify } from 'util';

const rimraf = promisify(_rimraf);

export async function rmrf(...dirs) {
  await Promise.all(dirs.map((_) => rimraf(_)));
}
