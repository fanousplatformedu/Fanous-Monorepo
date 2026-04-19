import { IntelligenceKey, StudentAssignmentStatus } from "@prisma/client";
import { CounselingSessionStatus, Role } from "@prisma/client";
import { AssignmentDraftAnswerInput } from "@student/dtos/assignments-draft.input";
import { InAppNotificationType } from "@prisma/client";

export type TStudentActor = {
  id: string;
  role: Role;
  schoolId: string | null;
};

export type TListMyAssignmentsArgs = {
  take: number;
  skip: number;
  actor: TStudentActor;
  query?: string | null;
  status?: StudentAssignmentStatus | null;
};

export type TSubmitAssignmentAnswersArgs = {
  actor: TStudentActor;
  studentAssignmentId: string;
  answers: AssignmentDraftAnswerInput[];
};

export type TListMyAssessmentResultsArgs = {
  take: number;
  skip: number;
  actor: TStudentActor;
  query?: string | null;
  dominantIntelligence?: IntelligenceKey | null;
};

export type TListMyNotificationsArgs = {
  take: number;
  skip: number;
  actor: TStudentActor;
  query?: string | null;
  unreadOnly?: boolean | null;
};

export type TMarkNotificationReadArgs = {
  actor: TStudentActor;
  notificationId: string;
};

export type TRequestCounselingSessionArgs = {
  title: string;
  note?: string;
  meetingUrl?: string;
  scheduledAt?: string;
  counselorId?: string;
  actor: TStudentActor;
};

export type TCancelCounselingSessionArgs = {
  reason?: string;
  sessionId: string;
  actor: TStudentActor;
};

export type TCompareResultsArgs = {
  actor: TStudentActor;
  baseResultId: string;
  compareWithResultId: string;
};

export type TCareerMatchItem = {
  title: string;
  score: number;
  fitReason: string;
  description: string;
};

export type TStudentDashboardCounts = {
  totalAssignments: number;
  pendingAssignments: number;
  unreadNotifications: number;
  submittedAssignments: number;
  evaluatedAssignments: number;
  inProgressAssignments: number;
  pendingCounselingSessions: number;
};

export type TNotificationCreateInput = {
  body: string;
  title: string;
  userId: string;
  schoolId?: string | null;
  actionUrl?: string | null;
  type: InAppNotificationType;
};

export type TSessionState = CounselingSessionStatus;

export type TSubmittedAssignmentAnswer = {
  value: number;
  questionNumber: number;
};

export type TListMyCounselingSessionsArgs = {
  take: number;
  skip: number;
  actor: TStudentActor;
  query?: string | null;
  status?: CounselingSessionStatus | null;
};
