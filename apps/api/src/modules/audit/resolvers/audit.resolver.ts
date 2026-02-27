import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuditCreateResultEntity } from "@audit/entities/audit-create-result.entity";
import { AuditGqlMutationNames } from "@audit/enums/gql-names.enum";
import { CreateAuditLogInput } from "@audit/dtos/create-audit-log.input";
import { AuditLogListEntity } from "@audit/entities/audit-log-list.entity";
import { AuditGqlQueryNames } from "@audit/enums/gql-names.enum";
import { ListAuditLogsInput } from "@audit/dtos/list-audit-logs.input";
import { AuditLogEntity } from "@audit/entities/audit-log.entity";
import { AuditService } from "@audit/services/audit.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { AuditMessage } from "@audit/enums/audit-message.enum";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class AuditResolver {
  constructor(private readonly auditService: AuditService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  @Query(() => AuditLogListEntity, { name: AuditGqlQueryNames.AuditLogs })
  auditLogs(
    @CurrentUser() user: any,
    @Args("input") input: ListAuditLogsInput,
  ) {
    return this.auditService.list({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId ?? null,
      actorId: input.actorId ?? null,
      action: input.action ?? null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      from: input.from ? new Date(input.from) : null,
      to: input.to ? new Date(input.to) : null,
      take: input.take,
      skip: input.skip,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  @Query(() => AuditLogEntity, { name: AuditGqlQueryNames.AuditLogById })
  auditLogById(@CurrentUser() user: any, @Args("id") id: string) {
    return this.auditService.byId(
      { role: user.role, schoolId: user.schoolId },
      id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => AuditCreateResultEntity, {
    name: AuditGqlMutationNames.CreateAuditLog,
  })
  async createAuditLog(
    @CurrentUser() user: any,
    @Args("input") input: CreateAuditLogInput,
    @Context() ctx: any,
  ) {
    const req = ctx.req;
    const log = await this.auditService.record({
      action: input.action,
      actorId: user.id,
      schoolId: input.schoolId ?? user.schoolId ?? null,
      entityType: input.entityType ?? null,
      entityId: input.entityId ?? null,
      metadata: input.metadata ?? null,
      ip: (req.headers["x-forwarded-for"] as string) || req.ip || null,
      userAgent: req.headers["user-agent"] ?? null,
    });
    return { message: AuditMessage.CREATED, log };
  }
}
