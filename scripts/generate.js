import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import fs from 'fs';
import { promisify } from 'util';
import { CONTENT_DIR, PUBLIC_DIR } from './dirs.js';
import { getSearchIndex } from './utils/getSearchIndex.js';

const writeFile = promisify(fs.writeFile);

const EXT = '.json';
const SEARCH_INDEX_FILENAME = 'search.index.json';

const customPagePaths = (process.env.CUSTOM_PAGE_PATHS_REGISTRY || '').split(',');

const contentPageRepository = new ContentPageRepository({
  contentDir: CONTENT_DIR,
  publicDir: PUBLIC_DIR,
});

export default async function generate() {
  const pagePathsList = await contentPageRepository.listAllPages();
  const relevantPagePaths = customPagePaths.length
    ? pagePathsList.filter((pagePath) => !customPagePaths.includes(pagePath))
    : pagePathsList;

  await Promise.all(
    relevantPagePaths.map(async (pagePath) => {
      try {
        await contentPageRepository.generatePage(pagePath);
        console.log(pagePath, 'OK');
      } catch (ex) {
        console.warn(`Failed to generate assets for ${pagePath}`, ex);
      }
    }),
  );

  const resourcesPaths = await getResourcesPaths();
  for (const resourcesPath of resourcesPaths) {
    await generateResource(resourcesPath);
  }

  await generateSearchIndex(relevantPagePaths);
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
