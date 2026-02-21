export const SchoolAdminMessages = {
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export type SchoolAdminMessage =
  (typeof SchoolAdminMessages)[keyof typeof SchoolAdminMessages];
