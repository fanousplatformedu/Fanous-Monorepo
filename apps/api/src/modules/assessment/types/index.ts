import { AssignmentStatus, IntelligenceKey, Role } from "@prisma/client";
import { AssignmentTargetMode } from "@prisma/client";

export type TAssessmentActor = {
  id: string;
  role: Role;
  schoolId: string | null;
};

export type TCreateAssignmentArgs = {
  title: string;
  dueAt?: string | null;
  actor: TAssessmentActor;
  description?: string | null;
  targetGradeId?: string | null;
  targetClassroomId?: string | null;
  targetMode?: AssignmentTargetMode | null;
};

export type TUpdateAssignmentArgs = {
  actor: TAssessmentActor;
  assignmentId: string;
  title?: string | null;
  dueAt?: string | null;
  description?: string | null;
  targetGradeId?: string | null;
  targetClassroomId?: string | null;
  targetMode?: AssignmentTargetMode | null;
  targetStudentIds?: string[] | null;
};

export type TListAssignmentsArgs = {
  take: number;
  skip: number;
  query?: string | null;
  actor: TAssessmentActor;
  status?: AssignmentStatus | null;
};

export type TAssignAssignmentArgs = {
  assignmentId: string;
  actor: TAssessmentActor;
  studentIds?: string[] | null;
};

export type TSubmitStudentAnswersArgs = {
  actor: TAssessmentActor;
  studentAssignmentId: string;
  answers: Array<{
    questionId: string;
    value: number;
  }>;
};

export type TListAssessmentResultsArgs = {
  take: number;
  skip: number;
  query?: string | null;
  actor: TAssessmentActor;
  assignmentId?: string | null;
};

export type TAssessmentResultArgs = {
  actor: TAssessmentActor;
  assignmentId: string;
  studentId: string;
};

export type TSchoolAssessmentSummaryArgs = {
  actor: TAssessmentActor;
  assignmentId?: string | null;
};

export type TSchoolAssignemntDetailArgs = {
  actor: TAssessmentActor;
  assignmentId: string;
  take?: number;
  skip?: number;
  query?: string | null;
};

export type TIntelligenceScoreMap = Record<IntelligenceKey, number>;
