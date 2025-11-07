import "jest";
import { Test, TestingModule } from "@nestjs/testing";
import { BillingService } from "../services/billing.service";
import { PrismaService } from "@prisma/prisma.service";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import {
  InvoiceStatus,
  LicensePlan,
  Role,
  SubscriptionStatus,
} from "@prisma/client";

type Actor = { id: string; role: Role };

const admin: Actor = { id: "u1", role: Role.ADMIN };
const nonAdmin: Actor = { id: "u2", role: Role.STUDENT };

const mockPrisma = () => ({
  subscription: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  invoice: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $transaction: jest.fn(),
});

describe("BillingService", () => {
  let service: BillingService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    prisma = mockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(BillingService);
  });

  // ===== createSubscription =====
  it("createSubscription: should forbid non-admin", async () => {
    await expect(
      service.createSubscription(
        {
          tenantId: "t1",
          plan: LicensePlan.STANDARD,
          currentPeriodStart: new Date("2025-01-01"),
          currentPeriodEnd: new Date("2025-02-01"),
        },
        nonAdmin
      )
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("createSubscription: should throw when end <= start", async () => {
    await expect(
      service.createSubscription(
        {
          tenantId: "t1",
          plan: LicensePlan.PRO,
          currentPeriodStart: new Date("2025-01-02"),
          currentPeriodEnd: new Date("2025-01-01"),
        },
        admin
      )
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("createSubscription: creates subscription and invoice when amount > 0", async () => {
    const start = new Date("2025-01-01");
    const end = new Date("2025-02-01");

    prisma.subscription.create.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      plan: LicensePlan.STANDARD,
      status: "TRIALING",
      currentPeriodStart: start,
      currentPeriodEnd: end,
      cancelAtPeriodEnd: false,
    });

    prisma.invoice.create.mockResolvedValue({
      id: "inv1",
      tenantId: "t1",
      amountCents: 1000,
      status: "DUE",
      currency: "USD",
      issuedAt: new Date(),
      dueAt: start,
      meta: { reason: "SUBSCRIPTION_START", subscriptionId: "sub1" },
    });

    const sub = await service.createSubscription(
      {
        tenantId: "t1",
        plan: LicensePlan.STANDARD,
        currentPeriodStart: start,
        currentPeriodEnd: end,
        seats: 0,
      },
      admin
    );

    expect(prisma.subscription.create).toHaveBeenCalled();
    expect(prisma.invoice.create).toHaveBeenCalled(); // STANDARD base price > 0
    expect(sub.id).toBe("sub1");
  });

  it("createSubscription: creates subscription and no invoice when amount === 0 (FREE)", async () => {
    const start = new Date("2025-01-01");
    const end = new Date("2025-02-01");

    prisma.subscription.create.mockResolvedValue({
      id: "subF",
      tenantId: "t1",
      plan: LicensePlan.FREE,
      status: "TRIALING",
      currentPeriodStart: start,
      currentPeriodEnd: end,
      cancelAtPeriodEnd: false,
    });

    const sub = await service.createSubscription(
      {
        tenantId: "t1",
        plan: LicensePlan.FREE,
        currentPeriodStart: start,
        currentPeriodEnd: end,
      },
      admin
    );

    expect(prisma.subscription.create).toHaveBeenCalled();
    expect(prisma.invoice.create).not.toHaveBeenCalled();
    expect(sub.id).toBe("subF");
  });

  // ===== updateSubscription =====
  it("updateSubscription: should forbid non-admin", async () => {
    await expect(
      service.updateSubscription({ id: "x" }, nonAdmin)
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("updateSubscription: throws when subscription not found", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    await expect(
      service.updateSubscription({ id: "subNA" }, admin)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updateSubscription: throws when new end <= currentPeriodStart", async () => {
    prisma.subscription.findUnique.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      plan: LicensePlan.STANDARD,
      status: "ACTIVE",
      currentPeriodStart: new Date("2025-01-05"),
      currentPeriodEnd: new Date("2025-02-05"),
      cancelAtPeriodEnd: false,
    });

    await expect(
      service.updateSubscription(
        { id: "sub1", currentPeriodEnd: new Date("2025-01-01") },
        admin
      )
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("updateSubscription: plan change creates proration invoice when amount > 0", async () => {
    prisma.subscription.findUnique.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      plan: LicensePlan.STANDARD, // moving to PRO
      status: "ACTIVE",
      currentPeriodStart: new Date("2025-01-01"),
      currentPeriodEnd: new Date("2025-02-01"),
      cancelAtPeriodEnd: false,
    });

    prisma.invoice.create.mockResolvedValue({
      id: "invP",
      tenantId: "t1",
      amountCents: 1,
      currency: "USD",
      status: "DUE",
      issuedAt: new Date(),
      dueAt: new Date(),
      meta: {},
    });

    prisma.subscription.update.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      plan: LicensePlan.PRO,
      status: "ACTIVE",
      currentPeriodStart: new Date("2025-01-01"),
      currentPeriodEnd: new Date("2025-02-01"),
      cancelAtPeriodEnd: false,
    });

    const res = await service.updateSubscription(
      { id: "sub1", plan: LicensePlan.PRO, seats: 1 },
      admin
    );

    expect(prisma.invoice.create).toHaveBeenCalled();
    expect(prisma.subscription.update).toHaveBeenCalled();
    expect(res.subscription.plan).toBe(LicensePlan.PRO);
    expect(res.prorationInvoice?.id).toBe("invP");
  });

  it("updateSubscription: no proration when same plan", async () => {
    prisma.subscription.findUnique.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      plan: LicensePlan.PRO,
      status: "ACTIVE",
      currentPeriodStart: new Date("2025-01-01"),
      currentPeriodEnd: new Date("2025-02-01"),
      cancelAtPeriodEnd: false,
    });

    prisma.subscription.update.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      plan: LicensePlan.PRO,
      status: "ACTIVE",
      currentPeriodStart: new Date("2025-01-01"),
      currentPeriodEnd: new Date("2025-02-01"),
      cancelAtPeriodEnd: false,
    });

    const res = await service.updateSubscription(
      { id: "sub1", plan: LicensePlan.PRO },
      admin
    );

    expect(prisma.invoice.create).not.toHaveBeenCalled();
    expect(res.prorationInvoice).toBeNull();
  });

  // ===== cancelSubscription =====
  it("cancelSubscription: at period end = true -> sets cancelAtPeriodEnd", async () => {
    prisma.subscription.findUnique.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
    });
    prisma.subscription.update.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      cancelAtPeriodEnd: true,
    });

    const res = await service.cancelSubscription(
      { id: "sub1", atPeriodEnd: true },
      admin
    );

    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { id: "sub1" },
      data: { cancelAtPeriodEnd: true },
    });
    expect(res.subscription.cancelAtPeriodEnd).toBe(true);
  });

  it("cancelSubscription: immediate cancel -> sets status CANCELED", async () => {
    prisma.subscription.findUnique.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
    });
    prisma.subscription.update.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      status: "CANCELED",
      cancelAtPeriodEnd: false,
    });

    const res = await service.cancelSubscription(
      { id: "sub1", atPeriodEnd: false },
      admin
    );

    expect(prisma.subscription.update).toHaveBeenCalledWith({
      where: { id: "sub1" },
      data: expect.objectContaining({
        status: "CANCELED",
        cancelAtPeriodEnd: false,
      }),
    });
    expect(res.subscription.status).toBe("CANCELED");
  });

  it("cancelSubscription: throws when sub not found", async () => {
    prisma.subscription.findUnique.mockResolvedValue(null);
    await expect(
      service.cancelSubscription({ id: "nope", atPeriodEnd: false }, admin)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  // ===== upcomingInvoice =====
  it("upcomingInvoice: throws when active sub not found", async () => {
    prisma.subscription.findFirst.mockResolvedValue(null);
    await expect(
      service.upcomingInvoice({ tenantId: "t1" }, admin)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("upcomingInvoice: returns computed amount and date", async () => {
    prisma.subscription.findFirst.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      plan: LicensePlan.STANDARD,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodEnd: new Date("2025-02-01"),
    });

    const res = await service.upcomingInvoice(
      { tenantId: "t1", seats: 2, currency: "EUR" },
      admin
    );

    expect(res.currency).toBe("EUR");
    expect(res.plan).toBe(LicensePlan.STANDARD);
    expect(res.amountCents).toBeGreaterThan(0);
  });

  // ===== issueInvoice =====
  it("issueInvoice: forbid non-admin", async () => {
    await expect(
      service.issueInvoice({ tenantId: "t1", amountCents: 100 }, nonAdmin)
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("issueInvoice: amount must be positive", async () => {
    await expect(
      service.issueInvoice({ tenantId: "t1", amountCents: 0 }, admin)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("issueInvoice: creates invoice and parses metaJson", async () => {
    prisma.invoice.create.mockResolvedValue({
      id: "inv1",
      tenantId: "t1",
      amountCents: 555,
      status: "DUE",
      currency: "USD",
      issuedAt: new Date(),
      dueAt: null,
      meta: { foo: "bar" },
    });

    const inv = await service.issueInvoice(
      { tenantId: "t1", amountCents: 555, metaJson: '{"foo":"bar"}' },
      admin
    );

    expect(prisma.invoice.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        meta: { foo: "bar" },
      }),
    });
    expect(inv.id).toBe("inv1");
  });

  // ===== markInvoice =====
  it("markInvoice: throws if not found", async () => {
    prisma.invoice.findUnique.mockResolvedValue(null);
    await expect(
      service.markInvoice({ id: "x", status: InvoiceStatus.DUE }, admin)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("markInvoice: sets paidAt when status = PAID and handles metaJson", async () => {
    const now = new Date();
    prisma.invoice.findUnique.mockResolvedValue({ id: "inv1" });
    prisma.invoice.update.mockResolvedValue({
      id: "inv1",
      status: "PAID",
      paidAt: now,
    });

    await service.markInvoice(
      { id: "inv1", status: InvoiceStatus.PAID, metaJson: '{"a":1}' },
      admin
    );

    expect(prisma.invoice.update).toHaveBeenCalledWith({
      where: { id: "inv1" },
      data: expect.objectContaining({
        status: "PAID",
        meta: { a: 1 },
      }),
    });
  });

  // ===== listInvoices =====
  it("listInvoices: returns mapped items with stringified meta", async () => {
    prisma.$transaction.mockImplementation(async (ops: any[]) => {
      const [findMany, count] = ops;
      const items = await findMany;
      const total = await count;
      return [items, total];
    });

    prisma.invoice.findMany.mockResolvedValue([
      { id: "i1", meta: { k: "v" }, issuedAt: new Date() },
      { id: "i2", meta: null, issuedAt: new Date() },
    ]);
    prisma.invoice.count.mockResolvedValue(2);

    const page = await service.listInvoices(
      { tenantId: "t1", page: 1, pageSize: 10 },
      admin
    );

    expect(page.total).toBe(2);
    expect(page.items[0].meta).toBe('{"k":"v"}');
    expect(page.items[1].meta).toBeNull();
  });

  // ===== getInvoice =====
  it("getInvoice: throws when not found", async () => {
    prisma.invoice.findUnique.mockResolvedValue(null);
    await expect(service.getInvoice("nope", admin)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it("getInvoice: returns invoice with stringified meta", async () => {
    prisma.invoice.findUnique.mockResolvedValue({
      id: "inv1",
      meta: { x: 1 },
    });
    const inv = await service.getInvoice("inv1", admin);
    expect(inv.meta).toBe('{"x":1}');
  });

  // ===== applyPaymentWebhook =====
  it("applyPaymentWebhook: payment_intent.succeeded updates invoice", async () => {
    prisma.invoice.update.mockResolvedValue({ id: "invX", status: "PAID" });

    const res = await service.applyPaymentWebhook({
      type: "payment_intent.succeeded",
      provider: "stripe",
      data: {
        invoiceId: "invX",
        paidAt: "2025-01-01T00:00:00.000Z",
        paymentIntentId: "pi_123",
        amountReceived: 100,
        currency: "USD",
      },
    });

    expect(prisma.invoice.update).toHaveBeenCalled();
    expect(res.ok).toBe(true);
  });
});
