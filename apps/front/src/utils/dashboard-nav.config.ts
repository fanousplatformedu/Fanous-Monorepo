import { TDashboardNavItem } from "@/types/constant";

export const superAdminNav: TDashboardNavItem[] = [
  {
    key: "overview",
    labelKey: "dashboard.superAdmin.nav.overview",
    href: "/super-admin/dashboard",
    icon: "LayoutDashboard",
  },
  {
    key: "schools",
    labelKey: "dashboard.superAdmin.nav.schools",
    href: "/super-admin/dashboard/schools",
    icon: "School",
  },
  {
    key: "schoolAdmins",
    labelKey: "dashboard.superAdmin.nav.schoolAdmins",
    href: "/super-admin/dashboard/school-admins",
    icon: "UserRound",
  },
  {
    key: "accessRequests",
    labelKey: "dashboard.superAdmin.nav.accessRequests",
    href: "/super-admin/dashboard/access-requests",
    icon: "UserPlus2",
  },
  {
    key: "auditLogs",
    labelKey: "dashboard.superAdmin.nav.auditLogs",
    href: "/super-admin/dashboard/audit-logs",
    icon: "ScrollText",
  },
  {
    key: "settings",
    labelKey: "dashboard.superAdmin.nav.settings",
    href: "/super-admin/dashboard/settings",
    icon: "Settings2",
  },
];

export const schoolAdminNav: TDashboardNavItem[] = [
  {
    key: "overview",
    labelKey: "dashboard.schoolAdmin.nav.overview",
    href: "/school-admin/dashboard",
    icon: "LayoutDashboard",
  },
  {
    key: "members",
    labelKey: "dashboard.schoolAdmin.nav.members",
    href: "/school-admin/dashboard/members",
    icon: "Users",
  },
  {
    key: "requests",
    labelKey: "dashboard.schoolAdmin.nav.accessRequests",
    href: "/school-admin/dashboard/access-requests",
    icon: "UserRoundCheck",
  },
  {
    key: "grades",
    labelKey: "dashboard.schoolAdmin.nav.grades",
    href: "/school-admin/dashboard/grades",
    icon: "GraduationCap",
  },
  {
    key: "assignments",
    labelKey: "dashboard.schoolAdmin.nav.assignments",
    href: "/school-admin/dashboard/assignments",
    icon: "FileText",
  },
  {
    key: "reports",
    labelKey: "dashboard.schoolAdmin.nav.reports",
    href: "/school-admin/dashboard/reports",
    icon: "ChartColumnBig",
  },
  {
    key: "classrooms",
    labelKey: "dashboard.schoolAdmin.nav.classrooms",
    href: "/school-admin/dashboard/classrooms",
    icon: "School",
  },
  {
    key: "enrollments",
    labelKey: "dashboard.schoolAdmin.nav.enrollments",
    href: "/school-admin/dashboard/enrollments",
    icon: "ClipboardList",
  },
  {
    key: "audit",
    labelKey: "dashboard.schoolAdmin.nav.auditLogs",
    href: "/school-admin/dashboard/audit-logs",
    icon: "ScrollText",
  },
  {
    key: "settings",
    labelKey: "dashboard.schoolAdmin.nav.settings",
    href: "/school-admin/dashboard/settings",
    icon: "Settings2",
  },
];

export const schoolUserNav: TDashboardNavItem[] = [
  {
    key: "overview",
    labelKey: "dashboard.user.nav.overview",
    href: "/user/dashboard",
    icon: "LayoutDashboard",
  },
  {
    key: "profile",
    labelKey: "dashboard.user.nav.profile",
    href: "/user/dashboard/profile",
    icon: "UserRound",
  },
  {
    key: "settings",
    labelKey: "dashboard.user.nav.settings",
    href: "/user/dashboard/settings",
    icon: "Settings2",
  },
];
