import { MembershipStatus, SchoolRole } from "@prisma/client";
import { ListMembershipRequestsInput } from "@schoolAdmin/dtos/list-requests.input";
import { ReviewMembershipInput } from "@schoolAdmin/dtos/review-membership.input";
import { SchoolAdminMessages } from "@schoolAdmin/enums/school-admin-message.enum";
import { SchoolAdminCodes } from "@schoolAdmin/enums/school-admin-codes.enum";
import { PrismaService } from "@prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AppError } from "@ctypes/app-error";

@Injectable()
export class SchoolAdminService {
  constructor(private prismaService: PrismaService) {}
  private async requireActiveSchool(schoolId: string) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
      select: { id: true, isActive: true },
    });
    if (!school) throw new AppError(SchoolAdminCodes.SCHOOL_NOT_FOUND as any);
    if (!school.isActive)
      throw new AppError(SchoolAdminCodes.SCHOOL_INACTIVE as any);
    return school;
  }

  private toDateOrNull(v?: string) {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  async listMembershipRequests(
    adminUserId: string,
    adminSchoolId: string,
    input: ListMembershipRequestsInput,
  ) {
    if (!adminUserId)
      throw new AppError(
        SchoolAdminCodes.UNAUTHORIZED as any,
        "UNAUTHORIZED",
        401,
      );
    if (adminSchoolId !== input.schoolId)
      throw new AppError(SchoolAdminCodes.FORBIDDEN as any);
    await this.requireActiveSchool(input.schoolId);
    const take = input.take ?? 20;
    const skip = input.skip ?? 0;
    const where: any = { schoolId: input.schoolId };
    if (input.status) where.status = input.status;
    if (input.requestedRole) where.requestedRole = input.requestedRole;
    if (input.role) where.role = input.role;
    const from = this.toDateOrNull(input.from);
    const to = this.toDateOrNull(input.to);
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = from;
      if (to) where.createdAt.lte = to;
    }

    if (input.q?.trim()) {
      const q = input.q.trim();
      where.OR = [
        { firstName: { contains: q, mode: "insensitive" } },
        { lastName: { contains: q, mode: "insensitive" } },
        { nationalId: { contains: q, mode: "insensitive" } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { phone: { contains: q, mode: "insensitive" } } },
      ];
    }

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
        requestedRole: (m as any).requestedRole ?? m.role,
        role: m.role,
        status: m.status,
        userId: m.userId,
        email: m.user.email ?? undefined,
        phone: m.user.phone ?? undefined,
        firstName: m.firstName ?? undefined,
        lastName: m.lastName ?? undefined,
        nationalId: m.nationalId ?? undefined,
        grade: m.grade ?? undefined,
        reviewedById: m.reviewedById ?? undefined,
        reviewedAt: m.reviewedAt ?? undefined,
        reviewNote: (m as any).reviewNote ?? undefined,
        createdAt: m.createdAt,
      })),
    };
  }

  async reviewMembership(
    adminUserId: string,
    adminSchoolId: string,
    input: ReviewMembershipInput,
  ) {
    if (!adminUserId)
      throw new AppError(
        SchoolAdminCodes.UNAUTHORIZED as any,
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
      throw new AppError(SchoolAdminCodes.MEMBERSHIP_NOT_FOUND as any);
    if (membership.schoolId !== adminSchoolId)
      throw new AppError(SchoolAdminCodes.FORBIDDEN as any);
    if (!membership.school.isActive)
      throw new AppError(SchoolAdminCodes.SCHOOL_INACTIVE as any);
    if (membership.status !== MembershipStatus.PENDING)
      throw new AppError(SchoolAdminCodes.ONLY_PENDING_CAN_BE_REVIEWED as any);
    const nextStatus =
      input.action === "APPROVE"
        ? MembershipStatus.APPROVED
        : MembershipStatus.REJECTED;

    let nextRole = membership.role;
    if (input.action === "APPROVE") {
      const requestedRole =
        (membership as any).requestedRole ?? membership.role;
      nextRole = input.finalRole ?? requestedRole;
      if (nextRole === SchoolRole.SCHOOL_ADMIN) {
        throw new AppError(
          SchoolAdminCodes.FORBIDDEN as any,
          "CANNOT_ASSIGN_ADMIN_ROLE",
          403,
        );
      }
    }

    const updated = await this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: nextStatus,
        role: nextRole,
        reviewedById: adminUserId,
        reviewedAt: new Date(),
        reviewNote: input.reason ?? undefined,
      },
      include: { user: true },
    });

    return {
      message:
        input.action === "APPROVE"
          ? SchoolAdminMessages.APPROVED
          : SchoolAdminMessages.REJECTED,
      membership: {
        id: updated.id,
        schoolId: updated.schoolId,
        requestedRole: (updated as any).requestedRole ?? updated.role,
        role: updated.role,
        status: updated.status,
        userId: updated.userId,
        email: updated.user.email ?? undefined,
        phone: updated.user.phone ?? undefined,
        firstName: updated.firstName ?? undefined,
        lastName: updated.lastName ?? undefined,
        nationalId: updated.nationalId ?? undefined,
        grade: updated.grade ?? undefined,
        reviewedById: updated.reviewedById ?? undefined,
        reviewedAt: updated.reviewedAt ?? undefined,
        reviewNote: (updated as any).reviewNote ?? undefined,
        createdAt: updated.createdAt,
      },
    };
  }
}
