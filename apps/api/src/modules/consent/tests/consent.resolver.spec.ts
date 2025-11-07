import { Role, TenantRole } from "@prisma/client";
import { ConsentResolver } from "@consent/resolvers/consent.resolver";
import { ConsentService } from "@consent/services/consent.service";
import { Test } from "@nestjs/testing";

describe("ConsentResolver", () => {
  let resolver: ConsentResolver;
  let service: jest.Mocked<ConsentService>;

  const mockService: jest.Mocked<ConsentService> = {
    myConsents: jest.fn(),
    userConsents: jest.fn(),
    searchConsents: jest.fn(),
    setConsent: jest.fn(),
    revokeConsent: jest.fn(),
    deleteConsent: jest.fn(),
  } as any;

  const ctxWith = (user: any) => ({ req: { user } });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConsentResolver,
        { provide: ConsentService, useValue: mockService },
      ],
    }).compile();

    resolver = module.get(ConsentResolver);
    service = module.get(ConsentService) as any;
    jest.clearAllMocks();
  });

  it("myConsents delegates to service with tenantId & ctx user", async () => {
    service.myConsents.mockResolvedValueOnce([]);
    const ctx = ctxWith({ id: "u1", role: Role.STUDENT });

    const res = await resolver.myConsents("t1", ctx);
    expect(service.myConsents).toHaveBeenCalledWith("t1", {
      id: "u1",
      role: Role.STUDENT,
    });
    expect(res).toEqual([]);
  });

  it("userConsents delegates correctly", async () => {
    service.userConsents.mockResolvedValueOnce([]);
    const ctx = ctxWith({ id: "admin1", role: Role.SUPER_ADMIN });

    await resolver.userConsents("t1", "target", ctx);
    expect(service.userConsents).toHaveBeenCalledWith("t1", "target", {
      id: "admin1",
      role: Role.SUPER_ADMIN,
    });
  });

  it("searchConsents shapes page/pageSize and forwards filters + actor", async () => {
    service.searchConsents.mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });

    const ctx = ctxWith({ id: "co1", role: Role.COUNSELOR });

    await resolver.searchConsents(
      { tenantId: "t1", q: "ali" } as any,
      0, // should clamp to 1
      500, // should clamp to 100
      ctx
    );

    expect(service.searchConsents).toHaveBeenCalledWith(
      { tenantId: "t1", q: "ali", page: 1, pageSize: 100 },
      { id: "co1", role: Role.COUNSELOR }
    );
  });

  it("setConsent forwards input + actor", async () => {
    service.setConsent.mockResolvedValueOnce({ id: "c1" } as any);

    const ctx = ctxWith({ id: "u1", role: Role.STUDENT });

    const res = await resolver.setConsent(
      { tenantId: "t1", type: "MARKETING", status: "GRANTED" } as any,
      ctx
    );

    expect(service.setConsent).toHaveBeenCalledWith(
      { tenantId: "t1", type: "MARKETING", status: "GRANTED" },
      { id: "u1", role: Role.STUDENT }
    );
    expect(res).toEqual({ id: "c1" });
  });

  it("revokeConsent forwards input + actor", async () => {
    service.revokeConsent.mockResolvedValueOnce({ id: "c1" } as any);
    const ctx = ctxWith({ id: "u1", role: Role.STUDENT });

    const res = await resolver.revokeConsent(
      { tenantId: "t1", type: "MARKETING" } as any,
      ctx
    );

    expect(service.revokeConsent).toHaveBeenCalledWith(
      { tenantId: "t1", type: "MARKETING" },
      { id: "u1", role: Role.STUDENT }
    );
    expect(res).toEqual({ id: "c1" });
  });

  it("deleteConsent forwards id + actor and returns boolean", async () => {
    service.deleteConsent.mockResolvedValueOnce(true);
    const ctx = ctxWith({
      id: "sa1",
      role: TenantRole.SCHOOL_ADMIN as unknown as Role,
    });

    const res = await resolver.deleteConsent("cid", ctx);
    expect(service.deleteConsent).toHaveBeenCalledWith("cid", {
      id: "sa1",
      role: TenantRole.SCHOOL_ADMIN as unknown as Role,
    });
    expect(res).toBe(true);
  });
});
