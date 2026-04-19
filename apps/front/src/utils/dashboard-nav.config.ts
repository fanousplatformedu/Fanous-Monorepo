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

export const studentNav: TDashboardNavItem[] = [
  {
    key: "overview",
    labelKey: "dashboard.student.nav.overview",
    href: "/student/dashboard",
    icon: "LayoutDashboard",
  },
  {
    key: "assignments",
    labelKey: "dashboard.student.nav.assignments",
    href: "/student/dashboard/assignments",
    icon: "NotebookPen",
  },
  {
    key: "results",
    labelKey: "dashboard.student.nav.results",
    href: "/student/dashboard/results",
    icon: "ChartColumnBig",
  },
  {
    key: "notifications",
    labelKey: "dashboard.student.nav.notifications",
    href: "/student/dashboard/notifications",
    icon: "Bell",
  },
  {
    key: "counseling",
    labelKey: "dashboard.student.nav.counselingSessions",
    href: "/student/dashboard/counseling",
    icon: "MessagesSquare",
  },
  {
    key: "profileSettings",
    labelKey: "dashboard.student.nav.profileSettings",
    href: "/student/dashboard/profile",
    icon: "Settings",
  },
];

export const parentNav: TDashboardNavItem[] = [
  {
    key: "overview",
    labelKey: "dashboard.parent.nav.overview",
    href: "/parent/dashboard",
    icon: "LayoutDashboard",
  },
  {
    key: "children",
    labelKey: "dashboard.parent.nav.children",
    href: "/parent/dashboard/children",
    icon: "UsersRound",
  },
  {
    key: "results",
    labelKey: "dashboard.parent.nav.results",
    href: "/parent/dashboard/results",
    icon: "GraduationCap",
  },
  {
    key: "resources",
    labelKey: "dashboard.parent.nav.resources",
    href: "/parent/dashboard/resources",
    icon: "FileText",
  },
  {
    key: "activities",
    labelKey: "dashboard.parent.nav.activities",
    href: "/parent/dashboard/activities",
    icon: "ScrollText",
  },
  {
    key: "counseling",
    labelKey: "dashboard.parent.nav.counseling",
    href: "/parent/dashboard/counseling",
    icon: "UserCheck2",
  },
  {
    key: "profile",
    labelKey: "dashboard.parent.nav.profile",
    href: "/parent/dashboard/profile",
    icon: "UserRound",
  },
];
