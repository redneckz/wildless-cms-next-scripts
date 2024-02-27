import fs from 'fs';
import glob from 'glob';
import { basename } from 'path';
import { promisify } from 'util';
import { CONTENT_DIR } from './utils/env.js';

const findFiles = promisify(glob);
const readFile = promisify(fs.readFile);
const lstat = promisify(fs.lstat);
const unlink = promisify(fs.unlink);

const isDetached = (contentList) => (path) => !contentList.some((_) => _.includes(basename(path)));

const DOC_EXT_LIST = ['json', 'md'];

export default async function removeDetached() {
  const contentFiles = await findFiles(`${CONTENT_DIR}/**/*.@(${DOC_EXT_LIST.join('|')})`);
  const contentList = (await Promise.allSettled(contentFiles.map((_) => readFile(_, 'utf-8'))))
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value);

  const attaches = await findFiles(
    `${CONTENT_DIR}/**/!(${DOC_EXT_LIST.map((_) => `*.${_}`).join('|')})`,
  );
  const attachesStat = await Promise.all(attaches.map((_) => lstat(_)));

  const detachedFiles = attaches
    .filter((_, i) => attachesStat[i].isFile())
    .filter(isDetached(contentList));

  if (detachedFiles.length) {
    console.log('Unused attachments:', detachedFiles);

    const result = await Promise.allSettled(detachedFiles.map((_) => unlink(_)));
    const removedFilesCount = result.filter(({ status }) => status === 'fulfilled').length;

    console.log(`${removedFilesCount} attachment(s) were removed...`);
  } else {
    console.log('No unused attachments');
  }
}
