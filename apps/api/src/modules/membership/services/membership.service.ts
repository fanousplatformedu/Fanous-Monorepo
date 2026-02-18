import { SchoolRole, MembershipStatus } from "@prisma/client";
import { ListPendingRequestsInput } from "@membership/dtos/list-pending.input";
import { ApproveMembershipInput } from "@membership/dtos/approve-membership.input";
import { RejectMembershipInput } from "@membership/dtos/reject-membership.input";
import { RegisterRequestInput } from "@membership/dtos/register-request.input";
import { isEmail, isPhone } from "@utils/function-helper";
import { MembershipCodes } from "@membership/enums/membership-codes.enum";
import { PrismaService } from "@prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AppError } from "@common/types/app-error";

@Injectable()
export class MembershipService {
  constructor(private prismaService: PrismaService) {}

  private async requireSchoolActive(schoolId: string) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
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
      });
      if (!user) {
        user = await tx.user.create({
          data: {
            email: norm.email ?? undefined,
            phone: norm.phone ?? undefined,
            isActive: true,
          },
        });
      }

      const exists = await tx.userSchoolMembership.findFirst({
        where: {
          userId: user.id,
          schoolId: input.schoolId,
          role: input.role,
        },
      });

      if (exists) {
        throw new AppError(
          MembershipCodes.MEMBERSHIP_EXISTS as any,
          MembershipCodes.MEMBERSHIP_EXISTS,
          400,
          {
            status: exists.status,
          },
        );
      }

      const membership = await tx.userSchoolMembership.create({
        data: {
          userId: user.id,
          schoolId: input.schoolId,
          role: input.role,
          status: MembershipStatus.PENDING,
          firstName: profile.firstName,
          lastName: profile.lastName,
          nationalId: profile.nationalId,
          grade: profile.grade,
        },
        include: {
          user: true,
        },
      });
      return membership;
    });
  }

  async me(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new AppError(MembershipCodes.UNAUTHORIZED as any);
    return user;
  }

  async myMemberships(userId: string, schoolId: string) {
    await this.requireSchoolActive(schoolId);
    return this.prismaService.userSchoolMembership.findMany({
      where: { userId, schoolId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  }

  async listPendingRequests(input: ListPendingRequestsInput) {
    await this.requireSchoolActive(input.schoolId);
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
    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: input.membershipId },
        include: { user: true, school: true },
      },
    );
    if (!membership)
      throw new AppError(MembershipCodes.MEMBERSHIP_NOT_FOUND as any);
    if (membership.status !== MembershipStatus.PENDING)
      throw new AppError(MembershipCodes.ONLY_PENDING_CAN_BE_REVIEWED as any);
    if (!membership.school.isActive)
      throw new AppError(MembershipCodes.SCHOOL_INACTIVE as any);
    return this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.APPROVED,
        reviewedById: adminUserId,
        reviewedAt: new Date(),
      },
      include: { user: true },
    });
  }

  async rejectMembership(adminUserId: string, input: RejectMembershipInput) {
    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: input.membershipId },
        include: { user: true, school: true },
      },
    );
    if (!membership)
      throw new AppError(MembershipCodes.MEMBERSHIP_NOT_FOUND as any);
    if (membership.status !== MembershipStatus.PENDING)
      throw new AppError(MembershipCodes.ONLY_PENDING_CAN_BE_REVIEWED as any);
    if (!membership.school.isActive)
      throw new AppError(MembershipCodes.SCHOOL_INACTIVE as any);

    return this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.REJECTED,
        reviewedById: adminUserId,
        reviewedAt: new Date(),
      },
      include: { user: true },
    });
  }
}
