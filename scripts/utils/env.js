import dotenv from 'dotenv';
import { getFileStorageBaseUrl } from './getFileStorageBaseUrl.js';

dotenv.config({ path: ['.env.local', '.env'] });

export const CONTENT_DIR = process.env.CONTENT_DIR || 'content';
export const PAGE_EXT = process.env.PAGE_EXT || '.page.json';
export const PUBLIC_DIR = process.env.PUBLIC_DIR || 'public';
export const PROJECT_ID = process.env.PROJECT_ID;
export const FILE_STORAGE_BASE_URL = getFileStorageBaseUrl();
export const BUILD_DIR = 'build';
export const NEXT_DIR = '.next';
export const EXTRA_DIR = 'extra';
