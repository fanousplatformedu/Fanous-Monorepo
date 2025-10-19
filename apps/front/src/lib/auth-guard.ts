import { Role, TSession } from "@/types/auth";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function requireSession(
  redirectTo = "/auth/professional"
): Promise<TSession> {
  const session = await getSession();
  if (!session) redirect(`${redirectTo}`);
  return session;
}

export async function requireRole(
  allowed: Role[],
  fallback = "/dashboard"
): Promise<TSession> {
  const session = await requireSession();
  const role = session.user?.role;
  if (!role || !allowed.includes(role)) redirect(fallback);
  return session;
}
