import { Role, SchoolStatus, UserStatus } from "@prisma/client";
import { CounselorStudentLinkStatus } from "@prisma/client";

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
  take: number;
  skip: number;
  actor: TActor;
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
  status: UserStatus;
  adminUserId: string;
};

export type TManagedSchoolActor = {
  id: string;
  role: Role;
  schoolId: string | null;
};

export type TListSchoolCounselorsArgs = {
  take: number;
  skip: number;
  schoolId: string;
  query?: string | null;
  actor: TManagedSchoolActor;
};

export type TListSchoolStudentsForAssignmentArgs = {
  take: number;
  skip: number;
  schoolId: string;
  query?: string | null;
  actor: TManagedSchoolActor;
};

export type TAssignStudentsToCounselorArgs = {
  schoolId: string;
  counselorId: string;
  studentIds: string[];
  actor: TManagedSchoolActor;
};

export type TArchiveCounselorStudentAssignmentArgs = {
  assignmentId: string;
  actor: TManagedSchoolActor;
};

export type TRestoreCounselorStudentAssignmentArgs = {
  assignmentId: string;
  actor: TManagedSchoolActor;
};

export type TListCounselorStudentAssignmentsArgs = {
  take: number;
  skip: number;
  schoolId: string;
  query?: string | null;
  studentId?: string | null;
  actor: TManagedSchoolActor;
  counselorId?: string | null;
  status?: CounselorStudentLinkStatus | null;
};
