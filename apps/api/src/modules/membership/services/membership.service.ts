import { MembershipStatus, SchoolRole } from "@prisma/client";
import { MembershipCodes } from "@membership/enums/membership-codes.enum";
import { PrismaService } from "@prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AppError } from "@ctypes/app-error";

import * as T from "@membership/types/membership-service";
import * as H from "@utils/membership-helper";

@Injectable()
export class MembershipService {
  constructor(private prismaService: PrismaService) {}

  // ========= extracted helpers orchestration =======
  async requireSchoolActive(input: T.TRequireSchoolActiveInput) {
    const school = await this.prismaService.school.findUnique({
      where: { id: input.schoolId },
      select: { id: true, isActive: true },
    });
    if (!school) throw new AppError(MembershipCodes.SCHOOL_NOT_FOUND as any);
    if (!school.isActive)
      throw new AppError(MembershipCodes.SCHOOL_INACTIVE as any);
    return school;
  }

  async requireSchoolAdminForSchool(
    input: T.TRequireSchoolAdminForSchoolInput,
  ) {
    H.requireAuthUserId(input.adminUserId);
    const adminMembership =
      await this.prismaService.userSchoolMembership.findFirst({
        where: {
          userId: input.adminUserId,
          schoolId: input.schoolId,
          status: MembershipStatus.APPROVED,
          approvedRole: SchoolRole.SCHOOL_ADMIN,
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

  // ================== public service methods ==================
  async registerRequest(params: T.TRegisterRequestInput) {
    const input = params.input;
    await this.requireSchoolActive({ schoolId: input.schoolId });
    H.ensureRoleAllowedForRegister(input.role);
    const contact = H.normalizeSignupContacts(input.email, input.phone);
    const profile = input.profile ?? {};
    return this.prismaService.$transaction(async (tx) => {
      const userByEmail = await tx.user.findUnique({
        where: { emailNormalized: contact.emailNormalized },
        select: {
          id: true,
          isActive: true,
          emailNormalized: true,
          phoneNormalized: true,
        },
      });
      const userByPhone = await tx.user.findUnique({
        where: { phoneNormalized: contact.phoneNormalized },
        select: {
          id: true,
          isActive: true,
          emailNormalized: true,
          phoneNormalized: true,
        },
      });
      if (userByEmail && userByPhone && userByEmail.id !== userByPhone.id) {
        throw H.contactConflictError({
          emailNormalized: contact.emailNormalized,
          phoneNormalized: contact.phoneNormalized,
        });
      }
      let user = userByEmail ?? userByPhone;
      if (!user) {
        user = await tx.user.create({
          data: {
            email: contact.email,
            phone: contact.phone,
            emailNormalized: contact.emailNormalized,
            phoneNormalized: contact.phoneNormalized,
            isActive: true,
          },
          select: {
            id: true,
            isActive: true,
            emailNormalized: true,
            phoneNormalized: true,
          },
        });
      } else {
        if (!user.isActive) {
          throw new AppError(
            MembershipCodes.UNAUTHORIZED as any,
            "USER_INACTIVE",
            403,
          );
        }
        if (
          user.emailNormalized &&
          user.emailNormalized !== contact.emailNormalized
        ) {
          throw H.contactConflictError({ reason: "EMAIL_MISMATCH" });
        }
        if (
          user.phoneNormalized &&
          user.phoneNormalized !== contact.phoneNormalized
        ) {
          throw H.contactConflictError({ reason: "PHONE_MISMATCH" });
        }
        if (!user.emailNormalized || !user.phoneNormalized) {
          user = await tx.user.update({
            where: { id: user.id },
            data: {
              email: contact.email,
              phone: contact.phone,
              emailNormalized: contact.emailNormalized,
              phoneNormalized: contact.phoneNormalized,
            },
            select: {
              id: true,
              isActive: true,
              emailNormalized: true,
              phoneNormalized: true,
            },
          });
        }
      }
      const existing = await tx.userSchoolMembership.findUnique({
        where: H.buildMembershipUniqueWhere(user.id, input.schoolId),
        include: { user: true },
      });
      if (existing) {
        if (
          existing.status === MembershipStatus.PENDING ||
          existing.status === MembershipStatus.APPROVED
        ) {
          throw H.membershipExistsError(existing.status);
        }
        if (existing.status === MembershipStatus.SUSPENDED) {
          throw H.membershipSuspendedError(existing.status);
        }
        const updated = await tx.userSchoolMembership.update({
          where: { id: existing.id },
          data: {
            status: MembershipStatus.PENDING,
            requestedRole: input.role,
            approvedRole: null,
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
          approvedRole: null,
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

  async me(params: T.TMeInput) {
    const userId = H.requireAuthUserId(params.userId);
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
    if (!user) {
      throw new AppError(
        MembershipCodes.UNAUTHORIZED as any,
        "UNAUTHORIZED",
        401,
      );
    }
    return user;
  }

  async myMemberships(params: T.TMyMembershipsInput) {
    const userId = H.requireAuthUserId(params.userId);
    await this.requireSchoolActive({ schoolId: params.schoolId });
    return this.prismaService.userSchoolMembership.findMany({
      where: { userId, schoolId: params.schoolId },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });
  }

  async listPendingRequests(params: T.TListPendingRequestsInput) {
    await this.requireSchoolActive({ schoolId: params.input.schoolId });
    await this.requireSchoolAdminForSchool({
      adminUserId: params.adminUserId,
      schoolId: params.input.schoolId,
    });
    const take = params.input.take ?? 20;
    const skip = params.input.skip ?? 0;
    const where = {
      schoolId: params.input.schoolId,
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

  async approveMembership(params: T.TApproveMembershipInput) {
    const adminUserId = H.requireAuthUserId(params.adminUserId);
    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: params.input.membershipId },
        include: { user: true, school: true },
      },
    );
    if (!membership)
      throw new AppError(MembershipCodes.MEMBERSHIP_NOT_FOUND as any);
    if (!membership.school.isActive)
      throw new AppError(MembershipCodes.SCHOOL_INACTIVE as any);
    await this.requireSchoolAdminForSchool({
      adminUserId,
      schoolId: membership.schoolId,
    });
    H.ensurePendingStatus(membership.status);
    const finalRole = params.input.finalRole ?? membership.requestedRole;
    H.ensureFinalRoleValid(finalRole);
    return this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.APPROVED,
        approvedRole: finalRole,
        reviewedById: adminUserId,
        reviewedAt: new Date(),
        reviewNote: null,
      },
      include: { user: true },
    });
  }

  async rejectMembership(params: T.TRejectMembershipInput) {
    const adminUserId = H.requireAuthUserId(params.adminUserId);
    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: params.input.membershipId },
        include: { user: true, school: true },
      },
    );
    if (!membership)
      throw new AppError(MembershipCodes.MEMBERSHIP_NOT_FOUND as any);
    if (!membership.school.isActive)
      throw new AppError(MembershipCodes.SCHOOL_INACTIVE as any);
    await this.requireSchoolAdminForSchool({
      adminUserId,
      schoolId: membership.schoolId,
    });
    H.ensurePendingStatus(membership.status);
    return this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.REJECTED,
        approvedRole: null,
        reviewedById: adminUserId,
        reviewedAt: new Date(),
        reviewNote: params.input.reason ?? undefined,
      },
      include: { user: true },
    });
  }
}
