import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import fs from 'fs';
import { promisify } from 'util';
import { CONTENT_DIR, PAGES_DIR, PUBLIC_DIR } from './dirs.js';
import { generatePagesComponent } from './utils/generatePagesComponent.js';
import { generateSinglePageComponent } from './utils/generateSinglePageComponent.js';
import { getSearchIndex } from './utils/getSearchIndex.js';
import { time } from './utils/time.js';

const writeFile = promisify(fs.writeFile);

const SEARCH_INDEX_FILENAME = 'search.index.json';

const contentPageRepository = new ContentPageRepository({
  contentDir: CONTENT_DIR,
  publicDir: PUBLIC_DIR,
});

export default async function generate({ isMobile }) {
  const pagePathsList = await contentPageRepository.listAllContentPages();

  await time('pages-generation', async () => {
    const pages = await Promise.all(
      pagePathsList.map((_) => contentPageRepository.generatePage(_)),
    );

    await generateErrorPages(pages, isMobile);

    await writeFile(`${PAGES_DIR}/[...slug].tsx`, generatePagesComponent(isMobile), 'utf-8');
  });

  await time('search-index', () => generateSearchIndex(pagePathsList));
}

async function generateErrorPages(pages, isMobile) {
  const errorPages = pages.filter(({ slug }) => /^\d+$/.test(slug)).map(({ slug }) => slug);
  await Promise.all(
    errorPages.map(async (_) =>
      writeFile(
        `${PAGES_DIR}/${_}.tsx`,
        generateSinglePageComponent(isMobile)(
          await contentPageRepository.readPage(`${CONTENT_DIR}/${_}.page.json`),
          `${CONTENT_DIR}/${_}.page.json`,
        ),
        'utf-8',
      ),
    ),
  );
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
