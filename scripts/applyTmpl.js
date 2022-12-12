const SELF = '@redneckz/wildless-cms-next-scripts';
const UNI_BLOCKS_PACKAGE = '@redneckz/wildless-cms-uni-blocks';

export const applyTmpl = (tmpl, valsMap, isMobile) =>
  Object.keys(valsMap)
    .reduce((result, key) => result.replaceAll(`/* ${key} */`, valsMap[key]), tmpl)
    .replaceAll(
      `${UNI_BLOCKS_PACKAGE}/lib`,
      isMobile ? `${UNI_BLOCKS_PACKAGE}/mobile/lib` : `${UNI_BLOCKS_PACKAGE}/lib`,
    );
