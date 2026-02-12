import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export type TFormData = z.infer<typeof emailSchema>;

export const otpSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits"),
});
