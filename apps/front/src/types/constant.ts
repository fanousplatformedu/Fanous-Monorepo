import { LucideIcon } from "lucide-react";

// ============= Nav ===============
export type TNavItem = {
  href: string;
  labelKey: string;
  id: "home" | "login" | "about" | "contact";
};

export type TSocialItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

// =========== RTK Error =============
export type TNormalizedError = {
  code?: string;
  message: string;
  status?: number;
};

// ============== Otp ===============
export type TAuthIdentityPayload = {
  email?: string;
  mobile?: string;
};

// ============== Dashboard Config ===============
export type TDashboardIconName =
  | "Users"
  | "School"
  | "FileText"
  | "UserPlus2"
  | "Settings2"
  | "UserRound"
  | "UsersRound"
  | "ScrollText"
  | "UserCheck2"
  | "ClipboardList"
  | "GraduationCap"
  | "UserRoundCheck"
  | "ChartColumnBig"
  | "LayoutDashboard";

export type TDashboardNavItem = {
  key: string;
  href: string;
  labelKey: string;
  icon: TDashboardIconName;
};

export type TExportColumn<T> = {
  header: string;
  accessor: (row: T) => string | number | null | undefined;
};
