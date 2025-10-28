import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TenantService } from "@tenant/services/tenant.service";
import { PrismaService } from "@prisma/prisma.service";

const makeTransaction = () =>
  jest.fn(async (promises: any[]) => Promise.all(promises));

describe("TenantService", () => {
  let service: TenantService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: makeTransaction(),
            tenant: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
            tenantSettings: {
              upsert: jest.fn(),
            },
            license: {
              create: jest.fn(),
            },
            subscription: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(TenantService);
    prisma = module.get(PrismaService) as any;
    jest.clearAllMocks();
  });

  // ========== create ==========
  it("create: اگر slug وجود داشته باشد → BadRequest", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    await expect(
      service.create({ name: " Ten ", slug: " ten " } as any)
    ).rejects.toThrow(new BadRequestException("Slug already exists"));
  });

  it("create: موفق با trim name/slug", async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    prisma.tenant.create.mockResolvedValue({
      id: "t1",
      name: "Ten",
      slug: "ten",
      settings: null,
    });
    const res = await service.create({ name: "  Ten ", slug: " ten " } as any);
    expect(res).toEqual({ id: "t1", name: "Ten", slug: "ten", settings: null });
    expect(prisma.tenant.create).toHaveBeenCalledWith({
      data: { name: "Ten", slug: "ten" },
      include: { settings: true },
    });
  });

  // ========== update ==========
  it("update: تننت پیدا نشد → NotFound", async () => {
    prisma.tenant.findUnique.mockResolvedValueOnce(null);
    await expect(
      service.update({ id: "tX", name: "N" } as any)
    ).rejects.toThrow(new NotFoundException("Tenant not found"));
  });

  it("update: slug تکراری برای تننت دیگر → BadRequest", async () => {
    prisma.tenant.findUnique
      .mockResolvedValueOnce({ id: "t1" }) // current tenant by id
      .mockResolvedValueOnce({ id: "t2" }); // dup by slug
    await expect(
      service.update({ id: "t1", slug: "dup" } as any)
    ).rejects.toThrow(new BadRequestException("Slug already in use"));
  });

  it("update: موفق با trim و include settings", async () => {
    prisma.tenant.findUnique
      .mockResolvedValueOnce({ id: "t1" }) // current tenant
      .mockResolvedValueOnce(null); // no dup slug
    prisma.tenant.update.mockResolvedValue({
      id: "t1",
      name: "New",
      slug: "new-slug",
      settings: { id: "s1" },
    });
    const res = await service.update({
      id: "t1",
      name: "  New ",
      slug: " new-slug ",
    } as any);
    expect(res).toEqual({
      id: "t1",
      name: "New",
      slug: "new-slug",
      settings: { id: "s1" },
    });
    expect(prisma.tenant.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { name: "New", slug: "new-slug" },
      include: { settings: true },
    });
  });

  // ========== archive / restore ==========
  it("archive: تننت پیدا نشد → NotFound", async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    await expect(service.archive("tX")).rejects.toThrow(
      new NotFoundException("Tenant not found")
    );
  });

  it("archive: موفق", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    prisma.tenant.update.mockResolvedValue({ id: "t1", deletedAt: new Date() });
    const res = await service.archive("t1");
    expect(res.id).toBe("t1");
    expect(prisma.tenant.update).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it("restore: تننت پیدا نشد → NotFound", async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    await expect(service.restore("tX")).rejects.toThrow(
      new NotFoundException("Tenant not found")
    );
  });

  it("restore: موفق", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    prisma.tenant.update.mockResolvedValue({ id: "t1", deletedAt: null });
    const res = await service.restore("t1");
    expect(res).toEqual({ id: "t1", deletedAt: null });
  });

  // ========== byId / bySlug ==========
  it("byId: تننت پیدا نشد → NotFound", async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    await expect(service.byId("tX")).rejects.toThrow(
      new NotFoundException("Tenant not found")
    );
  });

  it("byId: موفق با include ها", async () => {
    prisma.tenant.findUnique.mockResolvedValue({
      id: "t1",
      settings: { id: "s1" },
      licenses: [],
      subscriptions: [],
    });
    const res = await service.byId("t1");
    expect(res).toEqual({
      id: "t1",
      settings: { id: "s1" },
      licenses: [],
      subscriptions: [],
    });
    expect(prisma.tenant.findUnique).toHaveBeenCalledWith({
      where: { id: "t1" },
      include: { settings: true, licenses: true, subscriptions: true },
    });
  });

  it("bySlug: تننت پیدا نشد → NotFound", async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    await expect(service.bySlug("x")).rejects.toThrow(
      new NotFoundException("Tenant not found")
    );
  });

  it("bySlug: موفق", async () => {
    prisma.tenant.findUnique.mockResolvedValue({
      id: "t1",
      settings: null,
      licenses: [],
      subscriptions: [],
    });
    const res = await service.bySlug("ten");
    expect(res.id).toBe("t1");
    expect(prisma.tenant.findUnique).toHaveBeenCalledWith({
      where: { slug: "ten" },
      include: { settings: true, licenses: true, subscriptions: true },
    });
  });

  // ========== paginate ==========
  it("paginate: برگرداندن items/total/page/pageSize و استفاده از $transaction", async () => {
    prisma.tenant.findMany.mockResolvedValue([{ id: "t1" }]);
    prisma.tenant.count.mockResolvedValue(1);
    const res = await service.paginate({
      page: 2,
      pageSize: 10,
      search: "ten",
      includeDeleted: false,
    } as any);
    expect(res).toEqual({
      items: [{ id: "t1" }],
      total: 1,
      page: 2,
      pageSize: 10,
    });
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  // ========== setSettings ==========
  it("setSettings: تننت پیدا نشد → NotFound", async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    await expect(
      service.setSettings({ tenantId: "tX" } as any)
    ).rejects.toThrow(new NotFoundException("Tenant not found"));
  });

  it("setSettings: create (بدون فیلدهای json) → upsert create", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    prisma.tenantSettings.upsert.mockResolvedValue({
      id: "s1",
      tenantId: "t1",
      defaultLanguage: "FA",
    });
    const res = await service.setSettings({
      tenantId: "t1",
      defaultLanguage: "FA",
    } as any);
    expect(res).toEqual({ id: "s1", tenantId: "t1", defaultLanguage: "FA" });
    expect(prisma.tenantSettings.upsert).toHaveBeenCalledWith({
      where: { tenantId: "t1" },
      create: {
        tenantId: "t1",
        brandingJson: undefined,
        ssoConfigJson: undefined,
        webhookConfigJson: undefined,
        defaultLanguage: "FA",
        allowedLanguages: undefined,
        retentionDays: undefined,
      },
      update: { defaultLanguage: "FA" },
      include: { tenant: false },
    });
  });

  it("setSettings: update با json-string → parse و set/null", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    prisma.tenantSettings.upsert.mockResolvedValue({
      id: "s1",
      tenantId: "t1",
      brandingJson: { logo: "x" },
      ssoConfigJson: null,
      webhookConfigJson: { url: "u" },
    });
    const res = await service.setSettings({
      tenantId: "t1",
      brandingJson: JSON.stringify({ logo: "x" }),
      ssoConfigJson: "", // → null
      webhookConfigJson: JSON.stringify({ url: "u" }),
    } as any);
    expect(res.id).toBe("s1");
    expect(prisma.tenantSettings.upsert).toHaveBeenCalledWith({
      where: { tenantId: "t1" },
      create: {
        tenantId: "t1",
        brandingJson: { logo: "x" },
        ssoConfigJson: undefined,
        webhookConfigJson: { url: "u" },
        defaultLanguage: undefined,
        allowedLanguages: undefined,
        retentionDays: undefined,
      },
      update: {
        brandingJson: { logo: "x" },
        ssoConfigJson: null,
        webhookConfigJson: { url: "u" },
      },
      include: { tenant: false },
    });
  });

  // ========== assignLicense ==========
  it("assignLicense: تننت پیدا نشد → NotFound", async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    await expect(
      service.assignLicense({
        tenantId: "tX",
        plan: "STANDARD",
        seats: 100,
        startsAt: new Date(),
      } as any)
    ).rejects.toThrow(new NotFoundException("Tenant not found"));
  });

  it("assignLicense: endsAt قبل از startsAt → BadRequest", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    await expect(
      service.assignLicense({
        tenantId: "t1",
        plan: "STANDARD",
        seats: 100,
        startsAt: new Date("2025-02-01"),
        endsAt: new Date("2025-01-01"),
      } as any)
    ).rejects.toThrow(new BadRequestException("endsAt must be after startsAt"));
  });

  it("assignLicense: موفق", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    prisma.license.create.mockResolvedValue({
      id: "lic1",
      tenantId: "t1",
      plan: "STANDARD",
      seats: 100,
    });
    const res = await service.assignLicense({
      tenantId: "t1",
      plan: "STANDARD",
      seats: 100,
      startsAt: new Date("2025-01-01"),
    } as any);
    expect(res.id).toBe("lic1");
    expect(prisma.license.create).toHaveBeenCalled();
  });

  // ========== createSubscription ==========
  it("createSubscription: تننت پیدا نشد → NotFound", async () => {
    prisma.tenant.findUnique.mockResolvedValue(null);
    await expect(
      service.createSubscription({
        tenantId: "tX",
        plan: "STANDARD",
        currentPeriodStart: new Date("2025-01-01"),
        currentPeriodEnd: new Date("2025-02-01"),
      } as any)
    ).rejects.toThrow(new NotFoundException("Tenant not found"));
  });

  it("createSubscription: currentPeriodEnd < currentPeriodStart → BadRequest", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    await expect(
      service.createSubscription({
        tenantId: "t1",
        plan: "STANDARD",
        currentPeriodStart: new Date("2025-02-01"),
        currentPeriodEnd: new Date("2025-01-01"),
      } as any)
    ).rejects.toThrow(
      new BadRequestException(
        "currentPeriodEnd must be after currentPeriodStart"
      )
    );
  });

  it("createSubscription: موفق", async () => {
    prisma.tenant.findUnique.mockResolvedValue({ id: "t1" });
    prisma.subscription.create.mockResolvedValue({
      id: "sub1",
      tenantId: "t1",
      plan: "STANDARD",
      status: "TRIALING",
    });
    const res = await service.createSubscription({
      tenantId: "t1",
      plan: "STANDARD",
      currentPeriodStart: new Date("2025-01-01"),
      currentPeriodEnd: new Date("2025-02-01"),
      cancelAtPeriodEnd: true,
    } as any);
    expect(res.id).toBe("sub1");
    expect(prisma.subscription.create).toHaveBeenCalledWith({
      data: {
        tenantId: "t1",
        plan: "STANDARD",
        status: "TRIALING",
        currentPeriodStart: new Date("2025-01-01"),
        currentPeriodEnd: new Date("2025-02-01"),
        cancelAtPeriodEnd: true,
      },
    });
  });
});
