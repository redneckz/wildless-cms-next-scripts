export const extractType = ({ type }) => type;
export const extractMobileType = ({ type, mobile: { type: mobileType } = {} }) =>
  mobileType || type;

const extractAllTypes = (blocks, typeExtractor) =>
  blocks.flatMap((b) => [typeExtractor(b), ...extractAllTypes(b.blocks || [], typeExtractor)]);

export const getBlockTypes =
  ({ blocksRegistry, typeExtractor }) =>
  (page) =>
    unique(
      extractAllTypes(page.blocks || [], typeExtractor)
        .filter((type) => type && type in blocksRegistry)
        .concat(
          ...Object.values(page.slots || {}).map(getBlockTypes({ blocksRegistry, typeExtractor })),
        ),
    );

function unique(list) {
  return [...new Set(list)];
}
