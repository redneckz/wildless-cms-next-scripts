export const applyTmpl = (tmpl, valsMap) =>
  Object.keys(valsMap).reduce(
    (result, key) => result.replaceAll(`/* ${key} */`, valsMap[key]),
    tmpl,
  );
