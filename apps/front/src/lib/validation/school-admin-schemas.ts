import { z } from "zod";

export const createAssignmentSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    dueAt: z.string().optional(),
    targetMode: z.enum([
      "ALL_STUDENTS",
      "BY_STUDENT_IDS",
      "BY_GRADE",
      "BY_CLASSROOM",
    ]),
    targetGradeId: z.string().optional(),
    targetClassroomId: z.string().optional(),
    targetStudentIds: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.targetMode === "BY_GRADE" && !data.targetGradeId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetGradeId"],
        message: "Grade is required",
      });
    }
    if (data.targetMode === "BY_CLASSROOM" && !data.targetClassroomId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetClassroomId"],
        message: "Classroom is required",
      });
    }
    if (
      data.targetMode === "BY_STUDENT_IDS" &&
      (!data.targetStudentIds || data.targetStudentIds.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["targetStudentIds"],
        message: "Select at least one student",
      });
    }
  });

export type TCreateAssignmentForm = z.infer<typeof createAssignmentSchema>;

export const updateAssignmentSchema = createAssignmentSchema.safeExtend({
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]),
});

export type TUpdateAssignmentForm = z.infer<typeof updateAssignmentSchema>;

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

export const enrollmentFilterSchema = z.object({
  gradeFilter: z.string(),
  studentSearch: z.string(),
});

export type TEnrollmentFilterForm = z.infer<typeof enrollmentFilterSchema>;

export const classroomFiltersSchema = z.object({
  query: z.string(),
  gradeId: z.string(),
  scope: z.enum(["ACTIVE_ONLY", "ALL"]),
});

export type TClassroomFiltersValues = z.infer<typeof classroomFiltersSchema>;

export const gradeSchema = z.object({
  name: z.string().min(1),
  code: z.string(),
});

export type TGradeFormValues = z.infer<typeof gradeSchema>;

export const gradeEditSchema = z.object({
  name: z.string().min(1),
  code: z.string(),
});

export type TGradeEditValues = z.infer<typeof gradeEditSchema>;

export const assignAssignmentsSchema = z.object({
  counselorId: z.string().min(1),
  studentIds: z.array(z.string()).min(1),
});

export type TAssignAssignmentsValues = z.infer<typeof assignAssignmentsSchema>;

export const CounselorAssignmentsFilterSchema = z.object({
  query: z.string(),
  counselorId: z.string(),
  studentId: z.string(),
  status: z.string(),
});

export type TCounselorAssignmentsFilterValues = z.infer<
  typeof CounselorAssignmentsFilterSchema
>;

export const accessRequestFilterSchema = z.object({
  query: z.string(),
  status: z.enum(["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELED"]),
  requestedRole: z.enum(["ALL", "STUDENT", "PARENT", "COUNSELOR"]),
});

export type TAccessRequestFilterFormValues = z.infer<
  typeof accessRequestFilterSchema
>;

type TAddSchoolMemberMessage = (
  key: string,
  params?: Record<string, string>,
) => string;

export const createAddSchoolMemberSchema = (msg: TAddSchoolMemberMessage) =>
  z.object({
    firstName: z.string().min(1, { error: () => msg("firstNameRequired") }),
    lastName: z.string().min(1, { error: () => msg("lastNameRequired") }),
    email: z
      .string()
      .min(1, { error: () => msg("emailRequired") })
      .email({ error: () => msg("emailInvalid") }),
    mobile: z.string().min(1, { error: () => msg("mobileRequired") }),
    username: z.string().min(3, {
      error: () => msg("usernameMin", { min: "3" }),
    }),
    password: z.string().min(6, {
      error: () => msg("passwordMin", { min: "6" }),
    }),
    role: z.enum(["STUDENT", "PARENT", "COUNSELOR", "SCHOOL_ADMIN"], {
      error: () => msg("roleRequired"),
    }),
    isActive: z.boolean(),
    forcePasswordChange: z.boolean(),
  });

export type TAddSchoolMemberForm = z.infer<
  ReturnType<typeof createAddSchoolMemberSchema>
>;

export const createEditSchoolMemberSchema = (msg: TAddSchoolMemberMessage) =>
  z.object({
    userId: z.string().min(1, { error: () => msg("userIdRequired") }),
    firstName: z.string().min(1, { error: () => msg("firstNameRequired") }),
    lastName: z.string().min(1, { error: () => msg("lastNameRequired") }),
    email: z
      .string()
      .min(1, { error: () => msg("emailRequired") })
      .email({ error: () => msg("emailInvalid") }),
    mobile: z.string().min(1, { error: () => msg("mobileRequired") }),
    username: z
      .string()
      .optional()
      .refine((v) => !v || v.length >= 3, {
        error: () => msg("usernameMin", { min: "3" }),
      }),
    password: z
      .string()
      .optional()
      .refine((v) => !v || v.length >= 6, {
        error: () => msg("passwordMin", { min: "6" }),
      }),
    role: z.enum(["STUDENT", "PARENT", "COUNSELOR", "SCHOOL_ADMIN"], {
      error: () => msg("roleRequired"),
    }),
    isActive: z.boolean(),
    forcePasswordChange: z.boolean(),
  });

export type TEditSchoolMemberForm = z.infer<
  ReturnType<typeof createEditSchoolMemberSchema>
>;
