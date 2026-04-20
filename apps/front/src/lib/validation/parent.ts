import { z } from "zod";

export const parentProfileSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  mobile: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type TParentProfileFormValues = z.infer<typeof parentProfileSchema>;

export const requestSessionSchema = z.object({
  childId: z.string().min(1),
  title: z.string().min(1),
  note: z.string().optional(),
});

export type TParentCounselingrequestValues = z.infer<
  typeof requestSessionSchema
>;

export const counselingFiltersSchema = z.object({
  query: z.string(),
  status: z.string(),
  childId: z.string(),
});

export const childrenFiltersSchema = z.object({
  query: z.string(),
  childId: z.string(),
});

export const resultsFiltersSchema = z.object({
  childId: z.string(),
});
