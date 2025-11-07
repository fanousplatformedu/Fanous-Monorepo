import { Resolver, Mutation, Args, Context, Query, Int } from "@nestjs/graphql";
import { AuditEventPage, AuditStats } from "@audit/entities/audit-page.entity";
import { Role, TenantRole } from "@prisma/client";
import { AuditEventEntity } from "@audit/entities/audit.entity";
import { AuditStatsInput } from "@audit/dto/audit-stats.input";
import { AuditPageInput } from "@audit/dto/audit-page.input";
import { LogAuditInput } from "@audit/dto/log-audit.input";
import { AuditService } from "@audit/services/audit.service";
import { Roles } from "@decorators/roles.decorator";

@Resolver(() => AuditEventEntity)
export class AuditResolver {
  constructor(private readonly auditService: AuditService) {}

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => AuditEventEntity, { name: "logAudit" })
  async logAudit(@Args("input") input: LogAuditInput, @Context() ctx) {
    const req = ctx?.req;
    const ua = req?.headers?.["user-agent"] as string | undefined;
    const ip = (req?.ip || req?.socket?.remoteAddress || "") as string;
    const data = input.dataJson ? JSON.parse(input.dataJson) : undefined;
    const ev = await this.auditService.log({
      tenantId: input.tenantId,
      actorId: req?.user?.id ?? null,
      ip,
      userAgent: ua ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      data,
    });
    return {
      ...ev,
      data: ev.data ? JSON.stringify(ev.data) : null,
    };
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Query(() => AuditEventEntity, { name: "auditEvent" })
  async auditEvent(@Args("id") id: string, @Context() ctx) {
    const ev = await this.auditService.byId(id, ctx.req.user);
    return { ...ev, data: ev.data ? JSON.stringify(ev.data) : null };
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Query(() => AuditEventPage, { name: "auditEvents" })
  async auditEvents(@Args("input") input: AuditPageInput, @Context() ctx) {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 20));
    const { items, total } = await this.auditService.paginate(
      { ...input, page, pageSize },
      ctx.req.user
    );
    return {
      items: items.map((it) => ({
        ...it,
        data: it.data ? JSON.stringify(it.data) : null,
      })),
      total,
      page,
      pageSize,
    };
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Query(() => AuditStats, { name: "auditStats" })
  async auditStats(@Args("input") input: AuditStatsInput, @Context() ctx) {
    const result = await this.auditService.stats(input, ctx.req.user);
    if (result.groupBy === "day") {
      return {
        groupBy: "day",
        rows: result.rows.map((r: any) => ({ day: r.day, count: r.count })),
      };
    }
    return {
      groupBy: "action",
      rows: result.rows.map((r: any) => ({ action: r.action, count: r.count })),
    };
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => Int, { name: "purgeAudit" })
  async purgeAudit(
    @Args("tenantId") tenantId: string,
    @Args("before") before: Date,
    @Context() ctx
  ) {
    return this.auditService.purge({ tenantId, before }, ctx.req.user);
  }
}
