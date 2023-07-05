import fs from 'fs';
import { PUBLIC_DIR, UNIBLOCK_PACKAGE_DIR } from './dirs.js';

export const createInfoFile = async () => {
  const data = {
    BUILD_VER: process.env.CI_COMMIT_TAG ?? '',
    BUILD_DATE: getCurrentDateTime(),
    UNIBLOCK_VER: await getCurrentVersionUniBlocks(),
  };

  try {
    const jsonContent = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(`${PUBLIC_DIR}/__version.json`, jsonContent, 'utf8');
  } catch (error) {
    console.error(`Error while save info file: ${error}`);
  }
};

const getCurrentVersionUniBlocks = async () => {
  try {
    const packageJson = await fs.promises.readFile(`${UNIBLOCK_PACKAGE_DIR}/package.json`, 'utf8');
    const packageData = JSON.parse(packageJson);
    const version = packageData.version;

    return version;
  } catch (error) {
    console.error(`Error while read file package.json: ${error}`);

    return null;
  }
};

const getCurrentDateTime = () => {
  const currentDate = new Date();

  const YYYY = currentDate.getFullYear();
  const MM = String(currentDate.getMonth() + 1).padStart(2, '0');
  const DD = String(currentDate.getDate()).padStart(2, '0');
  const HH = String(currentDate.getHours()).padStart(2, '0');
  const mm = String(currentDate.getMinutes()).padStart(2, '0');
  const ss = String(currentDate.getSeconds()).padStart(2, '0');

  return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
};
