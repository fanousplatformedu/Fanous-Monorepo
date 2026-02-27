import { Role, SchoolStatus, UserStatus } from "@prisma/client";

export type TActor = { id: string; role: Role; schoolId: string | null };

export type TCreateSchoolArgs = {
  actor: TActor;
  name: string;
  code?: string | null;
  settings?: any | null;
};

export type TUpdateSchoolArgs = {
  actor: TActor;
  schoolId: string;
  name?: string | null;
  code?: string | null;
  settings?: any | null;
};

export type TSetSchoolStatusArgs = {
  actor: TActor;
  schoolId: string;
  status: SchoolStatus;
};

export type TListSchoolsArgs = {
  actor: TActor;
  take: number;
  skip: number;
  query?: string | null;
  status?: SchoolStatus | null;
};

export type TCreateSchoolAdminArgs = {
  actor: TActor;
  schoolId: string;
  adminEmail: string;
  adminFullName?: string | null;
};

export type TListSchoolAdminsArgs = {
  take: number;
  skip: number;
  actor: TActor;
  schoolId?: string | null;
  status?: UserStatus | null;
};

export type TSetAdminStatusArgs = {
  actor: TActor;
  adminUserId: string;
  status: UserStatus;
};
