export const AdminMessages = {
  ADMIN_REMOVED: "SCHOOL_ADMIN_REMOVED",
  ADMIN_ASSIGNED: "SCHOOL_ADMIN_ASSIGNED",
} as const;

export type AdminMessage = (typeof AdminMessages)[keyof typeof AdminMessages];
