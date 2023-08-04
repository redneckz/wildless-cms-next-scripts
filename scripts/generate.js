import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { CONTENT_DIR, PAGES_DIR, PUBLIC_DIR } from './dirs.js';
import { generatePageComponent } from './generatePageComponent.js';
import { getSearchIndex } from './utils/getSearchIndex.js';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const SEARCH_INDEX_FILENAME = 'search.index.json';

const customPagePaths = (process.env.CUSTOM_PAGE_PATHS_REGISTRY || '').split(',');

const contentPageRepository = new ContentPageRepository({
  contentDir: CONTENT_DIR,
  publicDir: PUBLIC_DIR,
});

export default async function generate({ isMobile }) {
  const pagePathsList = await contentPageRepository.listAllContentPages();
  const relevantPagePaths = customPagePaths.length
    ? pagePathsList.filter((pagePath) => !customPagePaths.includes(pagePath))
    : pagePathsList;

  const pages = await Promise.all(relevantPagePaths.map(generatePageAndRelatedAssets(isMobile)));

  await generateSearchIndex(relevantPagePaths);
}

function generatePageAndRelatedAssets(isMobile) {
  return async (pagePath) => {
    const page = await contentPageRepository.generatePage(pagePath);

    const generatedPageComponentPath = toGeneratedPageComponentPath(pagePath);
    await mkdir(path.dirname(generatedPageComponentPath), { recursive: true });
    await writeFile(
      generatedPageComponentPath,
      generatePageComponent(isMobile)(page, pagePath),
      'utf-8',
    );

    console.log(pagePath, 'OK');
  };
}

async function generateSearchIndex(pagePathsList) {
  try {
    await writeFile(
      `${PUBLIC_DIR}/${SEARCH_INDEX_FILENAME}`,
      JSON.stringify(
        await getSearchIndex(pagePathsList, (pagePath) => contentPageRepository.readPage(pagePath)),
      ),
      'utf-8',
    );
  } catch (ex) {
    console.warn('Failed to generate search index', ex);
  }
}

function toGeneratedPageComponentPath(pagePath) {
  const extIndex = pagePath.indexOf('.');
  const withoutExt = extIndex !== -1 ? pagePath.substring(0, extIndex) : pagePath;
  const relativePath = `${path.relative(CONTENT_DIR, withoutExt)}.tsx`;

  return path.join(PAGES_DIR, relativePath);
}
