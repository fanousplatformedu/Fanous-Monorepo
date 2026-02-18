import { UpdateSchoolStatusInput } from "@school/dtos/update-school-status.input";
import { CreateSchoolInput } from "@school/dtos/create-school.input";
import { ListSchoolsInput } from "@school/dtos/list-schools.input";
import { GetSchoolInput } from "@school/dtos/get-school.input";
import { PrismaService } from "@prisma/prisma.service";
import { SchoolCodes } from "@school/enums/school-codes.enum";
import { Injectable } from "@nestjs/common";
import { AppError } from "@ctypes/app-error";

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService) {}

  async createSchool(input: CreateSchoolInput) {
    const code = input.code.trim();
    const name = input.name.trim();

    const exists = await this.prismaService.school.findUnique({
      where: { code },
    });
    if (exists) throw new AppError(SchoolCodes.SCHOOL_CODE_EXISTS as any);
    return this.prismaService.school.create({
      data: {
        code,
        name,
        isActive: input.isActive ?? true,
      },
    });
  }

  async updateSchoolStatus(input: UpdateSchoolStatusInput) {
    const school = await this.prismaService.school.findUnique({
      where: { id: input.schoolId },
    });
    if (!school) throw new AppError(SchoolCodes.SCHOOL_NOT_FOUND as any);
    return this.prismaService.school.update({
      where: { id: input.schoolId },
      data: { isActive: input.isActive },
    });
  }

  async listSchools(input: ListSchoolsInput) {
    const take = input.take ?? 20;
    const skip = input.skip ?? 0;
    const where: any = {};
    if (input.onlyActive) where.isActive = true;
    if (input.q?.trim()) {
      const q = input.q.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { code: { contains: q, mode: "insensitive" } },
      ];
    }

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

  async getSchool(input: GetSchoolInput) {
    if (!input.id && !input.code)
      throw new AppError(SchoolCodes.INVALID_INPUT as any);
    const school = input.id
      ? await this.prismaService.school.findUnique({ where: { id: input.id } })
      : await this.prismaService.school.findUnique({
          where: { code: input.code!.trim() },
        });
    if (!school) throw new AppError(SchoolCodes.SCHOOL_NOT_FOUND as any);
    return school;
  }
}
