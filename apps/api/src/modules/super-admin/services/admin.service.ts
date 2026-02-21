import { MembershipStatus, SchoolRole, GlobalRole } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { AdminCodes } from "@superAdmin/enums/admin-codes.enum";
import { Injectable } from "@nestjs/common";
import { AppError } from "@ctypes/app-error";

import * as T from "@superAdmin/types/admin-service";
import * as H from "@utils/super-admin-helper";

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async requireSchoolActive(input: T.TRequireSchoolActiveInput) {
    const school = await this.prismaService.school.findUnique({
      where: { id: input.schoolId },
      select: { id: true, isActive: true },
    });
    if (!school) throw new AppError(AdminCodes.SCHOOL_NOT_FOUND as any);
    if (!school.isActive) throw new AppError(AdminCodes.SCHOOL_INACTIVE as any);
    return school;
  }

  async assignSchoolAdmin(params: T.TAssignSchoolAdminParams) {
    const superAdminUserId = H.requireSuperAdminId({
      superAdminUserId: params.superAdminUserId,
    });
    await this.requireSchoolActive({ schoolId: params.input.schoolId });
    const norm = H.normalizeAssignInput({
      identifier: params.input.identifier,
    });
    return this.prismaService.$transaction(async (tx) => {
      let user = await tx.user.findFirst({
        where: {
          OR: [
            ...(norm.emailNormalized
              ? [{ emailNormalized: norm.emailNormalized }]
              : []),
            ...(norm.phoneNormalized
              ? [{ phoneNormalized: norm.phoneNormalized }]
              : []),
          ],
        },
        select: {
          id: true,
          email: true,
          phone: true,
          isActive: true,
          globalRole: true,
        },
      });
      if (!user) {
        user = await tx.user.create({
          data: {
            email: norm.email ?? undefined,
            phone: norm.phone ?? undefined,
            emailNormalized: norm.emailNormalized ?? undefined,
            phoneNormalized: norm.phoneNormalized ?? undefined,
            isActive: true,
            globalRole: GlobalRole.USER,
          },
          select: {
            id: true,
            email: true,
            phone: true,
            isActive: true,
            globalRole: true,
          },
        });
      } else {
        H.ensureUserAssignable({
          isActive: user.isActive,
          globalRole: user.globalRole,
        });
      }

      const existing = await tx.userSchoolMembership.findUnique({
        where: H.membershipUniqueWhere(user.id, params.input.schoolId),
        select: { approvedRole: true, status: true },
      });
      H.ensureNoNonAdminRoleConflict(existing ?? undefined);
      const membership = await tx.userSchoolMembership.upsert({
        where: H.membershipUniqueWhere(user.id, params.input.schoolId),
        update: {
          requestedRole: SchoolRole.SCHOOL_ADMIN,
          approvedRole: SchoolRole.SCHOOL_ADMIN,
          status: MembershipStatus.APPROVED,
          reviewedById: superAdminUserId,
          reviewedAt: new Date(),
          reviewNote: null,
          firstName: params.input.firstName ?? undefined,
          lastName: params.input.lastName ?? undefined,
        },
        create: {
          userId: user.id,
          schoolId: params.input.schoolId,
          requestedRole: SchoolRole.SCHOOL_ADMIN,
          approvedRole: SchoolRole.SCHOOL_ADMIN,
          status: MembershipStatus.APPROVED,
          reviewedById: superAdminUserId,
          reviewedAt: new Date(),
          reviewNote: null,
          firstName: params.input.firstName ?? undefined,
          lastName: params.input.lastName ?? undefined,
        },
        include: { user: true },
      });
      return membership;
    });
  }

  async removeSchoolAdmin(params: T.TRemoveSchoolAdminParams) {
    const superAdminUserId = H.requireSuperAdminId({
      superAdminUserId: params.superAdminUserId,
    });
    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: params.input.membershipId },
        include: { user: true, school: true },
      },
    );
    if (!membership) throw new AppError(AdminCodes.MEMBERSHIP_NOT_FOUND as any);
    if (membership.approvedRole !== SchoolRole.SCHOOL_ADMIN)
      throw new AppError(AdminCodes.MEMBERSHIP_NOT_FOUND as any);
    const updated = await this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.SUSPENDED,
        reviewedById: superAdminUserId,
        reviewedAt: new Date(),
        reviewNote: "SUSPENDED_BY_SUPER_ADMIN",
      },
      include: { user: true },
    });
    return updated;
  }

  async listSchoolAdmins(params: T.TListSchoolAdminsParams) {
    await this.requireSchoolActive({ schoolId: params.input.schoolId });
    const take = params.input.take ?? 20;
    const skip = params.input.skip ?? 0;
    const where = H.buildListAdminsWhere(
      params.input.schoolId,
      params.input.status,
    );
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
    return { items, total };
  }
}
