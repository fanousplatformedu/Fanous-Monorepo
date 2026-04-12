import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
  JSON: { input: unknown; output: unknown; }
};

export type AccessRequest = {
  __typename?: 'AccessRequest';
  approvedUserId: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  fullName: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  mobile: Maybe<Scalars['String']['output']>;
  rejectReason: Maybe<Scalars['String']['output']>;
  requestedRole: Scalars['String']['output'];
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedById: Maybe<Scalars['String']['output']>;
  schoolId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type AccessRequestList = {
  __typename?: 'AccessRequestList';
  items: Array<AccessRequest>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type AdminLoginInput = {
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type AdminProfileResult = {
  __typename?: 'AdminProfileResult';
  email: Maybe<Scalars['String']['output']>;
  fullName: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type AssessmentQuestion = {
  __typename?: 'AssessmentQuestion';
  code: Scalars['Float']['output'];
  id: Scalars['String']['output'];
  intelligenceKeys: Array<Scalars['String']['output']>;
  isActive: Scalars['Boolean']['output'];
  order: Scalars['Float']['output'];
  text: Scalars['String']['output'];
};

export type AssessmentResult = {
  __typename?: 'AssessmentResult';
  bodilyKinesthetic: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  dominantKey: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  interpersonal: Scalars['Float']['output'];
  intrapersonal: Scalars['Float']['output'];
  linguistic: Scalars['Float']['output'];
  logicalMath: Scalars['Float']['output'];
  musical: Scalars['Float']['output'];
  naturalistic: Scalars['Float']['output'];
  schoolId: Scalars['String']['output'];
  student: Maybe<AssessmentStudent>;
  studentAssignment: Maybe<StudentAssignment>;
  studentAssignmentId: Scalars['String']['output'];
  studentId: Scalars['String']['output'];
  summaryJson: Maybe<Scalars['JSON']['output']>;
  visualSpatial: Scalars['Float']['output'];
};

export type AssessmentResultList = {
  __typename?: 'AssessmentResultList';
  items: Array<AssessmentResult>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type AssessmentStudent = {
  __typename?: 'AssessmentStudent';
  email: Maybe<Scalars['String']['output']>;
  fullName: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
};

export type AssignAssignmentInput = {
  assignmentId: Scalars['String']['input'];
  studentIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type AssignmentRef = {
  __typename?: 'AssignmentRef';
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AuditCreateResult = {
  __typename?: 'AuditCreateResult';
  log: AuditLog;
  message: Scalars['String']['output'];
};

export type AuditLog = {
  __typename?: 'AuditLog';
  action: Scalars['String']['output'];
  actorId: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  entityId: Maybe<Scalars['String']['output']>;
  entityType: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  ip: Maybe<Scalars['String']['output']>;
  metadata: Maybe<Scalars['JSON']['output']>;
  schoolId: Maybe<Scalars['String']['output']>;
  userAgent: Maybe<Scalars['String']['output']>;
};

export type AuditLogList = {
  __typename?: 'AuditLogList';
  items: Array<AuditLog>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  fullName: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  role: Scalars['String']['output'];
  schoolId: Maybe<Scalars['String']['output']>;
  userId: Scalars['String']['output'];
};

export type ChangeAdminPasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type Classroom = {
  __typename?: 'Classroom';
  code: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Maybe<Scalars['DateTime']['output']>;
  gradeId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  schoolId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  year: Maybe<Scalars['Int']['output']>;
};

export type ClassroomList = {
  __typename?: 'ClassroomList';
  items: Array<Classroom>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type CloseEnrollmentInput = {
  endedAt?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

export type CreateAssignmentInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueAt?: InputMaybe<Scalars['String']['input']>;
  targetClassroomId?: InputMaybe<Scalars['String']['input']>;
  targetGradeId?: InputMaybe<Scalars['String']['input']>;
  targetMode?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateAuditLogInput = {
  action: Scalars['String']['input'];
  entityId?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  schoolId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateClassroomInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  gradeId: Scalars['String']['input'];
  name: Scalars['String']['input'];
  schoolId: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateGradeInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  schoolId: Scalars['String']['input'];
};

export type CreateSchoolAdminInput = {
  adminEmail: Scalars['String']['input'];
  adminFullName?: InputMaybe<Scalars['String']['input']>;
  schoolId: Scalars['String']['input'];
};

export type CreateSchoolAdminResult = {
  __typename?: 'CreateSchoolAdminResult';
  admin: SchoolAdmin;
  message: Scalars['String']['output'];
  notificationError: Maybe<Scalars['String']['output']>;
  tempPassword: Maybe<Scalars['String']['output']>;
};

export type CreateSchoolInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  settings?: InputMaybe<Scalars['JSON']['input']>;
};

export type EnrollStudentInput = {
  classroomId: Scalars['String']['input'];
  schoolId: Scalars['String']['input'];
  startedAt?: InputMaybe<Scalars['String']['input']>;
  studentId: Scalars['String']['input'];
};

export type Enrollment = {
  __typename?: 'Enrollment';
  classroomId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  endedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  schoolId: Scalars['String']['output'];
  startedAt: Scalars['DateTime']['output'];
  studentId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Grade = {
  __typename?: 'Grade';
  code: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  deletedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  schoolId: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type GradeList = {
  __typename?: 'GradeList';
  items: Array<Grade>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ListAccessRequestsInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  schoolId?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export type ListAssessmentResultsInput = {
  assignmentId?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type ListAssignmentsInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export type ListAuditLogsInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  actorId?: InputMaybe<Scalars['String']['input']>;
  entityId?: InputMaybe<Scalars['String']['input']>;
  entityType?: InputMaybe<Scalars['String']['input']>;
  from?: InputMaybe<Scalars['String']['input']>;
  schoolId?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  to?: InputMaybe<Scalars['String']['input']>;
};

export type ListClassroomsInput = {
  gradeId?: InputMaybe<Scalars['String']['input']>;
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  schoolId: Scalars['String']['input'];
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type ListGradesInput = {
  includeDeleted?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  schoolId: Scalars['String']['input'];
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type ListSchoolAdminsInput = {
  schoolId?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export type ListSchoolMembersInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export type ListSchoolsInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
};

export type LogoutResult = {
  __typename?: 'LogoutResult';
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminLogin: AuthPayload;
  archiveClassroom: Classroom;
  archiveGrade: Grade;
  assignAssignmentToStudents: Scalars['String']['output'];
  changeAdminPassword: PasswordResult;
  closeEnrollment: Enrollment;
  createAssignment: SchoolAssignment;
  createAuditLog: AuditCreateResult;
  createClassroom: Classroom;
  createGrade: Grade;
  createSchool: School;
  createSchoolAdmin: CreateSchoolAdminResult;
  enrollStudent: Enrollment;
  logout: LogoutResult;
  logoutAll: LogoutResult;
  publishAssignment: SchoolAssignment;
  refreshAuth: AuthPayload;
  removeSchoolMember: User;
  requestOtp: OtpResponse;
  resetAdminPassword: PasswordResult;
  restoreClassroom: Classroom;
  restoreGrade: Grade;
  reviewAccessRequest: ReviewResult;
  sendTestEmail: NotificationResult;
  sendTestSms: NotificationResult;
  setAdminStatus: Scalars['String']['output'];
  setSchoolStatus: School;
  submitAccessRequest: AccessRequest;
  submitStudentAnswers: Scalars['String']['output'];
  updateAdminProfile: AdminProfileResult;
  updateClassroom: Classroom;
  updateGrade: Grade;
  updateMe: User;
  updateSchool: School;
  verifyOtp: AuthPayload;
};


export type MutationAdminLoginArgs = {
  input: AdminLoginInput;
};


export type MutationArchiveClassroomArgs = {
  id: Scalars['String']['input'];
};


export type MutationArchiveGradeArgs = {
  id: Scalars['String']['input'];
};


export type MutationAssignAssignmentToStudentsArgs = {
  input: AssignAssignmentInput;
};


export type MutationChangeAdminPasswordArgs = {
  input: ChangeAdminPasswordInput;
};


export type MutationCloseEnrollmentArgs = {
  input: CloseEnrollmentInput;
};


export type MutationCreateAssignmentArgs = {
  input: CreateAssignmentInput;
};


export type MutationCreateAuditLogArgs = {
  input: CreateAuditLogInput;
};


export type MutationCreateClassroomArgs = {
  input: CreateClassroomInput;
};


export type MutationCreateGradeArgs = {
  input: CreateGradeInput;
};


export type MutationCreateSchoolArgs = {
  input: CreateSchoolInput;
};


export type MutationCreateSchoolAdminArgs = {
  input: CreateSchoolAdminInput;
};


export type MutationEnrollStudentArgs = {
  input: EnrollStudentInput;
};


export type MutationPublishAssignmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveSchoolMemberArgs = {
  input: RemoveSchoolMemberInput;
};


export type MutationRequestOtpArgs = {
  input: RequestOtpInput;
};


export type MutationResetAdminPasswordArgs = {
  input: ResetAdminPasswordInput;
};


export type MutationRestoreClassroomArgs = {
  id: Scalars['String']['input'];
};


export type MutationRestoreGradeArgs = {
  id: Scalars['String']['input'];
};


export type MutationReviewAccessRequestArgs = {
  input: ReviewAccessRequestInput;
};


export type MutationSendTestEmailArgs = {
  input: SendTestEmailInput;
};


export type MutationSendTestSmsArgs = {
  input: SendTestSmsInput;
};


export type MutationSetAdminStatusArgs = {
  input: SetAdminStatusInput;
};


export type MutationSetSchoolStatusArgs = {
  input: SetSchoolStatusInput;
};


export type MutationSubmitAccessRequestArgs = {
  input: SubmitAccessRequestInput;
};


export type MutationSubmitStudentAnswersArgs = {
  input: SubmitStudentAnswersInput;
};


export type MutationUpdateAdminProfileArgs = {
  input: UpdateAdminProfileInput;
};


export type MutationUpdateClassroomArgs = {
  input: UpdateClassroomInput;
};


export type MutationUpdateGradeArgs = {
  input: UpdateGradeInput;
};


export type MutationUpdateMeArgs = {
  input: UpdateMeInput;
};


export type MutationUpdateSchoolArgs = {
  input: UpdateSchoolInput;
};


export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};

export type NotificationResult = {
  __typename?: 'NotificationResult';
  channel: Scalars['String']['output'];
  destination: Scalars['String']['output'];
  errorCode: Maybe<Scalars['String']['output']>;
  errorMessage: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  providerMessageId: Maybe<Scalars['String']['output']>;
};

export type OtpResponse = {
  __typename?: 'OtpResponse';
  message: Scalars['String']['output'];
  resendAfterSeconds: Maybe<Scalars['Float']['output']>;
};

export type PasswordResult = {
  __typename?: 'PasswordResult';
  adminUserId: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  notificationError: Maybe<Scalars['String']['output']>;
  tempPassword: Maybe<Scalars['String']['output']>;
};

export type PublicSchoolEntity = {
  __typename?: 'PublicSchoolEntity';
  code: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type PublicSchoolList = {
  __typename?: 'PublicSchoolList';
  items: Array<PublicSchoolEntity>;
  total: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  HealthCheck: Scalars['String']['output'];
  accessRequestById: AccessRequest;
  accessRequests: AccessRequestList;
  assessmentQuestions: Array<AssessmentQuestion>;
  assessmentResults: AssessmentResultList;
  assignments: SchoolAssignmentList;
  auditLogById: AuditLog;
  auditLogs: AuditLogList;
  classrooms: ClassroomList;
  enrollmentsByClassroom: Array<Enrollment>;
  grades: GradeList;
  me: User;
  publicSchools: PublicSchoolList;
  schoolAdmins: SchoolAdminList;
  schoolAssessmentSummary: SchoolAssessmentSummary;
  schoolById: School;
  schoolMembers: UserList;
  schools: SchoolList;
};


export type QueryAccessRequestByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAccessRequestsArgs = {
  input: ListAccessRequestsInput;
};


export type QueryAssessmentResultsArgs = {
  input: ListAssessmentResultsInput;
};


export type QueryAssignmentsArgs = {
  input: ListAssignmentsInput;
};


export type QueryAuditLogByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryAuditLogsArgs = {
  input: ListAuditLogsInput;
};


export type QueryClassroomsArgs = {
  input: ListClassroomsInput;
};


export type QueryEnrollmentsByClassroomArgs = {
  classroomId: Scalars['String']['input'];
  schoolId: Scalars['String']['input'];
};


export type QueryGradesArgs = {
  input: ListGradesInput;
};


export type QuerySchoolAdminsArgs = {
  input: ListSchoolAdminsInput;
};


export type QuerySchoolAssessmentSummaryArgs = {
  input: InputMaybe<SchoolAssessmentSummaryInput>;
};


export type QuerySchoolByIdArgs = {
  schoolId: Scalars['String']['input'];
};


export type QuerySchoolMembersArgs = {
  input: ListSchoolMembersInput;
};


export type QuerySchoolsArgs = {
  input: ListSchoolsInput;
};

export type RemoveSchoolMemberInput = {
  hardDelete?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['String']['input'];
};

export type RequestOtpInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  schoolCode?: InputMaybe<Scalars['String']['input']>;
};

export type ResetAdminPasswordInput = {
  adminUserId: Scalars['String']['input'];
};

export type ReviewAccessRequestInput = {
  approve: Scalars['Boolean']['input'];
  finalRole?: InputMaybe<Scalars['String']['input']>;
  notifyVia?: InputMaybe<Scalars['String']['input']>;
  rejectReason?: InputMaybe<Scalars['String']['input']>;
  requestId: Scalars['String']['input'];
};

export type ReviewResult = {
  __typename?: 'ReviewResult';
  createdUserId: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  notificationError: Maybe<Scalars['String']['output']>;
  requestId: Scalars['String']['output'];
};

export type School = {
  __typename?: 'School';
  archivedAt: Maybe<Scalars['DateTime']['output']>;
  code: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  settings: Maybe<Scalars['JSON']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SchoolAdmin = {
  __typename?: 'SchoolAdmin';
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  forcePasswordChange: Scalars['Boolean']['output'];
  fullName: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  role: Scalars['String']['output'];
  schoolId: Scalars['String']['output'];
  schoolName: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  username: Maybe<Scalars['String']['output']>;
};

export type SchoolAdminList = {
  __typename?: 'SchoolAdminList';
  items: Array<SchoolAdmin>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type SchoolAssessmentSummary = {
  __typename?: 'SchoolAssessmentSummary';
  avgBodilyKinesthetic: Scalars['Float']['output'];
  avgInterpersonal: Scalars['Float']['output'];
  avgIntrapersonal: Scalars['Float']['output'];
  avgLinguistic: Scalars['Float']['output'];
  avgLogicalMath: Scalars['Float']['output'];
  avgMusical: Scalars['Float']['output'];
  avgNaturalistic: Scalars['Float']['output'];
  avgVisualSpatial: Scalars['Float']['output'];
  completionRate: Scalars['Float']['output'];
  evaluatedStudentAssignments: Scalars['Int']['output'];
  pendingStudentAssignments: Scalars['Int']['output'];
  publishedAssignments: Scalars['Int']['output'];
  submittedStudentAssignments: Scalars['Int']['output'];
  totalAssignments: Scalars['Int']['output'];
  totalStudents: Scalars['Int']['output'];
};

export type SchoolAssessmentSummaryInput = {
  assignmentId?: InputMaybe<Scalars['String']['input']>;
};

export type SchoolAssignment = {
  __typename?: 'SchoolAssignment';
  createdAt: Scalars['DateTime']['output'];
  createdById: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  dueAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  schoolId: Scalars['String']['output'];
  status: Scalars['String']['output'];
  targetClassroomId: Maybe<Scalars['String']['output']>;
  targetGradeId: Maybe<Scalars['String']['output']>;
  targetMode: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type SchoolAssignmentList = {
  __typename?: 'SchoolAssignmentList';
  items: Array<SchoolAssignment>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type SchoolList = {
  __typename?: 'SchoolList';
  items: Array<School>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type SendTestEmailInput = {
  html: Scalars['String']['input'];
  subject: Scalars['String']['input'];
  text?: InputMaybe<Scalars['String']['input']>;
  to: Scalars['String']['input'];
};

export type SendTestSmsInput = {
  message: Scalars['String']['input'];
  mobile: Scalars['String']['input'];
  sender?: InputMaybe<Scalars['String']['input']>;
};

export type SetAdminStatusInput = {
  adminUserId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type SetSchoolStatusInput = {
  schoolId: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type StudentAnswerInput = {
  questionId: Scalars['String']['input'];
  value: Scalars['Int']['input'];
};

export type StudentAssignment = {
  __typename?: 'StudentAssignment';
  assignment: Maybe<AssignmentRef>;
  assignmentId: Scalars['String']['output'];
  completionRate: Scalars['Float']['output'];
  evaluatedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  startedAt: Maybe<Scalars['DateTime']['output']>;
  status: Scalars['String']['output'];
  studentId: Scalars['String']['output'];
  submittedAt: Maybe<Scalars['DateTime']['output']>;
};

export type SubmitAccessRequestInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  requestedRole: Scalars['String']['input'];
  schoolId: Scalars['String']['input'];
};

export type SubmitStudentAnswersInput = {
  answers: Array<StudentAnswerInput>;
  studentAssignmentId: Scalars['String']['input'];
};

export type UpdateAdminProfileInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateClassroomInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  gradeId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateGradeInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMeInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSchoolInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  schoolId: Scalars['String']['input'];
  settings?: InputMaybe<Scalars['JSON']['input']>;
};

export type User = {
  __typename?: 'User';
  avatarUrl: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  forcePasswordChange: Maybe<Scalars['Boolean']['output']>;
  fullName: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  mobile: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
  schoolId: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  username: Maybe<Scalars['String']['output']>;
};

export type UserList = {
  __typename?: 'UserList';
  items: Array<User>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type VerifyOtpInput = {
  code: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  schoolCode?: InputMaybe<Scalars['String']['input']>;
};

export type HeaderCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type HeaderCurrentUserQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: string, email: string | null, fullName: string | null, schoolId: string | null, avatarUrl: string | null, forcePasswordChange: boolean | null } };

export type HeaderLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type HeaderLogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResult', message: string } };

export type PublicSchoolsQueryVariables = Exact<{ [key: string]: never; }>;


export type PublicSchoolsQuery = { __typename?: 'Query', publicSchools: { __typename?: 'PublicSchoolList', total: number, items: Array<{ __typename?: 'PublicSchoolEntity', id: string, name: string, code: string | null }> } };

export type SchoolAdminLoginMutationVariables = Exact<{
  input: AdminLoginInput;
}>;


export type SchoolAdminLoginMutation = { __typename?: 'Mutation', adminLogin: { __typename?: 'AuthPayload', role: string, userId: string, message: string, schoolId: string | null, fullName: string | null } };

export type SchoolAdminMeQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolAdminMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: string, email: string | null, schoolId: string | null, username: string | null, fullName: string | null, avatarUrl: string | null, forcePasswordChange: boolean | null } };

export type SchoolAdminChangePasswordMutationVariables = Exact<{
  input: ChangeAdminPasswordInput;
}>;


export type SchoolAdminChangePasswordMutation = { __typename?: 'Mutation', changeAdminPassword: { __typename?: 'PasswordResult', message: string } };

export type SchoolMembersQueryVariables = Exact<{
  input: ListSchoolMembersInput;
}>;


export type SchoolMembersQuery = { __typename?: 'Query', schoolMembers: { __typename?: 'UserList', total: number, take: number, skip: number, items: Array<{ __typename?: 'User', id: string, role: string, email: string | null, mobile: string | null, status: string, fullName: string | null, createdAt: string }> } };

export type RemoveSchoolMemberMutationVariables = Exact<{
  input: RemoveSchoolMemberInput;
}>;


export type RemoveSchoolMemberMutation = { __typename?: 'Mutation', removeSchoolMember: { __typename?: 'User', id: string, status: string } };

export type SchoolAdminAccessRequestsQueryVariables = Exact<{
  input: ListAccessRequestsInput;
}>;


export type SchoolAdminAccessRequestsQuery = { __typename?: 'Query', accessRequests: { __typename?: 'AccessRequestList', total: number, take: number, skip: number, items: Array<{ __typename?: 'AccessRequest', id: string, email: string | null, mobile: string | null, status: string, fullName: string | null, createdAt: string, reviewedAt: string | null, rejectReason: string | null, reviewedById: string | null, requestedRole: string, approvedUserId: string | null }> } };

export type ReviewAccessRequestMutationVariables = Exact<{
  input: ReviewAccessRequestInput;
}>;


export type ReviewAccessRequestMutation = { __typename?: 'Mutation', reviewAccessRequest: { __typename?: 'ReviewResult', message: string, requestId: string, createdUserId: string | null, notificationError: string | null } };

export type SchoolAdminAuditLogsQueryVariables = Exact<{
  input: ListAuditLogsInput;
}>;


export type SchoolAdminAuditLogsQuery = { __typename?: 'Query', auditLogs: { __typename?: 'AuditLogList', total: number, take: number, skip: number, items: Array<{ __typename?: 'AuditLog', id: string, ip: string | null, action: string, actorId: string | null, schoolId: string | null, entityId: string | null, metadata: unknown | null, userAgent: string | null, createdAt: string, entityType: string | null }> } };

export type GradesQueryVariables = Exact<{
  input: ListGradesInput;
}>;


export type GradesQuery = { __typename?: 'Query', grades: { __typename?: 'GradeList', total: number, take: number, skip: number, items: Array<{ __typename?: 'Grade', id: string, name: string, code: string | null, schoolId: string, deletedAt: string | null, createdAt: string, updatedAt: string }> } };

export type CreateGradeMutationVariables = Exact<{
  input: CreateGradeInput;
}>;


export type CreateGradeMutation = { __typename?: 'Mutation', createGrade: { __typename?: 'Grade', id: string, name: string, code: string | null, schoolId: string, deletedAt: string | null, createdAt: string, updatedAt: string } };

export type UpdateGradeMutationVariables = Exact<{
  input: UpdateGradeInput;
}>;


export type UpdateGradeMutation = { __typename?: 'Mutation', updateGrade: { __typename?: 'Grade', id: string, name: string, code: string | null, schoolId: string, deletedAt: string | null, createdAt: string, updatedAt: string } };

export type ArchiveGradeMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ArchiveGradeMutation = { __typename?: 'Mutation', archiveGrade: { __typename?: 'Grade', id: string, deletedAt: string | null } };

export type RestoreGradeMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RestoreGradeMutation = { __typename?: 'Mutation', restoreGrade: { __typename?: 'Grade', id: string, deletedAt: string | null } };

export type ClassroomsQueryVariables = Exact<{
  input: ListClassroomsInput;
}>;


export type ClassroomsQuery = { __typename?: 'Query', classrooms: { __typename?: 'ClassroomList', total: number, take: number, skip: number, items: Array<{ __typename?: 'Classroom', id: string, name: string, code: string | null, year: number | null, gradeId: string, schoolId: string, deletedAt: string | null, createdAt: string, updatedAt: string }> } };

export type CreateClassroomMutationVariables = Exact<{
  input: CreateClassroomInput;
}>;


export type CreateClassroomMutation = { __typename?: 'Mutation', createClassroom: { __typename?: 'Classroom', id: string, name: string, code: string | null, year: number | null, gradeId: string, schoolId: string, deletedAt: string | null, createdAt: string, updatedAt: string } };

export type UpdateClassroomMutationVariables = Exact<{
  input: UpdateClassroomInput;
}>;


export type UpdateClassroomMutation = { __typename?: 'Mutation', updateClassroom: { __typename?: 'Classroom', id: string, name: string, code: string | null, year: number | null, gradeId: string, schoolId: string, deletedAt: string | null, createdAt: string, updatedAt: string } };

export type ArchiveClassroomMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ArchiveClassroomMutation = { __typename?: 'Mutation', archiveClassroom: { __typename?: 'Classroom', id: string, deletedAt: string | null } };

export type RestoreClassroomMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RestoreClassroomMutation = { __typename?: 'Mutation', restoreClassroom: { __typename?: 'Classroom', id: string, deletedAt: string | null } };

export type EnrollStudentMutationVariables = Exact<{
  input: EnrollStudentInput;
}>;


export type EnrollStudentMutation = { __typename?: 'Mutation', enrollStudent: { __typename?: 'Enrollment', id: string, endedAt: string | null, schoolId: string, studentId: string, startedAt: string, createdAt: string, updatedAt: string, classroomId: string } };

export type CloseEnrollmentMutationVariables = Exact<{
  input: CloseEnrollmentInput;
}>;


export type CloseEnrollmentMutation = { __typename?: 'Mutation', closeEnrollment: { __typename?: 'Enrollment', id: string, endedAt: string | null, schoolId: string, studentId: string, startedAt: string, createdAt: string, updatedAt: string, classroomId: string } };

export type EnrollmentsByClassroomQueryVariables = Exact<{
  schoolId: Scalars['String']['input'];
  classroomId: Scalars['String']['input'];
}>;


export type EnrollmentsByClassroomQuery = { __typename?: 'Query', enrollmentsByClassroom: Array<{ __typename?: 'Enrollment', id: string, endedAt: string | null, schoolId: string, studentId: string, createdAt: string, startedAt: string, updatedAt: string, classroomId: string }> };

export type AssessmentQuestionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AssessmentQuestionsQuery = { __typename?: 'Query', assessmentQuestions: Array<{ __typename?: 'AssessmentQuestion', id: string, code: number, text: string, order: number, isActive: boolean, intelligenceKeys: Array<string> }> };

export type CreateAssignmentMutationVariables = Exact<{
  input: CreateAssignmentInput;
}>;


export type CreateAssignmentMutation = { __typename?: 'Mutation', createAssignment: { __typename?: 'SchoolAssignment', id: string, title: string, dueAt: string | null, status: string, schoolId: string, updatedAt: string, createdAt: string, targetMode: string, publishedAt: string | null, createdById: string, description: string | null, targetGradeId: string | null, targetClassroomId: string | null } };

export type AssignmentsQueryVariables = Exact<{
  input: ListAssignmentsInput;
}>;


export type AssignmentsQuery = { __typename?: 'Query', assignments: { __typename?: 'SchoolAssignmentList', skip: number, take: number, total: number, items: Array<{ __typename?: 'SchoolAssignment', id: string, title: string, dueAt: string | null, status: string, schoolId: string, createdAt: string, updatedAt: string, targetMode: string, description: string | null, publishedAt: string | null, createdById: string, targetGradeId: string | null, targetClassroomId: string | null }> } };

export type PublishAssignmentMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PublishAssignmentMutation = { __typename?: 'Mutation', publishAssignment: { __typename?: 'SchoolAssignment', id: string, status: string, updatedAt: string, publishedAt: string | null } };

export type AssignAssignmentToStudentsMutationVariables = Exact<{
  input: AssignAssignmentInput;
}>;


export type AssignAssignmentToStudentsMutation = { __typename?: 'Mutation', assignAssignmentToStudents: string };

export type AssessmentResultsQueryVariables = Exact<{
  input: ListAssessmentResultsInput;
}>;


export type AssessmentResultsQuery = { __typename?: 'Query', assessmentResults: { __typename?: 'AssessmentResultList', take: number, skip: number, total: number, items: Array<{ __typename?: 'AssessmentResult', id: string, musical: number, schoolId: string, studentId: string, createdAt: string, linguistic: number, logicalMath: number, summaryJson: unknown | null, dominantKey: string | null, naturalistic: number, visualSpatial: number, interpersonal: number, intrapersonal: number, bodilyKinesthetic: number, studentAssignmentId: string, student: { __typename?: 'AssessmentStudent', id: string, email: string | null, fullName: string | null } | null, studentAssignment: { __typename?: 'StudentAssignment', id: string, status: string, startedAt: string | null, studentId: string, submittedAt: string | null, evaluatedAt: string | null, assignmentId: string, completionRate: number, assignment: { __typename?: 'AssignmentRef', id: string, title: string } | null } | null }> } };

export type SchoolAssessmentSummaryQueryVariables = Exact<{
  input: InputMaybe<SchoolAssessmentSummaryInput>;
}>;


export type SchoolAssessmentSummaryQuery = { __typename?: 'Query', schoolAssessmentSummary: { __typename?: 'SchoolAssessmentSummary', avgMusical: number, totalStudents: number, avgLinguistic: number, completionRate: number, avgLogicalMath: number, avgNaturalistic: number, avgVisualSpatial: number, totalAssignments: number, avgInterpersonal: number, avgIntrapersonal: number, publishedAssignments: number, avgBodilyKinesthetic: number, pendingStudentAssignments: number, submittedStudentAssignments: number, evaluatedStudentAssignments: number } };

export type SubmitAccessRequestMutationVariables = Exact<{
  input: SubmitAccessRequestInput;
}>;


export type SubmitAccessRequestMutation = { __typename?: 'Mutation', submitAccessRequest: { __typename?: 'AccessRequest', id: string, status: string, schoolId: string, requestedRole: string, email: string | null, mobile: string | null, fullName: string | null, createdAt: string } };

export type RequestOtpMutationVariables = Exact<{
  input: RequestOtpInput;
}>;


export type RequestOtpMutation = { __typename?: 'Mutation', requestOtp: { __typename?: 'OtpResponse', message: string, resendAfterSeconds: number | null } };

export type VerifyOtpMutationVariables = Exact<{
  input: VerifyOtpInput;
}>;


export type VerifyOtpMutation = { __typename?: 'Mutation', verifyOtp: { __typename?: 'AuthPayload', message: string, userId: string, role: string, schoolId: string | null } };

export type SchoolUserMeQueryVariables = Exact<{ [key: string]: never; }>;


export type SchoolUserMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: string, status: string, schoolId: string | null, email: string | null, mobile: string | null, fullName: string | null, createdAt: string } };

export type UpdateMeMutationVariables = Exact<{
  input: UpdateMeInput;
}>;


export type UpdateMeMutation = { __typename?: 'Mutation', updateMe: { __typename?: 'User', id: string, fullName: string | null, email: string | null, mobile: string | null, updatedAt: string } };

export type SchoolUserLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type SchoolUserLogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResult', message: string } };

export type SuperAdminLoginMutationVariables = Exact<{
  input: AdminLoginInput;
}>;


export type SuperAdminLoginMutation = { __typename?: 'Mutation', adminLogin: { __typename?: 'AuthPayload', message: string, userId: string, role: string, schoolId: string | null, fullName: string | null } };

export type SuperAdminMeQueryVariables = Exact<{ [key: string]: never; }>;


export type SuperAdminMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: string, status: string, schoolId: string | null, email: string | null, mobile: string | null, fullName: string | null, createdAt: string } };

export type SuperAdminChangePasswordMutationVariables = Exact<{
  input: ChangeAdminPasswordInput;
}>;


export type SuperAdminChangePasswordMutation = { __typename?: 'Mutation', changeAdminPassword: { __typename?: 'PasswordResult', message: string } };

export type CreateSchoolMutationVariables = Exact<{
  input: CreateSchoolInput;
}>;


export type CreateSchoolMutation = { __typename?: 'Mutation', createSchool: { __typename?: 'School', id: string, name: string, code: string | null, status: string, createdAt: string } };

export type SchoolsQueryVariables = Exact<{
  input: ListSchoolsInput;
}>;


export type SchoolsQuery = { __typename?: 'Query', schools: { __typename?: 'SchoolList', total: number, take: number, skip: number, items: Array<{ __typename?: 'School', id: string, name: string, code: string | null, status: string, createdAt: string }> } };

export type UpdateSchoolMutationVariables = Exact<{
  input: UpdateSchoolInput;
}>;


export type UpdateSchoolMutation = { __typename?: 'Mutation', updateSchool: { __typename?: 'School', id: string, name: string, code: string | null, status: string, updatedAt: string } };

export type SetSchoolStatusMutationVariables = Exact<{
  input: SetSchoolStatusInput;
}>;


export type SetSchoolStatusMutation = { __typename?: 'Mutation', setSchoolStatus: { __typename?: 'School', id: string, status: string, archivedAt: string | null } };

export type CreateSchoolAdminMutationVariables = Exact<{
  input: CreateSchoolAdminInput;
}>;


export type CreateSchoolAdminMutation = { __typename?: 'Mutation', createSchoolAdmin: { __typename?: 'CreateSchoolAdminResult', message: string, tempPassword: string | null, notificationError: string | null, admin: { __typename?: 'SchoolAdmin', id: string, schoolId: string, schoolName: string | null, username: string | null, email: string | null, status: string, forcePasswordChange: boolean, createdAt: string } } };

export type SchoolAdminsQueryVariables = Exact<{
  input: ListSchoolAdminsInput;
}>;


export type SchoolAdminsQuery = { __typename?: 'Query', schoolAdmins: { __typename?: 'SchoolAdminList', total: number, take: number, skip: number, items: Array<{ __typename?: 'SchoolAdmin', id: string, schoolId: string, schoolName: string | null, username: string | null, email: string | null, status: string, forcePasswordChange: boolean, createdAt: string }> } };

export type SetAdminStatusMutationVariables = Exact<{
  input: SetAdminStatusInput;
}>;


export type SetAdminStatusMutation = { __typename?: 'Mutation', setAdminStatus: string };

export type SuperAdminAccessRequestsQueryVariables = Exact<{
  input: ListAccessRequestsInput;
}>;


export type SuperAdminAccessRequestsQuery = { __typename?: 'Query', accessRequests: { __typename?: 'AccessRequestList', total: number, take: number, skip: number, items: Array<{ __typename?: 'AccessRequest', id: string, status: string, requestedRole: string, email: string | null, mobile: string | null, fullName: string | null, reviewedById: string | null, reviewedAt: string | null, rejectReason: string | null, approvedUserId: string | null, createdAt: string }> } };

export type SuperAdminAuditLogsQueryVariables = Exact<{
  input: ListAuditLogsInput;
}>;


export type SuperAdminAuditLogsQuery = { __typename?: 'Query', auditLogs: { __typename?: 'AuditLogList', total: number, take: number, skip: number, items: Array<{ __typename?: 'AuditLog', id: string, action: string, actorId: string | null, schoolId: string | null, entityType: string | null, entityId: string | null, metadata: unknown | null, ip: string | null, userAgent: string | null, createdAt: string }> } };

export type CreateAuditLogMutationVariables = Exact<{
  input: CreateAuditLogInput;
}>;


export type CreateAuditLogMutation = { __typename?: 'Mutation', createAuditLog: { __typename?: 'AuditCreateResult', message: string, log: { __typename?: 'AuditLog', id: string, action: string, actorId: string | null, schoolId: string | null, entityType: string | null, entityId: string | null, metadata: unknown | null, createdAt: string } } };

export type SuperAdminReviewAccessRequestMutationVariables = Exact<{
  input: ReviewAccessRequestInput;
}>;


export type SuperAdminReviewAccessRequestMutation = { __typename?: 'Mutation', reviewAccessRequest: { __typename?: 'ReviewResult', message: string, requestId: string, createdUserId: string | null, notificationError: string | null } };

export type SchoolByIdQueryVariables = Exact<{
  schoolId: Scalars['String']['input'];
}>;


export type SchoolByIdQuery = { __typename?: 'Query', schoolById: { __typename?: 'School', id: string, name: string, code: string | null, status: string, settings: unknown | null, createdAt: string, updatedAt: string, archivedAt: string | null } };

export type UpdateAdminProfileMutationVariables = Exact<{
  input: UpdateAdminProfileInput;
}>;


export type UpdateAdminProfileMutation = { __typename?: 'Mutation', updateAdminProfile: { __typename?: 'AdminProfileResult', id: string, email: string | null, message: string, fullName: string | null } };


export const HeaderCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HeaderCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"forcePasswordChange"}}]}}]}}]} as unknown as DocumentNode<HeaderCurrentUserQuery, HeaderCurrentUserQueryVariables>;
export const HeaderLogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"HeaderLogout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<HeaderLogoutMutation, HeaderLogoutMutationVariables>;
export const PublicSchoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PublicSchools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publicSchools"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}}]}}]}}]}}]} as unknown as DocumentNode<PublicSchoolsQuery, PublicSchoolsQueryVariables>;
export const SchoolAdminLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolAdminLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<SchoolAdminLoginMutation, SchoolAdminLoginMutationVariables>;
export const SchoolAdminMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolAdminMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"forcePasswordChange"}}]}}]}}]} as unknown as DocumentNode<SchoolAdminMeQuery, SchoolAdminMeQueryVariables>;
export const SchoolAdminChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolAdminChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeAdminPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeAdminPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SchoolAdminChangePasswordMutation, SchoolAdminChangePasswordMutationVariables>;
export const SchoolMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListSchoolMembersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolMembers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolMembersQuery, SchoolMembersQueryVariables>;
export const RemoveSchoolMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveSchoolMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveSchoolMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeSchoolMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<RemoveSchoolMemberMutation, RemoveSchoolMemberMutationVariables>;
export const SchoolAdminAccessRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolAdminAccessRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListAccessRequestsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectReason"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}},{"kind":"Field","name":{"kind":"Name","value":"approvedUserId"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolAdminAccessRequestsQuery, SchoolAdminAccessRequestsQueryVariables>;
export const ReviewAccessRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviewAccessRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewAccessRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewAccessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"createdUserId"}},{"kind":"Field","name":{"kind":"Name","value":"notificationError"}}]}}]}}]} as unknown as DocumentNode<ReviewAccessRequestMutation, ReviewAccessRequestMutationVariables>;
export const SchoolAdminAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolAdminAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListAuditLogsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolAdminAuditLogsQuery, SchoolAdminAuditLogsQueryVariables>;
export const GradesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Grades"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListGradesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"grades"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GradesQuery, GradesQueryVariables>;
export const CreateGradeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGrade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGradeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGrade"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateGradeMutation, CreateGradeMutationVariables>;
export const UpdateGradeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateGrade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateGradeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateGrade"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateGradeMutation, UpdateGradeMutationVariables>;
export const ArchiveGradeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveGrade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveGrade"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<ArchiveGradeMutation, ArchiveGradeMutationVariables>;
export const RestoreGradeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreGrade"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreGrade"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<RestoreGradeMutation, RestoreGradeMutationVariables>;
export const ClassroomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Classrooms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListClassroomsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"classrooms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<ClassroomsQuery, ClassroomsQueryVariables>;
export const CreateClassroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateClassroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateClassroomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createClassroom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateClassroomMutation, CreateClassroomMutationVariables>;
export const UpdateClassroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateClassroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateClassroomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateClassroom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"gradeId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateClassroomMutation, UpdateClassroomMutationVariables>;
export const ArchiveClassroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ArchiveClassroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"archiveClassroom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<ArchiveClassroomMutation, ArchiveClassroomMutationVariables>;
export const RestoreClassroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RestoreClassroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreClassroom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deletedAt"}}]}}]}}]} as unknown as DocumentNode<RestoreClassroomMutation, RestoreClassroomMutationVariables>;
export const EnrollStudentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnrollStudent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnrollStudentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollStudent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"classroomId"}}]}}]}}]} as unknown as DocumentNode<EnrollStudentMutation, EnrollStudentMutationVariables>;
export const CloseEnrollmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CloseEnrollment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CloseEnrollmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"closeEnrollment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"classroomId"}}]}}]}}]} as unknown as DocumentNode<CloseEnrollmentMutation, CloseEnrollmentMutationVariables>;
export const EnrollmentsByClassroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EnrollmentsByClassroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"classroomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollmentsByClassroom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}},{"kind":"Argument","name":{"kind":"Name","value":"classroomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"classroomId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"classroomId"}}]}}]}}]} as unknown as DocumentNode<EnrollmentsByClassroomQuery, EnrollmentsByClassroomQueryVariables>;
export const AssessmentQuestionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AssessmentQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessmentQuestions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"intelligenceKeys"}}]}}]}}]} as unknown as DocumentNode<AssessmentQuestionsQuery, AssessmentQuestionsQueryVariables>;
export const CreateAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAssignmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"targetMode"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"targetGradeId"}},{"kind":"Field","name":{"kind":"Name","value":"targetClassroomId"}}]}}]}}]} as unknown as DocumentNode<CreateAssignmentMutation, CreateAssignmentMutationVariables>;
export const AssignmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Assignments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListAssignmentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"targetMode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdById"}},{"kind":"Field","name":{"kind":"Name","value":"targetGradeId"}},{"kind":"Field","name":{"kind":"Name","value":"targetClassroomId"}}]}}]}}]}}]} as unknown as DocumentNode<AssignmentsQuery, AssignmentsQueryVariables>;
export const PublishAssignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishAssignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publishAssignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}}]}}]}}]} as unknown as DocumentNode<PublishAssignmentMutation, PublishAssignmentMutationVariables>;
export const AssignAssignmentToStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignAssignmentToStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AssignAssignmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignAssignmentToStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AssignAssignmentToStudentsMutation, AssignAssignmentToStudentsMutationVariables>;
export const AssessmentResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AssessmentResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListAssessmentResultsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assessmentResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"musical"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"linguistic"}},{"kind":"Field","name":{"kind":"Name","value":"logicalMath"}},{"kind":"Field","name":{"kind":"Name","value":"summaryJson"}},{"kind":"Field","name":{"kind":"Name","value":"dominantKey"}},{"kind":"Field","name":{"kind":"Name","value":"naturalistic"}},{"kind":"Field","name":{"kind":"Name","value":"visualSpatial"}},{"kind":"Field","name":{"kind":"Name","value":"interpersonal"}},{"kind":"Field","name":{"kind":"Name","value":"intrapersonal"}},{"kind":"Field","name":{"kind":"Name","value":"bodilyKinesthetic"}},{"kind":"Field","name":{"kind":"Name","value":"studentAssignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"studentAssignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}},{"kind":"Field","name":{"kind":"Name","value":"assignment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<AssessmentResultsQuery, AssessmentResultsQueryVariables>;
export const SchoolAssessmentSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolAssessmentSummary"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SchoolAssessmentSummaryInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolAssessmentSummary"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"avgMusical"}},{"kind":"Field","name":{"kind":"Name","value":"totalStudents"}},{"kind":"Field","name":{"kind":"Name","value":"avgLinguistic"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}},{"kind":"Field","name":{"kind":"Name","value":"avgLogicalMath"}},{"kind":"Field","name":{"kind":"Name","value":"avgNaturalistic"}},{"kind":"Field","name":{"kind":"Name","value":"avgVisualSpatial"}},{"kind":"Field","name":{"kind":"Name","value":"totalAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"avgInterpersonal"}},{"kind":"Field","name":{"kind":"Name","value":"avgIntrapersonal"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"avgBodilyKinesthetic"}},{"kind":"Field","name":{"kind":"Name","value":"pendingStudentAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"submittedStudentAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatedStudentAssignments"}}]}}]}}]} as unknown as DocumentNode<SchoolAssessmentSummaryQuery, SchoolAssessmentSummaryQueryVariables>;
export const SubmitAccessRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitAccessRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitAccessRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAccessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<SubmitAccessRequestMutation, SubmitAccessRequestMutationVariables>;
export const RequestOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"resendAfterSeconds"}}]}}]}}]} as unknown as DocumentNode<RequestOtpMutation, RequestOtpMutationVariables>;
export const VerifyOtpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyOtp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VerifyOtpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyOtp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}}]}}]}}]} as unknown as DocumentNode<VerifyOtpMutation, VerifyOtpMutationVariables>;
export const SchoolUserMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolUserMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<SchoolUserMeQuery, SchoolUserMeQueryVariables>;
export const UpdateMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateMe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateMeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateMe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateMeMutation, UpdateMeMutationVariables>;
export const SchoolUserLogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SchoolUserLogout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SchoolUserLogoutMutation, SchoolUserLogoutMutationVariables>;
export const SuperAdminLoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SuperAdminLogin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AdminLoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminLogin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<SuperAdminLoginMutation, SuperAdminLoginMutationVariables>;
export const SuperAdminMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SuperAdminMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<SuperAdminMeQuery, SuperAdminMeQueryVariables>;
export const SuperAdminChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SuperAdminChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeAdminPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeAdminPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SuperAdminChangePasswordMutation, SuperAdminChangePasswordMutationVariables>;
export const CreateSchoolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSchool"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSchoolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSchool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<CreateSchoolMutation, CreateSchoolMutationVariables>;
export const SchoolsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Schools"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListSchoolsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schools"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolsQuery, SchoolsQueryVariables>;
export const UpdateSchoolDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSchool"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSchoolInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSchool"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateSchoolMutation, UpdateSchoolMutationVariables>;
export const SetSchoolStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetSchoolStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetSchoolStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setSchoolStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}}]} as unknown as DocumentNode<SetSchoolStatusMutation, SetSchoolStatusMutationVariables>;
export const CreateSchoolAdminDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSchoolAdmin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSchoolAdminInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSchoolAdmin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"tempPassword"}},{"kind":"Field","name":{"kind":"Name","value":"notificationError"}},{"kind":"Field","name":{"kind":"Name","value":"admin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"forcePasswordChange"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateSchoolAdminMutation, CreateSchoolAdminMutationVariables>;
export const SchoolAdminsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolAdmins"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListSchoolAdminsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolAdmins"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolName"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"forcePasswordChange"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<SchoolAdminsQuery, SchoolAdminsQueryVariables>;
export const SetAdminStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetAdminStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetAdminStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setAdminStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SetAdminStatusMutation, SetAdminStatusMutationVariables>;
export const SuperAdminAccessRequestsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SuperAdminAccessRequests"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListAccessRequestsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessRequests"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"requestedRole"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedById"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"rejectReason"}},{"kind":"Field","name":{"kind":"Name","value":"approvedUserId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<SuperAdminAccessRequestsQuery, SuperAdminAccessRequestsQueryVariables>;
export const SuperAdminAuditLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SuperAdminAuditLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListAuditLogsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"auditLogs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<SuperAdminAuditLogsQuery, SuperAdminAuditLogsQueryVariables>;
export const CreateAuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAuditLogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"log"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"action"}},{"kind":"Field","name":{"kind":"Name","value":"actorId"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<CreateAuditLogMutation, CreateAuditLogMutationVariables>;
export const SuperAdminReviewAccessRequestDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SuperAdminReviewAccessRequest"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewAccessRequestInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewAccessRequest"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"requestId"}},{"kind":"Field","name":{"kind":"Name","value":"createdUserId"}},{"kind":"Field","name":{"kind":"Name","value":"notificationError"}}]}}]}}]} as unknown as DocumentNode<SuperAdminReviewAccessRequestMutation, SuperAdminReviewAccessRequestMutationVariables>;
export const SchoolByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SchoolById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"schoolById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"schoolId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"schoolId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"settings"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"archivedAt"}}]}}]}}]} as unknown as DocumentNode<SchoolByIdQuery, SchoolByIdQueryVariables>;
export const UpdateAdminProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAdminProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAdminProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAdminProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<UpdateAdminProfileMutation, UpdateAdminProfileMutationVariables>;