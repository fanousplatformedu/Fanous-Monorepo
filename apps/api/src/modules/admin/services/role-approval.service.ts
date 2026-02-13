import { NotFoundException, BadRequestException } from "@nestjs/common";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { AdminListRoleApprovalsInput } from "@admin/dtos/admin-list-approvals.input";
import { AdminReviewRoleRequestInput } from "@admin/dtos/review-role-request.input";
import { ApprovalStatus, Role } from "@prisma/client";
import { AdminErrorEnum } from "@admin/enums/admin-error.enum";
import { PrismaService } from "@prisma/prisma.service";

@Injectable()
export class AdminRoleApprovalService {
  constructor(private prismaService: PrismaService) {}

  private readonly allowedDesiredRoles = new Set<Role>([
    Role.STUDENT,
    Role.PARENT,
    Role.TEACHER,
    Role.COUNSELOR,
  ]);

  private async getActor(actorId: string) {
    const actor = await this.prismaService.user.findUnique({
      where: { id: actorId },
      select: { id: true, role: true, schoolId: true, isActive: true },
    });
    if (!actor || !actor.isActive)
      throw new ForbiddenException(AdminErrorEnum.FORBIDDEN);
    return actor;
  }

  private enforceSchoolScope(
    actor: { role: Role; schoolId: string | null },
    targetSchoolId?: string | null,
  ) {
    if (actor.role === Role.SUPER_ADMIN) return;
    if (actor.role !== Role.ADMIN)
      throw new ForbiddenException(AdminErrorEnum.FORBIDDEN);
    if (!actor.schoolId)
      throw new ForbiddenException(AdminErrorEnum.SCHOOL_REQUIRED);
    if (targetSchoolId && targetSchoolId !== actor.schoolId)
      throw new ForbiddenException(AdminErrorEnum.FORBIDDEN);
  }

  async listRoleApprovals(actorId: string, input: AdminListRoleApprovalsInput) {
    const actor = await this.getActor(actorId);
    const where: any = {
      ...(input.status ? { status: input.status } : {}),
      ...(input.requestedRole ? { requestedRole: input.requestedRole } : {}),
    };
    if (actor.role !== Role.SUPER_ADMIN) {
      if (!actor.schoolId)
        throw new ForbiddenException(AdminErrorEnum.SCHOOL_REQUIRED);
      where.schoolId = actor.schoolId;
    }

    if (input.q?.trim()) {
      const q = input.q.trim();
      where.OR = [
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { user: { phone: { contains: q, mode: "insensitive" } } },
      ];
    }

    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const skip = (page - 1) * limit;

    const [total, items] = await this.prismaService.$transaction([
      this.prismaService.roleApprovalRequest.count({ where }),
      this.prismaService.roleApprovalRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: { include: { school: true } },
          reviewedBy: true,
          school: true,
        },
      }),
    ]);
    return { total, items };
  }

  async getRoleApproval(actorId: string, requestId: string) {
    const actor = await this.getActor(actorId);
    const req = await this.prismaService.roleApprovalRequest.findUnique({
      where: { id: requestId },
      include: {
        user: { include: { school: true } },
        reviewedBy: true,
        school: true,
      },
    });
    if (!req) throw new NotFoundException(AdminErrorEnum.REQUEST_NOT_FOUND);
    this.enforceSchoolScope(actor, req.schoolId ?? req.user.schoolId ?? null);
    return req;
  }

  async approve(actorId: string, input: AdminReviewRoleRequestInput) {
    const actor = await this.getActor(actorId);

    const req = await this.prismaService.roleApprovalRequest.findUnique({
      where: { id: input.requestId },
      include: { user: true },
    });
    if (!req) throw new NotFoundException(AdminErrorEnum.REQUEST_NOT_FOUND);
    const targetSchoolId = req.schoolId ?? req.user.schoolId ?? null;
    this.enforceSchoolScope(actor, targetSchoolId);
    if (req.status !== ApprovalStatus.PENDING)
      throw new BadRequestException(AdminErrorEnum.REQUEST_ALREADY_REVIEWED);
    if (!this.allowedDesiredRoles.has(req.requestedRole))
      throw new BadRequestException(AdminErrorEnum.INVALID_ROLE_FOR_ASSIGNMENT);
    const now = new Date();

    return this.prismaService.$transaction(async (tx) => {
      const updatedReq = await tx.roleApprovalRequest.update({
        where: { id: req.id },
        data: {
          status: ApprovalStatus.APPROVED,
          reviewedAt: now,
          reviewedById: actor.id,
          note: input.note ?? req.note,
        },
        include: {
          user: { include: { school: true } },
          reviewedBy: true,
          school: true,
        },
      });

      await tx.user.update({
        where: { id: req.userId },
        data: {
          role: req.requestedRole,
          roleApprovedAt: now,
          roleApprovedById: actor.id,
          desiredRole: null,
        },
      });

      return updatedReq;
    });
  }

  async reject(actorId: string, input: AdminReviewRoleRequestInput) {
    const actor = await this.getActor(actorId);
    const req = await this.prismaService.roleApprovalRequest.findUnique({
      where: { id: input.requestId },
      include: { user: true },
    });
    if (!req) throw new NotFoundException(AdminErrorEnum.REQUEST_NOT_FOUND);
    const targetSchoolId = req.schoolId ?? req.user.schoolId ?? null;
    this.enforceSchoolScope(actor, targetSchoolId);
    if (req.status !== ApprovalStatus.PENDING)
      throw new BadRequestException(AdminErrorEnum.REQUEST_ALREADY_REVIEWED);
    const now = new Date();
    return this.prismaService.roleApprovalRequest.update({
      where: { id: req.id },
      data: {
        status: ApprovalStatus.REJECTED,
        reviewedAt: now,
        reviewedById: actor.id,
        note: input.note ?? req.note,
      },
      include: {
        user: { include: { school: true } },
        reviewedBy: true,
        school: true,
      },
    });
  }
}
