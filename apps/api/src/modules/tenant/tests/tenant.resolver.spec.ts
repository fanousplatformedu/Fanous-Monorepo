import { Test, TestingModule } from "@nestjs/testing";
import { TenantResolver } from "@tenant/resolvers/tenant.resolver";
import { TenantService } from "@tenant/services/tenant.service";

describe("TenantResolver", () => {
  let resolver: TenantResolver;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantResolver,
        {
          provide: TenantService,
          useValue: {
            byId: jest.fn(),
            bySlug: jest.fn(),
            paginate: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            archive: jest.fn(),
            restore: jest.fn(),
            setSettings: jest.fn(),
            assignLicense: jest.fn(),
            createSubscription: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(TenantResolver);
    service = module.get(TenantService) as any;
    jest.clearAllMocks();
  });

  // Queries
  it("tenantById → call service.byId", async () => {
    service.byId.mockResolvedValue({ id: "t1" });
    const res = await resolver.tenantById("t1");
    expect(res).toEqual({ id: "t1" });
    expect(service.byId).toHaveBeenCalledWith("t1");
  });

  it("tenantBySlug → call service.bySlug", async () => {
    service.bySlug.mockResolvedValue({ id: "t1", slug: "ten" });
    const res = await resolver.tenantBySlug("ten");
    expect(res).toEqual({ id: "t1", slug: "ten" });
    expect(service.bySlug).toHaveBeenCalledWith("ten");
  });

  it("tenants → call service.paginate", async () => {
    service.paginate.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });
    const input = { page: 1, pageSize: 10 };
    const res = await resolver.tenants(input as any);
    expect(res).toEqual({ items: [], total: 0, page: 1, pageSize: 10 });
    expect(service.paginate).toHaveBeenCalledWith(input);
  });

  // Mutations
  it("createTenant → call service.create", async () => {
    service.create.mockResolvedValue({ id: "t1" });
    const res = await resolver.createTenant({
      name: "Ten",
      slug: "ten",
    } as any);
    expect(res).toEqual({ id: "t1" });
    expect(service.create).toHaveBeenCalledWith({ name: "Ten", slug: "ten" });
  });

  it("updateTenant → call service.update", async () => {
    service.update.mockResolvedValue({ id: "t1", name: "New" });
    const res = await resolver.updateTenant({ id: "t1", name: "New" } as any);
    expect(res).toEqual({ id: "t1", name: "New" });
    expect(service.update).toHaveBeenCalledWith({ id: "t1", name: "New" });
  });

  it("archiveTenant → true", async () => {
    service.archive.mockResolvedValue(true);
    const res = await resolver.archiveTenant("t1");
    expect(res).toBe(true);
    expect(service.archive).toHaveBeenCalledWith("t1");
  });

  it("restoreTenant → true", async () => {
    service.restore.mockResolvedValue(true);
    const res = await resolver.restoreTenant("t1");
    expect(res).toBe(true);
    expect(service.restore).toHaveBeenCalledWith("t1");
  });

  it("setTenantSettings → call service.setSettings", async () => {
    service.setSettings.mockResolvedValue({ id: "s1" });
    const res = await resolver.setTenantSettings({ tenantId: "t1" } as any);
    expect(res).toEqual({ id: "s1" });
    expect(service.setSettings).toHaveBeenCalledWith({ tenantId: "t1" });
  });

  it("assignLicense → call service.assignLicense", async () => {
    service.assignLicense.mockResolvedValue({ id: "lic1" });
    const res = await resolver.assignLicense({
      tenantId: "t1",
      plan: "STANDARD",
      seats: 10,
      startsAt: new Date("2025-01-01"),
    } as any);
    expect(res).toEqual({ id: "lic1" });
    expect(service.assignLicense).toHaveBeenCalled();
  });

  it("createSubscription → call service.createSubscription", async () => {
    service.createSubscription.mockResolvedValue({ id: "sub1" });
    const res = await resolver.createSubscription({
      tenantId: "t1",
      plan: "STANDARD",
      currentPeriodStart: new Date("2025-01-01"),
      currentPeriodEnd: new Date("2025-02-01"),
    } as any);
    expect(res).toEqual({ id: "sub1" });
    expect(service.createSubscription).toHaveBeenCalled();
  });
});
