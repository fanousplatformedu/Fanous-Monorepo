export enum SchoolGqlInputNames {
  ListSchoolsInput = "ListSchoolsInput",
  CreateSchoolInput = "CreateSchoolInput",
  UpdateSchoolInput = "UpdateSchoolInput",
  SetAdminStatusInput = "SetAdminStatusInput",
  SetSchoolStatusInput = "SetSchoolStatusInput",
  ListSchoolAdminsInput = "ListSchoolAdminsInput",
  CreateSchoolAdminInput = "CreateSchoolAdminInput",
}

export enum SchoolGqlObjectNames {
  School = "School",
  SchoolList = "SchoolList",
  SchoolAdmin = "SchoolAdmin",
  SchoolAdminList = "SchoolAdminList",
  CreateSchoolAdminResult = "CreateSchoolAdminResult",
}

export enum SchoolGqlQueryNames {
  Schools = "schools",
  SchoolById = "schoolById",
  SchoolAdmins = "schoolAdmins",
}

export enum SchoolGqlMutationNames {
  CreateSchool = "createSchool",
  UpdateSchool = "updateSchool",
  SetAdminStatus = "setAdminStatus",
  SetSchoolStatus = "setSchoolStatus",
  CreateSchoolAdmin = "createSchoolAdmin",
}
