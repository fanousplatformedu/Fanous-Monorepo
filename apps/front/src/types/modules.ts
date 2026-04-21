import { ComponentType, ElementType, ReactNode } from "react";
import { TParentProfileFormValues } from "@/lib/validation/parent";
import { TClassroomFiltersValues } from "@/lib/validation/school-admin";
import { TCreateAssignmentForm } from "@/lib/validation/school-admin";
import { TEnrollmentFilterForm } from "@/lib/validation/school-admin";
import { TGradeFormValues } from "@/lib/validation/school-admin";
import { adminLoginSchema } from "@/lib/validation/auth";
import { TEnrollmentForm } from "@/lib/validation/school-admin";
import { TClassroomForm } from "@/lib/validation/school-admin";
import { UseFormReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { z } from "zod";

import type * as TAPI from "@lib/graphql/generated";

// ============ Role Gateway ==============
export type TRoleItem = {
  href: string;
  gradient: string;
  iconColor: string;
  cardGradient: string;
  secondaryHref?: string;
  secondaryActionKey?: string;
  icon: ComponentType<{ className?: string }>;
  key: "superAdmin" | "schoolAdmin" | "schoolUser";
};

// ============ Auth ===============
export type TAuthPageShellProps = {
  className?: string;
  children: ReactNode;
  contentClassName?: string;
};

export type TAuthGlassCardProps = {
  children: ReactNode;
  className?: string;
  glowClassName?: string;
};

export type TAuthPageBadgeProps = {
  text: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber";
};

export type TAuthFormActionsProps = {
  backText: string;
  onBack: () => void;
  submitText: string;
  loadingText: string;
  isLoading?: boolean;
};

export type TOtpFlipCardProps = {
  back: ReactNode;
  flipped: boolean;
  front: ReactNode;
};

export type TFormValues = z.infer<typeof adminLoginSchema>;

export type TAdminLoginFormBaseProps<TMutationResult> = {
  title: string;
  footer: string;
  badgeText: string;
  redirectTo: string;
  description: string;
  badgeIcon: LucideIcon;
  badgeTone?: "blue" | "green" | "amber";
  getSuccessMessage: (result: TMutationResult) => string;
  submit: (values: TFormValues) => Promise<TMutationResult>;
};

export type TPieDatum = {
  name: string;
  value: number;
};

export type TPieSummaryChartProps = {
  data: TPieDatum[];
};

export type TDonutDatum = {
  name: string;
  value: number;
};

export type TDonutSummaryChartProps = {
  data: TDonutDatum[];
};

export type TBarDatum = {
  name: string;
  value: number;
};

export type TBarSummaryChartProps = {
  data: TBarDatum[];
};

export type TDashboardSectionProps = {
  title?: string;
  className?: string;
  children: ReactNode;
  description?: string;
};

// =========== Super Admin Dashboard =============
export type TSchoolFilterValues = {
  query: string;
  status: "" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
};

export type TSchoolsFiltersProps = {
  value: TSchoolFilterValues;
  onReset: () => void;
  onApply: (values: TSchoolFilterValues) => void;
};

export type TSchoolAdminFilterValues = {
  schoolId: string;
  status: "" | "ACTIVE" | "DISABLED" | "DELETED";
};

export type TSchoolAdminsFiltersProps = {
  onReset: () => void;
  value: TSchoolAdminFilterValues;
  onApply: (values: TSchoolAdminFilterValues) => void;
};

export type TAuditLogFilterValues = {
  action: string;
  actorId: string;
  schoolId: string;
  entityType: string;
};

export type TAuditLogsFiltersProps = {
  value: TAuditLogFilterValues;
  onReset: () => void;
  onApply: (values: TAuditLogFilterValues) => void;
};

export type TCreateAuditLogDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// ============ School Admin Dashboard =============
export type TPasswordFormValues = {
  newPassword: string;
  currentPassword: string;
};

export type TSchoolAdminAuditLogFilterValues = {
  action: string;
  actorId: string;
  entityType: string;
};

export type TSchoolAdminAuditLogsFiltersProps = {
  onReset: () => void;
  value: TSchoolAdminAuditLogFilterValues;
  onApply: (values: TSchoolAdminAuditLogFilterValues) => void;
};

export type TGradesResponse = NonNullable<TAPI.GradesQuery["grades"]>;
export type TGradeItem = TGradesResponse["items"][number];

export type TClassroomsResponse = NonNullable<
  TAPI.ClassroomsQuery["classrooms"]
>;
export type TClassroomItem = TClassroomsResponse["items"][number];

export type TMembersResponse = NonNullable<
  TAPI.SchoolMembersQuery["schoolMembers"]
>;
export type TMemberItem = TMembersResponse["items"][number];

export type TEnrollmentsResponse = NonNullable<
  TAPI.EnrollmentsByClassroomQuery["enrollmentsByClassroom"]
>;
export type TEnrollmentItem = TEnrollmentsResponse["items"][number];

export type TGradeMeta = {
  name: string;
  code: string | null | undefined;
};

export type TClassroomMeta = {
  name: string;
  gradeId: string;
  code: string | null | undefined;
  year: number | null | undefined;
};

export type TStudentMeta = {
  status: string;
  email: string | null | undefined;
  mobile: string | null | undefined;
  fullName: string | null | undefined;
};

export type TCloseTarget = {
  id: string;
  studentLabel: string;
  classroomLabel: string;
};

export type TSelectOption = {
  value: string;
  label: string;
};

export type TEnrollmentFormProps = {
  disabled: boolean;
  isSubmitting: boolean;
  duplicateMessage: string;
  studentOptions: TSelectOption[];
  classroomOptions: TSelectOption[];
  form: UseFormReturn<TEnrollmentForm>;
  selectedStudentAlreadyActive: boolean;
  onSubmit: (values: TEnrollmentForm) => Promise<void>;
};

export type TEnrollmentStatsProps = {
  studentsCount: number;
  classroomsCount: number;
  selectedClassroomName: string;
};

export type TEnrollmentTableProps = {
  page: number;
  isClosing: boolean;
  isFetching: boolean;
  activeCount: number;
  closedCount: number;
  enrollmentsTotal: number;
  selectedGradeName: string;
  selectedYearLabel: string;
  selectedClassroomName: string;
  enrollments: TEnrollmentItem[];
  gradeMap: Map<string, TGradeMeta>;
  onPageChange: (page: number) => void;
  studentMap: Map<string, TStudentMeta>;
  classroomMap: Map<string, TClassroomMeta>;
  onCloseRequest: (target: TCloseTarget) => void;
};

export type TEnrollmentCloseDialogProps = {
  open: boolean;
  isLoading: boolean;
  target: TCloseTarget | null;
  onConfirm: () => Promise<void>;
  onOpenChange: (open: boolean) => void;
};

export type TOption = {
  value: string;
  label: string;
};

export type TEnrollmentFiltersProps = {
  gradeFilter: string;
  onReset: () => void;
  studentSearch: string;
  isSearching?: boolean;
  gradeOptions: TOption[];
  onApply: (values: TEnrollmentFilterForm) => void;
};

export type TGradeOption = {
  value: string;
  label: string;
};

export type TEditClassroomTarget = {
  id: string;
  name: string;
  code: string;
  year: string;
  gradeId: string;
};

export type TFilterValues = {
  query: string;
  gradeId: string;
  scope: "ACTIVE_ONLY" | "ALL";
};

export type TClassroomCreateFormProps = {
  isSubmitting: boolean;
  gradeOptions: TOption[];
  onSubmit: (values: TClassroomForm) => Promise<void>;
};

export type TClassroomFiltersProps = {
  onReset: () => void;
  gradeOptions: TOption[];
  initialValues: TClassroomFiltersValues;
  onApply: (values: TClassroomFiltersValues) => void;
};

export type TClassroomRow = {
  id: string;
  name: string;
  gradeId: string;
  schoolId: string;
  code: string | null;
  year: number | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
};

type TGradeMap = Map<
  string,
  {
    name: string;
    code: string | null;
  }
>;

export type TClassroomTableProps = {
  page: number;
  total: number;
  pageSize: number;
  activeCount: number;
  gradeMap: TGradeMap;
  isUpdating: boolean;
  isFetching: boolean;
  isArchiving: boolean;
  isRestoring: boolean;
  archivedCount: number;
  classrooms: TClassroomRow[];
  onPageChange: (page: number) => void;
  onEdit: (classroom: TClassroomRow) => void;
  onToggleArchive: (
    classroomId: string,
    deletedAt: string | Date | null,
  ) => Promise<void>;
};

type TClassroomEditInitialValues = {
  id: string;
  name: string;
  code: string;
  year: string;
  gradeId: string;
} | null;

export type TClassroomEditDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  gradeOptions: TOption[];
  initialValues: TClassroomEditInitialValues;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    id: string;
    name: string;
    code?: string;
    year?: string;
    gradeId: string;
  }) => Promise<void>;
};

export type TAccessRequestRole = "STUDENT" | "PARENT" | "COUNSELOR";

export type TAccessRequestFilterValues = {
  query: string;
  status: "ALL" | TAccessRequestStatus;
  requestedRole: "ALL" | TAccessRequestRole;
};

export type TAccessRequestRow = {
  id: string;
  createdAt: string;
  email: string | null;
  mobile: string | null;
  fullName: string | null;
  reviewedAt: string | null;
  rejectReason: string | null;
  reviewedById: string | null;
  status: TAccessRequestStatus;
  approvedUserId: string | null;
  requestedRole: TAccessRequestRole;
};

export type TAccessRequestFiltersProps = {
  onReset: () => void;
  value: TAccessRequestFilterValues;
  onApply: (values: TAccessRequestFilterValues) => void;
};

export type TDialogMode = "approve" | "reject" | "publish" | "assign" | null;

export type TReviewDialogForm = {
  rejectReason: string;
  finalRole: TAccessRequestRole;
};

export type TAccessRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";

export type TAccessRequestFilterStatus = "ALL" | TAccessRequestStatus;

export type TAccessRequestFilterRole = "ALL" | TAccessRequestRole;

export type TAccessRequestDialogMode = "approve" | "reject";

export type TAccessRequestReviewDialogProps = {
  open: boolean;
  isLoading: boolean;
  request: TAccessRequestRow | null;
  mode: TAccessRequestDialogMode | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (payload: {
    finalRole?: TAccessRequestRole;
    rejectReason?: string;
  }) => void | Promise<void>;
};

export type TDialogFormValues = {
  rejectReason: string;
  finalRole: TAccessRequestRole;
};

export type TGradeDialogState = {
  id: string;
  name: string;
  code: string;
} | null;

export type TGradeFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: TGradeFormValues) => Promise<void>;
};

export type TGradeFiltersProps = {
  includeArchived: boolean;
  onIncludeArchivedChange: (value: boolean) => void;
};

export type TGradeRow = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  code: string | null;
  deletedAt: string | null;
};

export type TGradeTableProps = {
  page: number;
  total: number;
  pageSize: number;
  items: TGradeRow[];
  isFetching: boolean;
  isUpdating: boolean;
  isArchiving: boolean;
  isRestoring: boolean;
  onEdit: (grade: TGradeRow) => void;
  onPageChange: (page: number) => void;
  onToggleArchive: (id: string, deletedAt: string | null) => Promise<void>;
};

export type TGradeEditDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  initialValues: {
    id: string;
    name: string;
    code: string;
  } | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    id: string;
    name: string;
    code: string;
  }) => Promise<void>;
};

export type TSchoolMemberRole =
  | "PARENT"
  | "STUDENT"
  | "COUNSELOR"
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN";

export type TSchoolMemberStatus = "ACTIVE" | "DISABLED" | "DELETED";

export type TSchoolMemberRoleFilter =
  | "ALL"
  | "PARENT"
  | "STUDENT"
  | "COUNSELOR"
  | "SCHOOL_ADMIN";

export type TSchoolMemberStatusFilter = "ALL" | "ACTIVE" | "DISABLED";

export type TSchoolMemberFilterValues = {
  query: string;
  role: TSchoolMemberRoleFilter;
  status: TSchoolMemberStatusFilter;
};

export type TSchoolMemberRow = {
  id: string;
  createdAt: string;
  email: string | null;
  mobile: string | null;
  role: TSchoolMemberRole;
  fullName: string | null;
  status: TSchoolMemberStatus;
};

export type TMemberDisableDialogProps = {
  open: boolean;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  member: TSchoolMemberRow | null;
  onOpenChange: (open: boolean) => void;
};

export type TMembersFiltersProps = {
  onReset: () => void;
  value: TSchoolMemberFilterValues;
  onApply: (values: TSchoolMemberFilterValues) => void;
};

type TAssessmentResultList = NonNullable<
  TAPI.AssessmentResultsQuery["assessmentResults"]
>;

export type TAssignmentResultsTableProps = {
  page: number;
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  items: TAssessmentResultList["items"];
  onPageChange: (page: number) => void;
};

export type TSelectedAssignment = {
  id: string;
  title: string;
  status: string;
} | null;

export type TAssignmentActionDialogProps = {
  open: boolean;
  mode: TDialogMode;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  assignment: TSelectedAssignment;
  onOpenChange: (open: boolean) => void;
};

export type TSummary =
  | {
      avgMusical: number;
      totalStudents: number;
      avgLinguistic: number;
      completionRate: number;
      avgLogicalMath: number;
      avgNaturalistic: number;
      avgVisualSpatial: number;
      totalAssignments: number;
      avgInterpersonal: number;
      avgIntrapersonal: number;
      publishedAssignments: number;
      avgBodilyKinesthetic: number;
      pendingStudentAssignments: number;
      submittedStudentAssignments: number;
      evaluatedStudentAssignments: number;
    }
  | null
  | undefined;

export type TAssignmentSummaryCardsProps = {
  summary: TSummary;
  isFetching: boolean;
  questionCount: number;
};

export type TAssignmentCreateFormProps = {
  isLoading: boolean;
  form: UseFormReturn<TCreateAssignmentForm>;
  onSubmit: (values: TCreateAssignmentForm) => Promise<void>;
};

export type TTrendPoint = {
  name: string;
  audits: number;
  requests: number;
  assignments: number;
};

export type TDonutItem = {
  name: string;
  value: number;
};

// =============== Student Dashboard =================
export type TPerformanceSummary = {
  latestOverallScore: number;
  submittedAssignments: number;
  dominantIntelligenceLabel: string;
  pendingCounselingSessions: number;
};

export type TOverviewStats = {
  roleLabel: string;
  statusLabel: string;
  totalAssignments: number;
  pendingAssignments: number;
  unreadNotifications: number;
  evaluatedAssignments: number;
  inProgressAssignments: number;
};

export type TSimpleChartItem = {
  name: string;
  value: number;
};

export type TProgressPoint = {
  label: string;
  overall: number;
};

type TAssignmentDetail = TAPI.MyAssignmentDetailQuery["myAssignmentDetail"];

type TAnswerDraft = {
  value: number;
  questionNumber: number;
};

export type TAssignmentDialog = {
  open: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  assignment: TAssignmentDetail | null;
  onOpenChange: (open: boolean) => void;
  onSubmitAnswers: (values: TAnswerDraft[]) => Promise<void>;
};

export type TItem = TAPI.MyAssignmentsQuery["myAssignments"]["items"][number];

export type TStudentAssignmentTable = {
  page: number;
  total: number;
  items: TItem[];
  isFetching: boolean;
  onPageChange: (page: number) => void;
  onViewDetail: (studentAssignmentId: string) => void;
};

type TStudentAssignmentStatusFilter =
  | "ALL"
  | "PENDING"
  | "SUBMITTED"
  | "EVALUATED"
  | "IN_PROGRESS"
  | "NOT_STARTED";

export type TStudentAssignmentFilterValues = {
  query: string;
  status: TStudentAssignmentStatusFilter;
};

export type TStudentAssignmentFilter = {
  onReset: () => void;
  value: TStudentAssignmentFilterValues;
  onApply: (values: TStudentAssignmentFilterValues) => void;
};

export type TAnswerFormValues = {
  answers: Array<{
    value?: number;
    questionNumber: number;
  }>;
};

export type TResultDominantFilter =
  | "ALL"
  | "MUSICAL"
  | "LINGUISTIC"
  | "NATURALISTIC"
  | "INTERPERSONAL"
  | "INTRAPERSONAL"
  | "VISUAL_SPATIAL"
  | "BODILY_KINESTHETIC"
  | "LOGICAL_MATHEMATICAL";

export type TResultFilterValues = {
  dominantIntelligence: TResultDominantFilter;
};

export type TResultFiltersProps = {
  onReset: () => void;
  value: TResultFilterValues;
  onApply: (values: TResultFilterValues) => void;
};

export type TResultRow =
  TAPI.MyAssessmentResultsQuery["myAssessmentResults"]["items"][number];

export type TResultTableProps = {
  page: number;
  total: number;
  items: TResultRow[];
  isFetching: boolean;
  compareIds: string[];
  onPageChange: (page: number) => void;
  onViewDetail: (resultId: string) => void;
  onOpenCompare: (resultId?: string) => void;
  onToggleCompare: (resultId: string) => void;
};

type TResultDetail =
  TAPI.MyAssessmentResultDetailQuery["myAssessmentResultDetail"];

export type TResultDetailDialogProps = {
  open: boolean;
  isLoading: boolean;
  onCompare: () => void;
  result: TResultDetail | null;
  onOpenChange: (open: boolean) => void;
};

export type TResultCompareDialogProps = {
  open: boolean;
  isLoading: boolean;
  compareIds: string[];
  compareRows: TResultRow[];
  onClearSelection: () => void;
  onOpenChange: (open: boolean) => void;
  data: TAPI.CompareResultsQuery["compareResults"];
};

export type TStudentNotificationVisibility = "ALL" | "UNREAD";

export type TStudentNotificationFilterValues = {
  unreadOnly: TStudentNotificationVisibility;
};

export type TStudentNotificationFilter = {
  onReset: () => void;
  value: TStudentNotificationFilterValues;
  onApply: (values: TStudentNotificationFilterValues) => void;
};

export type TStudentNotificationItem =
  TAPI.MyNotificationsQuery["myNotifications"]["items"][number];

export type TStudentNotificationTable = {
  page: number;
  total: number;
  isFetching: boolean;
  isMarkingRead: boolean;
  items: TStudentNotificationItem[];
  onPageChange: (page: number) => void;
  onViewDetail: (notificationId: string) => void;
  onMarkAsRead: (notificationId: string) => void;
};

export type TStudentNotificationDetailDialog = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: TStudentNotificationItem | null;
};

export type TStudentCounselingStatusFilter =
  | "ALL"
  | "REQUESTED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED";

export type TStudentCounselingFilterValues = {
  query: string;
  status: TStudentCounselingStatusFilter;
};

export type TStudentCounselingFilter = {
  onReset: () => void;
  value: TStudentCounselingFilterValues;
  onApply: (values: TStudentCounselingFilterValues) => void;
};

export type TStudentCounselingItem =
  TAPI.MyCounselingSessionsQuery["myCounselingSessions"]["items"][number];

export type TStudentCounselingTable = {
  page: number;
  total: number;
  isFetching: boolean;
  items: TStudentCounselingItem[];
  onPageChange: (page: number) => void;
  onCancelSession: (item: TStudentCounselingItem) => void;
};

export type TCancelCounselingDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  target: TStudentCounselingItem | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason?: string) => Promise<void>;
};

export type TCancelCounselingFormValues = {
  reason: string;
};

export type TRequestCounselingFormValues = {
  note: string;
  title: string;
  meetingUrl: string;
  scheduledAt: string;
  counselorId: string;
};

export type TRequestCounselingDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: {
    title: string;
    note?: string;
    meetingUrl?: string;
    scheduledAt?: string;
    counselorId?: string;
  }) => Promise<void>;
};

export type TStudentProfileFormValues = {
  email: string;
  mobile: string;
  fullName: string;
  avatarUrl: string;
};

export type TStudentLogoutCardProps = {
  isSubmitting: boolean;
  onLogout: () => Promise<void>;
};

export type TStudentAccountCardProps = {
  me: {
    id: string;
    role: string;
    status?: string | null;
    schoolId?: string | null;
    createdAt?: string | null;
  };
};

export type TStudentProfileFormProps = {
  isSubmitting: boolean;
  me: {
    email?: string | null;
    mobile?: string | null;
    fullName?: string | null;
    avatarUrl?: string | null;
  };
  onSubmit: (values: TStudentProfileFormValues) => Promise<void>;
};

export type TStudentProfileSummaryCardProps = {
  isFetching?: boolean;
  me: {
    id: string;
    role: string;
    email?: string | null;
    status?: string | null;
    mobile?: string | null;
    schoolId?: string | null;
    fullName?: string | null;
    avatarUrl?: string | null;
    createdAt?: string | null;
  };
};

export type TDistributionItem = {
  label: string;
  value: number;
};

export type TResultDistribution = {
  title: string;
  emptyText: string;
  description: string;
  items: TDistributionItem[];
};

export type TStudentResultDetailDialogProps = TResultDetailDialogProps;

export type TDetailTab = "overview" | "scores" | "matches";

export type TChartRow = {
  key: string;
  value: number;
  fullLabel: string;
  shortLabel: string;
};

export type TSummaryPoint = {
  label: string;
  value: string;
  icon: ElementType;
};

export type TDetailTabItem = {
  label: string;
  key: TDetailTab;
  icon: ElementType;
};

export type TTopScoreItem = TChartRow;

export type TStudentResultDetail = {
  value: TDetailTab;
  items: TDetailTabItem[];
  onChange: (tab: TDetailTab) => void;
};

export type TStudentResultTab = {
  topScores: TChartRow[];
  chartData: TChartRow[];
  narrativeSummary: string;
};

export type TStudentResultMatches = {
  dominantText: string;
  matches?: Array<{
    title: string;
    score: number;
    description?: string | null;
    fitReason?: string | null;
  }> | null;
};

export type TStudentResultCard = {
  title: string;
  score: number;
  fitReason?: string | null;
  description?: string | null;
};

// =============== Pranet Dashboard =================
export type TProfileLogout = {
  isSubmitting?: boolean;
  onLogout: () => void | Promise<void>;
};

type TMe = TAPI.SchoolUserMeQuery["me"];

export type TProfileForm = {
  me: TMe;
  isSubmitting?: boolean;
  onSubmit: (values: TParentProfileFormValues) => void | Promise<void>;
};

type TSessionsList = NonNullable<
  TAPI.ParentCounselingSessionsQuery["parentCounselingSessions"]
>;

type TSessionItem = TSessionsList["items"][number];

export type TCounselingSessionTable = {
  page: number;
  total: number;
  isFetching?: boolean;
  items: TSessionItem[];
  onPageChange: (page: number) => void;
  onCancelSession: (sessionId: string) => void;
};

export type TCancelSessionDialog = {
  open: boolean;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

export type TCounselingRequest = {
  open: boolean;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  childOptions: Array<{ value: string; label: string }>;
  onSubmit: (values: TAPI.ParentRequestSessionInput) => void | Promise<void>;
};

export type TParentCounselingFilterValues = {
  query: string;
  childId: string | "ALL";
  status: "ALL" | TAPI.CounselingSessionStatus;
};

export type TParentCounselingFilter = {
  onReset: () => void;
  value: TParentCounselingFilterValues;
  childOptions: Array<{ value: string; label: string }>;
  onApply: (values: TParentCounselingFilterValues) => void;
};

export type TParentCounselingSummary = {
  requestedCount: number;
  confirmedCount: number;
  completedCount: number;
};

type TChildDetail = TAPI.ParentChildDetailQuery["parentChildDetail"];

export type TChildDetailDialog = {
  open: boolean;
  isLoading?: boolean;
  child: TChildDetail | null;
  onOpenChange: (open: boolean) => void;
};

type TChildrenList = NonNullable<TAPI.MyChildrenQuery["myChildren"]>;
type TChildItem = TChildrenList["items"][number];

export type TChildTable = {
  page: number;
  total: number;
  items: TChildItem[];
  isFetching?: boolean;
  onPageChange: (page: number) => void;
  onOpenDetail: (childId: string) => void;
};

export type TParentChildrenFilterValues = {
  query: string;
  childId: string | "ALL";
};

export type TChildrenFilter = {
  onReset: () => void;
  value: TParentChildrenFilterValues;
  childOptions: Array<{ value: string; label: string }>;
  onApply: (values: TParentChildrenFilterValues) => void;
};

export type TChildrenSummary = {
  totalChildren: number;
  withEmailCount: number;
  withMobileCount: number;
};

type TParentResultList = NonNullable<
  TAPI.ParentChildResultsQuery["parentChildResults"]
>;

type TResultItem = TParentResultList["items"][number];

type TCompareData = TAPI.CompareParentResultsQuery["compareParentResults"];

export type TResultCompare = {
  open: boolean;
  data: TCompareData;
  isLoading?: boolean;
  compareIds: string[];
  compareRows: TResultItem[];
  onClearSelection: () => void;
  onOpenChange: (open: boolean) => void;
};

type TDetail = TAPI.ParentResultDetailQuery["parentResultDetail"];

export type TResultDetailDialog = {
  open: boolean;
  isLoading?: boolean;
  onCompare: () => void;
  result: TDetail | null;
  onOpenChange: (open: boolean) => void;
};

export type TParentResultItem = TParentResultList["items"][number];

export type TParentResultTable = {
  page: number;
  total: number;
  compareIds: string[];
  isFetching?: boolean;
  items: TResultItem[];
  onPageChange: (page: number) => void;
  onViewDetail: (resultId: string) => void;
  onOpenCompare: (resultId?: string) => void;
  onToggleCompare: (resultId: string) => void;
};

export type TParentDistributionChart = {
  data: Array<{
    key: string;
    label: string;
    value: number;
  }>;
};

export type TParentResultsFilterValues = {
  childId: string | "ALL";
};

export type TParentResultFilters = {
  onReset: () => void;
  value: TParentResultsFilterValues;
  childOptions: Array<{ value: string; label: string }>;
  onApply: (values: TParentResultsFilterValues) => void;
};

export type TResultSummaryCards = {
  total: number;
  averageScore: number;
  compareCount: number;
};

type TResultList = NonNullable<
  TAPI.ParentChildResultsQuery["parentChildResults"]
>;
export type TDashboardParentResultItem = TResultList["items"][number];

type TActivitiesList = NonNullable<
  TAPI.ParentChildActivitiesQuery["parentChildActivities"]
>;

export type TActivityItem = TActivitiesList["items"][number];

export type TActivitiesTable = {
  page: number;
  total: number;
  isFetching?: boolean;
  items: TActivityItem[];
  onPageChange: (page: number) => void;
};

export type TParentActivitiesFilterValues = {
  type: string | "ALL";
  childId: string | "ALL";
};

export type TActivitiesFilters = {
  onReset: () => void;
  value: TParentActivitiesFilterValues;
  childOptions: Array<{ value: string; label: string }>;
  onApply: (values: TParentActivitiesFilterValues) => void;
};

export type TActivitiesSummaryCard = {
  sessionsCount: number;
  totalActivities: number;
  completedAssessments: number;
  submittedAssignments: number;
};
