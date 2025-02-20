import dotenv from 'dotenv';
import { getFileStorageBaseUrl } from './getFileStorageBaseUrl.js';
import { getWcmsResourcesBaseUrl } from './getWcmsResourcesBaseUrl.js';

dotenv.config({ path: ['.env.local', '.env'] });

export const CONTENT_DIR = process.env.CONTENT_DIR || 'content';
export const PAGE_EXT = process.env.PAGE_EXT || '.page.json';
export const PUBLIC_DIR = process.env.PUBLIC_DIR || 'public';
export const PAGES_DIR = process.env.PAGES_DIR || 'pages';
export const PROJECT_ID = process.env.PROJECT_ID;
export const FILE_STORAGE_BASE_URL = getFileStorageBaseUrl();
export const WCMS_RESOURCES_BASE_URL = getWcmsResourcesBaseUrl();
export const BUILD_DIR = 'build';
export const NEXT_DIR = '.next';
export const EXTRA_DIR = 'extra';
export const UNIBLOCK_PACKAGE_DIR = 'node_modules/@redneckz/wildless-cms-uni-blocks';
