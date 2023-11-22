import fs from 'fs';
import { promisify } from 'util';
import { contentPageRepository } from './utils/contentPageRepository.js';
import { PUBLIC_DIR } from './utils/env.js';
import { getSearchIndex } from './utils/getSearchIndex.js';

const writeFile = promisify(fs.writeFile);

const SEARCH_INDEX_FILENAME = 'search.index.json';
const PATH_DELIMITER = '/';

export default async function generate() {
  const allSlugs = await contentPageRepository.listAllSlugs();

  const pages = await Promise.all(
    allSlugs
      .map(async (slug) => {
        try {
          console.log(slug, 'OK');
          return [slug.join(PATH_DELIMITER), await contentPageRepository.generatePage(slug)];
        } catch (ex) {
          console.warn('Failed to generate assets for', slug, ex);
        }
      })
      .filter(Boolean),
  );

  await generateSearchIndex(pages);
}

async function generateSearchIndex(pages) {
  try {
    await writeFile(
      `${PUBLIC_DIR}/${SEARCH_INDEX_FILENAME}`,
      JSON.stringify(await getSearchIndex(pages)),
      'utf-8',
    );
  } catch (ex) {
    console.warn('Failed to generate search index', ex);
  }
}
