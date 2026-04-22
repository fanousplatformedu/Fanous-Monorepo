import { AccessRequestRole, AuditAction, Prisma, Role } from "@prisma/client";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { SchoolStatus, UserStatus } from "@prisma/client";
import { AccessRequestErrorCode } from "@accessRequest/enums/access-request-error-code.enum";
import { AccessRequestMessage } from "@accessRequest/enums/access-request-message.enum";
import { NotificationTemplate } from "@notif/enums/notif-template.enum";
import { AccessRequestStatus } from "@prisma/client";
import { NotificationService } from "@notif/services/notif.service";
import { NotificationChannel } from "@notif/enums/notif-channel.enum";
import { PrismaService } from "@prisma/prisma.service";
import { AuditService } from "@audit/services/audit.service";

import * as T from "@accessRequest/types/access-request.types";

@Injectable()
export class AccessRequestService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notifService: NotificationService,
    private readonly auditService: AuditService,
  ) {}

  // ========= Public submit ============
  async submit(args: T.TSubmitAccessRequestArgs) {
    const hasEmail = !!args.email?.trim();
    const hasMobile = !!args.mobile?.trim();
    if (!hasEmail && !hasMobile) {
      throw new BadRequestException({
        code: AccessRequestErrorCode.INVALID_DESTINATION,
      });
    }
    const school = await this.prismaService.school.findUnique({
      where: { id: args.schoolId },
      select: { id: true, status: true, name: true },
    });
    if (!school)
      throw new NotFoundException({
        code: AccessRequestErrorCode.SCHOOL_NOT_FOUND,
      });
    if (school.status !== SchoolStatus.ACTIVE)
      throw new BadRequestException({
        code: AccessRequestErrorCode.SCHOOL_SUSPENDED,
      });
    const email = args.email?.trim().toLowerCase() ?? null;
    const mobile = args.mobile?.trim() ?? null;
    const existing = await this.prismaService.accessRequest.findFirst({
      where: {
        schoolId: args.schoolId,
        status: AccessRequestStatus.PENDING,
        OR: [
          email ? { email } : undefined,
          mobile ? { mobile } : undefined,
        ].filter(Boolean) as any,
      },
      select: { id: true },
    });
    if (existing)
      throw new BadRequestException({
        code: AccessRequestErrorCode.DUPLICATE_PENDING_REQUEST,
      });
    const userExists = await this.prismaService.user.findFirst({
      where: {
        schoolId: args.schoolId,
        OR: [
          email ? { email } : undefined,
          mobile ? { mobile } : undefined,
        ].filter(Boolean) as any,
        status: UserStatus.ACTIVE,
      },
      select: { id: true },
    });
    if (userExists)
      throw new BadRequestException({
        code: AccessRequestErrorCode.USER_ALREADY_EXISTS,
      });
    const req = await this.prismaService.accessRequest.create({
      data: {
        schoolId: args.schoolId,
        status: AccessRequestStatus.PENDING,
        requestedRole: args.requestedRole,
        email,
        mobile,
        fullName: args.fullName?.trim() ?? null,
      },
      select: this.selectAccessRequest(),
    });
    return { message: AccessRequestMessage.SUBMITTED, request: req };
  }

  // ============ list requests (SCHOOL_ADMIN or SUPER_ADMIN) ============
  async listAccessRequests(args: T.TListAccessRequestsArgs) {
    const { actor, query, status, requestedRole, take, skip } = args;
    if (actor.role !== Role.SCHOOL_ADMIN && actor.role !== Role.SUPER_ADMIN)
      throw new ForbiddenException({
        code: AccessRequestErrorCode.FORBIDDEN,
      });

    if (actor.role === Role.SCHOOL_ADMIN && !actor.schoolId)
      throw new BadRequestException({
        code: AccessRequestErrorCode.INVALID_OPERATION,
      });
    const where: Prisma.AccessRequestWhereInput = {
      ...(actor.role === Role.SCHOOL_ADMIN
        ? { schoolId: actor.schoolId! }
        : {}),
      ...(status ? { status } : {}),
      ...(requestedRole ? { requestedRole } : {}),
      ...(query?.trim()
        ? {
            OR: [
              { fullName: { contains: query.trim(), mode: "insensitive" } },
              { email: { contains: query.trim(), mode: "insensitive" } },
              { mobile: { contains: query.trim(), mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.accessRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      this.prismaService.accessRequest.count({ where }),
    ]);
    return {
      items,
      total,
      take,
      skip,
    };
  }

  async byId(actor: { role: Role; schoolId: string | null }, id: string) {
    const isSuper = actor.role === Role.SUPER_ADMIN;
    const isSchoolAdmin = actor.role === Role.SCHOOL_ADMIN;
    if (!isSuper && !isSchoolAdmin)
      throw new ForbiddenException({ code: AccessRequestErrorCode.FORBIDDEN });
    const req = await this.prismaService.accessRequest.findUnique({
      where: { id },
      select: this.selectAccessRequest(),
    });
    if (!req)
      throw new NotFoundException({
        code: AccessRequestErrorCode.REQUEST_NOT_FOUND,
      });
    if (!isSuper && req.schoolId !== actor.schoolId) {
      throw new ForbiddenException({
        code: AccessRequestErrorCode.CROSS_TENANT_ACCESS,
      });
    }
    return req;
  }

  // ========= approve/reject ==========
  async review(args: T.TReviewAccessRequestArgs) {
    const isSchoolAdmin = args.actor.role === Role.SCHOOL_ADMIN;
    const isSuperAdmin = args.actor.role === Role.SUPER_ADMIN;
    if (!isSchoolAdmin && !isSuperAdmin)
      throw new ForbiddenException({ code: AccessRequestErrorCode.FORBIDDEN });
    if (isSchoolAdmin && !args.actor.schoolId)
      throw new ForbiddenException({ code: AccessRequestErrorCode.FORBIDDEN });
    const req = await this.prismaService.accessRequest.findUnique({
      where: { id: args.requestId },
      select: {
        ...this.selectAccessRequest(),
        school: { select: { id: true, name: true, status: true } },
      },
    });
    if (!req)
      throw new NotFoundException({
        code: AccessRequestErrorCode.REQUEST_NOT_FOUND,
      });
    if (isSchoolAdmin && req.schoolId !== args.actor.schoolId)
      throw new ForbiddenException({
        code: AccessRequestErrorCode.CROSS_TENANT_ACCESS,
      });
    if (req.status !== AccessRequestStatus.PENDING)
      throw new BadRequestException({
        code: AccessRequestErrorCode.ALREADY_REVIEWED,
      });
    if (req.school.status !== SchoolStatus.ACTIVE)
      throw new BadRequestException({
        code: AccessRequestErrorCode.SCHOOL_SUSPENDED,
      });
    const destinationEmail = req.email ?? null;
    const destinationMobile = req.mobile ?? null;
    const notifyVia = args.notifyVia ?? "AUTO";
    const channel =
      notifyVia === "EMAIL"
        ? NotificationChannel.EMAIL
        : notifyVia === "SMS"
          ? NotificationChannel.SMS
          : destinationEmail
            ? NotificationChannel.EMAIL
            : NotificationChannel.SMS;
    const destination =
      channel === NotificationChannel.EMAIL
        ? destinationEmail
        : destinationMobile;
    if (!destination)
      throw new BadRequestException({
        code: AccessRequestErrorCode.INVALID_DESTINATION,
      });
    if (args.approve) {
      const finalRole: AccessRequestRole = args.finalRole ?? req.requestedRole;
      const userRole: Role =
        finalRole === AccessRequestRole.STUDENT
          ? Role.STUDENT
          : finalRole === AccessRequestRole.PARENT
            ? Role.PARENT
            : Role.COUNSELOR;
      const existingUser = await this.prismaService.user.findFirst({
        where: {
          schoolId: req.schoolId,
          OR: [
            req.email ? { email: req.email } : undefined,
            req.mobile ? { mobile: req.mobile } : undefined,
          ].filter(Boolean) as Prisma.UserWhereInput[],
        },
        select: { id: true },
      });
      if (existingUser) {
        throw new BadRequestException({
          code: AccessRequestErrorCode.USER_ALREADY_EXISTS,
        });
      }
      let createdUserId: string | undefined;
      let notificationError: string | undefined;
      await this.prismaService.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            schoolId: req.schoolId,
            role: userRole,
            status: UserStatus.ACTIVE,
            email: req.email,
            mobile: req.mobile,
            fullName: req.fullName,
          },
          select: { id: true },
        });
        createdUserId = user.id;
        await tx.accessRequest.update({
          where: { id: req.id },
          data: {
            status: AccessRequestStatus.APPROVED,
            reviewedById: args.actor.id,
            reviewedAt: new Date(),
            approvedUserId: user.id,
            rejectReason: null,
          },
        });
      });
      await this.auditService.record({
        action: AuditAction.ACCESS_REQUEST_APPROVE,
        actorId: args.actor.id,
        schoolId: req.schoolId,
        entityType: "AccessRequest",
        entityId: req.id,
        metadata: {
          requestId: req.id,
          requestedRole: req.requestedRole,
          finalRole,
          approvedUserId: createdUserId,
          email: req.email,
          mobile: req.mobile,
          fullName: req.fullName,
          reviewedByRole: args.actor.role,
        },
      });
      try {
        const result = await this.notifService.notifyByTemplate({
          template: NotificationTemplate.ACCESS_REQUEST_APPROVED,
          channel,
          destination,
          schoolName: req.school.name,
          roleTitle: finalRole,
        });
        if (result.message !== "SENT")
          notificationError =
            `${result.errorCode ?? "FAILED"}: ${result.errorMessage ?? ""}`.trim();
      } catch (error: unknown) {
        notificationError =
          error instanceof Error
            ? error.message
            : AccessRequestErrorCode.NOTIFICATION_FAILED;
      }
      return {
        message: AccessRequestMessage.APPROVED,
        requestId: req.id,
        createdUserId,
        notificationError,
      };
    }
    const reason = args.rejectReason?.trim() || null;
    await this.prismaService.accessRequest.update({
      where: { id: req.id },
      data: {
        status: AccessRequestStatus.REJECTED,
        reviewedById: args.actor.id,
        reviewedAt: new Date(),
        rejectReason: reason,
      },
    });
    await this.auditService.record({
      action: AuditAction.ACCESS_REQUEST_REJECT,
      actorId: args.actor.id,
      schoolId: req.schoolId,
      entityType: "AccessRequest",
      entityId: req.id,
      metadata: {
        requestId: req.id,
        requestedRole: req.requestedRole,
        rejectReason: reason,
        email: req.email,
        mobile: req.mobile,
        fullName: req.fullName,
        reviewedByRole: args.actor.role,
      },
    });
    let notificationError: string | undefined;
    try {
      const result = await this.notifService.notifyByTemplate({
        template: NotificationTemplate.ACCESS_REQUEST_REJECTED,
        channel,
        destination,
        schoolName: req.school.name,
        reason: reason ?? undefined,
      });
      if (result.message !== "SENT")
        notificationError =
          `${result.errorCode ?? "FAILED"}: ${result.errorMessage ?? ""}`.trim();
    } catch (e: any) {
      notificationError =
        e?.message ?? AccessRequestErrorCode.NOTIFICATION_FAILED;
    }
    return {
      message: AccessRequestMessage.REJECTED,
      requestId: req.id,
      notificationError,
    };
  }

  private selectAccessRequest() {
    return {
      id: true,
      schoolId: true,
      status: true,
      requestedRole: true,
      email: true,
      mobile: true,
      fullName: true,
      reviewedById: true,
      reviewedAt: true,
      rejectReason: true,
      approvedUserId: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
