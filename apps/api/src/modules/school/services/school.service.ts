import { Injectable, NotFoundException } from "@nestjs/common";
import { CloseEnrollmentInput } from "@school/dto/close-enrollment.input";
import { UpdateClassroomInput } from "@school/dto/create-classroom.input";
import { CreateClassroomInput } from "@school/dto/create-classroom.input";
import { BadRequestException } from "@nestjs/common";
import { EnrollStudentInput } from "@school/dto/enroll-student.input";
import { ClassroomPageInput } from "@school/dto/paginate-classrooms.input";
import { UpdateGradeInput } from "@school/dto/create-grade.input";
import { CreateGradeInput } from "@school/dto/create-grade.input";
import { GradePageInput } from "@school/dto/paginate-grades.input";
import { PrismaService } from "@prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class SchoolService {
  constructor(private prismaService: PrismaService) {}

  // ========= Grades =========
  async createGrade(input: CreateGradeInput) {
    return this.prismaService.grade.create({
      data: {
        tenantId: input.tenantId,
        name: input.name.trim(),
        code: input.code?.trim() ?? null,
      },
    });
  }

  async updateGrade(input: UpdateGradeInput) {
    const g = await this.prismaService.grade.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!g) throw new NotFoundException("Grade not found");
    return this.prismaService.grade.update({
      where: { id: input.id },
      data: {
        ...(input.name ? { name: input.name.trim() } : {}),
        ...(input.code !== undefined
          ? { code: input.code?.trim() ?? null }
          : {}),
      },
    });
  }

  async archiveGrade(id: string, tenantId: string) {
    const g = await this.prismaService.grade.findFirst({
      where: { id, tenantId },
    });
    if (!g) throw new NotFoundException("Grade not found");
    return this.prismaService.grade.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restoreGrade(id: string, tenantId: string) {
    const g = await this.prismaService.grade.findFirst({
      where: { id, tenantId },
    });
    if (!g) throw new NotFoundException("Grade not found");
    return this.prismaService.grade.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async paginateGrades(input: GradePageInput) {
    const { tenantId, page = 1, pageSize = 20, search, includeDeleted } = input;
    const and: Prisma.GradeWhereInput[] = [{ tenantId }];
    if (search && search.trim()) {
      and.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
        ],
      });
    }
    if (!includeDeleted) and.push({ deletedAt: null });
    const where: Prisma.GradeWhereInput = and.length
      ? { AND: and }
      : { tenantId };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.grade.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.grade.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  // ========= Classrooms =========
  async createClassroom(input: CreateClassroomInput) {
    const grade = await this.prismaService.grade.findFirst({
      where: { id: input.gradeId, tenantId: input.tenantId, deletedAt: null },
      select: { id: true },
    });
    if (!grade) throw new BadRequestException("Invalid grade for this tenant");
    return this.prismaService.classroom.create({
      data: {
        tenantId: input.tenantId,
        gradeId: input.gradeId,
        name: input.name.trim(),
        code: input.code?.trim() ?? null,
        year: input.year,
      },
    });
  }

  async updateClassroom(input: UpdateClassroomInput) {
    const c = await this.prismaService.classroom.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!c) throw new NotFoundException("Classroom not found");
    if (input.gradeId) {
      const grade = await this.prismaService.grade.findFirst({
        where: { id: input.gradeId, tenantId: input.tenantId, deletedAt: null },
        select: { id: true },
      });
      if (!grade)
        throw new BadRequestException("Invalid grade for this tenant");
    }
    return this.prismaService.classroom.update({
      where: { id: input.id },
      data: {
        ...(input.gradeId ? { gradeId: input.gradeId } : {}),
        ...(input.name !== undefined ? { name: input.name?.trim() ?? "" } : {}),
        ...(input.code !== undefined
          ? { code: input.code?.trim() ?? null }
          : {}),
        ...(input.year !== undefined ? { year: input.year } : {}),
      },
    });
  }

  async archiveClassroom(id: string, tenantId: string) {
    const c = await this.prismaService.classroom.findFirst({
      where: { id, tenantId },
    });
    if (!c) throw new NotFoundException("Classroom not found");
    return this.prismaService.classroom.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restoreClassroom(id: string, tenantId: string) {
    const c = await this.prismaService.classroom.findFirst({
      where: { id, tenantId },
    });
    if (!c) throw new NotFoundException("Classroom not found");
    return this.prismaService.classroom.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async paginateClassrooms(input: ClassroomPageInput) {
    const {
      tenantId,
      gradeId,
      page = 1,
      pageSize = 20,
      search,
      includeDeleted,
    } = input;

    const and: Prisma.ClassroomWhereInput[] = [{ tenantId }];
    if (gradeId) and.push({ gradeId });
    if (search && search.trim()) {
      and.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
        ],
      });
    }
    if (!includeDeleted) and.push({ deletedAt: null });
    const where: Prisma.ClassroomWhereInput = and.length
      ? { AND: and }
      : { tenantId };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.classroom.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.classroom.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  // ========= Enrollment =========
  async enrollStudent(input: EnrollStudentInput) {
    const [classroom, student] = await this.prismaService.$transaction([
      this.prismaService.classroom.findFirst({
        where: {
          id: input.classroomId,
          tenantId: input.tenantId,
          deletedAt: null,
        },
        select: { id: true },
      }),
      this.prismaService.user.findFirst({
        where: {
          id: input.studentId,
          tenantRoles: { some: { tenantId: input.tenantId } },
        },
        select: { id: true },
      }),
    ]);
    if (!classroom)
      throw new BadRequestException("Invalid classroom for this tenant");
    if (!student)
      throw new BadRequestException("Student not found in this tenant");
    const startedAt = input.startedAt ?? new Date();
    return this.prismaService.enrollment.create({
      data: {
        tenantId: input.tenantId,
        classroomId: input.classroomId,
        studentId: input.studentId,
        startedAt,
      },
    });
  }

  async closeEnrollment(input: CloseEnrollmentInput) {
    const e = await this.prismaService.enrollment.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!e) throw new NotFoundException("Enrollment not found");
    const endedAt = input.endedAt ?? new Date();
    if (endedAt < e.startedAt)
      throw new BadRequestException("endedAt must be after startedAt");
    return this.prismaService.enrollment.update({
      where: { id: e.id },
      data: { endedAt },
    });
  }

  async enrollmentsByClassroom(tenantId: string, classroomId: string) {
    const c = await this.prismaService.classroom.findFirst({
      where: { id: classroomId, tenantId },
      select: { id: true },
    });
    if (!c) throw new NotFoundException("Classroom not found");
    return this.prismaService.enrollment.findMany({
      where: { tenantId, classroomId },
      orderBy: { startedAt: "desc" },
    });
  }
}
