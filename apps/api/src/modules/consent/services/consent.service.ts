import { NotFoundException, BadRequestException } from "@nestjs/common";
import { ConsentType, ConsentStatus, Role, Prisma } from "@prisma/client";
import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";

type Actor = { id: string; role: Role };

@Injectable()
export class ConsentService {
  constructor(private prismaService: PrismaService) {}

  // ============ Helpers ==================
  private canReadTenant(actor: Actor) {
    const r = String(actor.role).toUpperCase();
    return ["SUPER_ADMIN", "SCHOOL_ADMIN", "COUNSELOR"].includes(r);
  }
  private canWriteTenant(actor: Actor) {
    const r = String(actor.role).toUpperCase();
    return ["SUPER_ADMIN", "SCHOOL_ADMIN"].includes(r);
  }
  private isParent(actor: Actor) {
    return String(actor.role).toUpperCase() === "PARENT";
  }
  private isStudent(actor: Actor) {
    return String(actor.role).toUpperCase() === "STUDENT";
  }
  private jstr(x: any) {
    return x == null ? null : JSON.stringify(x);
  }
  private parseMaybe(s?: string | null) {
    if (s == null) return undefined;
    try {
      return JSON.parse(s);
    } catch {
      throw new BadRequestException("Invalid JSON");
    }
  }

  private async ensureParentLink(
    parentId: string,
    childUserId: string,
    tenantId: string
  ) {
    const link = await this.prismaService.parentLink.findFirst({
      where: { parentId, childId: childUserId, tenantId },
      select: { id: true },
    });
    if (!link) throw new ForbiddenException("No access to this child");
  }

  // =========== Read APIs ===============
  async myConsents(tenantId: string, actor: Actor) {
    const items = await this.prismaService.consent.findMany({
      where: { tenantId, userId: actor.id },
      orderBy: { createdAt: "desc" },
    });
    return items.map((c) => ({
      id: c.id,
      type: c.type,
      status: c.status,
      data: this.jstr(c.data),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      userId: c.userId,
      tenantId: c.tenantId,
    }));
  }

  async userConsents(tenantId: string, userId: string, actor: Actor) {
    if (actor.id !== userId) {
      if (this.isParent(actor))
        await this.ensureParentLink(actor.id, userId, tenantId);
      else if (!this.canReadTenant(actor))
        throw new ForbiddenException("Access denied");
    }
    const items = await this.prismaService.consent.findMany({
      where: { tenantId, userId },
      orderBy: { createdAt: "desc" },
    });
    return items.map((c) => ({
      id: c.id,
      type: c.type,
      status: c.status,
      data: this.jstr(c.data),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      userId: c.userId,
      tenantId: c.tenantId,
    }));
  }

  async searchConsents(
    input: {
      tenantId: string;
      userId?: string;
      type?: ConsentType;
      status?: ConsentStatus;
      q?: string;
      page: number;
      pageSize: number;
    },
    actor: Actor
  ) {
    if (!this.canReadTenant(actor))
      throw new ForbiddenException("Access denied");

    const AND: Prisma.ConsentWhereInput[] = [{ tenantId: input.tenantId }];
    if (input.userId) AND.push({ userId: input.userId });
    if (input.type) AND.push({ type: input.type });
    if (input.status) AND.push({ status: input.status });

    const where: Prisma.ConsentWhereInput = input.q
      ? {
          AND,
          user: {
            // ✅ use relation filter to avoid XOR clash
            is: {
              OR: [
                { name: { contains: input.q, mode: "insensitive" } },
                { email: { contains: input.q, mode: "insensitive" } },
              ],
            },
          },
        }
      : { AND };

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.consent.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      this.prismaService.consent.count({ where }),
    ]);

    return {
      items: items.map((c) => ({
        id: c.id,
        type: c.type,
        status: c.status,
        data: this.jstr(c.data),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        userId: c.userId,
        tenantId: c.tenantId,
      })),
      total: total,
      page: input.page,
      pageSize: input.pageSize,
    };
  }

  // ===== Write APIs =====

  /**
   * Set/Update consent:
   * - اگر (userId) خالی باشد برای خود کاربر بازی می‌شود (STUDENT/PARENT)
   * - والد می‌تواند برای child (با ParentLink) ثبت کند
   * - ادمین مدرسه/سوپرادمین می‌تواند برای هر کاربر در tenant ثبت/ویرایش کند
   * - اگر رکوردی با (tenantId, userId, type) وجود داشته باشد، به‌روزرسانی می‌شود، در غیر این صورت ساخته می‌شود
   */
  async setConsent(
    input: {
      tenantId: string;
      userId?: string;
      type: ConsentType;
      status: ConsentStatus;
      data?: string;
    },
    actor: Actor
  ) {
    const targetUserId = input.userId ?? actor.id;
    if (targetUserId !== actor.id) {
      if (this.isParent(actor))
        await this.ensureParentLink(actor.id, targetUserId, input.tenantId);
      else if (!this.canWriteTenant(actor))
        throw new ForbiddenException("Access denied");
    }

    const existing = await this.prismaService.consent.findFirst({
      where: {
        tenantId: input.tenantId,
        userId: targetUserId,
        type: input.type,
      },
    });

    const dataJson = this.parseMaybe(input.data);
    if (existing) {
      const updated = await this.prismaService.consent.update({
        where: { id: existing.id },
        data: { status: input.status, data: dataJson ?? null },
      });
      return {
        id: updated.id,
        type: updated.type,
        status: updated.status,
        data: this.jstr(updated.data),
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        userId: updated.userId,
        tenantId: updated.tenantId,
      };
    } else {
      const created = await this.prismaService.consent.create({
        data: {
          tenantId: input.tenantId,
          userId: targetUserId,
          type: input.type,
          status: input.status,
          data: dataJson,
        },
      });
      return {
        id: created.id,
        type: created.type,
        status: created.status,
        data: this.jstr(created.data),
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
        userId: created.userId,
        tenantId: created.tenantId,
      };
    }
  }

  /**
   * revokeConsent: وضعیت را REVOKED می‌کند.
   */
  async revokeConsent(
    input: { tenantId: string; userId?: string; type: ConsentType },
    actor: Actor
  ) {
    const targetUserId = input.userId ?? actor.id;
    if (targetUserId !== actor.id) {
      if (this.isParent(actor))
        await this.ensureParentLink(actor.id, targetUserId, input.tenantId);
      else if (!this.canWriteTenant(actor))
        throw new ForbiddenException("Access denied");
    }
    const existing = await this.prismaService.consent.findFirst({
      where: {
        tenantId: input.tenantId,
        userId: targetUserId,
        type: input.type,
      },
    });
    if (!existing) throw new NotFoundException("Consent not found");
    const updated = await this.prismaService.consent.update({
      where: { id: existing.id },
      data: { status: "REVOKED" as any },
    });

    return {
      id: updated.id,
      type: updated.type,
      status: updated.status,
      data: this.jstr(updated.data),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      userId: updated.userId,
      tenantId: updated.tenantId,
    };
  }

  /**
   * deleteConsent: فقط برای SUPER_ADMIN | SCHOOL_ADMIN
   */
  async deleteConsent(consentId: string, actor: Actor) {
    if (!this.canWriteTenant(actor))
      throw new ForbiddenException("Access denied");
    const existed = await this.prismaService.consent.findUnique({
      where: { id: consentId },
      select: { id: true },
    });
    if (!existed) throw new NotFoundException("Consent not found");
    await this.prismaService.consent.delete({ where: { id: consentId } });
    return true;
  }
}
