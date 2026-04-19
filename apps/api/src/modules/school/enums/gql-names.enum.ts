export enum SchoolGqlInputNames {
  ListGradesInput = "ListGradesInput",
  ListSchoolsInput = "ListSchoolsInput",
  UpdateGradeInput = "UpdateGradeInput",
  CreateGradeInput = "CreateGradeInput",
  CreateSchoolInput = "CreateSchoolInput",
  UpdateSchoolInput = "UpdateSchoolInput",
  EnrollStudentInput = "EnrollStudentInput",
  SetAdminStatusInput = "SetAdminStatusInput",
  ListClassroomsInput = "ListClassroomsInput",
  SetSchoolStatusInput = "SetSchoolStatusInput",
  CloseEnrollmentInput = "CloseEnrollmentInput",
  UpdateClassroomInput = "UpdateClassroomInput",
  CreateClassroomInput = "CreateClassroomInput",
  ListSchoolAdminsInput = "ListSchoolAdminsInput",
  CreateSchoolAdminInput = "CreateSchoolAdminInput",
  ListEnrollmentsByClassroomInput = "ListEnrollmentsByClassroomInput",
}

export enum SchoolGqlObjectNames {
  Grade = "Grade",
  School = "School",
  Classroom = "Classroom",
  GradeList = "GradeList",
  SchoolList = "SchoolList",
  Enrollment = "Enrollment",
  SchoolAdmin = "SchoolAdmin",
  PublicSchool = "PublicSchool",
  ClassroomList = "ClassroomList",
  EnrollmentList = "EnrollmentList",
  SchoolAdminList = "SchoolAdminList",
  PublicSchoolList = "PublicSchoolList",
  CreateSchoolAdminResult = "CreateSchoolAdminResult",
}

export enum SchoolGqlQueryNames {
  Grades = "grades",
  Schools = "schools",
  Classrooms = "classrooms",
  SchoolById = "schoolById",
  SchoolAdmins = "schoolAdmins",
  PublicSchools = "publicSchools",
  EnrollmentsByClassroom = "enrollmentsByClassroom",
}

export enum SchoolGqlMutationNames {
  CreateSchool = "createSchool",
  UpdateSchool = "updateSchool",
  SetAdminStatus = "setAdminStatus",
  SetSchoolStatus = "setSchoolStatus",
  CreateSchoolAdmin = "createSchoolAdmin",

  CreateGrade = "createGrade",
  UpdateGrade = "updateGrade",
  ArchiveGrade = "archiveGrade",
  RestoreGrade = "restoreGrade",

  CreateClassroom = "createClassroom",
  UpdateClassroom = "updateClassroom",
  ArchiveClassroom = "archiveClassroom",
  RestoreClassroom = "restoreClassroom",

  EnrollStudent = "enrollStudent",
  CloseEnrollment = "closeEnrollment",
}
