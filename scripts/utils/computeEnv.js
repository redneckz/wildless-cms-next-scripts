const tag = process.env.npm_package_version ?? '0.0.0-local';

export const computeEnv = () => {
  const suffix = (tag.split('-').at(1) ?? 'prod').toLowerCase();

  if (suffix.startsWith('prod')) {
    return 'prod';
  }

  if (suffix.startsWith('rc')) {
    return 'rc';
  }

  return 'dev';
};
