import { Injectable, NotFoundException } from "@nestjs/common";
import { ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { Prisma, Role } from "@prisma/client";

type Actor = { id?: string; role?: Role } | null | undefined;

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  private isTenantAdmin(actor?: Actor) {
    const r = String(actor?.role ?? "").toUpperCase();
    return ["SUPER_ADMIN", "SCHOOL_ADMIN", "ADMIN"].includes(r);
  }

  async log(input: {
    data?: any;
    action: string;
    tenantId: string;
    ip?: string | null;
    entity?: string | null;
    actorId?: string | null;
    entityId?: string | null;
    userAgent?: string | null;
  }) {
    const ev = await this.prisma.auditEvent.create({
      data: {
        tenantId: input.tenantId,
        actorId: input.actorId ?? null,
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
        action: input.action,
        entity: input.entity ?? null,
        entityId: input.entityId ?? null,
        data: input.data ?? undefined,
      },
    });
    return ev;
  }

  async byId(id: string, actor: Actor) {
    const ev = await this.prisma.auditEvent.findUnique({ where: { id } });
    if (!ev) throw new NotFoundException("Audit event not found");
    if (!this.isTenantAdmin(actor))
      throw new ForbiddenException("Access denied");
    return ev;
  }

  async paginate(
    input: {
      tenantId: string;
      q?: string;
      actorId?: string;
      action?: string;
      entity?: string;
      from?: Date;
      to?: Date;
      page: number;
      pageSize: number;
    },
    actor: Actor
  ) {
    if (!this.isTenantAdmin(actor))
      throw new ForbiddenException("Access denied");
    const AND: any[] = [{ tenantId: input.tenantId }];
    if (input.q) {
      AND.push({
        OR: [
          { action: { contains: input.q, mode: "insensitive" } },
          { entity: { contains: input.q, mode: "insensitive" } },
          { entityId: { contains: input.q, mode: "insensitive" } },
        ],
      });
    }
    if (input.actorId) AND.push({ actorId: input.actorId });
    if (input.action) AND.push({ action: input.action });
    if (input.entity) AND.push({ entity: input.entity });
    if (input.from || input.to) {
      AND.push({
        createdAt: { gte: input.from ?? undefined, lte: input.to ?? undefined },
      });
    }
    const where = { AND };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      this.prisma.auditEvent.count({ where }),
    ]);
    return { items, total, page: input.page, pageSize: input.pageSize };
  }

  async stats(
    input: {
      tenantId: string;
      from?: Date;
      to?: Date;
      groupBy?: "action" | "day";
    },
    actor: Actor
  ) {
    if (!this.isTenantAdmin(actor))
      throw new ForbiddenException("Access denied");
    const where: any = { tenantId: input.tenantId };
    if (input.from || input.to) {
      where.createdAt = {
        gte: input.from ?? undefined,
        lte: input.to ?? undefined,
      };
    }
    if (input.groupBy === "day") {
      const filters: Prisma.Sql[] = [
        Prisma.sql`"tenantId" = ${input.tenantId}`,
      ];
      if (input.from) filters.push(Prisma.sql`"createdAt" >= ${input.from}`);
      if (input.to) filters.push(Prisma.sql`"createdAt" <= ${input.to}`);
      const whereSql =
        filters.length === 0
          ? Prisma.empty
          : filters
              .slice(1)
              .reduce(
                (acc, cur) => Prisma.sql`${acc} AND ${cur}`,
                Prisma.sql`WHERE ${filters[0]}`
              );
      const query = Prisma.sql`
                  SELECT to_char("createdAt" AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS day,
                        count(*)::int AS count
                  FROM "AuditEvent"
                  ${whereSql}
                  GROUP BY 1
                  ORDER BY 1 ASC
          `;
      const rows =
        await this.prisma.$queryRaw<{ day: string; count: number }[]>(query);
      return { groupBy: "day", rows };
    }

    const rows = await this.prisma.auditEvent.groupBy({
      by: ["action"],
      where,
      _count: { action: true },
      orderBy: { _count: { action: "desc" } },
    });

    return {
      groupBy: "action",
      rows: rows.map((r) => ({
        action: r.action,
        count: r._count?.action ?? 0,
      })),
    };
  }

  async purge(input: { tenantId: string; before: Date }, actor: Actor) {
    if (!this.isTenantAdmin(actor))
      throw new ForbiddenException("Access denied");
    const res = await this.prisma.auditEvent.deleteMany({
      where: { tenantId: input.tenantId, createdAt: { lt: input.before } },
    });
    return res.count;
  }
}
