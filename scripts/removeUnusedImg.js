import glob from 'glob';
import fs from 'fs';
import { promisify } from 'util';
import { CONTENT_DIR } from './dirs.js';
import { basename } from 'path';

const findFiles = promisify(glob);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);

const isFile = (path) => fs.lstatSync(path).isFile();
const isNotContained = (content) => (path) => content.some((_) => _.includes(basename(path)));

const DOC_EXT_LIST = ['json', 'md'];

export default async function removeUnusedImg() {
  const contentFiles = await findFiles(`${CONTENT_DIR}/**/*.@(${DOC_EXT_LIST.join('|')})`);
  const allContent = await Promise.all(contentFiles.map((path) => readFile(path, 'utf-8')));
  const attaches = await findFiles(
    `${CONTENT_DIR}/**/!(${DOC_EXT_LIST.map((_) => `*.${_}`).join('|')})`,
  );

  for (const detachedFile of attaches.filter(isFile).filter(isNotContained(allContent))) {
    unlink(detachedFile);
    console.log(`Remove ${detachedFile}`);
  }
}
