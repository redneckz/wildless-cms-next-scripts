import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { promisify } from 'util';
import { CONTENT_DIR, PUBLIC_DIR } from './utils/env.js';
import { generatePageComponent } from './generatePageComponent.js';
import { getSearchIndex } from './utils/getSearchIndex.js';
import { contentPageRepository } from './utils/contentPageRepository.js';
import { PAGES_DIR, PORTAL_RESOURCES_DIR, WCMS_RESOURCES_DIR } from './dirs.js';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const EXT = '.json';
const SEARCH_INDEX_FILENAME = 'search.index.json';
const PATH_DELIMITER = '/';

const customPagePaths = (process.env.CUSTOM_PAGE_PATHS_REGISTRY || '').split(',');

export async function generate({ isMobile, ssg }) {
  const allSlugs = await contentPageRepository.listAllSlugs();

  if (ssg) {
    const pagePathsList = await getPagePathsList();

    const relevantPagePaths = customPagePaths.length
      ? pagePathsList.filter((pagePath) => !customPagePaths.includes(pagePath))
      : pagePathsList;

    const pages = await Promise.all(relevantPagePaths.map(generatePageAndRelatedAssets(isMobile)));

    const resourcesPaths = await getResourcesPaths();

    for (const resourcesPath of resourcesPaths) {
      await generateResource(resourcesPath);
    }
  }

  const pagesMap = await Promise.all(
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

  await generateSearchIndexFor(pagesMap);
}

function generatePageAndRelatedAssets(isMobile) {
  return async (slug) => {
    const page = await contentPageRepository.generatePage(slug);

    const generatedPageComponentPath = toGeneratedPageComponentPath(slug);

    await mkdir(path.dirname(generatedPageComponentPath), { recursive: true });
    await writeFile(
      generatedPageComponentPath,
      generatePageComponent(isMobile)(page, slug),
      'utf-8',
    );

    console.log(slug, 'OK');
  };
}

export async function getResourcesPaths() {
  return glob(`{${WCMS_RESOURCES_DIR},${PORTAL_RESOURCES_DIR}}/**/*${EXT}`);
}

function getPagePathsList() {
  return glob(`${CONTENT_DIR}/**/*.page.json`);
}

async function generateResource(filePath) {
  const page = await contentPageRepository.generatePage(filePath);

  const resourcePath = path.join(PUBLIC_DIR, path.relative(CONTENT_DIR, filePath));

  await mkdir(path.dirname(resourcePath), { recursive: true });
  await writeFile(resourcePath, JSON.stringify(page), 'utf-8');

  console.log(filePath, 'OK');
}

function toGeneratedPageComponentPath(pagePath) {
  const extIndex = pagePath.indexOf('.');
  const withoutExt = extIndex !== -1 ? pagePath.substring(0, extIndex) : pagePath;
  const relativePath = `${path.relative(CONTENT_DIR, withoutExt)}.tsx`;

  return path.join(PAGES_DIR, relativePath);
}

async function generateSearchIndexFor(pages) {
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
