import { Control, FieldPath, FieldValues } from "react-hook-form";
import { TDashboardNavItem } from "@/types/constant";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

// ============= Header =============
export type TBrandProps = {
  href?: string;
  size?: "sm" | "md";
};

export type TNavLinksProps = {
  href: string;
  label: string;
  active?: boolean;
  className?: string;
  onClick?: () => void;
};

// =========== User Menu ============
export type TUserMenuProps = {
  mobile?: boolean;
  onActionDone?: () => void;
};

export type TRoleBadgeProps = {
  className?: string;
  role?: string | null;
};

export type TShortcutChipProps = {
  href: string;
  label: string;
  icon: ReactNode;
  className?: string;
};
// =========== Auth ============
export type TFloatingInputFieldProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
  inputClassName?: string;
  type?: React.HTMLInputTypeAttribute;
};

export type TFloatingPasswordFieldProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  control: Control<T>;
};

export type TSelectOption = {
  label: string;
  value: string;
};

export type TFloatingSelectFieldProps<T extends FieldValues> = {
  label: string;
  name: FieldPath<T>;
  disabled?: boolean;
  control: Control<T>;
  placeholder?: string;
  options: TSelectOption[];
};

// =============== Dashboard ================
export type TDashboardSidebarProps = {
  title: string;
  subtitle?: string;
  items: TDashboardNavItem[];
};

export type TDashboardShellProps = {
  header: ReactNode;
  sidebar: ReactNode;
  className?: string;
  children: ReactNode;
};
export type TDashboardHeaderProps = {
  title: string;
  description?: string;
  rightSlot?: ReactNode;
};

export type TDashboardStatCardProps = {
  title: string;
  icon: LucideIcon;
  subtitle?: string;
  value: number | string;
};

export type TDashboardChartCardProps = {
  title: string;
  children: ReactNode;
  description?: string;
};

export type TDashboardTableCardProps = {
  title: string;
  children: ReactNode;
  description?: string;
};

export type TDashboardEmptyStateProps = {
  title: string;
  icon: LucideIcon;
  description?: string;
};

// ============= Super Admin Dashborad ================
export type TChartItem = {
  name: string;
  value: number;
};

export type TSchoolAdminFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type TSchoolFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: {
    id: string;
    name: string;
    code?: string | null;
  } | null;
};

export type TSuperAdminKpiCardProps = {
  title: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
  value: string | number;
};

export type TSuperAdminSectionCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  description?: string;
};

export type TDashboardLoadingCardProps = {
  rows?: number;
  title?: boolean;
};

export type TTableActionButtonProps = {
  label: string;
  icon: LucideIcon;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "brandChip" | "brandOutline" | "brandDanger";
};

export type TTrendWidgetProps = {
  title: string;
  hint?: string;
  value: number | string;
};

type TSortDirection = "asc" | "desc";

export type TTableSortButtonProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  direction?: TSortDirection;
};

export type TTablePaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export type TDetailDrawerProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  description?: string;
  onOpenChange: (open: boolean) => void;
};

export type TStatusValue =
  | "ACTIVE"
  | "SUSPENDED"
  | "ARCHIVED"
  | "DISABLED"
  | "DELETED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | string;

export type TStatusBadgeProps = {
  className?: string;
  value?: TStatusValue | null;
};
