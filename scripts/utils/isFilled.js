export const isFilled = (_) =>
  _ !== null &&
  _ !== undefined &&
  _ !== '' &&
  (!Array.isArray(_) || _.length) &&
  (typeof _ !== 'object' || Object.keys(_).length);
