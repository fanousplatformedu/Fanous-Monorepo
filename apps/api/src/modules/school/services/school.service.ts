import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AuditAction, Role, SchoolStatus, UserStatus } from "@prisma/client";
import { NotificationTemplate } from "@notif/enums/notif-template.enum";
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
}
