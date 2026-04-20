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

export type AccessRequestRole =
  | 'COUNSELOR'
  | 'PARENT'
  | 'STUDENT';

export type AccessRequestStatus =
  | 'APPROVED'
  | 'CANCELED'
  | 'PENDING'
  | 'REJECTED';

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

export type AssessmentResultDetail = {
  __typename?: 'AssessmentResultDetail';
  assignmentTitle: Scalars['String']['output'];
  bodilyKinesthetic: Scalars['Float']['output'];
  careerMatches: Array<CareerMatch>;
  createdAt: Scalars['String']['output'];
  dominantIntelligence: Scalars['String']['output'];
  id: Scalars['String']['output'];
  interpersonal: Scalars['Float']['output'];
  intrapersonal: Scalars['Float']['output'];
  linguistic: Scalars['Float']['output'];
  logicalMath: Scalars['Float']['output'];
  musical: Scalars['Float']['output'];
  naturalistic: Scalars['Float']['output'];
  scoreSummary: Maybe<Scalars['String']['output']>;
  studentAssignmentId: Scalars['String']['output'];
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

export type AssessmentStudentResult = {
  __typename?: 'AssessmentStudentResult';
  assignmentTitle: Scalars['String']['output'];
  bodilyKinesthetic: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  dominantIntelligence: Scalars['String']['output'];
  id: Scalars['String']['output'];
  interpersonal: Scalars['Float']['output'];
  intrapersonal: Scalars['Float']['output'];
  linguistic: Scalars['Float']['output'];
  logicalMath: Scalars['Float']['output'];
  musical: Scalars['Float']['output'];
  naturalistic: Scalars['Float']['output'];
  studentAssignmentId: Scalars['String']['output'];
  visualSpatial: Scalars['Float']['output'];
};

export type AssessmentStudentResultList = {
  __typename?: 'AssessmentStudentResultList';
  items: Array<AssessmentStudentResult>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type AssignAssignmentInput = {
  assignmentId: Scalars['String']['input'];
  studentIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type AssignmentDraftAnswerInput = {
  questionNumber: Scalars['Int']['input'];
  value: Scalars['Int']['input'];
};

export type AssignmentRef = {
  __typename?: 'AssignmentRef';
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AssignmentStatus =
  | 'CLOSED'
  | 'DRAFT'
  | 'PUBLISHED';

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

export type CancelCounselingSessionInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['String']['input'];
};

export type CancelParentSessionInput = {
  reason?: InputMaybe<Scalars['String']['input']>;
  sessionId: Scalars['String']['input'];
};

export type CareerMatch = {
  __typename?: 'CareerMatch';
  description: Scalars['String']['output'];
  fitReason: Scalars['String']['output'];
  score: Scalars['Float']['output'];
  title: Scalars['String']['output'];
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

export type CompareParentResultsInput = {
  baseResultId: Scalars['String']['input'];
  childId: Scalars['String']['input'];
  compareWithResultId: Scalars['String']['input'];
};

export type CompareResultsInput = {
  baseResultId: Scalars['String']['input'];
  compareWithResultId: Scalars['String']['input'];
};

export type CompareStudentResultItem = {
  __typename?: 'CompareStudentResultItem';
  dominantKey: Maybe<ParentIntelligenceKey>;
  latestDate: Maybe<Scalars['DateTime']['output']>;
  latestScore: Maybe<Scalars['Float']['output']>;
  studentId: Scalars['String']['output'];
  studentName: Scalars['String']['output'];
};

export type CompareStudentResults = {
  __typename?: 'CompareStudentResults';
  items: Array<CompareStudentResultItem>;
};

export type CompareStudentResultsInput = {
  studentIds: Array<Scalars['String']['input']>;
};

export type CounselingSession = {
  __typename?: 'CounselingSession';
  canceledAt: Maybe<Scalars['String']['output']>;
  counselorId: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  meetingUrl: Maybe<Scalars['String']['output']>;
  note: Maybe<Scalars['String']['output']>;
  scheduledAt: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CounselingSessionList = {
  __typename?: 'CounselingSessionList';
  items: Array<CounselingSession>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type CounselorAssessmentQueueItem = {
  __typename?: 'CounselorAssessmentQueueItem';
  assignmentId: Scalars['String']['output'];
  assignmentTitle: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  resultId: Maybe<Scalars['String']['output']>;
  reviewId: Scalars['String']['output'];
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  status: CounselorReviewStatus;
  studentId: Scalars['String']['output'];
  studentName: Scalars['String']['output'];
};

export type CounselorAssessmentQueueList = {
  __typename?: 'CounselorAssessmentQueueList';
  hasNext: Scalars['Boolean']['output'];
  items: Array<CounselorAssessmentQueueItem>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type CounselorAssignmentItem = {
  __typename?: 'CounselorAssignmentItem';
  assignmentId: Scalars['String']['output'];
  dueAt: Maybe<Scalars['DateTime']['output']>;
  pendingReviews: Scalars['Int']['output'];
  publishedAt: Maybe<Scalars['DateTime']['output']>;
  reviewedCount: Scalars['Int']['output'];
  status: AssignmentStatus;
  title: Scalars['String']['output'];
  totalAssignedStudents: Scalars['Int']['output'];
};

export type CounselorAssignmentList = {
  __typename?: 'CounselorAssignmentList';
  hasNext: Scalars['Boolean']['output'];
  items: Array<CounselorAssignmentItem>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type CounselorAssignmentsInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  studentId?: InputMaybe<Scalars['String']['input']>;
};

export type CounselorDashboardSummary = {
  __typename?: 'CounselorDashboardSummary';
  activeStudents: Scalars['Int']['output'];
  pendingReviews: Scalars['Int']['output'];
  sessionsToday: Scalars['Int']['output'];
  totalStudents: Scalars['Int']['output'];
  unreadNotifications: Scalars['Int']['output'];
  upcomingSessions: Scalars['Int']['output'];
};

export type CounselorExportFormat =
  | 'EXCEL'
  | 'PDF';

export type CounselorExportResult = {
  __typename?: 'CounselorExportResult';
  createdAt: Scalars['DateTime']['output'];
  fileName: Scalars['String']['output'];
  filePath: Scalars['String']['output'];
  format: CounselorExportFormat;
  id: Scalars['String']['output'];
};

export type CounselorNotification = {
  __typename?: 'CounselorNotification';
  actionUrl: Maybe<Scalars['String']['output']>;
  body: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  readAt: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  type: InAppNotificationType;
};

export type CounselorNotificationList = {
  __typename?: 'CounselorNotificationList';
  hasNext: Scalars['Boolean']['output'];
  items: Array<CounselorNotification>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type CounselorProgressPoint = {
  __typename?: 'CounselorProgressPoint';
  date: Scalars['DateTime']['output'];
  label: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type CounselorReviewDetail = {
  __typename?: 'CounselorReviewDetail';
  assignmentId: Scalars['String']['output'];
  assignmentTitle: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  dominantKey: Maybe<ParentIntelligenceKey>;
  feedback: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  resultId: Maybe<Scalars['String']['output']>;
  reviewedAt: Maybe<Scalars['DateTime']['output']>;
  status: CounselorReviewStatus;
  studentId: Scalars['String']['output'];
  studentName: Scalars['String']['output'];
};

export type CounselorReviewResult = {
  __typename?: 'CounselorReviewResult';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CounselorReviewStatus =
  | 'IN_REVIEW'
  | 'PENDING'
  | 'RETURNED'
  | 'REVIEWED';

export type CounselorSession = {
  __typename?: 'CounselorSession';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  meetingUrl: Maybe<Scalars['String']['output']>;
  note: Maybe<Scalars['String']['output']>;
  scheduledAt: Maybe<Scalars['DateTime']['output']>;
  status: ParentCounselingSessionStatus;
  studentId: Scalars['String']['output'];
  studentName: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type CounselorSessionList = {
  __typename?: 'CounselorSessionList';
  hasNext: Scalars['Boolean']['output'];
  items: Array<CounselorSession>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type CounselorStudentCard = {
  __typename?: 'CounselorStudentCard';
  assignedAt: Scalars['DateTime']['output'];
  email: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  latestResultAt: Maybe<Scalars['DateTime']['output']>;
  linkStatus: CounselorStudentLinkStatus;
  mobile: Maybe<Scalars['String']['output']>;
  pendingReviews: Scalars['Int']['output'];
  upcomingSessionAt: Maybe<Scalars['DateTime']['output']>;
};

export type CounselorStudentDetail = {
  __typename?: 'CounselorStudentDetail';
  email: Maybe<Scalars['String']['output']>;
  fullName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  latestResultAt: Maybe<Scalars['DateTime']['output']>;
  latestSessionAt: Maybe<Scalars['DateTime']['output']>;
  mobile: Maybe<Scalars['String']['output']>;
  pendingReviews: Scalars['Int']['output'];
  totalResults: Scalars['Int']['output'];
  totalSessions: Scalars['Int']['output'];
};

export type CounselorStudentLinkStatus =
  | 'ACTIVE'
  | 'ARCHIVED';

export type CounselorStudentList = {
  __typename?: 'CounselorStudentList';
  hasNext: Scalars['Boolean']['output'];
  items: Array<CounselorStudentCard>;
  limit: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
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

export type EnrollmentList = {
  __typename?: 'EnrollmentList';
  items: Array<Enrollment>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ExportCounselorStudentReportInput = {
  format: CounselorExportFormat;
  studentId: Scalars['String']['input'];
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

export type InAppNotification = {
  __typename?: 'InAppNotification';
  actionUrl: Maybe<Scalars['String']['output']>;
  body: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isRead: Scalars['Boolean']['output'];
  readAt: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type InAppNotificationList = {
  __typename?: 'InAppNotificationList';
  items: Array<InAppNotification>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type InAppNotificationType =
  | 'ASSIGNMENT_DUE'
  | 'ASSIGNMENT_PUBLISHED'
  | 'GENERAL'
  | 'RESULT_READY';

export type ListAccessRequestsInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  requestedRole?: InputMaybe<AccessRequestRole>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<AccessRequestStatus>;
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

export type ListEnrollmentsByClassroomInput = {
  classroomId: Scalars['String']['input'];
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

export type ListMyAssessmentResultsInput = {
  dominantIntelligence?: InputMaybe<ParentIntelligenceKey>;
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type ListMyAssignmentsInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<StudentAssignmentStatus>;
  take: Scalars['Int']['input'];
};

export type ListMyChildrenInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type ListMyCounselingSessionsInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<ParentCounselingSessionStatus>;
  take: Scalars['Int']['input'];
};

export type ListMyNotificationsInput = {
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  unreadOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ListParentChildActivitiesInput = {
  childId: Scalars['String']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
  type?: InputMaybe<StudentActivityType>;
};

export type ListParentChildGradesInput = {
  childId: Scalars['String']['input'];
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  subject?: InputMaybe<Scalars['String']['input']>;
  take: Scalars['Int']['input'];
  termLabel?: InputMaybe<Scalars['String']['input']>;
};

export type ListParentChildResultsInput = {
  childId: Scalars['String']['input'];
  dominantIntelligence?: InputMaybe<ParentIntelligenceKey>;
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  take: Scalars['Int']['input'];
};

export type ListParentCounselingSessionsInput = {
  childId?: InputMaybe<Scalars['String']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  skip: Scalars['Int']['input'];
  status?: InputMaybe<ParentCounselingSessionStatus>;
  take: Scalars['Int']['input'];
};

export type ListParentResourcesInput = {
  category?: InputMaybe<ParentResourceCategory>;
  query?: InputMaybe<Scalars['String']['input']>;
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

export type MarkCounselorNotificationReadInput = {
  notificationId: Scalars['String']['input'];
};

export type MarkNotificationReadInput = {
  notificationId: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  adminLogin: AuthPayload;
  archiveClassroom: Classroom;
  archiveGrade: Grade;
  assignAssignmentToStudents: Scalars['String']['output'];
  cancelCounselingSession: NotificationStudentResult;
  changeAdminPassword: PasswordResult;
  closeEnrollment: Enrollment;
  createAssignment: SchoolAssignment;
  createAuditLog: AuditCreateResult;
  createClassroom: Classroom;
  createGrade: Grade;
  createSchool: School;
  createSchoolAdmin: CreateSchoolAdminResult;
  enrollStudent: Enrollment;
  exportCounselorStudentReport: CounselorExportResult;
  logout: LogoutResult;
  logoutAll: LogoutResult;
  markCounselorNotificationRead: CounselorReviewResult;
  markNotificationRead: NotificationStudentResult;
  parentCancelCounselingSession: ParentSessionRequestResult;
  parentRequestCounselingSession: ParentSessionRequestResult;
  publishAssignment: SchoolAssignment;
  refreshAuth: AuthPayload;
  removeSchoolMember: User;
  requestCounselingSession: CounselingSession;
  requestOtp: OtpResponse;
  resetAdminPassword: PasswordResult;
  restoreClassroom: Classroom;
  restoreGrade: Grade;
  reviewAccessRequest: ReviewResult;
  reviewStudentAssessment: CounselorReviewResult;
  scheduleCounselorSession: CounselorSession;
  sendTestEmail: NotificationResult;
  sendTestSms: NotificationResult;
  setAdminStatus: Scalars['String']['output'];
  setSchoolStatus: School;
  submitAccessRequest: AccessRequest;
  submitAssignmentAnswers: NotificationStudentResult;
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


export type MutationCancelCounselingSessionArgs = {
  input: CancelCounselingSessionInput;
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


export type MutationExportCounselorStudentReportArgs = {
  input: ExportCounselorStudentReportInput;
};


export type MutationMarkCounselorNotificationReadArgs = {
  input: MarkCounselorNotificationReadInput;
};


export type MutationMarkNotificationReadArgs = {
  input: MarkNotificationReadInput;
};


export type MutationParentCancelCounselingSessionArgs = {
  input: CancelParentSessionInput;
};


export type MutationParentRequestCounselingSessionArgs = {
  input: ParentRequestSessionInput;
};


export type MutationPublishAssignmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveSchoolMemberArgs = {
  input: RemoveSchoolMemberInput;
};


export type MutationRequestCounselingSessionArgs = {
  input: RequestCounselingSessionInput;
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


export type MutationReviewStudentAssessmentArgs = {
  input: ReviewStudentAssessmentInput;
};


export type MutationScheduleCounselorSessionArgs = {
  input: ScheduleCounselorSessionInput;
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


export type MutationSubmitAssignmentAnswersArgs = {
  input: SubmitAssignmentAnswersInput;
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

export type MyCounselorNotificationsInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  unreadOnly: Scalars['Boolean']['input'];
};

export type MyCounselorSessionsInput = {
  from?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ParentCounselingSessionStatus>;
  studentId?: InputMaybe<Scalars['String']['input']>;
  to?: InputMaybe<Scalars['String']['input']>;
};

export type MyStudentsInput = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CounselorStudentLinkStatus>;
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

export type NotificationStudentResult = {
  __typename?: 'NotificationStudentResult';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type OtpResponse = {
  __typename?: 'OtpResponse';
  message: Scalars['String']['output'];
  resendAfterSeconds: Maybe<Scalars['Float']['output']>;
};

export type ParentAssessmentResult = {
  __typename?: 'ParentAssessmentResult';
  assignmentTitle: Scalars['String']['output'];
  bodilyKinesthetic: Scalars['Float']['output'];
  careerMatches: Maybe<Array<ParentCareerMatch>>;
  createdAt: Scalars['DateTime']['output'];
  dominantIntelligence: Maybe<ParentIntelligenceKey>;
  id: Scalars['String']['output'];
  interpersonal: Scalars['Float']['output'];
  intrapersonal: Scalars['Float']['output'];
  linguistic: Scalars['Float']['output'];
  logicalMath: Scalars['Float']['output'];
  musical: Scalars['Float']['output'];
  naturalistic: Scalars['Float']['output'];
  studentAssignmentId: Scalars['String']['output'];
  summaryJson: Maybe<Scalars['String']['output']>;
  visualSpatial: Scalars['Float']['output'];
};

export type ParentAssessmentResultList = {
  __typename?: 'ParentAssessmentResultList';
  items: Array<ParentAssessmentResult>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ParentCareerMatch = {
  __typename?: 'ParentCareerMatch';
  description: Maybe<Scalars['String']['output']>;
  fitReason: Maybe<Scalars['String']['output']>;
  score: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type ParentChild = {
  __typename?: 'ParentChild';
  avatarUrl: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['DateTime']['output']>;
  currentEnrollment: Maybe<ParentChildCurrentEnrollment>;
  email: Maybe<Scalars['String']['output']>;
  fullName: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isPrimary: Scalars['Boolean']['output'];
  mobile: Maybe<Scalars['String']['output']>;
  relation: ParentRelationType;
  status: Maybe<UserStatus>;
};

export type ParentChildCurrentEnrollment = {
  __typename?: 'ParentChildCurrentEnrollment';
  classroom: Maybe<ParentChildEnrollmentClassroom>;
  endedAt: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['String']['output'];
  startedAt: Scalars['DateTime']['output'];
};

export type ParentChildDetail = {
  __typename?: 'ParentChildDetail';
  avatarUrl: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['DateTime']['output']>;
  currentEnrollment: Maybe<ParentChildCurrentEnrollment>;
  email: Maybe<Scalars['String']['output']>;
  fullName: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  isPrimary: Scalars['Boolean']['output'];
  mobile: Maybe<Scalars['String']['output']>;
  relation: ParentRelationType;
  status: Maybe<UserStatus>;
};

export type ParentChildDetailInput = {
  childId: Scalars['String']['input'];
};

export type ParentChildEnrollmentClassroom = {
  __typename?: 'ParentChildEnrollmentClassroom';
  grade: Maybe<ParentChildEnrollmentGrade>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ParentChildEnrollmentGrade = {
  __typename?: 'ParentChildEnrollmentGrade';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ParentChildList = {
  __typename?: 'ParentChildList';
  items: Array<ParentChild>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ParentCompareResultItem = {
  __typename?: 'ParentCompareResultItem';
  current: Scalars['Float']['output'];
  delta: Scalars['Float']['output'];
  intelligence: ParentIntelligenceKey;
  previous: Scalars['Float']['output'];
};

export type ParentCounselingSession = {
  __typename?: 'ParentCounselingSession';
  canceledAt: Maybe<Scalars['DateTime']['output']>;
  counselorId: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  meetingUrl: Maybe<Scalars['String']['output']>;
  note: Maybe<Scalars['String']['output']>;
  scheduledAt: Maybe<Scalars['DateTime']['output']>;
  status: ParentCounselingSessionStatus;
  student: Maybe<ParentCounselingSessionStudent>;
  studentId: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type ParentCounselingSessionList = {
  __typename?: 'ParentCounselingSessionList';
  items: Array<ParentCounselingSession>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ParentCounselingSessionStatus =
  | 'CANCELED'
  | 'COMPLETED'
  | 'CONFIRMED'
  | 'REQUESTED'
  | 'RESCHEDULED';

export type ParentCounselingSessionStudent = {
  __typename?: 'ParentCounselingSessionStudent';
  avatarUrl: Maybe<Scalars['String']['output']>;
  email: Maybe<Scalars['String']['output']>;
  fullName: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  mobile: Maybe<Scalars['String']['output']>;
};

export type ParentDashboardSummary = {
  __typename?: 'ParentDashboardSummary';
  progressTimeline: Array<ParentProgressPoint>;
  totalActivities: Scalars['Int']['output'];
  totalChildren: Scalars['Int']['output'];
  totalResults: Scalars['Int']['output'];
  totalSessions: Scalars['Int']['output'];
};

export type ParentIntelligenceKey =
  | 'BODILY_KINESTHETIC'
  | 'INTERPERSONAL'
  | 'INTRAPERSONAL'
  | 'LINGUISTIC'
  | 'LOGICAL_MATHEMATICAL'
  | 'MUSICAL'
  | 'NATURALISTIC'
  | 'VISUAL_SPATIAL';

export type ParentProgressPoint = {
  __typename?: 'ParentProgressPoint';
  label: Scalars['String']['output'];
  overall: Scalars['Float']['output'];
};

export type ParentRelationType =
  | 'FATHER'
  | 'GUARDIAN'
  | 'MOTHER'
  | 'OTHER';

export type ParentRequestSessionInput = {
  childId: Scalars['String']['input'];
  counselorId?: InputMaybe<Scalars['String']['input']>;
  meetingUrl?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type ParentResource = {
  __typename?: 'ParentResource';
  category: ParentResourceCategory;
  content: Maybe<Scalars['String']['output']>;
  coverImageUrl: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  isPublished: Scalars['Boolean']['output'];
  slug: Scalars['String']['output'];
  summary: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type ParentResourceCategory =
  | 'CAREER_GUIDE'
  | 'COMMUNICATION'
  | 'STUDY_SUPPORT'
  | 'SUPPORT_TEEN'
  | 'WELLBEING';

export type ParentResourceList = {
  __typename?: 'ParentResourceList';
  items: Array<ParentResource>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ParentSessionRequestResult = {
  __typename?: 'ParentSessionRequestResult';
  message: Scalars['String']['output'];
  sessionId: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
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
  compareParentResults: Array<ParentCompareResultItem>;
  compareResults: Array<ResultCompareItem>;
  compareStudentResults: CompareStudentResults;
  counselorAssignments: CounselorAssignmentList;
  counselorDashboardSummary: CounselorDashboardSummary;
  counselorReviewDetail: CounselorReviewDetail;
  counselorStudentDetail: CounselorStudentDetail;
  enrollmentsByClassroom: EnrollmentList;
  grades: GradeList;
  me: User;
  myAssessmentResultDetail: AssessmentResultDetail;
  myAssessmentResults: AssessmentStudentResultList;
  myAssignmentDetail: StudentAssignmentDetail;
  myAssignments: StudentAssignmentList;
  myChildren: ParentChildList;
  myCounselingSessions: CounselingSessionList;
  myCounselorNotifications: CounselorNotificationList;
  myCounselorSessions: CounselorSessionList;
  myNotifications: InAppNotificationList;
  myStudents: CounselorStudentList;
  parentChildActivities: StudentActivityList;
  parentChildDetail: ParentChildDetail;
  parentChildGrades: StudentGradeRecordList;
  parentChildResults: ParentAssessmentResultList;
  parentCounselingSessions: ParentCounselingSessionList;
  parentDashboardSummary: ParentDashboardSummary;
  parentResources: ParentResourceList;
  parentResultDetail: ParentAssessmentResult;
  publicSchools: PublicSchoolList;
  schoolAdmins: SchoolAdminList;
  schoolAssessmentSummary: SchoolAssessmentSummary;
  schoolById: School;
  schoolMembers: UserList;
  schools: SchoolList;
  studentAssessmentQueue: CounselorAssessmentQueueList;
  studentDashboardSummary: StudentDashboardSummary;
  studentProgressTimeline: Array<CounselorProgressPoint>;
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


export type QueryCompareParentResultsArgs = {
  input: CompareParentResultsInput;
};


export type QueryCompareResultsArgs = {
  input: CompareResultsInput;
};


export type QueryCompareStudentResultsArgs = {
  input: CompareStudentResultsInput;
};


export type QueryCounselorAssignmentsArgs = {
  input: CounselorAssignmentsInput;
};


export type QueryCounselorReviewDetailArgs = {
  reviewId: Scalars['String']['input'];
};


export type QueryCounselorStudentDetailArgs = {
  studentId: Scalars['String']['input'];
};


export type QueryEnrollmentsByClassroomArgs = {
  input: ListEnrollmentsByClassroomInput;
};


export type QueryGradesArgs = {
  input: ListGradesInput;
};


export type QueryMyAssessmentResultDetailArgs = {
  resultId: Scalars['String']['input'];
};


export type QueryMyAssessmentResultsArgs = {
  input: ListMyAssessmentResultsInput;
};


export type QueryMyAssignmentDetailArgs = {
  studentAssignmentId: Scalars['String']['input'];
};


export type QueryMyAssignmentsArgs = {
  input: ListMyAssignmentsInput;
};


export type QueryMyChildrenArgs = {
  input: ListMyChildrenInput;
};


export type QueryMyCounselingSessionsArgs = {
  input: ListMyCounselingSessionsInput;
};


export type QueryMyCounselorNotificationsArgs = {
  input: MyCounselorNotificationsInput;
};


export type QueryMyCounselorSessionsArgs = {
  input: MyCounselorSessionsInput;
};


export type QueryMyNotificationsArgs = {
  input: ListMyNotificationsInput;
};


export type QueryMyStudentsArgs = {
  input: MyStudentsInput;
};


export type QueryParentChildActivitiesArgs = {
  input: ListParentChildActivitiesInput;
};


export type QueryParentChildDetailArgs = {
  input: ParentChildDetailInput;
};


export type QueryParentChildGradesArgs = {
  input: ListParentChildGradesInput;
};


export type QueryParentChildResultsArgs = {
  input: ListParentChildResultsInput;
};


export type QueryParentCounselingSessionsArgs = {
  input: ListParentCounselingSessionsInput;
};


export type QueryParentResourcesArgs = {
  input: ListParentResourcesInput;
};


export type QueryParentResultDetailArgs = {
  resultId: Scalars['String']['input'];
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


export type QueryStudentAssessmentQueueArgs = {
  input: StudentAssessmentQueueInput;
};


export type QueryStudentProgressTimelineArgs = {
  input: StudentProgressTimelineInput;
};

export type RemoveSchoolMemberInput = {
  hardDelete?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['String']['input'];
};

export type RequestCounselingSessionInput = {
  counselorId?: InputMaybe<Scalars['String']['input']>;
  meetingUrl?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  scheduledAt?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type RequestOtpInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  schoolCode?: InputMaybe<Scalars['String']['input']>;
};

export type ResetAdminPasswordInput = {
  adminUserId: Scalars['String']['input'];
};

export type ResultCompareItem = {
  __typename?: 'ResultCompareItem';
  current: Scalars['Float']['output'];
  delta: Scalars['Float']['output'];
  intelligence: Scalars['String']['output'];
  previous: Scalars['Float']['output'];
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

export type ReviewStudentAssessmentInput = {
  feedback?: InputMaybe<Scalars['String']['input']>;
  reviewId: Scalars['String']['input'];
  status: CounselorReviewStatus;
};

export type ScheduleCounselorSessionInput = {
  meetingUrl?: InputMaybe<Scalars['String']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  scheduledAt: Scalars['String']['input'];
  studentId: Scalars['String']['input'];
  title: Scalars['String']['input'];
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

export type StudentActivity = {
  __typename?: 'StudentActivity';
  createdAt: Scalars['DateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  metadata: Maybe<Scalars['JSON']['output']>;
  title: Scalars['String']['output'];
  type: StudentActivityType;
};

export type StudentActivityList = {
  __typename?: 'StudentActivityList';
  items: Array<StudentActivity>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type StudentActivityType =
  | 'ASSESSMENT_COMPLETED'
  | 'ASSIGNMENT_ASSIGNED'
  | 'ASSIGNMENT_STARTED'
  | 'ASSIGNMENT_SUBMITTED'
  | 'CAREER_MATCH_UPDATED'
  | 'PROFILE_UPDATED'
  | 'RESULT_PUBLISHED'
  | 'SESSION_BOOKED'
  | 'SESSION_COMPLETED'
  | 'SESSION_REQUESTED';

export type StudentAnswerInput = {
  questionId: Scalars['String']['input'];
  value: Scalars['Int']['input'];
};

export type StudentAssessmentQueueInput = {
  assignmentId?: InputMaybe<Scalars['String']['input']>;
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<CounselorReviewStatus>;
  studentId?: InputMaybe<Scalars['String']['input']>;
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

export type StudentAssignmentDetail = {
  __typename?: 'StudentAssignmentDetail';
  assignmentId: Scalars['String']['output'];
  description: Maybe<Scalars['String']['output']>;
  dueAt: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  publishedAt: Maybe<Scalars['String']['output']>;
  questions: Array<StudentAssignmentQuestion>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type StudentAssignmentList = {
  __typename?: 'StudentAssignmentList';
  items: Array<StudentDashboardAssignment>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type StudentAssignmentQuestion = {
  __typename?: 'StudentAssignmentQuestion';
  answerValue: Maybe<Scalars['Int']['output']>;
  id: Scalars['String']['output'];
  order: Scalars['Int']['output'];
  questionNumber: Scalars['Int']['output'];
  text: Scalars['String']['output'];
};

export type StudentAssignmentStatus =
  | 'EVALUATED'
  | 'IN_PROGRESS'
  | 'NOT_STARTED'
  | 'PENDING'
  | 'SUBMITTED';

export type StudentDashboardAssignment = {
  __typename?: 'StudentDashboardAssignment';
  assignmentId: Scalars['String']['output'];
  completionRate: Scalars['Float']['output'];
  description: Maybe<Scalars['String']['output']>;
  dueAt: Maybe<Scalars['String']['output']>;
  evaluatedAt: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  publishedAt: Maybe<Scalars['String']['output']>;
  startedAt: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  submittedAt: Maybe<Scalars['String']['output']>;
  targetMode: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type StudentDashboardSummary = {
  __typename?: 'StudentDashboardSummary';
  dominantIntelligence: Maybe<Scalars['String']['output']>;
  evaluatedAssignments: Scalars['Int']['output'];
  inProgressAssignments: Scalars['Int']['output'];
  latestOverallScore: Scalars['Float']['output'];
  pendingAssignments: Scalars['Int']['output'];
  pendingCounselingSessions: Scalars['Int']['output'];
  progressTimeline: Array<StudentProgressPoint>;
  submittedAssignments: Scalars['Int']['output'];
  totalAssignments: Scalars['Int']['output'];
  unreadNotifications: Scalars['Int']['output'];
};

export type StudentGradeRecord = {
  __typename?: 'StudentGradeRecord';
  createdAt: Scalars['DateTime']['output'];
  examTitle: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  maxScore: Scalars['Float']['output'];
  recordedAt: Scalars['DateTime']['output'];
  score: Scalars['Float']['output'];
  subject: Scalars['String']['output'];
  termLabel: Maybe<Scalars['String']['output']>;
};

export type StudentGradeRecordList = {
  __typename?: 'StudentGradeRecordList';
  items: Array<StudentGradeRecord>;
  skip: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type StudentProgressPoint = {
  __typename?: 'StudentProgressPoint';
  label: Scalars['String']['output'];
  overall: Scalars['Float']['output'];
};

export type StudentProgressTimelineInput = {
  limit: Scalars['Int']['input'];
  studentId: Scalars['String']['input'];
};

export type SubmitAccessRequestInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  requestedRole: AccessRequestRole;
  schoolId: Scalars['String']['input'];
};

export type SubmitAssignmentAnswersInput = {
  answers: Array<AssignmentDraftAnswerInput>;
  studentAssignmentId: Scalars['String']['input'];
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

export type UserStatus =
  | 'ACTIVE'
  | 'DELETED'
  | 'DISABLED';

export type VerifyOtpInput = {
  code: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  mobile?: InputMaybe<Scalars['String']['input']>;
  schoolCode?: InputMaybe<Scalars['String']['input']>;
};

export type CounselorDashboardSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type CounselorDashboardSummaryQuery = { __typename?: 'Query', counselorDashboardSummary: { __typename?: 'CounselorDashboardSummary', totalStudents: number, sessionsToday: number, activeStudents: number, pendingReviews: number, upcomingSessions: number, unreadNotifications: number } };

export type MyStudentsQueryVariables = Exact<{
  input: MyStudentsInput;
}>;


export type MyStudentsQuery = { __typename?: 'Query', myStudents: { __typename?: 'CounselorStudentList', page: number, total: number, limit: number, hasNext: boolean, items: Array<{ __typename?: 'CounselorStudentCard', id: string, email: string | null, mobile: string | null, fullName: string, linkStatus: CounselorStudentLinkStatus, assignedAt: string, pendingReviews: number, latestResultAt: string | null, upcomingSessionAt: string | null }> } };

export type CounselorStudentDetailQueryVariables = Exact<{
  studentId: Scalars['String']['input'];
}>;


export type CounselorStudentDetailQuery = { __typename?: 'Query', counselorStudentDetail: { __typename?: 'CounselorStudentDetail', id: string, email: string | null, mobile: string | null, fullName: string, totalResults: number, totalSessions: number, pendingReviews: number, latestResultAt: string | null, latestSessionAt: string | null } };

export type StudentAssessmentQueueQueryVariables = Exact<{
  input: StudentAssessmentQueueInput;
}>;


export type StudentAssessmentQueueQuery = { __typename?: 'Query', studentAssessmentQueue: { __typename?: 'CounselorAssessmentQueueList', page: number, total: number, limit: number, hasNext: boolean, items: Array<{ __typename?: 'CounselorAssessmentQueueItem', status: CounselorReviewStatus, reviewId: string, resultId: string | null, studentId: string, createdAt: string, reviewedAt: string | null, studentName: string, assignmentId: string, assignmentTitle: string }> } };

export type CounselorReviewDetailQueryVariables = Exact<{
  reviewId: Scalars['String']['input'];
}>;


export type CounselorReviewDetailQuery = { __typename?: 'Query', counselorReviewDetail: { __typename?: 'CounselorReviewDetail', id: string, status: CounselorReviewStatus, feedback: string | null, resultId: string | null, studentId: string, createdAt: string, reviewedAt: string | null, dominantKey: ParentIntelligenceKey | null, studentName: string, assignmentId: string, assignmentTitle: string } };

export type ReviewStudentAssessmentMutationVariables = Exact<{
  input: ReviewStudentAssessmentInput;
}>;


export type ReviewStudentAssessmentMutation = { __typename?: 'Mutation', reviewStudentAssessment: { __typename?: 'CounselorReviewResult', success: boolean, message: string } };

export type CounselorAssignmentsQueryVariables = Exact<{
  input: CounselorAssignmentsInput;
}>;


export type CounselorAssignmentsQuery = { __typename?: 'Query', counselorAssignments: { __typename?: 'CounselorAssignmentList', page: number, total: number, limit: number, hasNext: boolean, items: Array<{ __typename?: 'CounselorAssignmentItem', title: string, dueAt: string | null, status: AssignmentStatus, publishedAt: string | null, assignmentId: string, reviewedCount: number, pendingReviews: number, totalAssignedStudents: number }> } };

export type StudentProgressTimelineQueryVariables = Exact<{
  input: StudentProgressTimelineInput;
}>;


export type StudentProgressTimelineQuery = { __typename?: 'Query', studentProgressTimeline: Array<{ __typename?: 'CounselorProgressPoint', date: string, label: string, value: number }> };

export type ScheduleCounselorSessionMutationVariables = Exact<{
  input: ScheduleCounselorSessionInput;
}>;


export type ScheduleCounselorSessionMutation = { __typename?: 'Mutation', scheduleCounselorSession: { __typename?: 'CounselorSession', id: string, note: string | null, title: string, status: ParentCounselingSessionStatus, createdAt: string, studentId: string, meetingUrl: string | null, studentName: string, scheduledAt: string | null } };

export type MyCounselorSessionsQueryVariables = Exact<{
  input: MyCounselorSessionsInput;
}>;


export type MyCounselorSessionsQuery = { __typename?: 'Query', myCounselorSessions: { __typename?: 'CounselorSessionList', page: number, total: number, limit: number, hasNext: boolean, items: Array<{ __typename?: 'CounselorSession', id: string, note: string | null, title: string, status: ParentCounselingSessionStatus, createdAt: string, studentId: string, meetingUrl: string | null, studentName: string, scheduledAt: string | null }> } };

export type MyCounselorNotificationsQueryVariables = Exact<{
  input: MyCounselorNotificationsInput;
}>;


export type MyCounselorNotificationsQuery = { __typename?: 'Query', myCounselorNotifications: { __typename?: 'CounselorNotificationList', page: number, total: number, limit: number, hasNext: boolean, items: Array<{ __typename?: 'CounselorNotification', id: string, type: InAppNotificationType, body: string, title: string, readAt: string | null, isRead: boolean, actionUrl: string | null, createdAt: string }> } };

export type MarkCounselorNotificationReadMutationVariables = Exact<{
  input: MarkCounselorNotificationReadInput;
}>;


export type MarkCounselorNotificationReadMutation = { __typename?: 'Mutation', markCounselorNotificationRead: { __typename?: 'CounselorReviewResult', success: boolean, message: string } };

export type ExportCounselorStudentReportMutationVariables = Exact<{
  input: ExportCounselorStudentReportInput;
}>;


export type ExportCounselorStudentReportMutation = { __typename?: 'Mutation', exportCounselorStudentReport: { __typename?: 'CounselorExportResult', id: string, format: CounselorExportFormat, fileName: string, filePath: string, createdAt: string } };

export type CompareStudentResultsQueryVariables = Exact<{
  input: CompareStudentResultsInput;
}>;


export type CompareStudentResultsQuery = { __typename?: 'Query', compareStudentResults: { __typename?: 'CompareStudentResults', items: Array<{ __typename?: 'CompareStudentResultItem', studentId: string, latestDate: string | null, studentName: string, latestScore: number | null, dominantKey: ParentIntelligenceKey | null }> } };

export type HeaderCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type HeaderCurrentUserQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, role: string, email: string | null, fullName: string | null, schoolId: string | null, avatarUrl: string | null, forcePasswordChange: boolean | null } };

export type HeaderLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type HeaderLogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'LogoutResult', message: string } };

export type ParentDashboardSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type ParentDashboardSummaryQuery = { __typename?: 'Query', parentDashboardSummary: { __typename?: 'ParentDashboardSummary', totalResults: number, totalChildren: number, totalSessions: number, totalActivities: number } };

export type MyChildrenQueryVariables = Exact<{
  input: ListMyChildrenInput;
}>;


export type MyChildrenQuery = { __typename?: 'Query', myChildren: { __typename?: 'ParentChildList', take: number, skip: number, total: number, items: Array<{ __typename?: 'ParentChild', id: string, email: string | null, mobile: string | null, fullName: string | null, relation: ParentRelationType, isPrimary: boolean, avatarUrl: string | null, createdAt: string | null, currentEnrollment: { __typename?: 'ParentChildCurrentEnrollment', id: string, startedAt: string, endedAt: string | null, classroom: { __typename?: 'ParentChildEnrollmentClassroom', id: string, name: string, grade: { __typename?: 'ParentChildEnrollmentGrade', id: string, name: string } | null } | null } | null }> } };

export type ParentChildDetailQueryVariables = Exact<{
  input: ParentChildDetailInput;
}>;


export type ParentChildDetailQuery = { __typename?: 'Query', parentChildDetail: { __typename?: 'ParentChildDetail', id: string, email: string | null, mobile: string | null, relation: ParentRelationType, fullName: string | null, isPrimary: boolean, avatarUrl: string | null, currentEnrollment: { __typename?: 'ParentChildCurrentEnrollment', id: string, startedAt: string, endedAt: string | null, classroom: { __typename?: 'ParentChildEnrollmentClassroom', id: string, name: string, grade: { __typename?: 'ParentChildEnrollmentGrade', id: string, name: string } | null } | null } | null } };

export type ParentChildGradesQueryVariables = Exact<{
  input: ListParentChildGradesInput;
}>;


export type ParentChildGradesQuery = { __typename?: 'Query', parentChildGrades: { __typename?: 'StudentGradeRecordList', take: number, skip: number, total: number, items: Array<{ __typename?: 'StudentGradeRecord', id: string, score: number, subject: string, maxScore: number, examTitle: string | null, termLabel: string | null, createdAt: string, recordedAt: string }> } };

export type ParentChildResultsQueryVariables = Exact<{
  input: ListParentChildResultsInput;
}>;


export type ParentChildResultsQuery = { __typename?: 'Query', parentChildResults: { __typename?: 'ParentAssessmentResultList', take: number, skip: number, total: number, items: Array<{ __typename?: 'ParentAssessmentResult', id: string, musical: number, createdAt: string, linguistic: number, logicalMath: number, naturalistic: number, interpersonal: number, intrapersonal: number, visualSpatial: number, assignmentTitle: string, bodilyKinesthetic: number, studentAssignmentId: string, dominantIntelligence: ParentIntelligenceKey | null }> } };

export type ParentResultDetailQueryVariables = Exact<{
  resultId: Scalars['String']['input'];
}>;


export type ParentResultDetailQuery = { __typename?: 'Query', parentResultDetail: { __typename?: 'ParentAssessmentResult', id: string, musical: number, createdAt: string, linguistic: number, logicalMath: number, naturalistic: number, interpersonal: number, intrapersonal: number, visualSpatial: number, assignmentTitle: string, bodilyKinesthetic: number, studentAssignmentId: string, dominantIntelligence: ParentIntelligenceKey | null, careerMatches: Array<{ __typename?: 'ParentCareerMatch', title: string, score: number, fitReason: string | null, description: string | null }> | null } };

export type CompareParentResultsQueryVariables = Exact<{
  input: CompareParentResultsInput;
}>;


export type CompareParentResultsQuery = { __typename?: 'Query', compareParentResults: Array<{ __typename?: 'ParentCompareResultItem', delta: number, current: number, previous: number, intelligence: ParentIntelligenceKey }> };

export type ParentResourcesQueryVariables = Exact<{
  input: ListParentResourcesInput;
}>;


export type ParentResourcesQuery = { __typename?: 'Query', parentResources: { __typename?: 'ParentResourceList', take: number, skip: number, total: number, items: Array<{ __typename?: 'ParentResource', id: string, slug: string, title: string, summary: string | null, content: string | null, category: ParentResourceCategory, createdAt: string, isPublished: boolean, coverImageUrl: string | null }> } };

export type ParentChildActivitiesQueryVariables = Exact<{
  input: ListParentChildActivitiesInput;
}>;


export type ParentChildActivitiesQuery = { __typename?: 'Query', parentChildActivities: { __typename?: 'StudentActivityList', take: number, skip: number, total: number, items: Array<{ __typename?: 'StudentActivity', id: string, type: StudentActivityType, title: string, metadata: unknown | null, createdAt: string, description: string | null }> } };

export type ParentCounselingSessionsQueryVariables = Exact<{
  input: ListParentCounselingSessionsInput;
}>;


export type ParentCounselingSessionsQuery = { __typename?: 'Query', parentCounselingSessions: { __typename?: 'ParentCounselingSessionList', take: number, skip: number, total: number, items: Array<{ __typename?: 'ParentCounselingSession', id: string, note: string | null, title: string, status: ParentCounselingSessionStatus, createdAt: string, canceledAt: string | null, meetingUrl: string | null, scheduledAt: string | null, counselorId: string | null, studentId: string, student: { __typename?: 'ParentCounselingSessionStudent', id: string, fullName: string | null, email: string | null, mobile: string | null, avatarUrl: string | null } | null }> } };

export type ParentRequestCounselingSessionMutationVariables = Exact<{
  input: ParentRequestSessionInput;
}>;


export type ParentRequestCounselingSessionMutation = { __typename?: 'Mutation', parentRequestCounselingSession: { __typename?: 'ParentSessionRequestResult', success: boolean, message: string, sessionId: string | null } };

export type ParentCancelCounselingSessionMutationVariables = Exact<{
  input: CancelParentSessionInput;
}>;


export type ParentCancelCounselingSessionMutation = { __typename?: 'Mutation', parentCancelCounselingSession: { __typename?: 'ParentSessionRequestResult', success: boolean, message: string, sessionId: string | null } };

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
  input: ListEnrollmentsByClassroomInput;
}>;


export type EnrollmentsByClassroomQuery = { __typename?: 'Query', enrollmentsByClassroom: { __typename?: 'EnrollmentList', total: number, take: number, skip: number, items: Array<{ __typename?: 'Enrollment', id: string, endedAt: string | null, schoolId: string, studentId: string, createdAt: string, startedAt: string, updatedAt: string, classroomId: string }> } };

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

export type StudentDashboardSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type StudentDashboardSummaryQuery = { __typename?: 'Query', studentDashboardSummary: { __typename?: 'StudentDashboardSummary', totalAssignments: number, pendingAssignments: number, latestOverallScore: number, unreadNotifications: number, submittedAssignments: number, evaluatedAssignments: number, dominantIntelligence: string | null, inProgressAssignments: number, pendingCounselingSessions: number, progressTimeline: Array<{ __typename?: 'StudentProgressPoint', label: string, overall: number }> } };

export type MyAssignmentsQueryVariables = Exact<{
  input: ListMyAssignmentsInput;
}>;


export type MyAssignmentsQuery = { __typename?: 'Query', myAssignments: { __typename?: 'StudentAssignmentList', take: number, skip: number, total: number, items: Array<{ __typename?: 'StudentDashboardAssignment', id: string, title: string, dueAt: string | null, status: string, startedAt: string | null, targetMode: string | null, description: string | null, publishedAt: string | null, submittedAt: string | null, evaluatedAt: string | null, assignmentId: string, completionRate: number }> } };

export type MyAssignmentDetailQueryVariables = Exact<{
  studentAssignmentId: Scalars['String']['input'];
}>;


export type MyAssignmentDetailQuery = { __typename?: 'Query', myAssignmentDetail: { __typename?: 'StudentAssignmentDetail', id: string, title: string, dueAt: string | null, status: string, publishedAt: string | null, description: string | null, assignmentId: string, questions: Array<{ __typename?: 'StudentAssignmentQuestion', id: string, text: string, order: number, answerValue: number | null, questionNumber: number }> } };

export type SubmitAssignmentAnswersMutationVariables = Exact<{
  input: SubmitAssignmentAnswersInput;
}>;


export type SubmitAssignmentAnswersMutation = { __typename?: 'Mutation', submitAssignmentAnswers: { __typename?: 'NotificationStudentResult', success: boolean, message: string } };

export type MyAssessmentResultsQueryVariables = Exact<{
  input: ListMyAssessmentResultsInput;
}>;


export type MyAssessmentResultsQuery = { __typename?: 'Query', myAssessmentResults: { __typename?: 'AssessmentStudentResultList', total: number, take: number, skip: number, items: Array<{ __typename?: 'AssessmentStudentResult', id: string, musical: number, createdAt: string, linguistic: number, logicalMath: number, naturalistic: number, visualSpatial: number, interpersonal: number, intrapersonal: number, assignmentTitle: string, bodilyKinesthetic: number, studentAssignmentId: string, dominantIntelligence: string }> } };

export type MyAssessmentResultDetailQueryVariables = Exact<{
  resultId: Scalars['String']['input'];
}>;


export type MyAssessmentResultDetailQuery = { __typename?: 'Query', myAssessmentResultDetail: { __typename?: 'AssessmentResultDetail', id: string, musical: number, createdAt: string, linguistic: number, logicalMath: number, scoreSummary: string | null, naturalistic: number, visualSpatial: number, interpersonal: number, intrapersonal: number, assignmentTitle: string, bodilyKinesthetic: number, studentAssignmentId: string, dominantIntelligence: string, careerMatches: Array<{ __typename?: 'CareerMatch', score: number, title: string, fitReason: string, description: string }> } };

export type CompareResultsQueryVariables = Exact<{
  input: CompareResultsInput;
}>;


export type CompareResultsQuery = { __typename?: 'Query', compareResults: Array<{ __typename?: 'ResultCompareItem', delta: number, current: number, previous: number, intelligence: string }> };

export type MyNotificationsQueryVariables = Exact<{
  input: ListMyNotificationsInput;
}>;


export type MyNotificationsQuery = { __typename?: 'Query', myNotifications: { __typename?: 'InAppNotificationList', take: number, skip: number, total: number, items: Array<{ __typename?: 'InAppNotification', id: string, body: string, type: string, title: string, isRead: boolean, readAt: string | null, actionUrl: string | null, createdAt: string }> } };

export type MarkNotificationReadMutationVariables = Exact<{
  input: MarkNotificationReadInput;
}>;


export type MarkNotificationReadMutation = { __typename?: 'Mutation', markNotificationRead: { __typename?: 'NotificationStudentResult', success: boolean, message: string } };

export type MyCounselingSessionsQueryVariables = Exact<{
  input: ListMyCounselingSessionsInput;
}>;


export type MyCounselingSessionsQuery = { __typename?: 'Query', myCounselingSessions: { __typename?: 'CounselingSessionList', take: number, skip: number, total: number, items: Array<{ __typename?: 'CounselingSession', id: string, note: string | null, title: string, status: string, createdAt: string, meetingUrl: string | null, canceledAt: string | null, scheduledAt: string | null, counselorId: string | null }> } };

export type RequestCounselingSessionMutationVariables = Exact<{
  input: RequestCounselingSessionInput;
}>;


export type RequestCounselingSessionMutation = { __typename?: 'Mutation', requestCounselingSession: { __typename?: 'CounselingSession', id: string, note: string | null, title: string, status: string, createdAt: string, meetingUrl: string | null, canceledAt: string | null, scheduledAt: string | null, counselorId: string | null } };

export type CancelCounselingSessionMutationVariables = Exact<{
  input: CancelCounselingSessionInput;
}>;


export type CancelCounselingSessionMutation = { __typename?: 'Mutation', cancelCounselingSession: { __typename?: 'NotificationStudentResult', success: boolean, message: string } };

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


export const CounselorDashboardSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CounselorDashboardSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counselorDashboardSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalStudents"}},{"kind":"Field","name":{"kind":"Name","value":"sessionsToday"}},{"kind":"Field","name":{"kind":"Name","value":"activeStudents"}},{"kind":"Field","name":{"kind":"Name","value":"pendingReviews"}},{"kind":"Field","name":{"kind":"Name","value":"upcomingSessions"}},{"kind":"Field","name":{"kind":"Name","value":"unreadNotifications"}}]}}]}}]} as unknown as DocumentNode<CounselorDashboardSummaryQuery, CounselorDashboardSummaryQueryVariables>;
export const MyStudentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyStudents"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyStudentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myStudents"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"hasNext"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"linkStatus"}},{"kind":"Field","name":{"kind":"Name","value":"assignedAt"}},{"kind":"Field","name":{"kind":"Name","value":"pendingReviews"}},{"kind":"Field","name":{"kind":"Name","value":"latestResultAt"}},{"kind":"Field","name":{"kind":"Name","value":"upcomingSessionAt"}}]}}]}}]}}]} as unknown as DocumentNode<MyStudentsQuery, MyStudentsQueryVariables>;
export const CounselorStudentDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CounselorStudentDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counselorStudentDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"totalResults"}},{"kind":"Field","name":{"kind":"Name","value":"totalSessions"}},{"kind":"Field","name":{"kind":"Name","value":"pendingReviews"}},{"kind":"Field","name":{"kind":"Name","value":"latestResultAt"}},{"kind":"Field","name":{"kind":"Name","value":"latestSessionAt"}}]}}]}}]} as unknown as DocumentNode<CounselorStudentDetailQuery, CounselorStudentDetailQueryVariables>;
export const StudentAssessmentQueueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentAssessmentQueue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentAssessmentQueueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentAssessmentQueue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"hasNext"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"reviewId"}},{"kind":"Field","name":{"kind":"Name","value":"resultId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"studentName"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentTitle"}}]}}]}}]}}]} as unknown as DocumentNode<StudentAssessmentQueueQuery, StudentAssessmentQueueQueryVariables>;
export const CounselorReviewDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CounselorReviewDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"reviewId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counselorReviewDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"reviewId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"reviewId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"}},{"kind":"Field","name":{"kind":"Name","value":"resultId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedAt"}},{"kind":"Field","name":{"kind":"Name","value":"dominantKey"}},{"kind":"Field","name":{"kind":"Name","value":"studentName"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentTitle"}}]}}]}}]} as unknown as DocumentNode<CounselorReviewDetailQuery, CounselorReviewDetailQueryVariables>;
export const ReviewStudentAssessmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReviewStudentAssessment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReviewStudentAssessmentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviewStudentAssessment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<ReviewStudentAssessmentMutation, ReviewStudentAssessmentMutationVariables>;
export const CounselorAssignmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CounselorAssignments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CounselorAssignmentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"counselorAssignments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"hasNext"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"reviewedCount"}},{"kind":"Field","name":{"kind":"Name","value":"pendingReviews"}},{"kind":"Field","name":{"kind":"Name","value":"totalAssignedStudents"}}]}}]}}]}}]} as unknown as DocumentNode<CounselorAssignmentsQuery, CounselorAssignmentsQueryVariables>;
export const StudentProgressTimelineDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentProgressTimeline"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"StudentProgressTimelineInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentProgressTimeline"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]} as unknown as DocumentNode<StudentProgressTimelineQuery, StudentProgressTimelineQueryVariables>;
export const ScheduleCounselorSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ScheduleCounselorSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ScheduleCounselorSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scheduleCounselorSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"meetingUrl"}},{"kind":"Field","name":{"kind":"Name","value":"studentName"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}}]}}]}}]} as unknown as DocumentNode<ScheduleCounselorSessionMutation, ScheduleCounselorSessionMutationVariables>;
export const MyCounselorSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyCounselorSessions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyCounselorSessionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCounselorSessions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"hasNext"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"meetingUrl"}},{"kind":"Field","name":{"kind":"Name","value":"studentName"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}}]}}]}}]}}]} as unknown as DocumentNode<MyCounselorSessionsQuery, MyCounselorSessionsQueryVariables>;
export const MyCounselorNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyCounselorNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyCounselorNotificationsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCounselorNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"hasNext"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"readAt"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"actionUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<MyCounselorNotificationsQuery, MyCounselorNotificationsQueryVariables>;
export const MarkCounselorNotificationReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkCounselorNotificationRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkCounselorNotificationReadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markCounselorNotificationRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<MarkCounselorNotificationReadMutation, MarkCounselorNotificationReadMutationVariables>;
export const ExportCounselorStudentReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExportCounselorStudentReport"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ExportCounselorStudentReportInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exportCounselorStudentReport"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"format"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"filePath"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<ExportCounselorStudentReportMutation, ExportCounselorStudentReportMutationVariables>;
export const CompareStudentResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CompareStudentResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompareStudentResultsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compareStudentResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"latestDate"}},{"kind":"Field","name":{"kind":"Name","value":"studentName"}},{"kind":"Field","name":{"kind":"Name","value":"latestScore"}},{"kind":"Field","name":{"kind":"Name","value":"dominantKey"}}]}}]}}]}}]} as unknown as DocumentNode<CompareStudentResultsQuery, CompareStudentResultsQueryVariables>;
export const HeaderCurrentUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HeaderCurrentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"forcePasswordChange"}}]}}]}}]} as unknown as DocumentNode<HeaderCurrentUserQuery, HeaderCurrentUserQueryVariables>;
export const HeaderLogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"HeaderLogout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<HeaderLogoutMutation, HeaderLogoutMutationVariables>;
export const ParentDashboardSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParentDashboardSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentDashboardSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalResults"}},{"kind":"Field","name":{"kind":"Name","value":"totalChildren"}},{"kind":"Field","name":{"kind":"Name","value":"totalSessions"}},{"kind":"Field","name":{"kind":"Name","value":"totalActivities"}}]}}]}}]} as unknown as DocumentNode<ParentDashboardSummaryQuery, ParentDashboardSummaryQueryVariables>;
export const MyChildrenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyChildren"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListMyChildrenInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myChildren"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"relation"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"currentEnrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"classroom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"grade"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<MyChildrenQuery, MyChildrenQueryVariables>;
export const ParentChildDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParentChildDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ParentChildDetailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentChildDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"relation"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimary"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}},{"kind":"Field","name":{"kind":"Name","value":"currentEnrollment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"classroom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"grade"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<ParentChildDetailQuery, ParentChildDetailQueryVariables>;
export const ParentChildGradesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParentChildGrades"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListParentChildGradesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentChildGrades"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"maxScore"}},{"kind":"Field","name":{"kind":"Name","value":"examTitle"}},{"kind":"Field","name":{"kind":"Name","value":"termLabel"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"recordedAt"}}]}}]}}]}}]} as unknown as DocumentNode<ParentChildGradesQuery, ParentChildGradesQueryVariables>;
export const ParentChildResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParentChildResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListParentChildResultsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentChildResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"musical"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"linguistic"}},{"kind":"Field","name":{"kind":"Name","value":"logicalMath"}},{"kind":"Field","name":{"kind":"Name","value":"naturalistic"}},{"kind":"Field","name":{"kind":"Name","value":"interpersonal"}},{"kind":"Field","name":{"kind":"Name","value":"intrapersonal"}},{"kind":"Field","name":{"kind":"Name","value":"visualSpatial"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bodilyKinesthetic"}},{"kind":"Field","name":{"kind":"Name","value":"studentAssignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"dominantIntelligence"}}]}}]}}]}}]} as unknown as DocumentNode<ParentChildResultsQuery, ParentChildResultsQueryVariables>;
export const ParentResultDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParentResultDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resultId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentResultDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"resultId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resultId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"musical"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"linguistic"}},{"kind":"Field","name":{"kind":"Name","value":"logicalMath"}},{"kind":"Field","name":{"kind":"Name","value":"naturalistic"}},{"kind":"Field","name":{"kind":"Name","value":"interpersonal"}},{"kind":"Field","name":{"kind":"Name","value":"intrapersonal"}},{"kind":"Field","name":{"kind":"Name","value":"visualSpatial"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bodilyKinesthetic"}},{"kind":"Field","name":{"kind":"Name","value":"studentAssignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"dominantIntelligence"}},{"kind":"Field","name":{"kind":"Name","value":"careerMatches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"fitReason"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ParentResultDetailQuery, ParentResultDetailQueryVariables>;
export const CompareParentResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CompareParentResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompareParentResultsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compareParentResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delta"}},{"kind":"Field","name":{"kind":"Name","value":"current"}},{"kind":"Field","name":{"kind":"Name","value":"previous"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}}]}}]}}]} as unknown as DocumentNode<CompareParentResultsQuery, CompareParentResultsQueryVariables>;
export const ParentResourcesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParentResources"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListParentResourcesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentResources"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"summary"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"isPublished"}},{"kind":"Field","name":{"kind":"Name","value":"coverImageUrl"}}]}}]}}]}}]} as unknown as DocumentNode<ParentResourcesQuery, ParentResourcesQueryVariables>;
export const ParentChildActivitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParentChildActivities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListParentChildActivitiesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentChildActivities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metadata"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<ParentChildActivitiesQuery, ParentChildActivitiesQueryVariables>;
export const ParentCounselingSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ParentCounselingSessions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListParentCounselingSessionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentCounselingSessions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"canceledAt"}},{"kind":"Field","name":{"kind":"Name","value":"meetingUrl"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"counselorId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"student"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"mobile"}},{"kind":"Field","name":{"kind":"Name","value":"avatarUrl"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ParentCounselingSessionsQuery, ParentCounselingSessionsQueryVariables>;
export const ParentRequestCounselingSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ParentRequestCounselingSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ParentRequestSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentRequestCounselingSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}}]}}]}}]} as unknown as DocumentNode<ParentRequestCounselingSessionMutation, ParentRequestCounselingSessionMutationVariables>;
export const ParentCancelCounselingSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ParentCancelCounselingSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelParentSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"parentCancelCounselingSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"sessionId"}}]}}]}}]} as unknown as DocumentNode<ParentCancelCounselingSessionMutation, ParentCancelCounselingSessionMutationVariables>;
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
export const EnrollmentsByClassroomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"EnrollmentsByClassroom"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListEnrollmentsByClassroomInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollmentsByClassroom"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"endedAt"}},{"kind":"Field","name":{"kind":"Name","value":"schoolId"}},{"kind":"Field","name":{"kind":"Name","value":"studentId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"classroomId"}}]}}]}}]}}]} as unknown as DocumentNode<EnrollmentsByClassroomQuery, EnrollmentsByClassroomQueryVariables>;
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
export const StudentDashboardSummaryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"StudentDashboardSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"studentDashboardSummary"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"pendingAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"latestOverallScore"}},{"kind":"Field","name":{"kind":"Name","value":"unreadNotifications"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatedAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"dominantIntelligence"}},{"kind":"Field","name":{"kind":"Name","value":"inProgressAssignments"}},{"kind":"Field","name":{"kind":"Name","value":"pendingCounselingSessions"}},{"kind":"Field","name":{"kind":"Name","value":"progressTimeline"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"overall"}}]}}]}}]}}]} as unknown as DocumentNode<StudentDashboardSummaryQuery, StudentDashboardSummaryQueryVariables>;
export const MyAssignmentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyAssignments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListMyAssignmentsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAssignments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"targetMode"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"submittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"evaluatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"completionRate"}}]}}]}}]}}]} as unknown as DocumentNode<MyAssignmentsQuery, MyAssignmentsQueryVariables>;
export const MyAssignmentDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyAssignmentDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"studentAssignmentId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAssignmentDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"studentAssignmentId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"studentAssignmentId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"dueAt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"questions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"answerValue"}},{"kind":"Field","name":{"kind":"Name","value":"questionNumber"}}]}}]}}]}}]} as unknown as DocumentNode<MyAssignmentDetailQuery, MyAssignmentDetailQueryVariables>;
export const SubmitAssignmentAnswersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubmitAssignmentAnswers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SubmitAssignmentAnswersInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"submitAssignmentAnswers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<SubmitAssignmentAnswersMutation, SubmitAssignmentAnswersMutationVariables>;
export const MyAssessmentResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyAssessmentResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListMyAssessmentResultsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAssessmentResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"musical"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"linguistic"}},{"kind":"Field","name":{"kind":"Name","value":"logicalMath"}},{"kind":"Field","name":{"kind":"Name","value":"naturalistic"}},{"kind":"Field","name":{"kind":"Name","value":"visualSpatial"}},{"kind":"Field","name":{"kind":"Name","value":"interpersonal"}},{"kind":"Field","name":{"kind":"Name","value":"intrapersonal"}},{"kind":"Field","name":{"kind":"Name","value":"assignmentTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bodilyKinesthetic"}},{"kind":"Field","name":{"kind":"Name","value":"studentAssignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"dominantIntelligence"}}]}}]}}]}}]} as unknown as DocumentNode<MyAssessmentResultsQuery, MyAssessmentResultsQueryVariables>;
export const MyAssessmentResultDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyAssessmentResultDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"resultId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myAssessmentResultDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"resultId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"resultId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"musical"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"linguistic"}},{"kind":"Field","name":{"kind":"Name","value":"logicalMath"}},{"kind":"Field","name":{"kind":"Name","value":"scoreSummary"}},{"kind":"Field","name":{"kind":"Name","value":"naturalistic"}},{"kind":"Field","name":{"kind":"Name","value":"visualSpatial"}},{"kind":"Field","name":{"kind":"Name","value":"interpersonal"}},{"kind":"Field","name":{"kind":"Name","value":"intrapersonal"}},{"kind":"Field","name":{"kind":"Name","value":"careerMatches"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"fitReason"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignmentTitle"}},{"kind":"Field","name":{"kind":"Name","value":"bodilyKinesthetic"}},{"kind":"Field","name":{"kind":"Name","value":"studentAssignmentId"}},{"kind":"Field","name":{"kind":"Name","value":"dominantIntelligence"}}]}}]}}]} as unknown as DocumentNode<MyAssessmentResultDetailQuery, MyAssessmentResultDetailQueryVariables>;
export const CompareResultsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CompareResults"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CompareResultsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"compareResults"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"delta"}},{"kind":"Field","name":{"kind":"Name","value":"current"}},{"kind":"Field","name":{"kind":"Name","value":"previous"}},{"kind":"Field","name":{"kind":"Name","value":"intelligence"}}]}}]}}]} as unknown as DocumentNode<CompareResultsQuery, CompareResultsQueryVariables>;
export const MyNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyNotifications"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListMyNotificationsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myNotifications"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"body"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isRead"}},{"kind":"Field","name":{"kind":"Name","value":"readAt"}},{"kind":"Field","name":{"kind":"Name","value":"actionUrl"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<MyNotificationsQuery, MyNotificationsQueryVariables>;
export const MarkNotificationReadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MarkNotificationRead"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MarkNotificationReadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"markNotificationRead"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<MarkNotificationReadMutation, MarkNotificationReadMutationVariables>;
export const MyCounselingSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyCounselingSessions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ListMyCounselingSessionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myCounselingSessions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"take"}},{"kind":"Field","name":{"kind":"Name","value":"skip"}},{"kind":"Field","name":{"kind":"Name","value":"total"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"meetingUrl"}},{"kind":"Field","name":{"kind":"Name","value":"canceledAt"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"counselorId"}}]}}]}}]}}]} as unknown as DocumentNode<MyCounselingSessionsQuery, MyCounselingSessionsQueryVariables>;
export const RequestCounselingSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestCounselingSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RequestCounselingSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestCounselingSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"note"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"meetingUrl"}},{"kind":"Field","name":{"kind":"Name","value":"canceledAt"}},{"kind":"Field","name":{"kind":"Name","value":"scheduledAt"}},{"kind":"Field","name":{"kind":"Name","value":"counselorId"}}]}}]}}]} as unknown as DocumentNode<RequestCounselingSessionMutation, RequestCounselingSessionMutationVariables>;
export const CancelCounselingSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelCounselingSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CancelCounselingSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelCounselingSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<CancelCounselingSessionMutation, CancelCounselingSessionMutationVariables>;
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