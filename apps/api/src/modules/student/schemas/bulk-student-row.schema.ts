import { z } from "zod";
import { TBulkStudentRoles } from "@student/types/student.types";
import { normalizePhoneNumber } from "@common/utils/mobile.util";

const requiredString = (label: string) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .min(1, `${label} is required`);

export const bulkStudentRowSchema = z.object({
  firstName: requiredString("First name"),
  lastName: requiredString("Last name"),
  mobile: z
    .string({ error: "Mobile is required" })
    .transform(normalizePhoneNumber)
    .refine((value) => /^\+?\d{7,15}$/.test(value), "Invalid mobile number"),
  email: z.email("Invalid email address"),
  classroomName: requiredString("Classroom name"),
  role: z.enum(
    Object.keys(TBulkStudentRoles) as [string, ...string[]],
    `Role must be one of: ${Object.keys(TBulkStudentRoles).join(", ")}`,
  ),
});

export type BulkStudentRow = z.infer<typeof bulkStudentRowSchema>;
