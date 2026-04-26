import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type TFormValues = z.infer<typeof adminLoginSchema>;

export const accessRequestSchema = z
  .object({
    schoolId: z.string().min(1, "School is required"),
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Invalid email").or(z.literal("")),
    mobile: z.string().or(z.literal("")),
    requestedRole: z.enum(["STUDENT", "PARENT", "COUNSELOR"]),
  })
  .refine((data) => Boolean(data.email || data.mobile), {
    message: "At least one of email or mobile is required",
    path: ["email"],
  });

export const requestOtpSchema = z.object({
  schoolCode: z.string().min(1, "School is required"),
  emailOrMobile: z.string().min(3, "Email or mobile is required"),
});

export type RequestValues = z.infer<typeof requestOtpSchema>;

export const verifyOtpSchema = z.object({
  schoolCode: z.string().min(1, "School is required"),
  emailOrMobile: z.string().min(3, "Email or mobile is required"),
  code: z.string().min(4).max(6),
});

export type VerifyValues = z.infer<typeof verifyOtpSchema>;
