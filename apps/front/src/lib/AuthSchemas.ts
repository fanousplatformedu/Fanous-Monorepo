import { z } from "zod";

export const SignUpFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50),
  email: z.string().refine((val) => z.email().safeParse(val).success, {
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(6)
    .max(100)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message:
        "Password must include uppercase, lowercase, number and special character",
    }),
});

export const SignInFormSchema = z.object({
  email: z.string().refine((val) => z.email().safeParse(val).success, {
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(6)
    .max(100)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message:
        "Password must include uppercase, lowercase, number and special character",
    }),
  role: z.enum(["PROFESSIONAL", "PROVIDER"]),
});

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
export type SignInFormValues = z.infer<typeof SignInFormSchema>;
