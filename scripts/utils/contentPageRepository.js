import { ContentPageRepository } from '@redneckz/wildless-cms-content';
import { CONTENT_DIR, FILE_STORAGE_BASE_URL, PROJECT_ID, PUBLIC_DIR } from './env.js';

export const contentPageRepository = new ContentPageRepository({
  contentDir: CONTENT_DIR,
  publicDir: PUBLIC_DIR,
  projectId: PROJECT_ID,
  baseURL: FILE_STORAGE_BASE_URL,
});
