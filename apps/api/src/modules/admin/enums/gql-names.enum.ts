export enum GqlQueryNames {
  ADMIN_REJECT_ROLE = "adminRejectRole",
  ADMIN_APPROVE_ROLE = "adminApproveRole",
  ADMIN_LIST_SCHOOLS = "adminListSchools",
  ADMIN_GET_ROLE_APPROVAL = "adminGetRoleApproval",
  ADMIN_LIST_ROLE_APPROVALS = "adminListRoleApprovals",
  ADMIN_ASSIGN_SCHOOL_ADMIN = "adminAssignSchoolAdmin",
}

export enum GqlInputNames {
  ADMIN_LIST_ROLE_APPROVALS_INPUT = "AdminListRoleApprovalsInput",
  ADMIN_REVIEW_ROLE_REQUEST_INPUT = "AdminReviewRoleRequestInput",
  ADMIN_ASSIGN_SCHOOL_ADMIN_INPUT = "AdminAssignSchoolAdminInput",
}

export enum GqlEntityNames {
  ROLE_APPROVAL_REQUEST = "RoleApprovalRequest",
  SCHOOL_ADMIN_LIST_ITEM = "SchoolAdminListItem",
  PAGED_ROLE_APPROVAL_REQUESTS = "PagedRoleApprovalRequests",
}
