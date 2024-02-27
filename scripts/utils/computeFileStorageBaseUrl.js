export const computeFileStorageBaseUrl = () => {
  // default 0.0.0-local
  const tag = process.env.npm_package_version ?? '';
  const suffix = (tag.split('-').at(1) ?? 'prod').toLowerCase();

  if (suffix.startsWith('prod')) {
    return process.env.FILE_STORAGE_BASE_URL_PROD;
  }

  if (suffix.startsWith('rc')) {
    return process.env.FILE_STORAGE_BASE_URL_RC;
  }

  return process.env.FILE_STORAGE_BASE_URL_DEV;
};
