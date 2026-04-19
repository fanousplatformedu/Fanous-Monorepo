import { IntelligenceKey } from "@prisma/client";

export const MULTIPLE_INTELLIGENCE_MAP: Record<IntelligenceKey, number[]> = {
  MUSICAL: [2, 4, 13, 23, 28, 34, 42, 65, 73, 75],
  INTRAPERSONAL: [1, 16, 19, 31, 45, 57, 58, 61, 78],
  NATURALISTIC: [8, 18, 20, 21, 27, 33, 38, 44, 51, 60],
  LINGUISTIC: [6, 9, 17, 29, 35, 37, 55, 56, 63, 64, 70],
  INTERPERSONAL: [12, 14, 30, 41, 48, 52, 59, 66, 72, 79],
  LOGICAL_MATHEMATICAL: [5, 10, 11, 19, 22, 24, 32, 36, 69],
  BODILY_KINESTHETIC: [3, 7, 15, 26, 39, 40, 43, 47, 62, 67, 74],
  VISUAL_SPATIAL: [25, 29, 44, 49, 50, 53, 54, 68, 71, 76, 77, 80],
};
