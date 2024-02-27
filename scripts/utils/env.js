import dotenv from 'dotenv';
import { computeFileStorageBaseUrl } from './computeFileStorageBaseUrl.js';

dotenv.config({ path: ['.env.local', '.env'] });

export const CONTENT_DIR = process.env.CONTENT_DIR || 'content';
export const PUBLIC_DIR = process.env.PUBLIC_DIR || 'public';
export const PROJECT_ID = process.env.PROJECT_ID;
export const FILE_STORAGE_BASE_URL = computeFileStorageBaseUrl();

export const CUSTOM_SLUGS_REGISTRY = (process.env.CUSTOM_SLUGS_REGISTRY ?? '')
  .split(',')
  .filter(Boolean)
  .map((_) => _.split('/'));

export const BUILD_DIR = 'build';
export const NEXT_DIR = '.next';
export const EXTRA_DIR = 'extra';
export const UNIBLOCK_PACKAGE_DIR = 'node_modules/@redneckz/wildless-cms-uni-blocks';
