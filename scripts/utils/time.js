export async function time(label, func) {
  console.time(label);
  try {
    await func();
  } finally {
    console.timeEnd(label);
  }
}

export const timed =
  (label, func) =>
  (...args) =>
    time(label, () => func(...args));
