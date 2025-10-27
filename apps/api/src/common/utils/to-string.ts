export const isString = (x: unknown): x is string => {
  return typeof x === "string" && x.length > 0;
};
