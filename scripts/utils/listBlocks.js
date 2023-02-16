export const listBlocks = (slot) =>
  (slot ? [slot] : []).concat(
    (slot?.blocks || []).flatMap(listBlocks),
    Object.values(slot?.slots || {}).flatMap((blocks) => (blocks || []).flatMap(listBlocks)),
  );
