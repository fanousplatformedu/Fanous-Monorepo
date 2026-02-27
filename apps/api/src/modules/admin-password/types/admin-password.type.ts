import { Role } from "@prisma/client";

export type TActor = {
  id: string;
  role: Role;
  schoolId: string | null;
};

export type TChangeAdminPasswordArgs = {
  actor: TActor;
  newPassword: string;
  currentPassword: string;
};

export type TResetAdminPasswordArgs = {
  actor: TActor;
  adminUserId: string;
};
