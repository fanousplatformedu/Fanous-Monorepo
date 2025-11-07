import { BrandingResolver } from "@branding/resolvers/branding.resolver";
import { BrandingService } from "@branding/services/branding.service";
import { Role } from "@prisma/client";

describe("BrandingResolver", () => {
  let resolver: BrandingResolver;
  let service: jest.Mocked<BrandingService>;

  const mockService = {
    getBranding: jest.fn(),
    getBrandingBySlug: jest.fn(),
    setBranding: jest.fn(),
    upsertBrandingAsset: jest.fn(),
  } as unknown as jest.Mocked<BrandingService>;

  const ctx = (user: any) => ({ req: { user } });

  beforeEach(() => {
    jest.clearAllMocks();
    resolver = new BrandingResolver(mockService);
    service = mockService;
  });

  it("branding → calls service.getBranding with tenantId", async () => {
    service.getBranding.mockResolvedValueOnce({ appName: "X" } as any);
    const res = await resolver.branding("t1");
    expect(service.getBranding).toHaveBeenCalledWith("t1");
    expect(res).toEqual({ appName: "X" });
  });

  it("brandingBySlug → calls service.getBrandingBySlug with slug", async () => {
    service.getBrandingBySlug.mockResolvedValueOnce({ appName: "Y" } as any);
    const res = await resolver.brandingBySlug({ slug: "acme" });
    expect(service.getBrandingBySlug).toHaveBeenCalledWith("acme");
    expect(res).toEqual({ appName: "Y" });
  });

  it("setBranding → forwards input and ctx.req.user", async () => {
    const input = { tenantId: "t1", appName: "Z" } as any;
    const user = { id: "a1", role: Role.SUPER_ADMIN };
    service.setBranding.mockResolvedValueOnce({ appName: "Z" } as any);

    const res = await resolver.setBranding(input, ctx(user) as any);
    expect(service.setBranding).toHaveBeenCalledWith(input, user);
    expect(res).toEqual({ appName: "Z" });
  });

  it("upsertBrandingAsset → forwards input and ctx.req.user", async () => {
    const input = { tenantId: "t1", field: "logo", fileId: "f1" } as any;
    // 👇 keep it simple: valid Role enum value
    const user = { id: "a2", role: Role.ADMIN };
    service.upsertBrandingAsset.mockResolvedValueOnce({ logoUrl: "u" } as any);

    const res = await resolver.upsertBrandingAsset(input, ctx(user) as any);
    expect(service.upsertBrandingAsset).toHaveBeenCalledWith(input, user);
    expect(res).toEqual({ logoUrl: "u" });
  });
});
