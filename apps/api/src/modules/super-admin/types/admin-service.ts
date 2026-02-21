import { MembershipStatus, SchoolRole, Prisma } from "@prisma/client";
import { AssignSchoolAdminInput } from "@superAdmin/dtos/assign-school.input";
import { RemoveSchoolAdminInput } from "@superAdmin/dtos/remove-school.input";
import { ListSchoolAdminsInput } from "@superAdmin/dtos/list-school.input";
import { AdminMessage } from "@superAdmin/enums/admin-message.enum";

export type TAssignSchoolAdminParams = {
  superAdminUserId: string;
  input: AssignSchoolAdminInput;
};

export type TRemoveSchoolAdminParams = {
  superAdminUserId: string;
  input: RemoveSchoolAdminInput;
};

export type TListSchoolAdminsParams = {
  input: ListSchoolAdminsInput;
};

export type TListSchoolAdminsOutput = {
  items: any[];
  total: number;
};

export type TAssignSchoolAdminResult = {
  message: AdminMessage;
  admin: TSchoolAdminItem;
};

export type TSchoolAdminItem = {
  userId: string;
  email?: string;
  phone?: string;
  createdAt: Date;
  schoolId: string;
  reviewedAt?: Date;
  lastName?: string;
  firstName?: string;
  reviewNote?: string;
  membershipId: string;
  reviewedById?: string;
  status: MembershipStatus;
  requestedRole: SchoolRole;
  approvedRole?: SchoolRole;
};

export type TRequireSchoolActiveInput = { schoolId: string };
export type TRequireSuperAdminIdInput = { superAdminUserId?: string };

export type TAdminMembershipUniqueWhere =
  Prisma.UserSchoolMembershipWhereUniqueInput;
export type TAdminMembershipListWhere = Prisma.UserSchoolMembershipWhereInput;
