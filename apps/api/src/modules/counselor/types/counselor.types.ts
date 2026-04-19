import { CounselorExportFormat, CounselorReviewStatus } from "@prisma/client";
import { CounselorStudentLinkStatus, Role } from "@prisma/client";
import { CounselingSessionStatus } from "@prisma/client";

export type TCurrentCounselorUser = {
  id: string;
  role: Role;
  email?: string;
  mobile?: string;
  fullName?: string;
  schoolId?: string;
};

export type TPaginationQuery = {
  page?: number;
  limit?: number;
  search?: string;
};

export interface MyStudentsServiceInput extends TPaginationQuery {
  status?: CounselorStudentLinkStatus;
}

export interface StudentAssessmentQueueServiceInput extends TPaginationQuery {
  studentId?: string;
  assignmentId?: string;
  status?: CounselorReviewStatus;
}

export interface ReviewStudentAssessmentServiceInput {
  reviewId: string;
  feedback?: string;
  status: CounselorReviewStatus;
}

export interface CounselorAssignmentsServiceInput extends TPaginationQuery {
  studentId?: string;
}

export type TStudentProgressTimelineServiceInput = {
  limit?: number;
  studentId: string;
};

export type TScheduleCounselorSessionServiceInput = {
  title: string;
  note?: string;
  scheduledAt: Date;
  studentId: string;
  meetingUrl?: string;
};

export interface MyCounselorSessionsServiceInput extends TPaginationQuery {
  to?: Date;
  from?: Date;
  studentId?: string;
  status?: CounselingSessionStatus;
}

export interface MyCounselorNotificationsServiceInput extends TPaginationQuery {
  unreadOnly?: boolean;
}

export interface MarkCounselorNotificationReadServiceInput {
  notificationId: string;
}

export interface ExportCounselorStudentReportServiceInput {
  studentId: string;
  format: CounselorExportFormat;
}

export interface CompareStudentResultsServiceInput {
  studentIds: string[];
}
