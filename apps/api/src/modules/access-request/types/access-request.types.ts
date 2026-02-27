import { AccessRequestStatus, Role } from "@prisma/client";

export type TActor = { id: string; role: Role; schoolId: string | null };

export type TSubmitAccessRequestArgs = {
  schoolId: string;
  requestedRole: Role;
  email?: string | null;
  mobile?: string | null;
  fullName?: string | null;
};

export type TListAccessRequestsArgs = {
  take: number;
  skip: number;
  actor: TActor;
  query?: string | null;
  schoolId?: string | null;
  status?: AccessRequestStatus | null;
};

export type TReviewAccessRequestArgs = {
  actor: TActor;
  approve: boolean;
  requestId: string;
  finalRole?: Role | null;
  rejectReason?: string | null;
  notifyVia?: "EMAIL" | "SMS" | "AUTO";
};

export type SchoolUserRole = "STUDENT" | "PARENT" | "TEACHER" | "COUNSELOR";

export const SCHOOL_USER_ROLES: readonly SchoolUserRole[] = [
  "STUDENT",
  "PARENT",
  "TEACHER",
  "COUNSELOR",
] as const;

export const isSchoolUserRole = (
  role: Role | string | null | undefined,
): role is SchoolUserRole => {
  return !!role && (SCHOOL_USER_ROLES as readonly string[]).includes(role);
};
