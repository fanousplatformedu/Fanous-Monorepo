import { Role, UserStatus } from "@prisma/client";

export type TUpdateMeArgs = {
  userId: string;
  email?: string | null;
  mobile?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
};

export type TListSchoolMembersArgs = {
  take: number;
  skip: number;
  role?: Role | null;
  query?: string | null;
  status?: UserStatus | null;
  actor: { id: string; role: Role; schoolId: string | null };
};

export type TRemoveSchoolMemberArgs = {
  targetUserId: string;
  hardDelete?: boolean;
  actor: { id: string; role: Role; schoolId: string | null };
};
