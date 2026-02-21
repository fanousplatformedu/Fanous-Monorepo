import { SchoolCodes } from "@school/enums/school-codes.enum";
import { AppError } from "@ctypes/app-error";
import { Prisma } from "@prisma/client";

import * as T from "@school/types/school-service";

export const normalizeSchoolFields = (
  input: T.TNormalizeSchoolFieldsInput,
): T.TNormalizeSchoolFieldsOutput => {
  const code = input.code.trim().toLowerCase();
  const name = input.name.trim();
  if (!code) throw new AppError(SchoolCodes.INVALID_INPUT, "INVALID_CODE", 400);
  if (!name) throw new AppError(SchoolCodes.INVALID_INPUT, "INVALID_NAME", 400);
  return { code, name };
};

export const buildSchoolSearchWhere = (
  input: T.TBuildSchoolSearchWhereInput,
): T.TBuildSchoolSearchWhereOutput => {
  const where: Prisma.SchoolWhereInput = {};
  if (input.onlyActive) where.isActive = true;
  const q = input.q?.trim();
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
    ];
  }
  return where;
};

export const getSchoolLookup = (
  input: T.TGetSchoolLookupInput,
): T.TGetSchoolLookupOutput => {
  const id = input.id?.trim();
  const code = input.code?.trim().toLowerCase();
  if (id) return { by: "id", where: { id } };
  if (code) return { by: "code", where: { code } };
  throw new AppError(SchoolCodes.INVALID_INPUT);
};

export const requireSchoolId = (schoolId?: string) => {
  if (!schoolId)
    throw new AppError(SchoolCodes.INVALID_INPUT as any, "NO_SCHOOL_ID", 400);
  return schoolId;
};
