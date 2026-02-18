import { MembershipStatus, SchoolRole } from "@prisma/client";
import { AssignSchoolAdminInput } from "@superAdmin/dtos/assign-school.input";
import { RemoveSchoolAdminInput } from "@superAdmin/dtos/remove-school.input";
import { ListSchoolAdminsInput } from "@superAdmin/dtos/list-school.input";
import { isEmail, isPhone } from "@utils/function-helper";
import { PrismaService } from "@prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { AdminCodes } from "@superAdmin/enums/admin-codes.enum";
import { AppError } from "@ctypes/app-error";

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  private normalizeIdentifier(identifier: string) {
    const v = identifier.trim();
    if (isEmail(v))
      return { email: v.toLowerCase(), phone: null as string | null };
    const p = v.replace(/\s/g, "");
    if (isPhone(p)) return { email: null as string | null, phone: p };
    throw new AppError(AdminCodes.IDENTIFIER_INVALID as any);
  }

  private async requireSchoolExists(schoolId: string) {
    const school = await this.prismaService.school.findUnique({
      where: { id: schoolId },
    });
    if (!school) throw new AppError(AdminCodes.SCHOOL_NOT_FOUND as any);
    return school;
  }

  async assignSchoolAdmin(
    superAdminUserId: string,
    input: AssignSchoolAdminInput,
  ) {
    const school = await this.requireSchoolExists(input.schoolId);
    const norm = this.normalizeIdentifier(input.identifier);
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
      const membership = await tx.userSchoolMembership.upsert({
        where: {
          userId_schoolId_role: {
            userId: user.id,
            schoolId: input.schoolId,
            role: SchoolRole.SCHOOL_ADMIN,
          },
        },
        update: {
          status: MembershipStatus.APPROVED,
          reviewedById: superAdminUserId,
          reviewedAt: new Date(),
          firstName: input.firstName ?? undefined,
          lastName: input.lastName ?? undefined,
        },
        create: {
          userId: user.id,
          schoolId: input.schoolId,
          role: SchoolRole.SCHOOL_ADMIN,
          status: MembershipStatus.APPROVED,
          reviewedById: superAdminUserId,
          reviewedAt: new Date(),
          firstName: input.firstName ?? undefined,
          lastName: input.lastName ?? undefined,
        },
        include: { user: true },
      });

      return {
        membership,
        user,
      };
    });
  }

  async removeSchoolAdmin(
    superAdminUserId: string,
    input: RemoveSchoolAdminInput,
  ) {
    const membership = await this.prismaService.userSchoolMembership.findUnique(
      {
        where: { id: input.membershipId },
        include: { user: true, school: true },
      },
    );
    if (!membership) throw new AppError(AdminCodes.MEMBERSHIP_NOT_FOUND as any);
    if (membership.role !== SchoolRole.SCHOOL_ADMIN)
      throw new AppError(AdminCodes.MEMBERSHIP_NOT_FOUND as any);
    const updated = await this.prismaService.userSchoolMembership.update({
      where: { id: membership.id },
      data: {
        status: MembershipStatus.SUSPENDED,
        reviewedById: superAdminUserId,
        reviewedAt: new Date(),
      },
      include: { user: true },
    });
    return updated;
  }

  async listSchoolAdmins(input: ListSchoolAdminsInput) {
    await this.requireSchoolExists(input.schoolId);
    const take = input.take ?? 20;
    const skip = input.skip ?? 0;
    const where = {
      schoolId: input.schoolId,
      role: SchoolRole.SCHOOL_ADMIN,
    };

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
