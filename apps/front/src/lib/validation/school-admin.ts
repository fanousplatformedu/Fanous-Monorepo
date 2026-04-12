import { z } from "zod";

export const createAssignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueAt: z.string().optional(),
  targetMode: z.enum([
    "ALL_STUDENTS",
    "BY_STUDENT_IDS",
    "BY_GRADE",
    "BY_CLASSROOM",
  ]),
});

export type TCreateAssignmentForm = z.infer<typeof createAssignmentSchema>;

export const classroomSchema = z.object({
  gradeId: z.string().min(1, "Grade is required"),
  name: z.string().min(1, "Classroom name is required"),
  code: z.string().optional(),
  year: z.string().optional(),
});

export type TClassroomForm = z.infer<typeof classroomSchema>;

export const enrollmentSchema = z.object({
  classroomId: z.string().min(1, "Classroom is required"),
  studentId: z.string().min(1, "Student is required"),
});

export type TEnrollmentForm = z.infer<typeof enrollmentSchema>;
