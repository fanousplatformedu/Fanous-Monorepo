import { Role, SchoolStatus, UserStatus } from "@prisma/client";

export type TActor = { id: string; role: Role; schoolId: string | null };

export type TRequestMeta = {
  ip?: string | null;
  userAgent?: string | null;
};

export type TCreateSchoolArgs = TRequestMeta & {
  actor: TActor;
  name: string;
  code?: string | null;
  settings?: any | null;
};

export type TUpdateSchoolArgs = TRequestMeta & {
  actor: TActor;
  schoolId: string;
  name?: string | null;
  code?: string | null;
  settings?: any | null;
};

export type TSetSchoolStatusArgs = TRequestMeta & {
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

export type TCreateSchoolAdminArgs = TRequestMeta & {
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

export type TSetAdminStatusArgs = TRequestMeta & {
  actor: TActor;
  adminUserId: string;
  status: UserStatus;
};
