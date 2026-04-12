import type { Role } from "@prisma/client";

export type TAdminRole = Extract<Role, "SUPER_ADMIN" | "SCHOOL_ADMIN">;

export type TAdminActor = {
  id: string;
  role: TAdminRole;
  schoolId: string | null;
};

export type TChangeAdminPasswordArgs = {
  actor: TAdminActor;
  newPassword: string;
  currentPassword: string;
};

export type TResetAdminPasswordArgs = {
  actor: {
    id: string;
    schoolId: string | null;
    role: Extract<Role, "SUPER_ADMIN">;
  };
  adminUserId: string;
};
