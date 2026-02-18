import { MembershipStatus, SchoolRole } from "@prisma/client";
import { ListPendingRequestsInput } from "@membership/dtos/list-pending.input";
import { ApproveMembershipInput } from "@membership/dtos/approve-membership.input";
import { RejectMembershipInput } from "@membership/dtos/reject-membership.input";
import { RegisterRequestInput } from "@membership/dtos/register-request.input";
import { isEmail, isPhone } from "@utils/function-helper";
import { MembershipCodes } from "@membership/enums/membership-codes.enum";
import { PrismaService } from "@prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AppError } from "@ctypes/app-error";

@Injectable()
export class MembershipService {
  constructor(private prismaService: PrismaService) {}

  private async requireSchoolActive(schoolId: string) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
      select: { id: true, isActive: true },
    });
    if (!school) throw new AppError(MembershipCodes.SCHOOL_NOT_FOUND as any);
    if (!school.isActive)
      throw new AppError(MembershipCodes.SCHOOL_INACTIVE as any);
    return school;
  }

  private normalizeIdentifier(identifier: string) {
    const v = identifier.trim();
    if (isEmail(v))
      return { email: v.toLowerCase(), phone: null as string | null };
    const p = v.replace(/\s/g, "");
    if (isPhone(p)) return { email: null as string | null, phone: p };
    throw new AppError(MembershipCodes.IDENTIFIER_INVALID as any);
  }

  private ensureRoleAllowedForRegister(role: SchoolRole) {
    if (role === SchoolRole.SCHOOL_ADMIN)
      throw new AppError(MembershipCodes.ROLE_INVALID as any);
  }

  private async requireSchoolAdminForSchool(
    adminUserId: string,
    schoolId: string,
  ) {
    if (!adminUserId)
      throw new AppError(
        MembershipCodes.UNAUTHORIZED as any,
        "UNAUTHORIZED",
        401,
      );

    const adminMembership =
      await this.prismaService.userSchoolMembership.findFirst({
        where: {
          userId: adminUserId,
          schoolId,
          status: MembershipStatus.APPROVED,
          role: SchoolRole.SCHOOL_ADMIN,
        },
        select: { id: true },
      });

    if (!adminMembership) {
      throw new AppError(
        MembershipCodes.ONLY_ADMIN_CAN_REVIEW as any,
        "ONLY_ADMIN_CAN_REVIEW",
        403,
      );
    }
    return true;
  }

  async registerRequest(input: RegisterRequestInput) {
    await this.requireSchoolActive(input.schoolId);
    this.ensureRoleAllowedForRegister(input.role);
    const norm = this.normalizeIdentifier(input.identifier);
    const profile = input.profile ?? {};
    return this.prismaService.$transaction(async (tx) => {
      let user = await tx.user.findFirst({
        where: {
          OR: [
            ...(norm.email ? [{ email: norm.email }] : []),
            ...(norm.phone ? [{ phone: norm.phone }] : []),
          ],
        },
        select: { id: true },
      });

      if (!user) {
        user = await tx.user.create({
          data: {
            email: norm.email ?? undefined,
            phone: norm.phone ?? undefined,
            isActive: true,
          },
          select: { id: true },
        });
      }

      const existing = await tx.userSchoolMembership.findUnique({
        where: {
          userId_schoolId: { userId: user.id, schoolId: input.schoolId },
        },
        include: { user: true },
      });

      if (existing) {
        if (
          existing.status === MembershipStatus.PENDING ||
          existing.status === MembershipStatus.APPROVED
        ) {
          throw new AppError(
            MembershipCodes.MEMBERSHIP_EXISTS as any,
            MembershipCodes.MEMBERSHIP_EXISTS,
            400,
            { status: existing.status },
          );
        }

        if (existing.status === MembershipStatus.SUSPENDED) {
          throw new AppError(
            MembershipCodes.FORBIDDEN as any,
            "MEMBERSHIP_SUSPENDED",
            403,
            { status: existing.status },
          );
        }

        const updated = await tx.userSchoolMembership.update({
          where: { id: existing.id },
          data: {
            status: MembershipStatus.PENDING,
            requestedRole: input.role,
            role: input.role,
            reviewedById: null,
            reviewedAt: null,
            reviewNote: null,
            firstName: profile.firstName ?? undefined,
            lastName: profile.lastName ?? undefined,
            nationalId: profile.nationalId ?? undefined,
            grade: profile.grade ?? undefined,
          },
          include: { user: true },
        });

        return updated;
      }

      const membership = await tx.userSchoolMembership.create({
        data: {
          userId: user.id,
          schoolId: input.schoolId,
          requestedRole: input.role,
          role: input.role,
          status: MembershipStatus.PENDING,
          firstName: profile.firstName ?? undefined,
          lastName: profile.lastName ?? undefined,
          nationalId: profile.nationalId ?? undefined,
          grade: profile.grade ?? undefined,
        },
        include: { user: true },
      });

      return membership;
    });
  }

  async me(userId: string) {
    if (!userId)
      throw new AppError(
        MembershipCodes.UNAUTHORIZED as any,
        "UNAUTHORIZED",
        401,
      );

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isActive: true,
        email: true,
        phone: true,
        globalRole: true,
      },
    });

    if (!user)
      throw new AppError(
        MembershipCodes.UNAUTHORIZED as any,
        "UNAUTHORIZED",
        401,
      );
    return user;
  }

  async myMemberships(userId: string, schoolId: string) {
    if (!userId)
      throw new AppError(
        MembershipCodes.UNAUTHORIZED as any,
        "UNAUTHORIZED",
        401,
      );
    await this.requireSchoolActive(schoolId);
    return this.prismaService.userSchoolMembership.findMany({
      where: { userId, schoolId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  }

  async listPendingRequests(
    adminUserId: string,
    input: ListPendingRequestsInput,
  ) {
    await this.requireSchoolActive(input.schoolId);
    await this.requireSchoolAdminForSchool(adminUserId, input.schoolId);
    const take = input.take ?? 20;
    const skip = input.skip ?? 0;
    const where = {
      schoolId: input.schoolId,
      status: MembershipStatus.PENDING,
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.userSchoolMembership.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "asc" },
        include: { user: true },
      }),
      this.prismaService.userSchoolMembership.count({ where }),
    ]);
    return { items, total };
  }

  async approveMembership(adminUserId: string, input: ApproveMembershipInput) {
    if (!adminUserId)
      throw new AppError(
        MembershipCodes.UNAUTHORIZED as any,
        "UNAUTHORIZED",
        401,
      );
    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: input.membershipId },
        include: { user: true, school: true },
      },
    );
    if (!membership)
      throw new AppError(MembershipCodes.MEMBERSHIP_NOT_FOUND as any);
    if (!membership.school.isActive)
      throw new AppError(MembershipCodes.SCHOOL_INACTIVE as any);
    await this.requireSchoolAdminForSchool(adminUserId, membership.schoolId);
    if (membership.status !== MembershipStatus.PENDING)
      throw new AppError(MembershipCodes.ONLY_PENDING_CAN_BE_REVIEWED as any);
    const finalRole = input.finalRole ?? membership.requestedRole;
    if (finalRole === SchoolRole.SCHOOL_ADMIN)
      throw new AppError(MembershipCodes.ROLE_INVALID as any);
    return this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.APPROVED,
        role: finalRole,
        reviewedById: adminUserId,
        reviewedAt: new Date(),
        reviewNote: null,
      },
      include: { user: true },
    });
  }

  async rejectMembership(adminUserId: string, input: RejectMembershipInput) {
    if (!adminUserId)
      throw new AppError(
        MembershipCodes.UNAUTHORIZED as any,
        "UNAUTHORIZED",
        401,
      );

    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: input.membershipId },
        include: { user: true, school: true },
      },
    );

    if (!membership)
      throw new AppError(MembershipCodes.MEMBERSHIP_NOT_FOUND as any);
    if (!membership.school.isActive)
      throw new AppError(MembershipCodes.SCHOOL_INACTIVE as any);

    await this.requireSchoolAdminForSchool(adminUserId, membership.schoolId);
    if (membership.status !== MembershipStatus.PENDING)
      throw new AppError(MembershipCodes.ONLY_PENDING_CAN_BE_REVIEWED as any);

    return this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.REJECTED,
        reviewedById: adminUserId,
        reviewedAt: new Date(),
        reviewNote: input.reason ?? undefined,
      },
      include: { user: true },
    });
  }
}
