import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import fs from 'fs';
import path from 'path';
import { CleanOptions, simpleGit } from 'simple-git';
import { promisify } from 'util';
import { CONTENT_DIR, PAGES_DIR, PUBLIC_DIR } from './dirs.js';
import { generatePage } from './generatePage.js';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

export default async function generate(isMobile, noIndex) {
  try {
    await simpleGit().clean(
      [CleanOptions.RECURSIVE, CleanOptions.FORCE, CleanOptions.IGNORED_ONLY],
      [PAGES_DIR],
    );
  } catch (ex) {
    // Do nothing
  }

  const contentPageRepository = new ContentPageRepository({
    contentDir: CONTENT_DIR,
    publicDir: PUBLIC_DIR,
  });

  const pagePathsList = await contentPageRepository.listAllContentPages();
  const pagePathsFilteredList = noIndex
    ? pagePathsList.filter((pagePath) => !pagePath.includes('/index'))
    : pagePathsList;

  for (const pagePath of pagePathsFilteredList) {
    const page = await contentPageRepository.readPage(pagePath);
    const generatedPagePath = toGeneratedPagePath(pagePath);

    await mkdir(path.dirname(generatedPagePath), { recursive: true });
    await writeFile(generatedPagePath, generatePage(isMobile)(page, pagePath));

    console.log(pagePath, 'OK');
  }
}

function toGeneratedPagePath(pagePath) {
  const extIndex = pagePath.indexOf('.');
  const withoutExt = extIndex !== -1 ? pagePath.substring(0, extIndex) : pagePath;
  const relativePath = `${path.relative(CONTENT_DIR, withoutExt)}.tsx`;

  return path.join(PAGES_DIR, relativePath);
}
