import { TListAuditLogsArgs, TRecordAuditArgs } from "@audit/types/audit.types";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ForbiddenException } from "@nestjs/common";
import { AuditErrorCode } from "@audit/enums/audit-error-code.enum";
import { PrismaService } from "@prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class AuditService {
  constructor(private readonly prismaService: PrismaService) {}

  async record(args: TRecordAuditArgs) {
    return this.prismaService.auditLog.create({
      data: {
        action: args.action,
        actorId: args.actorId ?? null,
        schoolId: args.schoolId ?? null,
        entityType: args.entityType ?? null,
        entityId: args.entityId ?? null,
        metadata: args.metadata ?? null,
        ip: args.ip ?? null,
        userAgent: args.userAgent ?? null,
      },
      select: this.select(),
    });
  }

  async list(args: TListAuditLogsArgs) {
    const isSuper = args.actor.role === Role.SUPER_ADMIN;
    const isSchoolAdmin = args.actor.role === Role.SCHOOL_ADMIN;
    if (!isSuper && !isSchoolAdmin)
      throw new ForbiddenException({ code: AuditErrorCode.FORBIDDEN });
    const scopedSchoolId = isSuper
      ? (args.schoolId ?? null)
      : args.actor.schoolId;
    if (!isSuper && !scopedSchoolId) {
      throw new ForbiddenException({ code: AuditErrorCode.FORBIDDEN });
    }
    const where: any = {
      schoolId: scopedSchoolId ?? undefined,
      actorId: args.actorId ?? undefined,
      action: args.action ?? undefined,
      entityType: args.entityType ?? undefined,
      entityId: args.entityId ?? undefined,
      createdAt:
        args.from || args.to
          ? {
              gte: args.from ?? undefined,
              lte: args.to ?? undefined,
            }
          : undefined,
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.auditLog.findMany({
        where,
        select: this.select(),
        orderBy: { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.auditLog.count({ where }),
    ]);
    return { items, total, take: args.take, skip: args.skip };
  }

  async byId(actor: { role: Role; schoolId: string | null }, id: string) {
    const isSuper = actor.role === Role.SUPER_ADMIN;
    const isSchoolAdmin = actor.role === Role.SCHOOL_ADMIN;
    if (!isSuper && !isSchoolAdmin)
      throw new ForbiddenException({ code: AuditErrorCode.FORBIDDEN });
    const log = await this.prismaService.auditLog.findUnique({
      where: { id },
      select: this.select(),
    });
    if (!log) throw new NotFoundException({ code: AuditErrorCode.NOT_FOUND });
    if (!isSuper && log.schoolId && log.schoolId !== actor.schoolId) {
      throw new ForbiddenException({
        code: AuditErrorCode.CROSS_TENANT_ACCESS,
      });
    }
    return log;
  }

  private select() {
    return {
      id: true,
      action: true,
      actorId: true,
      schoolId: true,
      entityType: true,
      entityId: true,
      metadata: true,
      ip: true,
      userAgent: true,
      createdAt: true,
    };
  }
}
