import { MembershipStatus, Prisma, SchoolRole } from "@prisma/client";
import { SchoolAdminMessages } from "@schoolAdmin/enums/school-admin-message.enum";
import { SchoolAdminCodes } from "@schoolAdmin/enums/school-admin-codes.enum";
import { PrismaService } from "@prisma/prisma.service";
import { ReviewAction } from "@enums/reviewAction-register";
import { Injectable } from "@nestjs/common";
import { AppError } from "@ctypes/app-error";

import * as H from "@utils/school-admin-helper";
import * as T from "@schoolAdmin/types/school-admin.types";

@Injectable()
export class SchoolAdminService {
  constructor(private prismaService: PrismaService) {}

  async requireActiveSchool(input: T.TRequireActiveSchoolInput) {
    const school = await this.prismaService.school.findUnique({
      where: { id: input.schoolId },
      select: { id: true, isActive: true },
    });
    if (!school) throw new AppError(SchoolAdminCodes.SCHOOL_NOT_FOUND);
    if (!school.isActive) throw new AppError(SchoolAdminCodes.SCHOOL_INACTIVE);
    return school;
  }

  async listMembershipRequests(
    params: T.TListMembershipRequestsParams,
  ): Promise<T.TMembershipRequestsPage> {
    H.requireAdminContext({
      adminUserId: params.adminUserId,
      adminSchoolId: params.adminSchoolId,
    });
    await this.requireActiveSchool({ schoolId: params.adminSchoolId });
    const take = params.input.take ?? 20;
    const skip = params.input.skip ?? 0;
    const where: Prisma.UserSchoolMembershipWhereInput = {
      schoolId: params.adminSchoolId,
    };
    if (params.input.status) where.status = params.input.status;
    if (params.input.requestedRole)
      where.requestedRole = params.input.requestedRole;
    if (params.input.approvedRole)
      where.approvedRole = params.input.approvedRole;
    const { from, to } = H.parseDateRange({
      from: params.input.from,
      to: params.input.to,
    });
    if (from || to) {
      where.createdAt = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {}),
      };
    }

    const OR = H.buildSearchOr(params.input.q);
    if (OR) where.OR = OR;
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.userSchoolMembership.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      this.prismaService.userSchoolMembership.count({ where }),
    ]);

    return {
      total,
      items: items.map((m) => ({
        id: m.id,
        schoolId: m.schoolId,
        userId: m.userId,
        createdAt: m.createdAt,
        status: m.status,
        requestedRole: m.requestedRole,
        approvedRole: m.approvedRole ?? undefined,
        email: m.user.email ?? undefined,
        phone: m.user.phone ?? undefined,
        firstName: m.firstName ?? undefined,
        lastName: m.lastName ?? undefined,
        nationalId: m.nationalId ?? undefined,
        grade: m.grade ?? undefined,
        reviewedById: m.reviewedById ?? undefined,
        reviewedAt: m.reviewedAt ?? undefined,
        reviewNote: m.reviewNote ?? undefined,
      })),
    };
  }

  async reviewMembership(
    params: T.TReviewMembershipParams,
  ): Promise<T.TReviewResult> {
    H.requireAdminContext({
      adminUserId: params.adminUserId,
      adminSchoolId: params.adminSchoolId,
    });
    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: params.input.membershipId },
        include: { user: true, school: true },
      },
    );
    if (!membership) throw new AppError(SchoolAdminCodes.MEMBERSHIP_NOT_FOUND);
    H.ensureSchoolMatches(params.adminSchoolId, membership.schoolId);
    if (!membership.school.isActive)
      throw new AppError(SchoolAdminCodes.SCHOOL_INACTIVE);
    H.ensurePending(membership.status);
    const nextStatus =
      params.input.action === ReviewAction.APPROVE
        ? MembershipStatus.APPROVED
        : MembershipStatus.REJECTED;
    let nextApprovedRole: SchoolRole | null = null;
    if (params.input.action === ReviewAction.APPROVE) {
      const finalRole = params.input.finalRole ?? membership.requestedRole;
      H.ensureRoleNotAdmin(finalRole);
      nextApprovedRole = finalRole;
    } else {
      nextApprovedRole = null;
    }
    const updated = await this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: nextStatus,
        approvedRole: nextApprovedRole,
        reviewedById: params.adminUserId,
        reviewedAt: new Date(),
        reviewNote: params.input.reason ?? undefined,
      },
      include: { user: true },
    });
    return {
      message:
        params.input.action === ReviewAction.APPROVE
          ? SchoolAdminMessages.APPROVED
          : SchoolAdminMessages.REJECTED,
      membership: {
        id: updated.id,
        schoolId: updated.schoolId,
        userId: updated.userId,
        createdAt: updated.createdAt,
        status: updated.status,
        requestedRole: updated.requestedRole,
        approvedRole: updated.approvedRole ?? undefined,
        email: updated.user.email ?? undefined,
        phone: updated.user.phone ?? undefined,
        firstName: updated.firstName ?? undefined,
        lastName: updated.lastName ?? undefined,
        nationalId: updated.nationalId ?? undefined,
        grade: updated.grade ?? undefined,
        reviewedById: updated.reviewedById ?? undefined,
        reviewedAt: updated.reviewedAt ?? undefined,
        reviewNote: updated.reviewNote ?? undefined,
      },
    };
  }
}
