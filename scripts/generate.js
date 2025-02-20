import fs from 'fs';
import { promisify } from 'util';
import { contentPageRepository } from './utils/contentPageRepository.js';
import { PUBLIC_DIR } from './utils/env.js';
import { getSearchIndex } from './utils/getSearchIndex.js';

const writeFile = promisify(fs.writeFile);

const SEARCH_INDEX_FILENAME = 'search.index.json';
const PATH_DELIMITER = '/';

export async function generate() {
  const allSlugs = (
    await Promise.all([
      contentPageRepository.listAllSlugs(),
      contentPageRepository.listErrorSlugs(),
    ])
  ).flat();

  const pagesMap = (
    await Promise.all(
      allSlugs.filter(Boolean).map(async (_) => {
        try {
          return [_.join(PATH_DELIMITER), await contentPageRepository.generatePage(_)];
        } catch (ex) {
          console.warn('Failed to generate assets for', _, ex);
        } finally {
          console.log(_, '... transform content OK');
        }
      }),
    )
  ).filter(Boolean);

  await generateSearchIndex(pagesMap);
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
