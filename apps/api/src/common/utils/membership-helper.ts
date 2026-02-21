import { normalizeIdentifier as normalizeOtpIdentifier } from "@utils/otp-helper";
import { MembershipStatus, Prisma, SchoolRole } from "@prisma/client";
import { TNormalizedIdentifier } from "@membership/types/membership-service";
import { MembershipCodes } from "@membership/enums/membership-codes.enum";
import { AppError } from "@ctypes/app-error";

export const requireAuthUserId = (userId: string): string => {
  if (!userId) {
    throw new AppError(
      MembershipCodes.UNAUTHORIZED as any,
      "UNAUTHORIZED",
      401,
    );
  }
  return userId;
};

export const ensureRoleAllowedForRegister = (role: SchoolRole): void => {
  if (role === SchoolRole.SCHOOL_ADMIN) {
    throw new AppError(MembershipCodes.ROLE_INVALID as any);
  }
};

export const ensureFinalRoleValid = (finalRole: SchoolRole): void => {
  if (finalRole === SchoolRole.SCHOOL_ADMIN) {
    throw new AppError(MembershipCodes.ROLE_INVALID as any);
  }
};

export const ensurePendingStatus = (status: MembershipStatus): void => {
  if (status !== MembershipStatus.PENDING) {
    throw new AppError(MembershipCodes.ONLY_PENDING_CAN_BE_REVIEWED as any);
  }
};

export const normalizeIdentifier = (
  identifier: string,
): TNormalizedIdentifier => {
  const norm = normalizeOtpIdentifier(identifier);
  return {
    email: norm.email ?? null,
    phone: norm.phone ?? null,
    emailNormalized: norm.emailNormalized ?? null,
    phoneNormalized: norm.phoneNormalized ?? null,
  };
};

export const buildUserLookupOrWhere = (norm: TNormalizedIdentifier) => {
  return {
    OR: [
      ...(norm.emailNormalized
        ? [{ emailNormalized: norm.emailNormalized }]
        : []),
      ...(norm.phoneNormalized
        ? [{ phoneNormalized: norm.phoneNormalized }]
        : []),
    ],
  };
};

export const buildMembershipUniqueWhere = (
  userId: string,
  schoolId: string,
): Prisma.UserSchoolMembershipWhereUniqueInput => {
  return {
    userId_schoolId: { userId, schoolId },
  };
};

export const membershipExistsError = (existingStatus: MembershipStatus) => {
  return new AppError(
    MembershipCodes.MEMBERSHIP_EXISTS as any,
    MembershipCodes.MEMBERSHIP_EXISTS,
    400,
    { status: existingStatus },
  );
};

export const membershipSuspendedError = (existingStatus: MembershipStatus) => {
  return new AppError(
    MembershipCodes.FORBIDDEN as any,
    "MEMBERSHIP_SUSPENDED",
    403,
    { status: existingStatus },
  );
};

export const normalizeSignupContacts = (email: string, phone: string) => {
  const emailNormalized = email.trim().toLowerCase();
  const phoneNormalized = phone.trim().replace(/\s|-/g, "");
  return {
    email: email.trim(),
    phone: phone.trim(),
    emailNormalized,
    phoneNormalized,
  };
};

export const contactConflictError = (details?: any) => {
  return new AppError(
    MembershipCodes.CONTACT_CONFLICT,
    "CONTACT_CONFLICT",
    409,
    details,
  );
};
