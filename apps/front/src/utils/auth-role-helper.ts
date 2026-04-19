export type AppRole =
  | "PARENT"
  | "STUDENT"
  | "COUNSELOR"
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN";

export const getRoleLabel = (role?: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "SCHOOL_ADMIN":
      return "School Admin";
    case "STUDENT":
      return "Student";
    case "PARENT":
      return "Parent";
    case "COUNSELOR":
      return "Counselor";
    default:
      return "User";
  }
};

export const getRoleDashboardPath = (role?: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "SCHOOL_ADMIN":
      return "/school-admin/dashboard";
    case "STUDENT":
      return "/student/dashboard";
    case "PARENT":
    case "COUNSELOR":
    default:
      return "/";
  }
};

export const getRoleProfilePath = (role?: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard/settings";
    case "SCHOOL_ADMIN":
      return "/school-admin/dashboard/settings";
    case "STUDENT":
      return "/student/dashboard/profile";
    case "PARENT":
    case "COUNSELOR":
    default:
      return "/";
  }
};

export const getRoleBadgeTone = (role?: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "blue";
    case "SCHOOL_ADMIN":
      return "green";
    case "STUDENT":
    case "PARENT":
    case "COUNSELOR":
      return "amber";
    default:
      return "blue";
  }
};
