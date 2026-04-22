import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { Role, SchoolStatus, UserStatus } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CounselorStudentLinkStatus } from "@prisma/client";
import { NotificationTemplate } from "@notif/enums/notif-template.enum";
import { AuditAction, Prisma } from "@prisma/client";
import { NotificationChannel } from "@notif/enums/notif-channel.enum";
import { NotificationService } from "@notif/services/notif.service";
import { SchoolErrorCode } from "@school/enums/school-error-code.enum";
import { PrismaService } from "@prisma/prisma.service";
import { SchoolMessage } from "@school/enums/school-message.enum";
import { AuditService } from "@audit/services/audit.service";
import { randomBytes } from "crypto";

import * as argon2 from "argon2";
import * as T from "@school/types/school.types";

@Injectable()
export class SchoolService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notifService: NotificationService,
    private readonly auditService: AuditService,
  ) {}

  // ========== Schools CRUD (SUPER_ADMIN) ==========
  async createSchool(args: T.TCreateSchoolArgs) {
    this.assertSuperAdmin(args.actor);
    const name = args.name.trim();
    if (!name)
      throw new BadRequestException({ code: SchoolErrorCode.INVALID_NAME });
    const code = args.code?.trim() || undefined;
    if (code) {
      const exists = await this.prismaService.school.findFirst({
        where: { code },
        select: { id: true },
      });
      if (exists) {
        throw new BadRequestException({
          code: SchoolErrorCode.SCHOOL_CODE_TAKEN,
        });
      }
    }

    const school = await this.prismaService.$transaction(async (tx) => {
      const created = await tx.school.create({
        data: {
          name,
          code,
          settings: args.settings ?? undefined,
        },
        select: this.schoolSelect(),
      });
      await tx.auditLog.create({
        data: {
          action: AuditAction.SCHOOL_CREATE,
          actorId: args.actor.id,
          schoolId: created.id,
          entityType: "School",
          entityId: created.id,
          metadata: { name: created.name, code: created.code },
          ip: args.ip ?? null,
          userAgent: args.userAgent ?? null,
        },
        select: { id: true },
      });
      return created;
    });
    return { message: SchoolMessage.CREATED, school };
  }

  async updateSchool(args: T.TUpdateSchoolArgs) {
    this.assertSuperAdmin(args.actor);
    const existing = await this.prismaService.school.findUnique({
      where: { id: args.schoolId },
      select: { id: true, name: true, code: true, settings: true },
    });
    if (!existing)
      throw new NotFoundException({ code: SchoolErrorCode.SCHOOL_NOT_FOUND });
    const code = args.code?.trim();
    if (code) {
      const taken = await this.prismaService.school.findFirst({
        where: { code, id: { not: args.schoolId } },
        select: { id: true },
      });
      if (taken) {
        throw new BadRequestException({
          code: SchoolErrorCode.SCHOOL_CODE_TAKEN,
        });
      }
    }
    const school = await this.prismaService.$transaction(async (tx) => {
      const updated = await tx.school.update({
        where: { id: args.schoolId },
        data: {
          name: args.name?.trim() ?? undefined,
          code: args.code !== undefined ? code || null : undefined,
          settings:
            args.settings !== undefined ? (args.settings ?? null) : undefined,
        },
        select: this.schoolSelect(),
      });

      await tx.auditLog.create({
        data: {
          action: AuditAction.SCHOOL_UPDATE,
          actorId: args.actor.id,
          schoolId: updated.id,
          entityType: "School",
          entityId: updated.id,
          metadata: {
            before: {
              name: existing.name,
              code: existing.code,
              settings: existing.settings,
            },
            after: {
              name: updated.name,
              code: updated.code,
              settings: updated.settings,
            },
          },
          ip: args.ip ?? null,
          userAgent: args.userAgent ?? null,
        },
        select: { id: true },
      });

      return updated;
    });
    return { message: SchoolMessage.UPDATED, school };
  }

  async setSchoolStatus(args: T.TSetSchoolStatusArgs) {
    this.assertSuperAdmin(args.actor);
    const school = await this.prismaService.school.findUnique({
      where: { id: args.schoolId },
      select: { id: true, status: true },
    });
    if (!school)
      throw new NotFoundException({ code: SchoolErrorCode.SCHOOL_NOT_FOUND });
    const archivedAt =
      args.status === SchoolStatus.ARCHIVED ? new Date() : null;
    await this.prismaService.$transaction(async (tx) => {
      await tx.school.update({
        where: { id: args.schoolId },
        data: { status: args.status, archivedAt },
      });
      if (args.status !== SchoolStatus.ACTIVE) {
        const users = await tx.user.findMany({
          where: { schoolId: args.schoolId },
          select: { id: true },
        });
        const ids = users.map((u) => u.id);
        if (ids.length)
          await tx.authSession.updateMany({
            where: { userId: { in: ids }, status: "ACTIVE" },
            data: { status: "REVOKED", revokedAt: new Date() },
          });
      }
      await tx.auditLog.create({
        data: {
          action: AuditAction.SCHOOL_UPDATE,
          actorId: args.actor.id,
          schoolId: args.schoolId,
          entityType: "School",
          entityId: args.schoolId,
          metadata: { from: school.status, to: args.status },
          ip: args.ip ?? null,
          userAgent: args.userAgent ?? null,
        },
        select: { id: true },
      });
    });
    const updated = await this.prismaService.school.findUnique({
      where: { id: args.schoolId },
      select: this.schoolSelect(),
    });
    return { message: SchoolMessage.STATUS_UPDATED, school: updated };
  }

  // ========= School Admins management (SUPER_ADMIN) ============
  async createSchoolAdmin(args: T.TCreateSchoolAdminArgs) {
    this.assertSuperAdmin(args.actor);
    const school = await this.prismaService.school.findUnique({
      where: { id: args.schoolId },
      select: { id: true, name: true, status: true, code: true },
    });
    if (!school)
      throw new NotFoundException({ code: SchoolErrorCode.SCHOOL_NOT_FOUND });
    if (!args.adminEmail) {
      throw new BadRequestException({
        code: SchoolErrorCode.ADMIN_EMAIL_REQUIRED,
      });
    }
    const email = args.adminEmail.trim().toLowerCase();
    const username = await this.generateUniqueUsername(
      school.code ?? school.name,
    );
    const tempPassword = this.generatePassword(12);
    const passwordHash = await argon2.hash(tempPassword);
    const admin = await this.prismaService.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          role: Role.SCHOOL_ADMIN,
          status: UserStatus.ACTIVE,
          schoolId: school.id,
          username,
          passwordHash,
          email,
          fullName: args.adminFullName?.trim() || null,
          forcePasswordChange: true,
        },
        select: {
          id: true,
          role: true,
          status: true,
          schoolId: true,
          username: true,
          email: true,
          fullName: true,
          forcePasswordChange: true,
          createdAt: true,
          school: { select: { name: true } },
        },
      });

      await tx.auditLog.create({
        data: {
          action: AuditAction.ADMIN_CREATE,
          actorId: args.actor.id,
          schoolId: school.id,
          entityType: "User",
          entityId: created.id,
          metadata: {
            createdAdminId: created.id,
            adminEmail: created.email,
            username: created.username,
          },
          ip: args.ip ?? null,
          userAgent: args.userAgent ?? null,
        },
        select: { id: true },
      });

      return created;
    });

    let notificationError: string | undefined;
    try {
      const result = await this.notifService.notifyByTemplate({
        template: NotificationTemplate.ADMIN_CREDENTIALS,
        channel: NotificationChannel.EMAIL,
        destination: email,
        username,
        password: tempPassword,
        schoolName: school.name,
      });
      if (result.message !== "SENT") {
        notificationError =
          `${result.errorCode ?? "FAILED"}: ${result.errorMessage ?? ""}`.trim();
      }
    } catch (e: any) {
      notificationError = e?.message ?? SchoolErrorCode.NOTIFICATION_FAILED;
    }

    return {
      message: SchoolMessage.ADMIN_CREATED,
      admin: {
        id: admin.id,
        role: admin.role,
        status: admin.status,
        schoolId: admin.schoolId!,
        schoolName: admin.school?.name,
        username: admin.username ?? undefined,
        email: admin.email ?? undefined,
        fullName: admin.fullName ?? undefined,
        forcePasswordChange: admin.forcePasswordChange,
        createdAt: admin.createdAt,
      },
      tempPassword: process.env.NODE_ENV === "production" ? null : tempPassword,
      notificationError,
    };
  }

  async setAdminStatus(args: T.TSetAdminStatusArgs) {
    this.assertSuperAdmin(args.actor);
    const admin = await this.prismaService.user.findUnique({
      where: { id: args.adminUserId },
      select: { id: true, role: true, status: true, schoolId: true },
    });
    if (!admin || admin.role !== Role.SCHOOL_ADMIN)
      throw new NotFoundException({ code: SchoolErrorCode.ADMIN_NOT_FOUND });
    await this.prismaService.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: args.adminUserId },
        data: { status: args.status },
      });
      if (args.status !== UserStatus.ACTIVE) {
        await tx.authSession.updateMany({
          where: { userId: args.adminUserId, status: "ACTIVE" },
          data: { status: "REVOKED", revokedAt: new Date() },
        });
      }
      await tx.auditLog.create({
        data: {
          action:
            args.status === UserStatus.ACTIVE
              ? AuditAction.ADMIN_DISABLE
              : AuditAction.ADMIN_DISABLE,
          actorId: args.actor.id,
          schoolId: admin.schoolId ?? null,
          entityType: "User",
          entityId: admin.id,
          metadata: { from: admin.status, to: args.status },
          ip: args.ip ?? null,
          userAgent: args.userAgent ?? null,
        },
        select: { id: true },
      });
    });
    return {
      message: SchoolMessage.ADMIN_STATUS_UPDATED,
      adminUserId: args.adminUserId,
    };
  }

  async listSchoolAdmins(args: T.TListSchoolAdminsArgs) {
    this.assertSuperAdmin(args.actor);
    const where: any = {
      role: Role.SCHOOL_ADMIN,
      status: args.status ?? undefined,
      schoolId: args.schoolId ?? undefined,
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          role: true,
          status: true,
          schoolId: true,
          username: true,
          email: true,
          fullName: true,
          forcePasswordChange: true,
          createdAt: true,
          school: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.user.count({ where }),
    ]);
    return {
      items: items.map((a) => ({
        id: a.id,
        role: a.role,
        status: a.status,
        schoolId: a.schoolId!,
        schoolName: a.school?.name,
        username: a.username ?? undefined,
        email: a.email ?? undefined,
        fullName: a.fullName ?? undefined,
        forcePasswordChange: a.forcePasswordChange,
        createdAt: a.createdAt,
      })),
      total,
      take: args.take,
      skip: args.skip,
    };
  }

  async listSchools(args: T.TListSchoolsArgs) {
    this.assertSuperAdmin(args.actor);
    const where: any = {
      status: args.status ?? undefined,
    };
    if (args.query?.trim()) {
      const q = args.query.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { code: { contains: q, mode: "insensitive" } },
      ];
    }
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.school.findMany({
        where,
        select: this.schoolSelect(),
        orderBy: { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.school.count({ where }),
    ]);
    return { items, total, take: args.take, skip: args.skip };
  }

  async schoolById(actor: { role: Role }, schoolId: string) {
    this.assertSuperAdmin(actor);
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
      select: this.schoolSelect(),
    });
    if (!school)
      throw new NotFoundException({ code: SchoolErrorCode.SCHOOL_NOT_FOUND });
    return school;
  }

  async createGrade(
    actor: { id: string; role: Role; schoolId: string | null },
    input: { schoolId: string; name: string; code?: string | null },
  ) {
    const schoolId = await this.resolveManagedSchoolId(actor, input.schoolId);
    const existing = await this.prismaService.grade.findFirst({
      where: {
        schoolId,
        OR: [
          { name: input.name.trim() },
          input.code ? { code: input.code.trim() } : undefined,
        ].filter(Boolean) as any,
      },
      select: { id: true },
    });
    if (existing)
      throw new BadRequestException("Grade already exists in this school");
    const grade = await this.prismaService.grade.create({
      data: {
        schoolId,
        name: input.name.trim(),
        code: input.code?.trim() ?? null,
      },
    });
    await this.auditService.record({
      action: AuditAction.GRADE_CREATE,
      actorId: actor.id,
      schoolId,
      entityType: "Grade",
      entityId: grade.id,
      metadata: {
        name: grade.name,
        code: grade.code,
      },
    });
    return grade;
  }

  async updateGrade(
    actor: { id: string; role: Role; schoolId: string | null },
    input: { id: string; name?: string | null; code?: string | null },
  ) {
    const grade = await this.prismaService.grade.findUnique({
      where: { id: input.id },
    });
    if (!grade) throw new NotFoundException("Grade not found");
    await this.resolveManagedSchoolId(actor, grade.schoolId);
    const updated = await this.prismaService.grade.update({
      where: { id: grade.id },
      data: {
        name: input.name !== undefined ? input.name?.trim() : undefined,
        code:
          input.code !== undefined ? (input.code?.trim() ?? null) : undefined,
      },
    });
    await this.auditService.record({
      action: AuditAction.GRADE_UPDATE,
      actorId: actor.id,
      schoolId: grade.schoolId,
      entityType: "Grade",
      entityId: grade.id,
      metadata: {
        before: {
          name: grade.name,
          code: grade.code,
        },
        after: {
          name: updated.name,
          code: updated.code,
        },
      },
    });
    return updated;
  }

  async archiveGrade(
    actor: { id: string; role: Role; schoolId: string | null },
    id: string,
  ) {
    const grade = await this.prismaService.grade.findUnique({
      where: { id },
    });
    if (!grade) throw new NotFoundException("Grade not found");
    await this.resolveManagedSchoolId(actor, grade.schoolId);
    const updated = await this.prismaService.grade.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await this.auditService.record({
      action: AuditAction.GRADE_ARCHIVE,
      actorId: actor.id,
      schoolId: grade.schoolId,
      entityType: "Grade",
      entityId: grade.id,
      metadata: {
        name: grade.name,
        code: grade.code,
      },
    });
    return updated;
  }

  async restoreGrade(
    actor: { id: string; role: Role; schoolId: string | null },
    id: string,
  ) {
    const grade = await this.prismaService.grade.findUnique({
      where: { id },
    });
    if (!grade) throw new NotFoundException("Grade not found");
    await this.resolveManagedSchoolId(actor, grade.schoolId);
    const updated = await this.prismaService.grade.update({
      where: { id },
      data: { deletedAt: null },
    });
    await this.auditService.record({
      action: AuditAction.GRADE_RESTORE,
      actorId: actor.id,
      schoolId: grade.schoolId,
      entityType: "Grade",
      entityId: grade.id,
      metadata: {
        name: grade.name,
        code: grade.code,
      },
    });
    return updated;
  }

  async listGrades(
    actor: { id: string; role: Role; schoolId: string | null },
    input: {
      schoolId: string;
      take: number;
      skip: number;
      query?: string | null;
      includeDeleted?: boolean | null;
    },
  ) {
    const schoolId = await this.resolveManagedSchoolId(actor, input.schoolId);
    const where: Prisma.GradeWhereInput = {
      schoolId,
      ...(input.includeDeleted ? {} : { deletedAt: null }),
      ...(input.query?.trim()
        ? {
            OR: [
              { name: { contains: input.query.trim(), mode: "insensitive" } },
              { code: { contains: input.query.trim(), mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.grade.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: input.take,
        skip: input.skip,
      }),
      this.prismaService.grade.count({ where }),
    ]);
    return { items, total, take: input.take, skip: input.skip };
  }

  async createClassroom(
    actor: { id: string; role: Role; schoolId: string | null },
    input: {
      schoolId: string;
      gradeId: string;
      name: string;
      code?: string | null;
      year?: number | null;
    },
  ) {
    const schoolId = await this.resolveManagedSchoolId(actor, input.schoolId);
    const grade = await this.prismaService.grade.findFirst({
      where: {
        id: input.gradeId,
        schoolId,
        deletedAt: null,
      },
    });
    if (!grade) throw new BadRequestException("Invalid grade for this school");
    const classroom = await this.prismaService.classroom.create({
      data: {
        schoolId,
        gradeId: input.gradeId,
        name: input.name.trim(),
        code: input.code?.trim() ?? null,
        year: input.year ?? null,
      },
    });
    await this.auditService.record({
      action: AuditAction.CLASSROOM_CREATE,
      actorId: actor.id,
      schoolId,
      entityType: "Classroom",
      entityId: classroom.id,
      metadata: {
        gradeId: classroom.gradeId,
        name: classroom.name,
        code: classroom.code,
        year: classroom.year,
      },
    });
    return classroom;
  }

  async updateClassroom(
    actor: { id: string; role: Role; schoolId: string | null },
    input: {
      id: string;
      gradeId?: string | null;
      name?: string | null;
      code?: string | null;
      year?: number | null;
    },
  ) {
    const classroom = await this.prismaService.classroom.findUnique({
      where: { id: input.id },
    });
    if (!classroom) throw new NotFoundException("Classroom not found");
    await this.resolveManagedSchoolId(actor, classroom.schoolId);
    if (input.gradeId) {
      const grade = await this.prismaService.grade.findFirst({
        where: {
          id: input.gradeId,
          schoolId: classroom.schoolId,
          deletedAt: null,
        },
        select: { id: true },
      });
      if (!grade)
        throw new BadRequestException("Invalid grade for this school");
    }

    const updated = await this.prismaService.classroom.update({
      where: { id: classroom.id },
      data: {
        gradeId: input.gradeId ?? undefined,
        name: input.name !== undefined ? input.name?.trim() : undefined,
        code:
          input.code !== undefined ? (input.code?.trim() ?? null) : undefined,
        year: input.year !== undefined ? (input.year ?? null) : undefined,
      },
    });
    await this.auditService.record({
      action: AuditAction.CLASSROOM_UPDATE,
      actorId: actor.id,
      schoolId: classroom.schoolId,
      entityType: "Classroom",
      entityId: classroom.id,
      metadata: {
        before: {
          gradeId: classroom.gradeId,
          name: classroom.name,
          code: classroom.code,
          year: classroom.year,
        },
        after: {
          gradeId: updated.gradeId,
          name: updated.name,
          code: updated.code,
          year: updated.year,
        },
      },
    });
    return updated;
  }

  async archiveClassroom(
    actor: { id: string; role: Role; schoolId: string | null },
    id: string,
  ) {
    const classroom = await this.prismaService.classroom.findUnique({
      where: { id },
    });
    if (!classroom) throw new NotFoundException("Classroom not found");
    await this.resolveManagedSchoolId(actor, classroom.schoolId);
    const updated = await this.prismaService.classroom.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    await this.auditService.record({
      action: AuditAction.CLASSROOM_ARCHIVE,
      actorId: actor.id,
      schoolId: classroom.schoolId,
      entityType: "Classroom",
      entityId: classroom.id,
      metadata: {
        name: classroom.name,
        code: classroom.code,
        year: classroom.year,
      },
    });
    return updated;
  }

  async restoreClassroom(
    actor: { id: string; role: Role; schoolId: string | null },
    id: string,
  ) {
    const classroom = await this.prismaService.classroom.findUnique({
      where: { id },
    });
    if (!classroom) throw new NotFoundException("Classroom not found");
    await this.resolveManagedSchoolId(actor, classroom.schoolId);
    const updated = await this.prismaService.classroom.update({
      where: { id },
      data: { deletedAt: null },
    });
    await this.auditService.record({
      action: AuditAction.CLASSROOM_RESTORE,
      actorId: actor.id,
      schoolId: classroom.schoolId,
      entityType: "Classroom",
      entityId: classroom.id,
      metadata: {
        name: classroom.name,
        code: classroom.code,
        year: classroom.year,
      },
    });
    return updated;
  }

  async listClassrooms(
    actor: { id: string; role: Role; schoolId: string | null },
    input: {
      schoolId: string;
      gradeId?: string | null;
      take: number;
      skip: number;
      query?: string | null;
      includeDeleted?: boolean | null;
    },
  ) {
    const schoolId = await this.resolveManagedSchoolId(actor, input.schoolId);
    const where: Prisma.ClassroomWhereInput = {
      schoolId,
      ...(input.gradeId ? { gradeId: input.gradeId } : {}),
      ...(input.includeDeleted ? {} : { deletedAt: null }),
      ...(input.query?.trim()
        ? {
            OR: [
              { name: { contains: input.query.trim(), mode: "insensitive" } },
              { code: { contains: input.query.trim(), mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.classroom.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: input.take,
        skip: input.skip,
      }),
      this.prismaService.classroom.count({ where }),
    ]);
    return { items, total, take: input.take, skip: input.skip };
  }

  async enrollStudent(
    actor: { id: string; role: Role; schoolId: string | null },
    input: {
      schoolId: string;
      classroomId: string;
      studentId: string;
      startedAt?: string | null;
    },
  ) {
    const schoolId = await this.resolveManagedSchoolId(actor, input.schoolId);
    const [classroom, student] = await this.prismaService.$transaction([
      this.prismaService.classroom.findFirst({
        where: {
          id: input.classroomId,
          schoolId,
          deletedAt: null,
        },
        select: { id: true },
      }),
      this.prismaService.user.findFirst({
        where: {
          id: input.studentId,
          schoolId,
          role: Role.STUDENT,
          status: UserStatus.ACTIVE,
        },
        select: { id: true },
      }),
    ]);
    if (!classroom)
      throw new BadRequestException("Invalid classroom for this school");
    if (!student)
      throw new BadRequestException("Student not found in this school");
    const enrollment = await this.prismaService.enrollment.create({
      data: {
        schoolId,
        classroomId: input.classroomId,
        studentId: input.studentId,
        startedAt: input.startedAt ? new Date(input.startedAt) : new Date(),
      },
    });
    await this.auditService.record({
      action: AuditAction.ENROLLMENT_CREATE,
      actorId: actor.id,
      schoolId,
      entityType: "Enrollment",
      entityId: enrollment.id,
      metadata: {
        classroomId: enrollment.classroomId,
        studentId: enrollment.studentId,
        startedAt: enrollment.startedAt,
      },
    });
    return enrollment;
  }

  async closeEnrollment(
    actor: { id: string; role: Role; schoolId: string | null },
    input: { id: string; endedAt?: string | null },
  ) {
    const enrollment = await this.prismaService.enrollment.findUnique({
      where: { id: input.id },
    });
    if (!enrollment) throw new NotFoundException("Enrollment not found");
    await this.resolveManagedSchoolId(actor, enrollment.schoolId);
    const endedAt = input.endedAt ? new Date(input.endedAt) : new Date();
    if (endedAt < enrollment.startedAt)
      throw new BadRequestException("endedAt must be after startedAt");
    const updated = await this.prismaService.enrollment.update({
      where: { id: enrollment.id },
      data: { endedAt },
    });
    await this.auditService.record({
      action: AuditAction.ENROLLMENT_CLOSE,
      actorId: actor.id,
      schoolId: enrollment.schoolId,
      entityType: "Enrollment",
      entityId: enrollment.id,
      metadata: {
        studentId: enrollment.studentId,
        classroomId: enrollment.classroomId,
        startedAt: enrollment.startedAt,
        endedAt,
      },
    });
    return updated;
  }

  async enrollmentsByClassroom(
    actor: { id: string; role: Role; schoolId: string | null },
    input: {
      schoolId: string;
      classroomId: string;
      take: number;
      skip: number;
    },
  ) {
    const scopedSchoolId = await this.resolveManagedSchoolId(
      actor,
      input.schoolId,
    );

    const classroom = await this.prismaService.classroom.findFirst({
      where: {
        id: input.classroomId,
        schoolId: scopedSchoolId,
      },
      select: { id: true },
    });
    if (!classroom) throw new NotFoundException("Classroom not found");
    const where = {
      schoolId: scopedSchoolId,
      classroomId: input.classroomId,
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.enrollment.findMany({
        where,
        orderBy: { startedAt: "desc" },
        take: input.take,
        skip: input.skip,
      }),
      this.prismaService.enrollment.count({ where }),
    ]);

    return {
      items,
      total,
      take: input.take,
      skip: input.skip,
    };
  }

  // =========== Assign to Counselor ============
  async listSchoolCounselors(args: T.TListSchoolCounselorsArgs) {
    const schoolId = await this.resolveManagedSchoolId(
      args.actor,
      args.schoolId,
    );
    const where: Prisma.UserWhereInput = {
      schoolId,
      role: Role.COUNSELOR,
      ...(args.query?.trim()
        ? {
            OR: [
              {
                fullName: { contains: args.query.trim(), mode: "insensitive" },
              },
              { email: { contains: args.query.trim(), mode: "insensitive" } },
              { mobile: { contains: args.query.trim(), mode: "insensitive" } },
              {
                username: { contains: args.query.trim(), mode: "insensitive" },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          mobile: true,
          avatarUrl: true,
          status: true,
        },
        orderBy: { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.user.count({ where }),
    ]);
    return {
      items,
      total,
      take: args.take,
      skip: args.skip,
    };
  }

  async listSchoolStudentsForCounselorAssignment(
    args: T.TListSchoolStudentsForAssignmentArgs,
  ) {
    const schoolId = await this.resolveManagedSchoolId(
      args.actor,
      args.schoolId,
    );
    const where: Prisma.UserWhereInput = {
      schoolId,
      role: Role.STUDENT,
      ...(args.query?.trim()
        ? {
            OR: [
              {
                fullName: { contains: args.query.trim(), mode: "insensitive" },
              },
              { email: { contains: args.query.trim(), mode: "insensitive" } },
              { mobile: { contains: args.query.trim(), mode: "insensitive" } },
              {
                username: { contains: args.query.trim(), mode: "insensitive" },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          mobile: true,
          avatarUrl: true,
          status: true,
        },
        orderBy: { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.user.count({ where }),
    ]);
    return {
      items,
      total,
      take: args.take,
      skip: args.skip,
    };
  }

  async assignStudentsToCounselor(args: T.TAssignStudentsToCounselorArgs) {
    const schoolId = await this.resolveManagedSchoolId(
      args.actor,
      args.schoolId,
    );
    const counselor = await this.prismaService.user.findFirst({
      where: {
        id: args.counselorId,
        schoolId,
        role: Role.COUNSELOR,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (!counselor)
      throw new NotFoundException({
        code: SchoolErrorCode.COUNSELOR_NOT_FOUND,
      });
    const students = await this.prismaService.user.findMany({
      where: {
        id: { in: args.studentIds },
        schoolId,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        fullName: true,
      },
    });

    if (students.length !== args.studentIds.length)
      throw new BadRequestException({
        code: SchoolErrorCode.INVALID_STUDENT_IDS,
      });
    let affectedCount = 0;
    await this.prismaService.$transaction(async (tx) => {
      for (const studentId of args.studentIds) {
        await tx.counselorStudentLink.updateMany({
          where: {
            schoolId,
            studentId,
            counselorId: { not: args.counselorId },
            status: CounselorStudentLinkStatus.ACTIVE,
          },
          data: {
            status: CounselorStudentLinkStatus.ARCHIVED,
          },
        });
        const existing = await tx.counselorStudentLink.findFirst({
          where: {
            schoolId,
            counselorId: args.counselorId,
            studentId,
          },
          select: {
            id: true,
            status: true,
          },
        });
        if (!existing) {
          await tx.counselorStudentLink.create({
            data: {
              schoolId,
              counselorId: args.counselorId,
              studentId,
              status: CounselorStudentLinkStatus.ACTIVE,
            },
          });
          affectedCount++;
        } else if (existing.status === CounselorStudentLinkStatus.ARCHIVED) {
          await tx.counselorStudentLink.update({
            where: { id: existing.id },
            data: {
              status: CounselorStudentLinkStatus.ACTIVE,
            },
          });
          affectedCount++;
        }
        const studentAssignments = await tx.studentAssignment.findMany({
          where: {
            studentId,
          },
          select: {
            assignmentId: true,
            result: {
              select: {
                id: true,
              },
            },
          },
        });
        for (const sa of studentAssignments) {
          const existingReview = await tx.counselorReview.findFirst({
            where: {
              schoolId,
              counselorId: args.counselorId,
              studentId,
              assignmentId: sa.assignmentId,
            },
            select: { id: true },
          });
          if (!existingReview) {
            await tx.counselorReview.create({
              data: {
                schoolId,
                counselorId: args.counselorId,
                studentId,
                assignmentId: sa.assignmentId,
                resultId: sa.result?.id ?? null,
                status: "PENDING",
              },
            });
          }
        }
      }
      await tx.auditLog.create({
        data: {
          action: AuditAction.MEMBER_CREATED,
          actorId: args.actor.id,
          schoolId,
          entityType: "CounselorStudentLink",
          entityId: args.counselorId,
          metadata: {
            counselorId: args.counselorId,
            studentIds: args.studentIds,
            affectedCount,
          },
        },
      });
    });
    return {
      success: true,
      message: SchoolMessage.COUNSELOR_ASSIGNMENT_CREATED,
      affectedCount,
    };
  }

  async archiveCounselorStudentAssignment(
    args: T.TArchiveCounselorStudentAssignmentArgs,
  ) {
    const assignment = await this.prismaService.counselorStudentLink.findUnique(
      {
        where: { id: args.assignmentId },
        select: {
          id: true,
          schoolId: true,
          counselorId: true,
          studentId: true,
          status: true,
        },
      },
    );
    if (!assignment)
      throw new NotFoundException({
        code: SchoolErrorCode.COUNSELOR_ASSIGNMENT_NOT_FOUND,
      });
    await this.resolveManagedSchoolId(args.actor, assignment.schoolId);
    await this.prismaService.counselorStudentLink.update({
      where: { id: assignment.id },
      data: {
        status: CounselorStudentLinkStatus.ARCHIVED,
      },
    });
    await this.auditService.record({
      action: AuditAction.MEMBER_CREATED,
      actorId: args.actor.id,
      schoolId: assignment.schoolId,
      entityType: "CounselorStudentLink",
      entityId: assignment.id,
      metadata: {
        action: "ARCHIVE",
        counselorId: assignment.counselorId,
        studentId: assignment.studentId,
      },
    });
    return {
      success: true,
      message: SchoolMessage.COUNSELOR_ASSIGNMENT_ARCHIVED,
      affectedCount: 1,
    };
  }

  async restoreCounselorStudentAssignment(
    args: T.TRestoreCounselorStudentAssignmentArgs,
  ) {
    const assignment = await this.prismaService.counselorStudentLink.findUnique(
      {
        where: { id: args.assignmentId },
        select: {
          id: true,
          schoolId: true,
          counselorId: true,
          studentId: true,
        },
      },
    );
    if (!assignment)
      throw new NotFoundException({
        code: SchoolErrorCode.COUNSELOR_ASSIGNMENT_NOT_FOUND,
      });
    await this.resolveManagedSchoolId(args.actor, assignment.schoolId);
    await this.prismaService.$transaction(async (tx) => {
      await tx.counselorStudentLink.updateMany({
        where: {
          schoolId: assignment.schoolId,
          studentId: assignment.studentId,
          counselorId: { not: assignment.counselorId },
          status: CounselorStudentLinkStatus.ACTIVE,
        },
        data: {
          status: CounselorStudentLinkStatus.ARCHIVED,
        },
      });
      await tx.counselorStudentLink.update({
        where: { id: assignment.id },
        data: {
          status: CounselorStudentLinkStatus.ACTIVE,
        },
      });
      await tx.auditLog.create({
        data: {
          action: AuditAction.MEMBER_CREATED,
          actorId: args.actor.id,
          schoolId: assignment.schoolId,
          entityType: "CounselorStudentLink",
          entityId: assignment.id,
          metadata: {
            action: "RESTORE",
            counselorId: assignment.counselorId,
            studentId: assignment.studentId,
          },
        },
      });
    });
    return {
      success: true,
      message: SchoolMessage.COUNSELOR_ASSIGNMENT_RESTORED,
      affectedCount: 1,
    };
  }

  async listCounselorStudentAssignments(
    args: T.TListCounselorStudentAssignmentsArgs,
  ) {
    const schoolId = await this.resolveManagedSchoolId(
      args.actor,
      args.schoolId,
    );
    const where: Prisma.CounselorStudentLinkWhereInput = {
      schoolId,
      ...(args.counselorId ? { counselorId: args.counselorId } : {}),
      ...(args.studentId ? { studentId: args.studentId } : {}),
      ...(args.status ? { status: args.status } : {}),
      ...(args.query?.trim()
        ? {
            OR: [
              {
                counselor: {
                  fullName: {
                    contains: args.query.trim(),
                    mode: "insensitive",
                  },
                },
              },
              {
                counselor: {
                  email: {
                    contains: args.query.trim(),
                    mode: "insensitive",
                  },
                },
              },
              {
                student: {
                  fullName: {
                    contains: args.query.trim(),
                    mode: "insensitive",
                  },
                },
              },
              {
                student: {
                  email: {
                    contains: args.query.trim(),
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.counselorStudentLink.findMany({
        where,
        include: {
          counselor: {
            select: {
              id: true,
              fullName: true,
              email: true,
              mobile: true,
              avatarUrl: true,
              status: true,
            },
          },
          student: {
            select: {
              id: true,
              fullName: true,
              email: true,
              mobile: true,
              avatarUrl: true,
              status: true,
            },
          },
        },
        orderBy: { assignedAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.counselorStudentLink.count({ where }),
    ]);
    return {
      items,
      total,
      take: args.take,
      skip: args.skip,
    };
  }

  // =========== Public User ============
  async listPublicSchools() {
    const where = {
      status: SchoolStatus.ACTIVE,
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.school.findMany({
        where,
        select: {
          id: true,
          name: true,
          code: true,
        },
        orderBy: { name: "asc" },
      }),
      this.prismaService.school.count({ where }),
    ]);
    return { items, total };
  }

  // ========== helpers ==========
  private assertSuperAdmin(actor: { role: Role }) {
    if (actor.role !== Role.SUPER_ADMIN)
      throw new ForbiddenException({ code: SchoolErrorCode.FORBIDDEN });
  }

  private schoolSelect() {
    return {
      id: true,
      name: true,
      code: true,
      status: true,
      settings: true,
      createdAt: true,
      updatedAt: true,
      archivedAt: true,
    };
  }

  private generatePassword(len: number) {
    return randomBytes(Math.ceil(len / 2))
      .toString("hex")
      .slice(0, len);
  }

  private normalizeSlug(input: string) {
    return input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .slice(0, 18);
  }

  private async generateUniqueUsername(seed: string) {
    const base = this.normalizeSlug(seed) || "school";
    for (let i = 0; i < 20; i++) {
      const suffix = randomBytes(3).toString("hex");
      const username = `${base}-${suffix}`;
      const exists = await this.prismaService.user.findUnique({
        where: { username },
      });
      if (!exists) return username;
    }
    return `${base}-${randomBytes(6).toString("hex")}`;
  }

  private async resolveManagedSchoolId(
    actor: { id: string; role: Role; schoolId: string | null },
    requestedSchoolId: string,
  ) {
    if (actor.role === Role.SUPER_ADMIN) return requestedSchoolId;
    if (actor.role === Role.SCHOOL_ADMIN) {
      if (!actor.schoolId || actor.schoolId !== requestedSchoolId)
        throw new ForbiddenException({ code: SchoolErrorCode.FORBIDDEN });
      return actor.schoolId;
    }
    throw new ForbiddenException({ code: SchoolErrorCode.FORBIDDEN });
  }
}
