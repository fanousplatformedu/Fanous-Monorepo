import { MembershipStatus, SchoolRole } from "@prisma/client";
import { TParseDateRangeInput } from "@schoolAdmin/types/school-admin.types";
import { SchoolAdminCodes } from "@schoolAdmin/enums/school-admin-codes.enum";
import { AppError } from "@ctypes/app-error";
import { Prisma } from "@prisma/client";

export const requireAdminContext = (input: {
  adminUserId: string;
  adminSchoolId: string;
}) => {
  if (!input.adminUserId)
    throw new AppError(SchoolAdminCodes.UNAUTHORIZED, "UNAUTHORIZED", 401);
  if (!input.adminSchoolId)
    throw new AppError(SchoolAdminCodes.FORBIDDEN, "NO_SCHOOL_CONTEXT", 403);
  return true;
};

export const toDateOrNull = (v?: string): Date | null => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const parseDateRange = (input: TParseDateRangeInput) => {
  const from = toDateOrNull(input.from);
  const to = toDateOrNull(input.to);
  return { from, to };
};

export const buildSearchOr = (
  qRaw?: string,
): Prisma.UserSchoolMembershipWhereInput["OR"] | undefined => {
  const q = qRaw?.trim();
  if (!q) return undefined;
  return [
    { firstName: { contains: q, mode: "insensitive" } },
    { lastName: { contains: q, mode: "insensitive" } },
    { nationalId: { contains: q, mode: "insensitive" } },
    { user: { email: { contains: q, mode: "insensitive" } } },
    { user: { phone: { contains: q, mode: "insensitive" } } },
  ];
};

export const ensurePending = (membershipStatus: MembershipStatus) => {
  if (membershipStatus !== MembershipStatus.PENDING)
    throw new AppError(SchoolAdminCodes.ONLY_PENDING_CAN_BE_REVIEWED);
};

export const ensureSchoolMatches = (
  adminSchoolId: string,
  membershipSchoolId: string,
) => {
  if (membershipSchoolId !== adminSchoolId)
    throw new AppError(SchoolAdminCodes.FORBIDDEN);
};

export const ensureRoleNotAdmin = (finalRole: SchoolRole) => {
  if (finalRole === SchoolRole.SCHOOL_ADMIN)
    throw new AppError(
      SchoolAdminCodes.FORBIDDEN,
      "CANNOT_ASSIGN_ADMIN_ROLE",
      403,
    );
};
