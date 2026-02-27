import { AuditAction, Role } from "@prisma/client";

export type TActor = {
  id: string;
  role: Role;
  schoolId: string | null;
};

export type TRecordAuditArgs = {
  ip?: string | null;
  action: AuditAction;
  metadata?: any | null;
  actorId?: string | null;
  schoolId?: string | null;
  entityId?: string | null;
  userAgent?: string | null;
  entityType?: string | null;
};

export type TListAuditLogsArgs = {
  take: number;
  skip: number;
  actor: TActor;
  to?: Date | null;
  from?: Date | null;
  actorId?: string | null;
  schoolId?: string | null;
  entityId?: string | null;
  entityType?: string | null;
  action?: AuditAction | null;
};
