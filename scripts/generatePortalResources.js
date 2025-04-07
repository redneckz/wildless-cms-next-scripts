import { ContentPageRepository } from '@redneckz/wildless-cms-content';

import { CONTENT_DIR, FILE_STORAGE_BASE_URL, PROJECT_ID, PUBLIC_DIR } from './utils/env.js';

const PORTAL_RESOURCES_DIR = 'content/portal-resources';
const PAGE_EXT = '.json';

const transformationOptions = {
  contentDir: CONTENT_DIR,
  pageExt: PAGE_EXT,
  publicDir: PUBLIC_DIR,
};

const contentPageRepository = new ContentPageRepository({
  projectId: PROJECT_ID,
  baseURL: FILE_STORAGE_BASE_URL,
  ...transformationOptions,
});

export async function generatePortalResources() {
  const paths = await contentPageRepository.listFiles({ ext: PAGE_EXT, dir: PORTAL_RESOURCES_DIR });

  const resources = paths.filter((_) => !_.includes('schemas'));

  for (const path of resources) {
    try {
      await contentPageRepository.generatePage(contentPageRepository.toSlug(path));
    } catch (ex) {
      console.warn('Failed to generate assets for', path, ex);
    }
  }
}
