import { z } from "zod";

export const counselorStudentFilterSchema = z.object({
  query: z.string(),
  status: z.enum(["ALL", "ACTIVE", "ARCHIVED"]),
});

export const counselorScheduleSessionDialogSchema = z.object({
  title: z.string().min(1),
  note: z.string().optional(),
  meetingUrl: z.string().optional(),
  scheduledAt: z.string().min(1),
});

export type TCounselorScheduleSessionDialogFormValues = z.infer<
  typeof counselorScheduleSessionDialogSchema
>;

export const counselorExportReportSchema = z.object({
  format: z.enum(["PDF", "EXCEL"]),
});

export type TCounselorExportReportFormValues = z.infer<
  typeof counselorExportReportSchema
>;

export const reviewFilterSchema = z.object({
  query: z.string(),
  status: z.enum(["ALL", "PENDING", "IN_REVIEW", "REVIEWED", "RETURNED"]),
  studentId: z.string(),
  assignmentId: z.string(),
});

export type TReviewFilterFormValues = z.infer<typeof reviewFilterSchema>;

export const actionDialogSchema = z.object({
  status: z.enum(["IN_REVIEW", "REVIEWED", "RETURNED"]),
  feedback: z.string(),
});

export type TActionDialogFormValues = z.infer<typeof actionDialogSchema>;
