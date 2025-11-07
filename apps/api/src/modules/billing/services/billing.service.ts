import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { LicensePlan, InvoiceStatus, Role } from "@prisma/client";
import { Injectable, BadRequestException } from "@nestjs/common";
import { SubscriptionStatus } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";

type Actor = { id: string; role: Role };

@Injectable()
export class BillingService {
  constructor(private prismaService: PrismaService) {}

  private isAdmin(actor?: Actor) {
    const r = String(actor?.role ?? "").toUpperCase();
    return ["SUPER_ADMIN", "SCHOOL_ADMIN", "ADMIN"].includes(r);
  }

  private seatPrice(plan: LicensePlan) {
    switch (plan) {
      case "FREE":
        return 0;
      case "STANDARD":
        return 300;
      case "PRO":
        return 500;
      case "ENTERPRISE":
        return 1000;
      default:
        return 0;
    }
  }
  private basePrice(plan: LicensePlan) {
    switch (plan) {
      case "FREE":
        return 0;
      case "STANDARD":
        return 1000;
      case "PRO":
        return 3000;
      case "ENTERPRISE":
        return 10000;
      default:
        return 0;
    }
  }

  private computeAmountCents(plan: LicensePlan, seats?: number) {
    const base = this.basePrice(plan);
    const perSeat = this.seatPrice(plan) * Math.max(0, seats ?? 0);
    return base + perSeat;
  }

  // =========== Subscription =============
  async createSubscription(
    input: {
      tenantId: string;
      plan: LicensePlan;
      currentPeriodStart: Date;
      currentPeriodEnd: Date;
      cancelAtPeriodEnd?: boolean;
      seats?: number;
      currency?: string;
    },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    if (input.currentPeriodEnd <= input.currentPeriodStart) {
      throw new BadRequestException(
        "currentPeriodEnd must be after currentPeriodStart"
      );
    }
    const sub = await this.prismaService.subscription.create({
      data: {
        tenantId: input.tenantId,
        plan: input.plan,
        status: "TRIALING",
        currentPeriodStart: input.currentPeriodStart,
        currentPeriodEnd: input.currentPeriodEnd,
        cancelAtPeriodEnd: !!input.cancelAtPeriodEnd,
      },
    });

    const amount = this.computeAmountCents(input.plan, input.seats);
    if (amount > 0) {
      await this.prismaService.invoice.create({
        data: {
          tenantId: input.tenantId,
          amountCents: amount,
          currency: input.currency ?? "USD",
          status: "DUE",
          issuedAt: new Date(),
          dueAt: input.currentPeriodStart,
          meta: {
            reason: "SUBSCRIPTION_START",
            subscriptionId: sub.id,
            plan: input.plan,
            seats: input.seats ?? 0,
          },
        },
      });
    }
    return sub;
  }

  async updateSubscription(
    input: {
      id: string;
      cancelAtPeriodEnd?: boolean;
      plan?: LicensePlan;
      status?: SubscriptionStatus;
      currentPeriodEnd?: Date;
      seats?: number;
    },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    const sub = await this.prismaService.subscription.findUnique({
      where: { id: input.id },
    });
    if (!sub) throw new NotFoundException("Subscription not found");
    if (
      input.currentPeriodEnd &&
      input.currentPeriodEnd <= sub.currentPeriodStart
    ) {
      throw new BadRequestException(
        "currentPeriodEnd must be after currentPeriodStart"
      );
    }

    let invoice: any | null = null;
    if (input.plan && input.plan !== sub.plan) {
      const amount = Math.max(
        0,
        this.computeAmountCents(input.plan, input.seats) -
          this.computeAmountCents(sub.plan)
      );
      if (amount > 0) {
        invoice = await this.prismaService.invoice.create({
          data: {
            tenantId: sub.tenantId,
            amountCents: amount,
            currency: "USD",
            status: "DUE",
            issuedAt: new Date(),
            dueAt: new Date(),
            meta: {
              reason: "PLAN_CHANGE_PRORATION",
              from: sub.plan,
              to: input.plan,
              subscriptionId: sub.id,
            },
          },
        });
      }
    }
    const updated = await this.prismaService.subscription.update({
      where: { id: sub.id },
      data: {
        cancelAtPeriodEnd: input.cancelAtPeriodEnd ?? sub.cancelAtPeriodEnd,
        plan: input.plan ?? sub.plan,
        status: input.status ?? sub.status,
        currentPeriodEnd: input.currentPeriodEnd ?? sub.currentPeriodEnd,
      },
    });
    return { subscription: updated, prorationInvoice: invoice };
  }

  async cancelSubscription(
    input: { id: string; atPeriodEnd: boolean },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    const sub = await this.prismaService.subscription.findUnique({
      where: { id: input.id },
    });
    if (!sub) throw new NotFoundException("Subscription not found");
    if (input.atPeriodEnd) {
      const updated = await this.prismaService.subscription.update({
        where: { id: sub.id },
        data: { cancelAtPeriodEnd: true },
      });
      return { subscription: updated };
    }
    const updated = await this.prismaService.subscription.update({
      where: { id: sub.id },
      data: {
        status: "CANCELED",
        cancelAtPeriodEnd: false,
        currentPeriodEnd: new Date(),
      },
    });
    return { subscription: updated };
  }

  async upcomingInvoice(
    input: {
      tenantId: string;
      onDate?: Date;
      seats?: number;
      currency?: string;
    },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    const sub = await this.prismaService.subscription.findFirst({
      where: {
        tenantId: input.tenantId,
        status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!sub) throw new NotFoundException("Active subscription not found");
    const amount = this.computeAmountCents(sub.plan, input.seats);
    const when = input.onDate ?? sub.currentPeriodEnd;
    return {
      amountCents: amount,
      currency: input.currency ?? "USD",
      dueAt: when,
      plan: sub.plan,
    };
  }

  // ============= Invoice =================
  async issueInvoice(
    input: {
      tenantId: string;
      amountCents: number;
      currency?: string;
      dueAt?: Date;
      metaJson?: string;
    },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    if (input.amountCents <= 0)
      throw new BadRequestException("amountCents must be positive");
    const meta = input.metaJson ? JSON.parse(input.metaJson) : undefined;
    const inv = await this.prismaService.invoice.create({
      data: {
        tenantId: input.tenantId,
        amountCents: input.amountCents,
        currency: input.currency ?? "USD",
        status: "DUE",
        issuedAt: new Date(),
        dueAt: input.dueAt ?? null,
        meta,
      },
    });
    return inv;
  }

  async markInvoice(
    input: {
      id: string;
      status: InvoiceStatus;
      paidAt?: Date;
      metaJson?: string;
    },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    const inv = await this.prismaService.invoice.findUnique({
      where: { id: input.id },
    });
    if (!inv) throw new NotFoundException("Invoice not found");
    const data: any = { status: input.status };
    if (input.status === "PAID") data.paidAt = input.paidAt ?? new Date();
    if (input.metaJson !== undefined)
      data.meta = input.metaJson ? JSON.parse(input.metaJson) : null;
    const updated = await this.prismaService.invoice.update({
      where: { id: inv.id },
      data,
    });
    return updated;
  }

  async listInvoices(
    input: {
      tenantId: string;
      q?: string;
      status?: InvoiceStatus;
      from?: Date;
      to?: Date;
      page: number;
      pageSize: number;
    },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    const AND: any[] = [{ tenantId: input.tenantId }];
    if (input.status) AND.push({ status: input.status });
    if (input.from || input.to)
      AND.push({
        issuedAt: { gte: input.from ?? undefined, lte: input.to ?? undefined },
      });
    if (input.q) {
      AND.push({
        OR: [
          { currency: { contains: input.q, mode: "insensitive" } },
          { meta: { path: ["description"], string_contains: input.q } as any },
        ],
      });
    }
    const where: any = { AND };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.invoice.findMany({
        where,
        orderBy: { issuedAt: "desc" },
        skip: (input.page - 1) * input.pageSize,
        take: input.pageSize,
      }),
      this.prismaService.invoice.count({ where }),
    ]);
    return {
      items: items.map((it) => ({
        ...it,
        meta: it.meta ? JSON.stringify(it.meta) : null,
      })),
      total,
      page: input.page,
      pageSize: input.pageSize,
    };
  }

  async getInvoice(id: string, actor: Actor) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    const inv = await this.prismaService.invoice.findUnique({ where: { id } });
    if (!inv) throw new NotFoundException("Invoice not found");
    return { ...inv, meta: inv.meta ? JSON.stringify(inv.meta) : null };
  }

  async applyPaymentWebhook(payload: any) {
    const type = payload?.type ?? "";
    if (type === "payment_intent.succeeded") {
      const invId = payload?.data?.invoiceId as string;
      if (invId) {
        await this.prismaService.invoice.update({
          where: { id: invId },
          data: {
            status: "PAID",
            paidAt: payload?.data?.paidAt
              ? new Date(payload.data.paidAt)
              : new Date(),
            meta: {
              paymentProvider: payload?.provider ?? "unknown",
              paymentIntentId: payload?.data?.paymentIntentId ?? null,
              amountReceived: payload?.data?.amountReceived ?? null,
              currency: payload?.data?.currency ?? null,
            },
          },
        });
      }
    }
    return { ok: true };
  }
}
