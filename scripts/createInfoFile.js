import fs from 'fs';
import { PUBLIC_DIR, UNIBLOCK_PACKAGE_DIR } from './dirs.js';

const MOSCOW_TIME_OFFSET = 3;

export const createInfoFile = async () => {
  const data = {
    BUILD_VER: process.env.npm_package_version ?? '',
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

  const utc = currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  const mscDate = new Date(utc + 3600000 * MOSCOW_TIME_OFFSET);

  const YYYY = mscDate.getFullYear();
  const MM = String(mscDate.getMonth() + 1).padStart(2, '0');
  const DD = String(mscDate.getDate()).padStart(2, '0');
  const HH = String(mscDate.getHours()).padStart(2, '0');
  const mm = String(mscDate.getMinutes()).padStart(2, '0');
  const ss = String(mscDate.getSeconds()).padStart(2, '0');

  return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`;
};
