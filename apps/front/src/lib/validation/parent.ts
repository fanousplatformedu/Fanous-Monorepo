import { z } from "zod";

export const parentProfileSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type TParentProfileFormValues = z.infer<typeof parentProfileSchema>;
