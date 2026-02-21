import { PrismaService } from "@prisma/prisma.service";
import { SchoolCodes } from "@school/enums/school-codes.enum";
import { Injectable } from "@nestjs/common";
import { AppError } from "@ctypes/app-error";

import * as T from "@school/types/school-service";
import * as H from "@utils/school-helper";

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService) {}

  async createSchool(params: T.TCreateSchoolParams) {
    const { code, name } = H.normalizeSchoolFields({
      code: params.input.code,
      name: params.input.name,
    });
    const exists = await this.prismaService.school.findUnique({
      where: { code },
    });
    if (exists) throw new AppError(SchoolCodes.SCHOOL_CODE_EXISTS);
    return this.prismaService.school.create({
      data: {
        code,
        name,
        isActive: params.input.isActive ?? true,
      },
    });
  }

  async updateSchoolStatus(params: T.TUpdateSchoolStatusParams) {
    const school = await this.prismaService.school.findUnique({
      where: { id: params.input.schoolId },
      select: { id: true },
    });
    if (!school) throw new AppError(SchoolCodes.SCHOOL_NOT_FOUND);
    return this.prismaService.school.update({
      where: { id: params.input.schoolId },
      data: { isActive: params.input.isActive },
    });
  }

  async listSchools(params: T.TListSchoolsParams) {
    const take = params.input.take ?? 20;
    const skip = params.input.skip ?? 0;
    const where = H.buildSchoolSearchWhere(params.input);
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.school.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      this.prismaService.school.count({ where }),
    ]);
    return { items, total };
  }

  async getSchool(params: T.TGetSchoolParams) {
    const lookup = H.getSchoolLookup(params.input);
    const school = await this.prismaService.school.findUnique({
      where: lookup.where,
    });
    if (!school) throw new AppError(SchoolCodes.SCHOOL_NOT_FOUND);
    return school;
  }

  async mySchool(params: T.TMySchoolParams) {
    const schoolId = H.requireSchoolId(params.schoolId);
    return this.getSchool({ input: { id: schoolId } });
  }
}
