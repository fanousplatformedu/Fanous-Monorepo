import { Role, UserStatus } from "@prisma/client";

export type TUpdateMeArgs = {
  userId: string;
  email?: string | null;
  mobile?: string | null;
  firstName?: string | null;
  lastName?: string | null;
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

export type TSchoolMemberArgs = {
  userId: string;
  actor: { id: string; role: Role; schoolId: string | null };
};

export type TRemoveSchoolMemberArgs = {
  targetUserId: string;
  hardDelete?: boolean;
  actor: { id: string; role: Role; schoolId: string | null };
};

export type TAddSchoolUserArgs = {
  password: string;
  email: string ;
  mobile: string ;
  firstName: string ;
  lastName: string ;
  role: Role;
  isActive: boolean;
  username: string;
  forcePasswordChange: boolean;
  actor: { id: string; role: Role; schoolId: string | null };
};

export type TEditSchoolUserArgs = {
  targetUserId: string;
  email?: string | null;
  mobile?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role?: Role | null;
  isActive?: boolean | null;
  username?: string | null;
  forcePasswordChange?: boolean | null;
  password?: string | null;
  actor: { id: string; role: Role; schoolId: string | null };
};