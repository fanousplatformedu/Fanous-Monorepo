import {
  PrismaClient,
  GlobalRole,
  MembershipStatus,
  SchoolRole,
  OtpPurpose,
  OtpChannel,
  TokenType,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as argon2 from "argon2";
import { nanoid } from "nanoid";
import * as crypto from "crypto";

const prisma = new PrismaClient();

// -------------------- helpers --------------------
function envInt(name: string, fallback: number) {
  const v = process.env[name];
  const n = v ? Number(v) : fallback;
  return Number.isFinite(n) ? n : fallback;
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function uniqEmail(prefix: string) {
  return `${prefix}.${faker.string.alphanumeric(10).toLowerCase()}@example.com`;
}

function uniqPhone() {
  // Adjust to your phone validation rules if needed
  return `09${faker.string.numeric(9)}`;
}

function pickIdentifier(): { email?: string; phone?: string } {
  const useEmail = faker.helpers.arrayElement([true, false]);
  if (useEmail) return { email: uniqEmail("user") };
  return { phone: uniqPhone() };
}

function rolesPool(): SchoolRole[] {
  return [
    SchoolRole.STUDENT,
    SchoolRole.PARENT,
    SchoolRole.TEACHER,
    SchoolRole.COUNSELOR,
  ];
}

function weightedMembershipStatus(): MembershipStatus {
  // You wanted SUSPENDED too:
  // PENDING 45% | APPROVED 35% | REJECTED 10% | SUSPENDED 10%
  const r = faker.number.int({ min: 1, max: 100 });
  if (r <= 45) return MembershipStatus.PENDING;
  if (r <= 80) return MembershipStatus.APPROVED;
  if (r <= 90) return MembershipStatus.REJECTED;
  return MembershipStatus.SUSPENDED;
}

function maybeCorrectRole(requested: SchoolRole): SchoolRole {
  // 20% chance admin corrects role on approval
  const correct = faker.number.int({ min: 1, max: 100 }) <= 20;
  if (!correct) return requested;
  const pool = rolesPool().filter((r) => r !== requested);
  return faker.helpers.arrayElement(pool);
}

function nowPlusSeconds(sec: number) {
  return new Date(Date.now() + sec * 1000);
}

function nowMinusMinutes(min: number) {
  return new Date(Date.now() - min * 60 * 1000);
}

function otp6Digits() {
  // numeric-ish code (stable for tests)
  return faker.string.numeric(6);
}

function refreshExpiry(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

// -------------------- seed steps --------------------
async function upsertSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing SUPER_ADMIN_EMAIL/SUPER_ADMIN_PASSWORD in env.");
  }

  const passwordHash = await argon2.hash(password);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        globalRole: GlobalRole.SUPER_ADMIN,
        passwordHash,
        isActive: true,
      },
    });
    return existing.id;
  }

  const created = await prisma.user.create({
    data: {
      email,
      passwordHash,
      globalRole: GlobalRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  return created.id;
}

async function upsertSchool(params: { code: string; name: string }) {
  const { code, name } = params;
  return prisma.school.upsert({
    where: { code },
    update: { name, isActive: true },
    create: { code, name, isActive: true },
  });
}

async function upsertSchoolAdminForSchool(params: {
  schoolId: string;
  schoolCode: string;
  superAdminId: string;
}) {
  const { schoolId, schoolCode, superAdminId } = params;

  const adminEmail = `admin.${schoolCode}.${faker.string.alphanumeric(6).toLowerCase()}@school.local`;

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isActive: true },
    create: { email: adminEmail, isActive: true, globalRole: GlobalRole.USER },
  });

  // Membership unique is (userId, schoolId)
  await prisma.userSchoolMembership.upsert({
    where: {
      userId_schoolId: { userId: adminUser.id, schoolId },
    },
    update: {
      status: MembershipStatus.APPROVED,
      requestedRole: SchoolRole.SCHOOL_ADMIN,
      role: SchoolRole.SCHOOL_ADMIN,
      reviewedById: superAdminId,
      reviewedAt: new Date(),
      firstName: "School",
      lastName: "Admin",
      reviewNote: "Assigned by SUPER_ADMIN",
    },
    create: {
      userId: adminUser.id,
      schoolId,
      status: MembershipStatus.APPROVED,
      requestedRole: SchoolRole.SCHOOL_ADMIN,
      role: SchoolRole.SCHOOL_ADMIN,
      reviewedById: superAdminId,
      reviewedAt: new Date(),
      firstName: "School",
      lastName: "Admin",
      reviewNote: "Assigned by SUPER_ADMIN",
    },
  });

  return adminUser;
}

async function ensureUser(params: { email?: string; phone?: string }) {
  const { email, phone } = params;

  // user must have only one identifier for your scenario
  if (!email && !phone) throw new Error("User must have email or phone.");

  const existing = await prisma.user.findFirst({
    where: {
      OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
    },
  });

  if (existing) return existing;

  return prisma.user.create({
    data: {
      email: email ?? null,
      phone: phone ?? null,
      isActive: true,
      globalRole: GlobalRole.USER,
    },
  });
}

async function upsertMembership(params: {
  userId: string;
  schoolId: string;
  adminUserId: string;
  requestedRole: SchoolRole;
  status: MembershipStatus;
}) {
  const { userId, schoolId, adminUserId, requestedRole, status } = params;

  // Decide final role & review fields
  const isReviewed = status !== MembershipStatus.PENDING;
  const finalRole =
    status === MembershipStatus.APPROVED
      ? maybeCorrectRole(requestedRole)
      : requestedRole;

  const reviewNote =
    status === MembershipStatus.REJECTED
      ? faker.helpers.arrayElement([
          "Role mismatch",
          "Incomplete profile",
          "Needs verification",
        ])
      : status === MembershipStatus.SUSPENDED
        ? faker.helpers.arrayElement([
            "Policy violation",
            "Temporary hold",
            "Manual review required",
          ])
        : status === MembershipStatus.APPROVED && finalRole !== requestedRole
          ? `Corrected role from ${requestedRole} to ${finalRole}`
          : status === MembershipStatus.APPROVED
            ? "Approved"
            : null;

  // Upsert membership (unique userId+schoolId)
  const membership = await prisma.userSchoolMembership.upsert({
    where: { userId_schoolId: { userId, schoolId } },
    update: {
      status,
      requestedRole,
      role: finalRole,
      reviewedById: isReviewed ? adminUserId : null,
      reviewedAt: isReviewed ? new Date() : null,
      reviewNote: reviewNote ?? null,
      // keep profile fields if already exist, only set if null
      firstName: undefined,
      lastName: undefined,
      nationalId: undefined,
      grade: undefined,
    },
    create: {
      userId,
      schoolId,
      status,
      requestedRole,
      role: finalRole,
      reviewedById: isReviewed ? adminUserId : null,
      reviewedAt: isReviewed ? new Date() : null,
      reviewNote: reviewNote ?? null,

      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      nationalId: faker.string.numeric(10),
      grade:
        requestedRole === SchoolRole.STUDENT
          ? faker.helpers.arrayElement(["7", "8", "9", "10", "11", "12"])
          : null,
    },
  });

  return { membership, finalRole };
}

async function createOtpForApproved(params: {
  schoolId: string;
  user: { id: string; email: string | null; phone: string | null };
  markUsed?: boolean;
}) {
  const { schoolId, user, markUsed } = params;

  // OTP channel determined by which identifier exists
  let channel: OtpChannel;
  let email: string | null = null;
  let phone: string | null = null;

  if (user.email) {
    channel = OtpChannel.EMAIL;
    email = user.email.toLowerCase();
  } else if (user.phone) {
    channel = OtpChannel.SMS;
    phone = user.phone;
  } else {
    // in your scenario user always has either email or phone
    return null;
  }

  const code = otp6Digits();
  const codeHash = await argon2.hash(code);

  const ttlSeconds = envInt("OTP_TTL_SECONDS", 120);
  const resendCooldownSeconds = envInt("OTP_RESEND_COOLDOWN_SECONDS", 60);

  const expiresAt = nowPlusSeconds(ttlSeconds);
  const resendAfter = nowPlusSeconds(resendCooldownSeconds);

  const otp = await prisma.otpRequest.create({
    data: {
      schoolId,
      userId: user.id,
      purpose: OtpPurpose.LOGIN,
      channel,
      email: email ?? null,
      phone: phone ?? null,
      codeHash,
      expiresAt,
      resendAfter,
      attempts: 0,
      usedAt: markUsed ? new Date() : null,
    },
  });

  // برای تست‌های واقعی، می‌تونی code را در log چاپ کنی (ولی در prod هرگز)
  // console.log("DEV OTP:", { schoolId, userId: user.id, code });

  return otp;
}

async function createRefreshSession(params: {
  schoolId: string;
  userId: string;
}) {
  const refreshDays = envInt("REFRESH_TOKEN_TTL_DAYS", 30);
  const refreshToken = nanoid(64);
  const tokenHash = sha256(refreshToken);

  const session = await prisma.userSession.create({
    data: {
      userId: params.userId,
      schoolId: params.schoolId,
      tokenType: TokenType.REFRESH,
      tokenHash,
      expiresAt: refreshExpiry(refreshDays),
      revokedAt: null,
    },
  });

  // برای تست refresh/logout واقعی، داشتن مقدار خام refreshToken مفید است.
  // اگر خواستی می‌تونی خروجی رو در فایل جدا ذخیره کنی.
  return { session, refreshToken };
}

// -------------------- main seeding logic --------------------
async function seed() {
  const superAdminId = await upsertSuperAdmin();

  const schoolsCount = envInt("SEED_SCHOOLS_COUNT", 5);
  const usersPerSchool = envInt("SEED_USERS_PER_SCHOOL", 25);

  // درصد کاربرانی که در چند مدرسه عضو می‌شوند
  const multiSchoolUserPercent = envInt("SEED_MULTI_SCHOOL_USER_PERCENT", 15); // default 15%

  // چند مدرسه اضافی برای هر کاربر چندمدرسه‌ای
  const extraSchoolsMin = envInt("SEED_MULTI_SCHOOL_EXTRA_MIN", 1);
  const extraSchoolsMax = envInt("SEED_MULTI_SCHOOL_EXTRA_MAX", 2);

  // برای approved ها چه درصدی OTP/Session بگیرند
  const approvedOtpPercent = envInt("SEED_APPROVED_OTP_PERCENT", 70); // default 70%
  const approvedSessionPercent = envInt("SEED_APPROVED_SESSION_PERCENT", 70); // default 70%

  // 1) Create schools + school admins
  const schools: Array<{ id: string; code: string; adminUserId: string }> = [];

  for (let i = 0; i < schoolsCount; i++) {
    const code = `sch-${String(i + 1).padStart(3, "0")}`;
    const name = `School ${i + 1} - ${faker.location.city()}`;

    const school = await upsertSchool({ code, name });
    const admin = await upsertSchoolAdminForSchool({
      schoolId: school.id,
      schoolCode: code,
      superAdminId,
    });

    schools.push({ id: school.id, code, adminUserId: admin.id });
  }

  // 2) Generate base users for each school membership, but allow some to join multiple schools
  // We'll create a pool of users so we can reuse them across schools (multi-tenant edge tests).
  const globalUserPool: Array<{
    id: string;
    email: string | null;
    phone: string | null;
  }> = [];

  // Create "base" users: roughly schoolsCount * usersPerSchool, but we will reuse some
  const baseUserCount = schoolsCount * usersPerSchool;

  for (let i = 0; i < baseUserCount; i++) {
    const { email, phone } = pickIdentifier();
    const user = await ensureUser({ email, phone });
    globalUserPool.push({ id: user.id, email: user.email, phone: user.phone });
  }

  // 3) For each school, attach memberships
  for (const school of schools) {
    for (let j = 0; j < usersPerSchool; j++) {
      // pick a random user from pool
      const user = faker.helpers.arrayElement(globalUserPool);

      // create membership in this school
      const requestedRole = faker.helpers.arrayElement(rolesPool());
      const status = weightedMembershipStatus();

      const { membership } = await upsertMembership({
        userId: user.id,
        schoolId: school.id,
        adminUserId: school.adminUserId,
        requestedRole,
        status,
      });

      // If APPROVED => optionally create OTP and Refresh Session
      if (membership.status === MembershipStatus.APPROVED) {
        const makeOtp =
          faker.number.int({ min: 1, max: 100 }) <= approvedOtpPercent;
        const makeSession =
          faker.number.int({ min: 1, max: 100 }) <= approvedSessionPercent;

        if (makeOtp) {
          // sometimes mark otp as already used (simulate login)
          const markUsed = faker.number.int({ min: 1, max: 100 }) <= 40;
          await createOtpForApproved({
            schoolId: school.id,
            user,
            markUsed,
          });
        }

        if (makeSession) {
          await createRefreshSession({ schoolId: school.id, userId: user.id });
        }
      }

      // 4) Multi-school memberships for some users
      const isMultiSchool =
        faker.number.int({ min: 1, max: 100 }) <= multiSchoolUserPercent;
      if (isMultiSchool) {
        const extraCount = faker.number.int({
          min: extraSchoolsMin,
          max: extraSchoolsMax,
        });

        const otherSchools = faker.helpers
          .shuffle(schools.filter((s) => s.id !== school.id))
          .slice(0, extraCount);

        for (const s2 of otherSchools) {
          const req2 = faker.helpers.arrayElement(rolesPool());
          const st2 = weightedMembershipStatus();

          const { membership: m2 } = await upsertMembership({
            userId: user.id,
            schoolId: s2.id,
            adminUserId: s2.adminUserId,
            requestedRole: req2,
            status: st2,
          });

          // if approved in second school => create OTP + session too
          if (m2.status === MembershipStatus.APPROVED) {
            const makeOtp2 =
              faker.number.int({ min: 1, max: 100 }) <= approvedOtpPercent;
            const makeSession2 =
              faker.number.int({ min: 1, max: 100 }) <= approvedSessionPercent;

            if (makeOtp2) {
              const markUsed = faker.number.int({ min: 1, max: 100 }) <= 40;
              await createOtpForApproved({ schoolId: s2.id, user, markUsed });
            }
            if (makeSession2) {
              await createRefreshSession({ schoolId: s2.id, userId: user.id });
            }
          }
        }
      }
    }
  }

  return { superAdminId, schoolsCount, usersPerSchool };
}

async function main() {
  const res = await seed();
  console.log("✅ Seed completed:", res);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
