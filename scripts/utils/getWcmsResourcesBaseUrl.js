import dotenv from 'dotenv';
import { computeEnv } from './computeEnv.js';

dotenv.config({ path: ['.env.local', '.env'] });

export const getWcmsResourcesBaseUrl = () => process.env.WCMS_RESOURCES_BASE_URL ?? compute();

const compute = () => {
  const env = computeEnv();

  if (env.startsWith('prod')) {
    return process.env.WCMS_RESOURCES_BASE_URL_PROD;
  }

  if (env.startsWith('rc')) {
    return process.env.WCMS_RESOURCES_BASE_URL_RC;
  }

  return process.env.WCMS_RESOURCES_BASE_URL_DEV;
};
