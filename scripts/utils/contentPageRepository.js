import { ContentPageRepository } from '@redneckz/wildless-cms-content';

import { CONTENT_DIR, FILE_STORAGE_BASE_URL, PAGE_EXT, PROJECT_ID, PUBLIC_DIR } from './env.js';

export const transformationOptions = {
  contentDir: CONTENT_DIR,
  pageExt: PAGE_EXT,
  publicDir: PUBLIC_DIR,
};

export const contentPageRepository = new ContentPageRepository({
  projectId: PROJECT_ID,
  baseURL: FILE_STORAGE_BASE_URL,
  ...transformationOptions,
});
