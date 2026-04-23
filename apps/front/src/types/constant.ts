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
  | "Bell"
  | "Users"
  | "Brain"
  | "School"
  | "FileText"
  | "Settings"
  | "UserPlus2"
  | "Settings2"
  | "UserRound"
  | "BadgeHelp"
  | "UsersRound"
  | "ScrollText"
  | "UserCheck2"
  | "NotebookPen"
  | "ClipboardList"
  | "GraduationCap"
  | "UserRoundCheck"
  | "ChartColumnBig"
  | "MessagesSquare"
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

export type TResultLike = {
  musical?: number | null;
  linguistic?: number | null;
  logicalMath?: number | null;
  naturalistic?: number | null;
  visualSpatial?: number | null;
  interpersonal?: number | null;
  intrapersonal?: number | null;
  assignmentTitle?: string | null;
  bodilyKinesthetic?: number | null;
  dominantIntelligence?: string | null;
};

export type TTranslate = (
  key: string,
  fallback?: string,
  params?: Record<string, string>,
) => string;
