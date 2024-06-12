import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const tag = process.env.npm_package_version ?? '0.0.0-local';

export const getFileStorageBaseUrl = () => process.env.FILE_STORAGE_BASE_URL ?? compute();

const compute = () => {
  const suffix = (tag.split('-').at(1) ?? 'prod').toLowerCase();

  if (suffix.startsWith('prod')) {
    return process.env.FILE_STORAGE_BASE_URL_PROD;
  }

  if (suffix.startsWith('rc')) {
    return process.env.FILE_STORAGE_BASE_URL_RC;
  }

  return process.env.FILE_STORAGE_BASE_URL_DEV;
};
