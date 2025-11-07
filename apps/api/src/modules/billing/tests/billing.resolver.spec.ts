import "jest";
import { Test, TestingModule } from "@nestjs/testing";
import { BillingResolver } from "../resolvers/billing.resolver";
import { BillingService } from "../services/billing.service";
import { Role } from "@prisma/client";

// ساده: فقط متدهای مورد نیاز رو mock می‌کنیم
const mockBillingService = () => ({
  createSubscription: jest.fn(),
  updateSubscription: jest.fn(),
  cancelSubscription: jest.fn(),
  upcomingInvoice: jest.fn(),
  issueInvoice: jest.fn(),
  markInvoice: jest.fn(),
  listInvoices: jest.fn(),
  getInvoice: jest.fn(),
});

const ctx = { req: { user: { id: "u1", role: Role.ADMIN } } };

describe("BillingResolver", () => {
  let resolver: BillingResolver;
  let service: ReturnType<typeof mockBillingService>;

  beforeEach(async () => {
    service = mockBillingService() as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingResolver,
        { provide: BillingService, useValue: service },
      ],
    }).compile();

    resolver = module.get(BillingResolver);
  });

  it("createSubscription: passes input and ctx user", async () => {
    service.createSubscription.mockResolvedValue({ id: "sub1" });

    const res = await resolver.createSubscription(
      {
        tenantId: "t1",
        plan: "STANDARD",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 86400000),
      } as any,
      ctx as any
    );

    expect(service.createSubscription).toHaveBeenCalled();
    expect(res.id).toBe("sub1");
  });

  it("updateSubscription: maps prorationInvoice.meta to string if present", async () => {
    service.updateSubscription.mockResolvedValue({
      subscription: { id: "sub1" },
      prorationInvoice: { id: "inv1", meta: { k: "v" } },
    });

    const res = await resolver.updateSubscription(
      { id: "sub1", plan: "PRO" } as any,
      ctx as any
    );

    expect(res.subscription.id).toBe("sub1");
    expect(res.prorationInvoice.meta).toBe('{"k":"v"}');
  });

  it("updateSubscription: prorationInvoice null stays null", async () => {
    service.updateSubscription.mockResolvedValue({
      subscription: { id: "sub1" },
      prorationInvoice: null,
    });

    const res = await resolver.updateSubscription(
      { id: "sub1" } as any,
      ctx as any
    );

    expect(res.subscription.id).toBe("sub1");
    expect(res.prorationInvoice).toBeNull();
  });

  it("cancelSubscription: coerces atPeriodEnd to boolean (!!) before calling service", async () => {
    service.cancelSubscription.mockResolvedValue({
      subscription: { id: "sub1", cancelAtPeriodEnd: true },
    });

    const res = await resolver.cancelSubscription(
      { id: "sub1" } as any, // atPeriodEnd نیامده -> باید false بشه
      ctx as any
    );

    // آرگومان پاس داده شده به سرویس رو بررسی کنیم
    const [firstCallArg] = service.cancelSubscription.mock.calls[0];
    expect(firstCallArg).toEqual({ id: "sub1", atPeriodEnd: false });

    expect(res.subscription.id).toBe("sub1");
  });

  it("upcomingInvoice: proxies to service", async () => {
    service.upcomingInvoice.mockResolvedValue({
      amountCents: 1234,
      currency: "USD",
      dueAt: new Date(),
      plan: "STANDARD",
    });

    const res = await resolver.upcomingInvoice(
      { tenantId: "t1" } as any,
      ctx as any
    );

    expect(service.upcomingInvoice).toHaveBeenCalled();
    expect(res.amountCents).toBe(1234);
  });

  it("issueInvoice: proxies and returns entity", async () => {
    service.issueInvoice.mockResolvedValue({ id: "inv1", meta: { a: 1 } });
    const res = await resolver.issueInvoice(
      { tenantId: "t1", amountCents: 100 } as any,
      ctx as any
    );
    expect(service.issueInvoice).toHaveBeenCalled();
    expect(res.id).toBe("inv1");
  });

  it("markInvoice: proxies and returns entity", async () => {
    service.markInvoice.mockResolvedValue({ id: "inv2", status: "PAID" });
    const res = await resolver.markInvoice(
      { id: "inv2", status: "PAID" } as any,
      ctx as any
    );
    expect(service.markInvoice).toHaveBeenCalled();
    expect(res.status).toBe("PAID");
  });

  it("invoices: normalizes page/pageSize and proxies", async () => {
    service.listInvoices.mockResolvedValue({
      total: 0,
      page: 1,
      pageSize: 20,
      items: [],
    });

    const res = await resolver.invoices(
      { tenantId: "t1", page: undefined, pageSize: undefined } as any,
      ctx as any
    );

    const [callArg] = service.listInvoices.mock.calls[0];
    expect(callArg.page).toBe(1);
    expect(callArg.pageSize).toBe(20);
    expect(res.items).toEqual([]);
  });

  it("invoice: proxies getInvoice", async () => {
    service.getInvoice.mockResolvedValue({ id: "invX", meta: "{}" });
    const res = await resolver.invoice("invX", ctx as any);
    expect(service.getInvoice).toHaveBeenCalledWith("invX", ctx.req.user);
    expect(res.id).toBe("invX");
  });
});
