import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditAction, Role, UserStatus } from "@prisma/client";
import { TChangeAdminPasswordArgs } from "@adminPassword/types/admin-password.type";
import { TResetAdminPasswordArgs } from "@adminPassword/types/admin-password.type";
import { AdminPasswordErrorCode } from "@adminPassword/enums/admin-password-error-code.enum";
import { AdminPasswordMessage } from "@adminPassword/enums/admin-password-message.enum";
import { NotificationTemplate } from "@notif/enums/notif-template.enum";
import { NotificationService } from "@notif/services/notif.service";
import { NotificationChannel } from "@notif/enums/notif-channel.enum";
import { PrismaService } from "@prisma/prisma.service";
import { AuditService } from "@audit/services/audit.service";
import { randomBytes } from "crypto";

import * as argon2 from "argon2";

@Injectable()
export class AdminPasswordService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notifService: NotificationService,
    private readonly auditService: AuditService,
  ) {}

  async changeAdminPassword(args: TChangeAdminPasswordArgs) {
    if (![Role.SCHOOL_ADMIN, Role.SUPER_ADMIN].includes(args.actor.role))
      throw new ForbiddenException({ code: AdminPasswordErrorCode.FORBIDDEN });
    this.assertStrongPassword(args.newPassword);
    const user = await this.prismaService.user.findUnique({
      where: { id: args.actor.id },
      select: {
        id: true,
        role: true,
        passwordHash: true,
        forcePasswordChange: true,
        schoolId: true,
      },
    });
    if (!user)
      throw new NotFoundException({
        code: AdminPasswordErrorCode.ADMIN_NOT_FOUND,
      });
    if (!user.passwordHash)
      throw new BadRequestException({
        code: AdminPasswordErrorCode.PASSWORD_NOT_SET,
      });
    const ok = await argon2.verify(user.passwordHash, args.currentPassword);
    if (!ok)
      throw new BadRequestException({
        code: AdminPasswordErrorCode.INVALID_CURRENT_PASSWORD,
      });
    const newHash = await argon2.hash(args.newPassword);
    await this.prismaService.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { passwordHash: newHash, forcePasswordChange: false },
      });
      await tx.authSession.updateMany({
        where: { userId: user.id, status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: new Date() },
      });
    });
    try {
      await this.auditService.record({
        action:
          (AuditAction as any).ADMIN_PASSWORD_CHANGED ??
          AuditAction.AUTH_REFRESH,
        actorId: user.id,
        schoolId: user.schoolId ?? null,
        entityType: "User",
        entityId: user.id,
        metadata: { kind: "admin_password_change" },
      });
    } catch {}
    return { message: AdminPasswordMessage.CHANGED };
  }

  async resetAdminPassword(args: TResetAdminPasswordArgs) {
    if (args.actor.role !== Role.SUPER_ADMIN)
      throw new ForbiddenException({ code: AdminPasswordErrorCode.FORBIDDEN });
    const admin = await this.prismaService.user.findUnique({
      where: { id: args.adminUserId },
      select: {
        id: true,
        role: true,
        status: true,
        email: true,
        username: true,
        schoolId: true,
        school: { select: { name: true } },
      },
    });
    if (!admin)
      throw new NotFoundException({
        code: AdminPasswordErrorCode.ADMIN_NOT_FOUND,
      });
    if (admin.role !== Role.SCHOOL_ADMIN)
      throw new BadRequestException({
        code: AdminPasswordErrorCode.TARGET_NOT_ADMIN,
      });
    if (admin.status !== UserStatus.ACTIVE)
      throw new ForbiddenException({ code: AdminPasswordErrorCode.FORBIDDEN });
    if (!admin.email)
      throw new BadRequestException({
        code: AdminPasswordErrorCode.NOTIFICATION_FAILED,
        message: "Admin email is missing",
      });
    const tempPassword = this.generatePassword(12);
    const passwordHash = await argon2.hash(tempPassword);
    await this.prismaService.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: admin.id },
        data: {
          passwordHash,
          forcePasswordChange: true,
        },
      });
      await tx.authSession.updateMany({
        where: { userId: admin.id, status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: new Date() },
      });
    });
    let notificationError: string | undefined;
    try {
      const result = await this.notifService.notifyByTemplate({
        template: NotificationTemplate.ADMIN_CREDENTIALS,
        channel: NotificationChannel.EMAIL,
        destination: admin.email,
        username: admin.username ?? "(no-username)",
        password: tempPassword,
        schoolName: admin.school?.name ?? "School",
      });
      if (result.message !== "SENT") {
        notificationError =
          `${result.errorCode ?? "FAILED"}: ${result.errorMessage ?? ""}`.trim();
      }
    } catch (e: any) {
      notificationError =
        e?.message ?? AdminPasswordErrorCode.NOTIFICATION_FAILED;
    }

    try {
      await this.auditService.record({
        action:
          (AuditAction as any).ADMIN_PASSWORD_RESET ?? AuditAction.AUTH_REFRESH,
        actorId: args.actor.id,
        schoolId: admin.schoolId ?? null,
        entityType: "User",
        entityId: admin.id,
        metadata: { kind: "admin_password_reset" },
      });
    } catch {}
    return {
      message: AdminPasswordMessage.RESET,
      adminUserId: admin.id,
      tempPassword: process.env.NODE_ENV === "production" ? null : tempPassword,
      notificationError,
    };
  }

  private assertStrongPassword(pw: string) {
    if (!pw || pw.length < 8)
      throw new BadRequestException({
        code: AdminPasswordErrorCode.WEAK_PASSWORD,
      });
  }

  private generatePassword(len: number) {
    return randomBytes(Math.ceil(len / 2))
      .toString("hex")
      .slice(0, len);
  }
}
