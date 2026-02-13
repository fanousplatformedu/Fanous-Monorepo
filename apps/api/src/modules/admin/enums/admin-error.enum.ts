export enum AdminErrorEnum {
  FORBIDDEN = "Access denied",
  SCHOOL_NOT_FOUND = "School not found",
  TARGET_USER_NOT_FOUND = "Target user not found",
  SCHOOL_REQUIRED = "Admin must belong to a school",
  REQUEST_NOT_FOUND = "Role approval request not found",
  REQUEST_ALREADY_REVIEWED = "Request already reviewed",
  INVALID_ROLE_FOR_ASSIGNMENT = "Invalid role for assignment",
  USER_NOT_IN_SCHOOL = "User does not belong to this school",
}
