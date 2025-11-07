import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { BrandingService } from "@branding/services/branding.service";
import { Role } from "@prisma/client";

const makePrismaMock = () => ({
  tenant: {
    findUnique: jest.fn(),
  },
  tenantSettings: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  fileAsset: {
    findUnique: jest.fn(),
  },
});

type Actor = { id: string; role: Role };

describe("BrandingService", () => {
  let service: BrandingService;
  let prisma: ReturnType<typeof makePrismaMock>;

  const now = new Date();
  const tenantId = "t1";
  const superAdmin: Actor = { id: "a1", role: Role.SUPER_ADMIN };
  const adminUser: Actor = { id: "a2", role: Role.ADMIN };
  const nonAdmin: Actor = { id: "u1", role: Role.STUDENT };
  const baseBrandingJson = {
    appName: "Acme",
    darkMode: true,
    customCss: ".x{y:1}",
    cssVars: { "--c": "#fff" },
    assets: {
      logoUrl: "https://cdn/logo.png",
      logoDarkUrl: "https://cdn/logo-dark.png",
      faviconUrl: "https://cdn/favicon.ico",
      backgroundUrl: "https://cdn/bg.jpg",
    },
    colors: {
      primary: "#111",
      secondary: "#222",
      accent: "#333",
      surface: "#444",
      text: "#555",
    },
    typography: { headings: "Inter", body: "Roboto" },
  };

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new BrandingService(prisma as any);
    jest.clearAllMocks();
    prisma.tenant.findUnique.mockResolvedValue({ id: tenantId });
    prisma.tenantSettings.findUnique.mockResolvedValue({
      id: "s1",
      tenantId,
      brandingJson: baseBrandingJson,
      defaultLanguage: "FA",
      allowedLanguages: [],
      ssoConfigJson: null,
      webhookConfigJson: null,
      retentionDays: null,
      createdAt: now,
      updatedAt: now,
    });
  });

  // ============= getBranding ==============
  describe("getBranding", () => {
    it("returns mapped branding entity with updatedAt", async () => {
      const res = await service.getBranding(tenantId);

      expect(prisma.tenant.findUnique).toHaveBeenCalledWith({
        where: { id: tenantId },
        select: { id: true },
      });
      expect(prisma.tenantSettings.findUnique).toHaveBeenCalledWith({
        where: { tenantId },
      });

      expect(res).toEqual(
        expect.objectContaining({
          appName: "Acme",
          darkMode: true,
          customCss: ".x{y:1}",
          cssVarsJson: JSON.stringify({ "--c": "#fff" }),
          logoUrl: "https://cdn/logo.png",
          logoDarkUrl: "https://cdn/logo-dark.png",
          faviconUrl: "https://cdn/favicon.ico",
          backgroundUrl: "https://cdn/bg.jpg",
          primaryColor: "#111",
          secondaryColor: "#222",
          accentColor: "#333",
          surfaceColor: "#444",
          textColor: "#555",
          fontFamilyHeadings: "Inter",
          fontFamilyBody: "Roboto",
          updatedAt: now,
        })
      );
    });

    it("creates tenantSettings if none exists", async () => {
      prisma.tenantSettings.findUnique.mockResolvedValueOnce(null);
      prisma.tenantSettings.create.mockResolvedValueOnce({
        id: "created-settings",
        tenantId,
        brandingJson: {},
        updatedAt: now,
        createdAt: now,
        defaultLanguage: "FA",
        allowedLanguages: [],
        ssoConfigJson: null,
        webhookConfigJson: null,
        retentionDays: null,
      });

      const res = await service.getBranding(tenantId);
      expect(prisma.tenantSettings.create).toHaveBeenCalledWith({
        data: { tenantId },
      });
      expect(res.updatedAt).toEqual(now);
    });

    it("is safe if brandingJson is not an object", async () => {
      prisma.tenantSettings.findUnique.mockResolvedValueOnce({
        id: "s2",
        tenantId,
        brandingJson: "oops",
        updatedAt: now,
        createdAt: now,
        defaultLanguage: "FA",
        allowedLanguages: [],
        ssoConfigJson: null,
        webhookConfigJson: null,
        retentionDays: null,
      });

      const res = await service.getBranding(tenantId);
      expect(res).toEqual(
        expect.objectContaining({
          appName: null,
          logoUrl: null,
          primaryColor: null,
          updatedAt: now,
        })
      );
    });

    it("throws NotFound if tenant missing", async () => {
      prisma.tenant.findUnique.mockResolvedValueOnce(null);
      await expect(service.getBranding(tenantId)).rejects.toBeInstanceOf(
        NotFoundException
      );
    });
  });

  // ========== getBrandingBySlug ==============
  describe("getBrandingBySlug", () => {
    it("resolves slug to tenant and returns branding", async () => {
      prisma.tenant.findUnique.mockResolvedValueOnce({ id: tenantId }); // by slug
      const res = await service.getBrandingBySlug("acme");
      expect(prisma.tenant.findUnique).toHaveBeenNthCalledWith(1, {
        where: { slug: "acme" },
        select: { id: true },
      });
      expect(res.updatedAt).toEqual(now);
    });

    it("throws NotFound when slug not found", async () => {
      prisma.tenant.findUnique.mockResolvedValueOnce(null);
      await expect(service.getBrandingBySlug("missing")).rejects.toBeInstanceOf(
        NotFoundException
      );
    });
  });

  // =========== setBranding ===============
  describe("setBranding", () => {
    it("forbids non-admin", async () => {
      await expect(
        service.setBranding({ tenantId, appName: "New" }, nonAdmin)
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("merges patch, resolves FileAsset URLs, updates settings", async () => {
      prisma.fileAsset.findUnique
        .mockResolvedValueOnce({ url: "https://cdn/new-logo.png" })
        .mockResolvedValueOnce({ url: "https://cdn/new-dark.png" })
        .mockResolvedValueOnce({ url: "https://cdn/new-favicon.ico" })
        .mockResolvedValueOnce({ url: "https://cdn/new-bg.jpg" });

      prisma.tenantSettings.update.mockResolvedValueOnce({
        id: "s1",
        tenantId,
        updatedAt: now,
        createdAt: now,
        defaultLanguage: "FA",
        allowedLanguages: [],
        ssoConfigJson: null,
        webhookConfigJson: null,
        retentionDays: null,
        brandingJson: {
          appName: "Brand X",
          darkMode: false,
          customCss: ".ok{}",
          cssVars: { a: 1 },
          assets: {
            logoUrl: "https://cdn/new-logo.png",
            logoDarkUrl: "https://cdn/new-dark.png",
            faviconUrl: "https://cdn/new-favicon.ico",
            backgroundUrl: "https://cdn/new-bg.jpg",
          },
          colors: {
            primary: "#abc",
            secondary: "#def",
            accent: "#999",
            surface: "#eee",
            text: "#123",
          },
          typography: {
            headings: "Manrope",
            body: "Open Sans",
          },
        },
      });

      const res = await service.setBranding(
        {
          tenantId,
          appName: "Brand X",
          darkMode: false,
          logoFileId: "f1",
          logoDarkFileId: "f2",
          faviconFileId: "f3",
          backgroundFileId: "f4",
          primaryColor: "#abc",
          secondaryColor: "#def",
          accentColor: "#999",
          surfaceColor: "#eee",
          textColor: "#123",
          fontFamilyHeadings: "Manrope",
          fontFamilyBody: "Open Sans",
          cssVarsJson: JSON.stringify({ a: 1 }),
          customCss: ".ok{}",
        },
        superAdmin
      );

      const updateArgs = prisma.tenantSettings.update.mock.calls[0][0];
      expect(updateArgs.where).toEqual({ tenantId });
      expect(updateArgs.data.brandingJson).toEqual(
        expect.objectContaining({
          appName: "Brand X",
          darkMode: false,
          assets: expect.objectContaining({
            logoUrl: "https://cdn/new-logo.png",
            logoDarkUrl: "https://cdn/new-dark.png",
            faviconUrl: "https://cdn/new-favicon.ico",
            backgroundUrl: "https://cdn/new-bg.jpg",
          }),
          colors: expect.objectContaining({
            primary: "#abc",
            secondary: "#def",
            accent: "#999",
            surface: "#eee",
            text: "#123",
          }),
          typography: expect.objectContaining({
            headings: "Manrope",
            body: "Open Sans",
          }),
          cssVars: { a: 1 },
          customCss: ".ok{}",
        })
      );

      expect(res).toEqual(
        expect.objectContaining({
          appName: "Brand X",
          darkMode: false,
          logoUrl: "https://cdn/new-logo.png",
          primaryColor: "#abc",
          fontFamilyHeadings: "Manrope",
          cssVarsJson: JSON.stringify({ a: 1 }),
          updatedAt: now,
        })
      );
    });

    it("throws BadRequest on invalid cssVarsJson", async () => {
      await expect(
        service.setBranding({ tenantId, cssVarsJson: "{oops" }, adminUser)
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("throws NotFound if FileAsset not found", async () => {
      prisma.fileAsset.findUnique.mockResolvedValueOnce(null);
      await expect(
        service.setBranding({ tenantId, logoFileId: "missing" }, superAdmin)
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ========== upsertBrandingAsset ===============
  describe("upsertBrandingAsset", () => {
    it("forbids non-admin", async () => {
      await expect(
        service.upsertBrandingAsset(
          { tenantId, field: "logo", fileId: "f1" },
          nonAdmin
        )
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("rejects invalid field", async () => {
      await expect(
        service.upsertBrandingAsset(
          { tenantId, field: "unknown", fileId: "f1" },
          superAdmin
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("sets URL by field mapping and returns mapped branding", async () => {
      prisma.fileAsset.findUnique.mockResolvedValueOnce({
        url: "https://cdn/new-logo.png",
      });

      prisma.tenantSettings.update.mockResolvedValueOnce({
        id: "s1",
        tenantId,
        brandingJson: {
          ...baseBrandingJson,
          assets: {
            ...(baseBrandingJson.assets ?? {}),
            logoUrl: "https://cdn/new-logo.png",
          },
        },
        defaultLanguage: "FA",
        allowedLanguages: [],
        ssoConfigJson: null,
        webhookConfigJson: null,
        retentionDays: null,
        createdAt: now,
        updatedAt: now,
      });

      const res = await service.upsertBrandingAsset(
        { tenantId, field: "logo", fileId: "f1" },
        superAdmin
      );

      const call = prisma.tenantSettings.update.mock.calls[0][0];
      expect(call.where).toEqual({ tenantId });
      expect(call.data.brandingJson.assets.logoUrl).toBe(
        "https://cdn/new-logo.png"
      );

      expect(res.logoUrl).toBe("https://cdn/new-logo.png");
      expect(res.updatedAt).toEqual(now);
    });

    it("removes URL when fileId omitted (null)", async () => {
      prisma.tenantSettings.update.mockResolvedValueOnce({
        id: "s1",
        tenantId,
        brandingJson: {
          ...baseBrandingJson,
          assets: {
            ...(baseBrandingJson.assets ?? {}),
            backgroundUrl: null,
          },
        },
        defaultLanguage: "FA",
        allowedLanguages: [],
        ssoConfigJson: null,
        webhookConfigJson: null,
        retentionDays: null,
        createdAt: now,
        updatedAt: now,
      });

      const res = await service.upsertBrandingAsset(
        { tenantId, field: "background" }, // no fileId
        superAdmin
      );

      expect(prisma.fileAsset.findUnique).not.toHaveBeenCalled();
      expect(res.backgroundUrl).toBeNull();
    });
  });
});
