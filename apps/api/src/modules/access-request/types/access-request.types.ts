import { AccessRequestRole, AccessRequestStatus, Role } from "@prisma/client";

export type TActor = { id: string; role: Role; schoolId: string | null };

export type TSubmitAccessRequestArgs = {
  schoolId: string;
  email?: string | null;
  mobile?: string | null;
  fullName?: string | null;
  requestedRole: AccessRequestRole;
};

export type TReviewAccessRequestArgs = {
  actor: TActor;
  approve: boolean;
  requestId: string;
  rejectReason?: string | null;
  finalRole?: AccessRequestRole | null;
  notifyVia?: "EMAIL" | "SMS" | "AUTO";
};

export type SchoolUserRole = "STUDENT" | "PARENT" | "COUNSELOR";

export const SCHOOL_USER_ROLES: readonly SchoolUserRole[] = [
  "STUDENT",
  "PARENT",
  "COUNSELOR",
] as const;

export const isSchoolUserRole = (
  role: Role | string | null | undefined,
): role is SchoolUserRole => {
  return !!role && (SCHOOL_USER_ROLES as readonly string[]).includes(role);
};

export type TListAccessRequestsArgs = {
  take: number;
  skip: number;
  actor: TActor;
  query?: string | null;
  status?: AccessRequestStatus | null;
  requestedRole?: AccessRequestRole | null;
};

export type TCurrentUser = {
  id: string;
  role: Role;
  sid: string | null;
  schoolId: string | null;
  fullName: string | null;
  forcePasswordChange: boolean;
};
