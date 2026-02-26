import { TRemoveSchoolMemberArgs, TUpdateMeArgs } from "@user/types/user.types";
import { NotFoundException, BadRequestException } from "@nestjs/common";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { TListSchoolMembersArgs } from "@user/types/user.types";
import { Role, UserStatus } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { UserErrorCode } from "@user/enums/user-error-code.enum";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

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
        fullName: args.fullName ?? undefined,
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
        { fullName: { contains: q, mode: "insensitive" } },
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
      select: { id: true, schoolId: true, role: true, status: true },
    });
    if (!target)
      throw new NotFoundException({ code: UserErrorCode.USER_NOT_FOUND });
    if (target.schoolId !== args.actor.schoolId)
      throw new ForbiddenException({ code: UserErrorCode.CROSS_TENANT_ACCESS });
    if (target.role === Role.SUPER_ADMIN)
      throw new ForbiddenException({ code: UserErrorCode.FORBIDDEN });
    if (args.hardDelete) {
      await this.prismaService.user.delete({ where: { id: target.id } });
      return { id: target.id };
    }
    await this.prismaService.user.update({
      where: { id: target.id },
      data: { status: UserStatus.DISABLED, deletedAt: new Date() },
    });
    await this.prismaService.authSession.updateMany({
      where: { userId: target.id, status: "ACTIVE" },
      data: { status: "REVOKED", revokedAt: new Date() },
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
      fullName: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
