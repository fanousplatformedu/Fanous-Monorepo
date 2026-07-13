import { TAddSchoolUserArgs, TEditSchoolUserArgs, TRemoveSchoolMemberArgs, TUpdateMeArgs } from "@user/types/user.types";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { TListSchoolMembersArgs } from "@user/types/user.types";
import { AuditAction, Role, UserStatus } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { UserErrorCode } from "@user/enums/user-error-code.enum";
import { AuditService } from "@audit/services/audit.service";
import { buildUserNameSearch } from "@common/utils/person-name.util";
import * as argon2 from "argon2";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async me(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: this.userSelect(),
    });
    if (!user)
      throw new NotFoundException({ code: UserErrorCode.USER_NOT_FOUND });
    return user;
  }

  async updateMe(args: TUpdateMeArgs) {
    const existing = await this.prismaService.user.findUnique({
      where: { id: args.userId },
      select: { id: true, role: true, schoolId: true },
    });
    if (!existing)
      throw new NotFoundException({ code: UserErrorCode.USER_NOT_FOUND });

    return this.prismaService.user.update({
      where: { id: args.userId },
      data: {
        firstName: args.firstName ?? undefined,
        lastName: args.lastName ?? undefined,
        avatarUrl: args.avatarUrl ?? undefined,
        email: args.email ? args.email.trim().toLowerCase() : undefined,
        mobile: args.mobile ? args.mobile.trim() : undefined,
      },
      select: this.userSelect(),
    });
  }

  async listSchoolMembers(args: TListSchoolMembersArgs) {
    if (args.actor.role !== Role.SCHOOL_ADMIN)
      throw new ForbiddenException({ code: UserErrorCode.FORBIDDEN });
    if (!args.actor.schoolId)
      throw new BadRequestException({ code: UserErrorCode.INVALID_OPERATION });
    const where: any = {
      schoolId: args.actor.schoolId,
      status: args.status ?? undefined,
      role: args.role ?? undefined,
    };
    if (args.query?.trim()) {
      const q = args.query.trim();
      where.OR = [
        ...buildUserNameSearch(q),
        { email: { contains: q, mode: "insensitive" } },
        { mobile: { contains: q, mode: "insensitive" } },
        { username: { contains: q, mode: "insensitive" } },
      ];
    }

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.user.findMany({
        where,
        select: this.userSelect(),
        orderBy: { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.user.count({ where }),
    ]);
    return { items, total, take: args.take, skip: args.skip };
  }

  async removeSchoolMember(args: TRemoveSchoolMemberArgs) {
    if (args.actor.role !== Role.SCHOOL_ADMIN)
      throw new ForbiddenException({ code: UserErrorCode.FORBIDDEN });
    if (!args.actor.schoolId)
      throw new BadRequestException({ code: UserErrorCode.INVALID_OPERATION });
    if (args.actor.id === args.targetUserId)
      throw new BadRequestException({ code: UserErrorCode.CANNOT_REMOVE_SELF });
    const target = await this.prismaService.user.findUnique({
      where: { id: args.targetUserId },
      select: {
        id: true,
        schoolId: true,
        role: true,
        status: true,
        email: true,
        mobile: true,
        firstName: true,
        lastName: true,
      },
    });
    if (!target)
      throw new NotFoundException({ code: UserErrorCode.USER_NOT_FOUND });
    if (target.schoolId !== args.actor.schoolId)
      throw new ForbiddenException({ code: UserErrorCode.CROSS_TENANT_ACCESS });
    if (target.role === Role.SUPER_ADMIN)
      throw new ForbiddenException({ code: UserErrorCode.FORBIDDEN });
    if (args.hardDelete) {
      await this.auditService.record({
        action: AuditAction.USER_DELETE,
        actorId: args.actor.id,
        schoolId: args.actor.schoolId,
        entityType: "User",
        entityId: target.id,
        metadata: {
          targetUserId: target.id,
          targetRole: target.role,
          previousStatus: target.status,
          hardDelete: true,
          email: target.email,
          mobile: target.mobile,
          firstName: target.firstName,
          lastName: target.lastName,
        },
      });
      await this.prismaService.user.delete({
        where: { id: target.id },
      });
      return { id: target.id };
    }

    await this.prismaService.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: target.id },
        data: {
          status: UserStatus.DISABLED,
          deletedAt: new Date(),
        },
      });
      await tx.authSession.updateMany({
        where: { userId: target.id, status: "ACTIVE" },
        data: { status: "REVOKED", revokedAt: new Date() },
      });
    });
    await this.auditService.record({
      action: AuditAction.USER_DISABLE,
      actorId: args.actor.id,
      schoolId: args.actor.schoolId,
      entityType: "User",
      entityId: target.id,
      metadata: {
        targetUserId: target.id,
        targetRole: target.role,
        previousStatus: target.status,
        newStatus: UserStatus.DISABLED,
        hardDelete: false,
        email: target.email,
        mobile: target.mobile,
        firstName: target.firstName,
        lastName: target.lastName,
      },
    });
    return { id: target.id };
  }

  private userSelect() {
    return {
      id: true,
      role: true,
      status: true,
      schoolId: true,
      username: true,
      email: true,
      mobile: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
      forcePasswordChange: true,
    };
  }

  

  async addSchoolUser(args: TAddSchoolUserArgs) {
    if (args.actor.role !== Role.SCHOOL_ADMIN)
      throw new ForbiddenException({ code: UserErrorCode.FORBIDDEN });
    if (!args.actor.schoolId)
      throw new BadRequestException({ code: UserErrorCode.INVALID_OPERATION });
    const passwordHash = await argon2.hash(args.password);
    const user = await this.prismaService.user.create({
      data: {
        email: args.email.trim().toLowerCase(),
        mobile: args.mobile.trim(),
        firstName: args.firstName,
        lastName: args.lastName,
        role: args.role,
        schoolId: args.actor.schoolId,
        passwordHash,
        forcePasswordChange: args.forcePasswordChange,
        isActive: args.isActive,
        username: args.username,
      },
    });
    return user;
  }

  async editSchoolUser(args: TEditSchoolUserArgs) {
    if (args.actor.role !== Role.SCHOOL_ADMIN)
      throw new ForbiddenException({ code: UserErrorCode.FORBIDDEN });
    if (!args.actor.schoolId)
      throw new BadRequestException({ code: UserErrorCode.INVALID_OPERATION });

    const target = await this.prismaService.user.findUnique({
      where: { id: args.targetUserId },
      select: { id: true, schoolId: true, role: true },
    });
    if (!target)
      throw new NotFoundException({ code: UserErrorCode.USER_NOT_FOUND });
    if (target.schoolId !== args.actor.schoolId)
      throw new ForbiddenException({ code: UserErrorCode.CROSS_TENANT_ACCESS });
    if (target.role === Role.SUPER_ADMIN)
      throw new ForbiddenException({ code: UserErrorCode.FORBIDDEN });

    const passwordHash = args.password ? await argon2.hash(args.password) : undefined;
    const user = await this.prismaService.user.update({
      where: { id: target.id },
      data: {
        email: args.email ? args.email.trim().toLowerCase() : undefined,
        mobile: args.mobile ? args.mobile.trim() : undefined,
        firstName: args.firstName ?? undefined,
        lastName: args.lastName ?? undefined,
        role: args.role ?? undefined,
        isActive: args.isActive ?? undefined,
        username: args.username ?? undefined,
        forcePasswordChange: args.forcePasswordChange ?? undefined,
        passwordHash,
      },
      select: this.userSelect(),
    });
    return user;
  }
}
