import { Prisma } from "@prisma/client";

export function formatPersonName(
  firstName?: string | null,
  lastName?: string | null,
  fallback = "",
): string {
  const name = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ");
  return name || fallback;
}

export function splitPersonName(fullName?: string | null): {
  firstName: string | null;
  lastName: string | null;
} {
  const trimmed = fullName?.trim();
  if (!trimmed) return { firstName: null, lastName: null };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? null,
    lastName: parts.slice(1).join(" ") || null,
  };
}

export function buildUserNameSearch(query: string): Prisma.UserWhereInput[] {
  const q = query.trim();
  if (!q) return [];
  return [
    { firstName: { contains: q, mode: Prisma.QueryMode.insensitive } },
    { lastName: { contains: q, mode: Prisma.QueryMode.insensitive } },
  ];
}
