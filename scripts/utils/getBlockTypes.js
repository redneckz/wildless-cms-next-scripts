import { listBlocks } from './listBlocks.js';

export const extractType = ({ type }) => type;

export const getBlockTypes = (page, typeExtractor = extractType) =>
  listBlocks(page)
    .map(typeExtractor)
    .filter((type) => type);
