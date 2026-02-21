import { normalizePhone, pickIdentifier } from "@utils/seed-helper";
import { TSeedCtx, TSeedUserSlim } from "@ctypes/seed-types";
import { normalizeEmail } from "@utils/seed-helper";
import { GlobalRole } from "@prisma/client";

export const ensureUser = async (
  ctx: TSeedCtx,
  input: { email?: string; phone?: string },
) => {
  if (!input.email && !input.phone)
    throw new Error("User must have email or phone.");
  const emailNormalized = input.email ? normalizeEmail(input.email) : null;
  const phoneNormalized = input.phone ? normalizePhone(input.phone) : null;

  let existing: {
    id: string;
    email: string | null;
    phone: string | null;
    emailNormalized: string | null;
    phoneNormalized: string | null;
  } | null = null;

  if (emailNormalized) {
    existing = await ctx.prisma.user.findUnique({
      where: { emailNormalized },
      select: {
        id: true,
        email: true,
        phone: true,
        emailNormalized: true,
        phoneNormalized: true,
      },
    });
  } else if (phoneNormalized) {
    existing = await ctx.prisma.user.findUnique({
      where: { phoneNormalized },
      select: {
        id: true,
        email: true,
        phone: true,
        emailNormalized: true,
        phoneNormalized: true,
      },
    });
  }
  if (existing) return existing;
  return ctx.prisma.user.create({
    data: {
      email: input.email ?? null,
      phone: input.phone ?? null,
      emailNormalized,
      phoneNormalized,
      isActive: true,
      globalRole: GlobalRole.USER,
    },
    select: {
      id: true,
      email: true,
      phone: true,
      emailNormalized: true,
      phoneNormalized: true,
    },
  });
};

export const seedUsersPool = async (
  ctx: TSeedCtx,
): Promise<TSeedUserSlim[]> => {
  const total = ctx.env.SEED_SCHOOLS_COUNT * ctx.env.SEED_USERS_PER_SCHOOL;
  const pool: TSeedUserSlim[] = [];
  for (let i = 0; i < total; i++) {
    const { email, phone } = pickIdentifier(ctx);
    const user = await ensureUser(ctx, { email, phone });
    pool.push({
      id: user.id,
      email: user.email,
      phone: user.phone,
      emailNormalized: user.emailNormalized,
      phoneNormalized: user.phoneNormalized,
    });
  }
  return pool;
};
