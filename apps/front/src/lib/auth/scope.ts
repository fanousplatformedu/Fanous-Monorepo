export type AuthScope = "super-admin" | "school";

export const getPathname = (): string => {
  if (typeof window === "undefined") return "";
  return window.location.pathname ?? "";
};

export const detectScopeFromPath = (pathname = getPathname()): AuthScope => {
  if (pathname.startsWith("/super-admin")) return "super-admin";
  return "school";
};

export const extractSchoolIdFromPath = (
  pathname = getPathname(),
): string | null => {
  const match =
    pathname.match(/^\/school\/([^/]+)/) ||
    pathname.match(/^\/school-admin\/([^/]+)/);
  return match?.[1] ?? null;
};
