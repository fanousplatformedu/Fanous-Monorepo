import { NotFoundException, ForbiddenException } from "@nestjs/common";
import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { Role } from "@prisma/client";

type BrandingJson = {
  appName?: string;
  darkMode?: boolean;
  customCss?: string;
  cssVars?: any;
  assets?: {
    logoUrl?: string | null;
    logoDarkUrl?: string | null;
    faviconUrl?: string | null;
    backgroundUrl?: string | null;
  };
  colors?: {
    primary?: string | null;
    secondary?: string | null;
    accent?: string | null;
    surface?: string | null;
    text?: string | null;
  };
  typography?: {
    headings?: string | null;
    body?: string | null;
  };
};

type Actor = { id: string; role: Role };

@Injectable()
export class BrandingService {
  constructor(private prismaService: PrismaService) {}

  private isAdmin(actor?: Actor) {
    const r = String(actor?.role ?? "").toUpperCase();
    return ["SUPER_ADMIN", "SCHOOL_ADMIN", "ADMIN"].includes(r);
  }

  private parseJsonOrNull(s?: string | null) {
    if (s == null) return null;
    try {
      return JSON.parse(s);
    } catch {
      throw new BadRequestException("Invalid JSON string");
    }
  }
  private jstr(x: any) {
    return x == null ? null : JSON.stringify(x);
  }

  private asBranding(json: unknown): BrandingJson {
    if (json && typeof json === "object" && !Array.isArray(json))
      return json as BrandingJson;
    return {};
  }

  private pickAssetUrl = async (fileId?: string | null) => {
    if (!fileId) return null;
    const f = await this.prismaService.fileAsset.findUnique({
      where: { id: fileId },
      select: { url: true },
    });
    if (!f) throw new NotFoundException("FileAsset not found");
    return f.url ?? null;
  };

  private merge(
    a: Record<string, any> | undefined,
    b: Record<string, any> | undefined
  ) {
    const out: Record<string, any> = { ...(a ?? {}) };
    for (const k of Object.keys(b ?? {})) {
      const v = (b as any)[k];
      if (v === undefined) continue;
      if (v === null) out[k] = null;
      else out[k] = v;
    }
    return out;
  }

  private mapBrandingJsonToEntity(json: BrandingJson) {
    return {
      appName: json?.appName ?? null,
      logoUrl: json?.assets?.logoUrl ?? null,
      logoDarkUrl: json?.assets?.logoDarkUrl ?? null,
      faviconUrl: json?.assets?.faviconUrl ?? null,
      backgroundUrl: json?.assets?.backgroundUrl ?? null,
      primaryColor: json?.colors?.primary ?? null,
      secondaryColor: json?.colors?.secondary ?? null,
      accentColor: json?.colors?.accent ?? null,
      surfaceColor: json?.colors?.surface ?? null,
      textColor: json?.colors?.text ?? null,
      darkMode: json?.darkMode ?? null,
      fontFamilyHeadings: json?.typography?.headings ?? null,
      fontFamilyBody: json?.typography?.body ?? null,
      cssVarsJson: this.jstr(json?.cssVars ?? null),
      customCss: json?.customCss ?? null,
    };
  }

  private async getTenantSettings(tenantId: string) {
    const t = await this.prismaService.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true },
    });
    if (!t) throw new NotFoundException("Tenant not found");
    const settings = await this.prismaService.tenantSettings.findUnique({
      where: { tenantId },
    });
    return (
      settings ??
      (await this.prismaService.tenantSettings.create({ data: { tenantId } }))
    );
  }

  // ========== Get branding by tenantId =============
  async getBranding(tenantId: string) {
    const settings = await this.getTenantSettings(tenantId);
    const current = this.asBranding(settings.brandingJson ?? {});
    const mapped = this.mapBrandingJsonToEntity(current);
    return { ...mapped, updatedAt: settings.updatedAt ?? null };
  }

  // =========== Public: Get branding by slug ===========
  async getBrandingBySlug(slug: string) {
    const tenant = await this.prismaService.tenant.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");
    return this.getBranding(tenant.id);
  }

  // ========= Admin: Set branding ============
  async setBranding(
    input: {
      tenantId: string;
      appName?: string;
      darkMode?: boolean;
      logoFileId?: string;
      logoDarkFileId?: string;
      faviconFileId?: string;
      backgroundFileId?: string;
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
      surfaceColor?: string;
      textColor?: string;
      fontFamilyHeadings?: string;
      fontFamilyBody?: string;
      cssVarsJson?: string;
      customCss?: string;
    },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    const settings = await this.getTenantSettings(input.tenantId);
    const current = this.asBranding(settings.brandingJson ?? {});
    const patch: BrandingJson = {};
    if (input.appName !== undefined) patch.appName = input.appName;
    if (input.darkMode !== undefined) patch.darkMode = !!input.darkMode;
    const assets = { ...(current.assets ?? {}) };
    if (input.logoFileId !== undefined)
      assets.logoUrl = await this.pickAssetUrl(input.logoFileId);
    if (input.logoDarkFileId !== undefined)
      assets.logoDarkUrl = await this.pickAssetUrl(input.logoDarkFileId);
    if (input.faviconFileId !== undefined)
      assets.faviconUrl = await this.pickAssetUrl(input.faviconFileId);
    if (input.backgroundFileId !== undefined)
      assets.backgroundUrl = await this.pickAssetUrl(input.backgroundFileId);
    if (Object.keys(assets).length) patch.assets = assets;
    const colors = { ...(current.colors ?? {}) };
    if (input.primaryColor !== undefined) colors.primary = input.primaryColor;
    if (input.secondaryColor !== undefined)
      colors.secondary = input.secondaryColor;
    if (input.accentColor !== undefined) colors.accent = input.accentColor;
    if (input.surfaceColor !== undefined) colors.surface = input.surfaceColor;
    if (input.textColor !== undefined) colors.text = input.textColor;
    if (Object.keys(colors).length) patch.colors = colors;
    const typography = { ...(current.typography ?? {}) };
    if (input.fontFamilyHeadings !== undefined)
      typography.headings = input.fontFamilyHeadings;
    if (input.fontFamilyBody !== undefined)
      typography.body = input.fontFamilyBody;
    if (Object.keys(typography).length) patch.typography = typography;
    if (input.cssVarsJson !== undefined) {
      patch.cssVars = this.parseJsonOrNull(input.cssVarsJson);
    }
    if (input.customCss !== undefined) patch.customCss = input.customCss;
    const next: BrandingJson = {
      ...current,
      ...patch,
      assets: this.merge(current.assets, patch.assets),
      colors: this.merge(current.colors, patch.colors),
      typography: this.merge(current.typography, patch.typography),
    };

    const updated = await this.prismaService.tenantSettings.update({
      where: { tenantId: input.tenantId },
      data: { brandingJson: next as any },
    });

    const mapped = this.mapBrandingJsonToEntity(
      this.asBranding(updated.brandingJson ?? {})
    );
    return { ...mapped, updatedAt: updated.updatedAt ?? null };
  }

  // ============= Admin: upsert/remove ============
  async upsertBrandingAsset(
    input: { tenantId: string; field: string; fileId?: string },
    actor: Actor
  ) {
    if (!this.isAdmin(actor)) throw new ForbiddenException("Access denied");
    const allowed = new Set(["logo", "logoDark", "favicon", "background"]);
    if (!allowed.has(input.field))
      throw new BadRequestException("Invalid asset field");
    const settings = await this.getTenantSettings(input.tenantId);
    const current = this.asBranding(settings.brandingJson ?? {});
    const assets = { ...(current.assets ?? {}) };
    const keyMap: Record<string, string> = {
      logo: "logoUrl",
      logoDark: "logoDarkUrl",
      favicon: "faviconUrl",
      background: "backgroundUrl",
    };

    const url = input.fileId ? await this.pickAssetUrl(input.fileId) : null;
    (assets as any)[keyMap[input.field]] = url;
    const updated = await this.prismaService.tenantSettings.update({
      where: { tenantId: input.tenantId },
      data: { brandingJson: { ...current, assets } as any },
    });
    const mapped = this.mapBrandingJsonToEntity(
      this.asBranding(updated.brandingJson ?? {})
    );
    return { ...mapped, updatedAt: updated.updatedAt ?? null };
  }
}
