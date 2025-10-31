export const renderTemplate = (
  input: string,
  vars: Record<string, any>
): string => {
  if (!input) return input;
  return input.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, p1) => {
    const path = String(p1).trim().split(".");
    let cur: any = vars ?? {};
    for (const k of path) cur = cur?.[k];
    const v = cur === undefined || cur === null ? "" : String(cur);
    return v;
  });
};
