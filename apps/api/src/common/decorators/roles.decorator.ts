import { GlobalRole, SchoolRole } from "@prisma/client";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles_key";
export type RoleValue = GlobalRole | SchoolRole;

export type RolesPolicy = {
  roles: RoleValue[];
  mode?: "ANY" | "ALL";
};

export const Roles = (...roles: RoleValue[]) =>
  SetMetadata(ROLES_KEY, { roles, mode: "ANY" } satisfies RolesPolicy);

export const RolesAll = (...roles: RoleValue[]) =>
  SetMetadata(ROLES_KEY, { roles, mode: "ALL" } satisfies RolesPolicy);
