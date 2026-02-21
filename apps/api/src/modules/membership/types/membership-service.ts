import { MembershipStatus, SchoolRole } from "@prisma/client";
import { ListPendingRequestsInput } from "@membership/dtos/list-pending.input";
import { ApproveMembershipInput } from "@membership/dtos/approve-membership.input";
import { RejectMembershipInput } from "@membership/dtos/reject-membership.input";
import { RegisterRequestInput } from "@membership/dtos/register-request.input";

// ============ shared ==========
export type TRequireSchoolActiveInput = { schoolId: string };

export type TEnsureRoleAllowedForRegisterInput = { role: SchoolRole };

export type TRequireSchoolAdminForSchoolInput = {
  adminUserId: string;
  schoolId: string;
};

// ========== service inputs =============
export type TRegisterRequestInput = {
  input: RegisterRequestInput;
};

export type TMeInput = { userId: string };

export type TMyMembershipsInput = { userId: string; schoolId: string };

export type TListPendingRequestsInput = {
  adminUserId: string;
  input: ListPendingRequestsInput;
};

export type TApproveMembershipInput = {
  adminUserId: string;
  input: ApproveMembershipInput;
};

export type TRejectMembershipInput = {
  adminUserId: string;
  input: RejectMembershipInput;
};

// =========== internal helper ============
export type TMembershipExistsErrorMeta = { status: MembershipStatus };

export type TNormalizedIdentifier = {
  email: string | null;
  phone: string | null;
  emailNormalized: string | null;
  phoneNormalized: string | null;
};
