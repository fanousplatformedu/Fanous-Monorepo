import { ComponentType, ReactNode } from "react";
import { adminLoginSchema } from "@/lib/validation/auth";
import { LucideIcon } from "lucide-react";
import { z } from "zod";

// ============ Role Gateway ==============
export type TRoleItem = {
  href: string;
  gradient: string;
  iconColor: string;
  cardGradient: string;
  secondaryHref?: string;
  secondaryActionKey?: string;
  icon: ComponentType<{ className?: string }>;
  key: "superAdmin" | "schoolAdmin" | "schoolUser";
};

// ============ Auth ===============
export type TAuthPageShellProps = {
  className?: string;
  children: ReactNode;
  contentClassName?: string;
};

export type TAuthGlassCardProps = {
  children: ReactNode;
  className?: string;
  glowClassName?: string;
};

export type TAuthPageBadgeProps = {
  text: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber";
};

export type TAuthFormActionsProps = {
  backText: string;
  onBack: () => void;
  submitText: string;
  loadingText: string;
  isLoading?: boolean;
};

export type TOtpFlipCardProps = {
  back: ReactNode;
  flipped: boolean;
  front: ReactNode;
};

export type TFormValues = z.infer<typeof adminLoginSchema>;

export type TAdminLoginFormBaseProps<TMutationResult> = {
  title: string;
  footer: string;
  badgeText: string;
  redirectTo: string;
  description: string;
  badgeIcon: LucideIcon;
  badgeTone?: "blue" | "green" | "amber";
  getSuccessMessage: (result: TMutationResult) => string;
  submit: (values: TFormValues) => Promise<TMutationResult>;
};

export type TPieDatum = {
  name: string;
  value: number;
};

export type TPieSummaryChartProps = {
  data: TPieDatum[];
};

export type TDonutDatum = {
  name: string;
  value: number;
};

export type TDonutSummaryChartProps = {
  data: TDonutDatum[];
};

export type TBarDatum = {
  name: string;
  value: number;
};

export type TBarSummaryChartProps = {
  data: TBarDatum[];
};

export type TDashboardSectionProps = {
  title?: string;
  className?: string;
  children: ReactNode;
  description?: string;
};

// =========== Super Admin Dashboard =============
export type TSchoolFilterValues = {
  query: string;
  status: "" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
};

export type TSchoolsFiltersProps = {
  value: TSchoolFilterValues;
  onReset: () => void;
  onApply: (values: TSchoolFilterValues) => void;
};

export type TSchoolAdminFilterValues = {
  schoolId: string;
  status: "" | "ACTIVE" | "DISABLED" | "DELETED";
};

export type TSchoolAdminsFiltersProps = {
  onReset: () => void;
  value: TSchoolAdminFilterValues;
  onApply: (values: TSchoolAdminFilterValues) => void;
};

export type TAuditLogFilterValues = {
  action: string;
  actorId: string;
  schoolId: string;
  entityType: string;
};

export type TAuditLogsFiltersProps = {
  value: TAuditLogFilterValues;
  onReset: () => void;
  onApply: (values: TAuditLogFilterValues) => void;
};

export type TCreateAuditLogDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// ============ School Admin Dashboard =============
export type TPasswordFormValues = {
  newPassword: string;
  currentPassword: string;
};
