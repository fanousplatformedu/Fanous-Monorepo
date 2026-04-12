export type AppRole =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "STUDENT"
  | "TEACHER"
  | "PARENT"
  | "COUNSELOR";

export const getRoleLabel = (role?: string | null) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "SCHOOL_ADMIN":
      return "School Admin";
    case "STUDENT":
      return "Student";
    case "TEACHER":
      return "Teacher";
    case "PARENT":
      return "Parent";
    case "COUNSELOR":
      return "Counselor";
    default:
      return "User";
  }
};

export const getRoleDashboardPath = (role?: string | null) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard";
    case "SCHOOL_ADMIN":
      return "/school-admin/dashboard";
    case "STUDENT":
    case "TEACHER":
    case "PARENT":
    case "COUNSELOR":
      return "/user/dashboard";
    default:
      return "/";
  }
};

export const getRoleProfilePath = (role?: string | null) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "/super-admin/dashboard/settings";
    case "SCHOOL_ADMIN":
      return "/school-admin/dashboard/settings";
    case "STUDENT":
    case "TEACHER":
    case "PARENT":
    case "COUNSELOR":
      return "/user/dashboard/profile";
    default:
      return "/";
  }
};

export const getRoleBadgeTone = (role?: string | null) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "blue";
    case "SCHOOL_ADMIN":
      return "green";
    case "STUDENT":
    case "TEACHER":
    case "PARENT":
    case "COUNSELOR":
      return "amber";
    default:
      return "blue";
  }
};
