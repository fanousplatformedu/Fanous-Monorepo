import { Prisma, SchoolRole, GlobalRole } from "@prisma/client";
import { normalizeIdentifier } from "@utils/membership-helper";
import { MembershipStatus } from "@prisma/client";
import { AdminCodes } from "@superAdmin/enums/admin-codes.enum";
import { AppError } from "@ctypes/app-error";

import * as T from "@superAdmin/types/admin-service";

export const requireSuperAdminId = (
  input: T.TRequireSuperAdminIdInput,
): string => {
  const id = input.superAdminUserId;
  if (!id)
    throw new AppError(AdminCodes.UNAUTHORIZED as any, "UNAUTHORIZED", 401);
  return id;
};

export const membershipUniqueWhere = (
  userId: string,
  schoolId: string,
): Prisma.UserSchoolMembershipWhereUniqueInput => {
  return { userId_schoolId: { userId, schoolId } };
};

export const buildListAdminsWhere = (
  schoolId: string,
  status?: MembershipStatus,
): Prisma.UserSchoolMembershipWhereInput => {
  return {
    schoolId,
    approvedRole: SchoolRole.SCHOOL_ADMIN,
    ...(status ? { status } : {}),
  };
};

export const ensureUserAssignable = (user: {
  isActive: boolean;
  globalRole: GlobalRole;
}) => {
  if (!user.isActive) throw new AppError(AdminCodes.USER_NOT_FOUND as any);
  if (user.globalRole === GlobalRole.SUPER_ADMIN)
    throw new AppError(
      AdminCodes.FORBIDDEN as any,
      "CANNOT_ASSIGN_SUPER_ADMIN",
      403,
    );
};

export const ensureNoNonAdminRoleConflict = (existing?: {
  approvedRole: SchoolRole | null;
  status: MembershipStatus;
}) => {
  if (!existing) return;
  if (
    existing.approvedRole &&
    existing.approvedRole !== SchoolRole.SCHOOL_ADMIN
  ) {
    throw new AppError(
      AdminCodes.FORBIDDEN as any,
      "USER_ALREADY_HAS_NON_ADMIN_ROLE_IN_SCHOOL",
      409,
      { approvedRole: existing.approvedRole, status: existing.status },
    );
  }
};

export const mapToSchoolAdminEntity = (m: any): T.TSchoolAdminItem => {
  return {
    userId: m.userId,
    status: m.status,
    membershipId: m.id,
    schoolId: m.schoolId,
    createdAt: m.createdAt,
    requestedRole: m.requestedRole,
    email: m.user?.email ?? undefined,
    lastName: m.lastName ?? undefined,
    phone: m.user?.phone ?? undefined,
    firstName: m.firstName ?? undefined,
    reviewedAt: m.reviewedAt ?? undefined,
    reviewNote: m.reviewNote ?? undefined,
    approvedRole: m.approvedRole ?? undefined,
    reviewedById: m.reviewedById ?? undefined,
  };
};

export const normalizeAssignInput = (input: { identifier: string }) =>
  normalizeIdentifier(input.identifier);
