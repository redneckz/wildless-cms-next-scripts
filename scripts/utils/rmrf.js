import { rimraf } from 'rimraf';

export async function rmrf(...dirs) {
  await Promise.all(dirs.map((_) => rimraf(_)));
}
