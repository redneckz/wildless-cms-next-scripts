import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { generatePageComponent } from './generatePageComponent.js';
import { contentPageRepository } from './utils/contentPageRepository.js';
import { PAGES_DIR, PUBLIC_DIR } from './utils/env.js';
import { getSearchIndex } from './utils/getSearchIndex.js';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const SEARCH_INDEX_FILENAME = 'search.index.json';
const PATH_DELIMITER = '/';

const customPagePaths = (process.env.CUSTOM_PAGE_PATHS_REGISTRY ?? '').split(',').filter(Boolean);

export async function generate({ isMobile, ssg }) {
  const allSlugs = await contentPageRepository.listAllSlugs();

  const pagesMap = await Promise.all(
    allSlugs
      .filter(Boolean)
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

  if (ssg) {
    const relevantPagePaths = pagesMap.filter(
      ([pagePath]) => !customPagePaths.some((_) => _ === pagePath),
    );

    await Promise.all(relevantPagePaths.map(generatePageAndRelatedAssets(isMobile)));
  }

  await generateSearchIndex(pagesMap);
}

function generatePageAndRelatedAssets(isMobile) {
  return async ([pagePath, page]) => {
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

function toGeneratedPageComponentPath(pagePath) {
  const pathWithExt = `${pagePath}.tsx`;

  return path.join(PAGES_DIR, pathWithExt);
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
