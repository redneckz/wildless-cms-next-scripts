import { listBlocks } from './listBlocks.js';

export const extractType = ({ type }) => type;
export const extractMobileType = ({ type, mobile: { type: mobileType } = {} }) =>
  mobileType || type;

export const getBlockTypes = (page, typeExtractor = extractType) =>
  listBlocks(page)
    .map(typeExtractor)
    .filter((type) => type);
