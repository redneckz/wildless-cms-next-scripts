import { CleanOptions, simpleGit } from 'simple-git';

export async function gitClean(...dirs) {
  try {
    await simpleGit().clean(
      [CleanOptions.RECURSIVE, CleanOptions.FORCE, CleanOptions.IGNORED_ONLY],
      dirs,
    );
  } catch (ex) {
    // Do nothing
  }
}
