import { SetMetadata } from "@nestjs/common";

export const SCHOOL_SCOPE_KEY = "school_scope";
export type SchoolScopePolicy = {
  requireActive?: boolean;
  allowSuperAdminBypass?: boolean;
};

export const SchoolScope = (policy: SchoolScopePolicy = {}) =>
  SetMetadata(SCHOOL_SCOPE_KEY, {
    requireActive: policy.requireActive ?? true,
    allowSuperAdminBypass: policy.allowSuperAdminBypass ?? true,
  } satisfies SchoolScopePolicy);
