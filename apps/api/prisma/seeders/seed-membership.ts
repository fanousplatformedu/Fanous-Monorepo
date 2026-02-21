import { TSeedCtx, TSeedSchool, TSeedUserSlim } from "@ctypes/seed-types";
import { MembershipStatus, SchoolRole } from "@prisma/client";
import { createOtpForApprovedIfNeeded } from "./seed-otp";
import { createRefreshSessionIfNeeded } from "./seed-session";

import * as H from "@utils/seed-helper";

export const upsertMembership = async (
  ctx: TSeedCtx,
  input: {
    userId: string;
    schoolId: string;
    reviewerId: string;
    requestedRole: SchoolRole;
    status: MembershipStatus;
  },
) => {
  if (input.requestedRole === SchoolRole.SCHOOL_ADMIN)
    throw new Error("Invalid requestedRole for normal register flow.");
  const isReviewed = input.status !== MembershipStatus.PENDING;
  const approvedRole =
    input.status === MembershipStatus.APPROVED
      ? H.maybeCorrectApprovedRole(ctx, input.requestedRole)
      : null;

  const reviewNote =
    input.status === MembershipStatus.REJECTED
      ? ctx.faker.helpers.arrayElement([
          "Role mismatch",
          "Incomplete profile",
          "Needs verification",
        ])
      : input.status === MembershipStatus.SUSPENDED
        ? ctx.faker.helpers.arrayElement([
            "Policy violation",
            "Temporary hold",
            "Manual review required",
          ])
        : input.status === MembershipStatus.APPROVED &&
            approvedRole &&
            approvedRole !== input.requestedRole
          ? `Corrected role from ${input.requestedRole} to ${approvedRole}`
          : input.status === MembershipStatus.APPROVED
            ? "Approved"
            : null;

  const grade =
    input.requestedRole === SchoolRole.STUDENT
      ? ctx.faker.helpers.arrayElement(["7", "8", "9", "10", "11", "12"])
      : null;

  const membership = await ctx.prisma.userSchoolMembership.upsert({
    where: {
      userId_schoolId: { userId: input.userId, schoolId: input.schoolId },
    },
    update: {
      status: input.status,
      requestedRole: input.requestedRole,
      approvedRole: approvedRole ?? null,
      reviewedById: isReviewed ? input.reviewerId : null,
      reviewedAt: isReviewed ? new Date() : null,
      reviewNote: reviewNote ?? null,
    },
    create: {
      userId: input.userId,
      schoolId: input.schoolId,
      status: input.status,
      requestedRole: input.requestedRole,
      approvedRole: approvedRole ?? null,
      reviewedById: isReviewed ? input.reviewerId : null,
      reviewedAt: isReviewed ? new Date() : null,
      reviewNote: reviewNote ?? null,
      firstName: ctx.faker.person.firstName(),
      lastName: ctx.faker.person.lastName(),
      nationalId: ctx.faker.string.numeric(10),
      grade: grade ?? null,
    },
    select: {
      id: true,
      status: true,
      requestedRole: true,
      approvedRole: true,
      schoolId: true,
      userId: true,
    },
  });
  return membership;
};

export const seedMembershipsForSchools = async (
  ctx: TSeedCtx,
  schools: TSeedSchool[],
  users: TSeedUserSlim[],
) => {
  const approvedOtpPercent = ctx.env.SEED_APPROVED_OTP_PERCENT;
  const approvedSessionPercent = ctx.env.SEED_APPROVED_SESSION_PERCENT;

  for (const school of schools) {
    for (let j = 0; j < ctx.env.SEED_USERS_PER_SCHOOL; j++) {
      const user = ctx.faker.helpers.arrayElement(users);
      const requestedRole = ctx.faker.helpers.arrayElement(H.rolesPool());
      const status = H.weightedMembershipStatus(ctx);
      const membership = await upsertMembership(ctx, {
        userId: user.id,
        schoolId: school.id,
        reviewerId: school.adminUserId,
        requestedRole,
        status,
      });

      if (
        membership.status === MembershipStatus.APPROVED &&
        membership.approvedRole
      ) {
        await createOtpForApprovedIfNeeded(ctx, {
          schoolId: school.id,
          user,
          approvedRole: membership.approvedRole,
          chancePercent: approvedOtpPercent,
        });

        await createRefreshSessionIfNeeded(ctx, {
          schoolId: school.id,
          userId: user.id,
          chancePercent: approvedSessionPercent,
        });
      }

      const isMultiSchool =
        ctx.faker.number.int({ min: 1, max: 100 }) <=
        ctx.env.SEED_MULTI_SCHOOL_USER_PERCENT;
      if (!isMultiSchool) continue;

      const extraCount = ctx.faker.number.int({
        min: ctx.env.SEED_MULTI_SCHOOL_EXTRA_MIN,
        max: ctx.env.SEED_MULTI_SCHOOL_EXTRA_MAX,
      });

      const otherSchools = ctx.faker.helpers
        .shuffle(schools.filter((s) => s.id !== school.id))
        .slice(0, extraCount);

      for (const s2 of otherSchools) {
        const req2 = ctx.faker.helpers.arrayElement(H.rolesPool());
        const st2 = H.weightedMembershipStatus(ctx);

        const m2 = await upsertMembership(ctx, {
          userId: user.id,
          schoolId: s2.id,
          reviewerId: s2.adminUserId,
          requestedRole: req2,
          status: st2,
        });

        if (m2.status === MembershipStatus.APPROVED && m2.approvedRole) {
          await createOtpForApprovedIfNeeded(ctx, {
            schoolId: s2.id,
            user,
            approvedRole: m2.approvedRole,
            chancePercent: approvedOtpPercent,
          });

          await createRefreshSessionIfNeeded(ctx, {
            schoolId: s2.id,
            userId: user.id,
            chancePercent: approvedSessionPercent,
          });
        }
      }
    }
  }
};
