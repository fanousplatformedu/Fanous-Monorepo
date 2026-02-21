import { MembershipStatus, SchoolRole } from "@prisma/client";
import { ListMembershipRequestsInput } from "@schoolAdmin/dtos/list-requests.input";
import { ReviewMembershipInput } from "@schoolAdmin/dtos/review-membership.input";
import { SchoolAdminMessage } from "@schoolAdmin/enums/school-admin-message.enum";

// =========== service inputs =========
export type TListMembershipRequestsParams = {
  adminUserId: string;
  adminSchoolId: string;
  input: ListMembershipRequestsInput;
};

export type TReviewMembershipParams = {
  adminUserId: string;
  adminSchoolId: string;
  input: ReviewMembershipInput;
};

export type TMembershipRequestItem = {
  id: string;
  userId: string;
  email?: string;
  phone?: string;
  grade?: string;
  createdAt: Date;
  schoolId: string;
  lastName?: string;
  reviewedAt?: Date;
  firstName?: string;
  nationalId?: string;
  reviewNote?: string;
  reviewedById?: string;
  status: MembershipStatus;
  requestedRole: SchoolRole;
  approvedRole?: SchoolRole;
};

export type TMembershipRequestsPage = {
  total: number;
  items: TMembershipRequestItem[];
};

export type TReviewResult = {
  message: SchoolAdminMessage;
  membership: TMembershipRequestItem;
};

export type TRequireActiveSchoolInput = { schoolId: string };

export type TRequireAdminContextInput = {
  adminUserId: string;
  adminSchoolId: string;
};

export type TParseDateRangeInput = {
  to?: string;
  from?: string;
};
