import { z } from "zod";

export const createSchoolSchema = z.object({
  name: z.string().min(2, "School name is required"),
  code: z.string().min(2, "Code is required").optional().or(z.literal("")),
});

export const updateSchoolSchema = z.object({
  schoolId: z.string().min(1),
  name: z.string().min(2, "School name is required"),
  code: z.string().min(2, "Code is required").optional().or(z.literal("")),
});

export type CreateValues = z.infer<typeof createSchoolSchema>;
export type UpdateValues = z.infer<typeof updateSchoolSchema>;

export const createSchoolAdminSchema = z.object({
  schoolId: z.string().min(1, "School is required"),
  adminEmail: z.string().email("Invalid email"),
  adminFullName: z.string().optional().or(z.literal("")),
});

export type Values = z.infer<typeof createSchoolAdminSchema>;

export const setSchoolStatusSchema = z.object({
  schoolId: z.string().min(1),
  status: z.enum(["ACTIVE", "SUSPENDED", "ARCHIVED"]),
});

export const setAdminStatusSchema = z.object({
  adminUserId: z.string().min(1),
  status: z.enum(["ACTIVE", "DISABLED", "DELETED"]),
});

export const superAuditLogSchema = z.object({
  schoolId: z.string().optional().or(z.literal("")),
  action: z.string().min(2, "Action is required"),
  entityType: z.string().optional().or(z.literal("")),
  entityId: z.string().optional().or(z.literal("")),
  metadata: z.string().optional().or(z.literal("")),
});

export type TSuperAuditLogValues = z.infer<typeof superAuditLogSchema>;

export const superAdminChangePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
});

export type PasswordValues = z.infer<typeof superAdminChangePasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
