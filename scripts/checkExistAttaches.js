import fs from 'fs';
import glob from 'glob';
import { join, parse } from 'path';
import { promisify } from 'util';
import { CONTENT_DIR } from './dirs.js';
import { isURL } from './utils/isUrl.js';

const findFiles = promisify(glob);
const readFile = promisify(fs.readFile);
const lstat = promisify(fs.lstat);

const DOC_EXT_LIST = ['json', 'md'];

export default async function checkExistAttaches() {
  const contentFiles = await findFiles(`${CONTENT_DIR}/**/*.@(${DOC_EXT_LIST.join('|')})`);

  for (const path of contentFiles) {
    const content = JSON.parse(await readFile(path, 'utf-8'));

    if (!content?.blocks) {
      continue;
    }

    for (const block of content.blocks) {
      await adjustBlock(path, block);
    }
  }
}

const adjustBlock = async (path, block) => {
  for (const key in block) {
    if (typeof block[key] === 'object') {
      await adjustBlock(path, block[key]);
    }

    if (key === 'src' && !isURL(block[key])) {
      const unitPathDir = parse(path).dir;

      try {
        const attachPath = join(unitPathDir, block[key]);
        const attachStat = await lstat(attachPath);

        if (!attachStat.isFile()) {
          const error = new Error('Attach not exist');
          error.path = attachPath;

          throw error;
        }
      } catch (ex) {
        console.error(`\n\nAttach not exist!\nattach: ${ex?.path}\njson: ${path}`);
      }
    }
  }
};
