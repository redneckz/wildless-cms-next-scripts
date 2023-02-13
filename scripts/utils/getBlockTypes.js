export const extractType = ({ type }) => type;
export const extractMobileType = ({ type, mobile: { type: mobileType } = {} }) =>
  mobileType || type;

const extractAllTypes = (typeExtractor) => (slot) =>
  (typeExtractor(slot) ? [typeExtractor(slot)] : []).concat(
    slot.blocks?.flatMap(extractAllTypes(typeExtractor)),
    Object.values(slot.slots || {}).flatMap((list) =>
      list?.flatMap(extractAllTypes(typeExtractor)),
    ),
  );

export const getBlockTypes = (page, typeExtractor = extractType) =>
  extractAllTypes(typeExtractor)(page || {}).filter((type) => type);
