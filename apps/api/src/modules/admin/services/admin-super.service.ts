import { NotFoundException, Injectable } from "@nestjs/common";
import { AdminAssignSchoolAdminInput } from "@admin/dtos/assign-school-admin.input";
import { ForbiddenException } from "@nestjs/common";
import { AdminErrorEnum } from "@admin/enums/admin-error.enum";
import { PrismaService } from "@prisma/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class AdminSuperService {
  constructor(private prismaService: PrismaService) {}

  async assignSchoolAdmin(actorId: string, input: AdminAssignSchoolAdminInput) {
    const actor = await this.prismaService.user.findUnique({
      where: { id: actorId },
      select: { id: true, role: true, isActive: true },
    });
    if (!actor || !actor.isActive || actor.role !== Role.SUPER_ADMIN)
      throw new ForbiddenException(AdminErrorEnum.FORBIDDEN);
    const school = await this.prismaService.school.findUnique({
      where: { id: input.schoolId },
    });
    if (!school) throw new NotFoundException(AdminErrorEnum.SCHOOL_NOT_FOUND);
    const user = await this.prismaService.user.findUnique({
      where: { id: input.userId },
    });
    if (!user)
      throw new NotFoundException(AdminErrorEnum.TARGET_USER_NOT_FOUND);
    return this.prismaService.user.update({
      where: { id: input.userId },
      data: { role: Role.ADMIN, schoolId: input.schoolId, desiredRole: null },
      select: { id: true, role: true, schoolId: true },
    });
  }

  async listSchools(actorId: string) {
    const actor = await this.prismaService.user.findUnique({
      where: { id: actorId },
      select: { role: true, isActive: true },
    });
    if (!actor || !actor.isActive || actor.role !== Role.SUPER_ADMIN)
      throw new ForbiddenException(AdminErrorEnum.FORBIDDEN);
    return this.prismaService.school.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, slug: true, isActive: true },
    });
  }
}
