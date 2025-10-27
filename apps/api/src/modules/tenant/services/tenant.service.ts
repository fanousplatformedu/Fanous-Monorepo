import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSubscriptionInput } from "@tenant/dto/create-subscription.input";
import { SetTenantSettingsInput } from "@tenant/dto/set-tenant-settings.input";
import { BadRequestException } from "@nestjs/common";
import { AssignLicenseInput } from "@tenant/dto/assign-license";
import { UpdateTenantInput } from "@tenant/dto/create-tenant.input";
import { CreateTenantInput } from "@tenant/dto/create-tenant.input";
import { TenantPageInput } from "@tenant/dto/paginate-tenants.input";
import { PrismaService } from "@prisma/prisma.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class TenantService {
  constructor(private prismaService: PrismaService) {}

  async create(input: CreateTenantInput) {
    const exists = await this.prismaService.tenant.findUnique({
      where: { slug: input.slug },
    });
    if (exists) throw new BadRequestException("Slug already exists");
    return this.prismaService.tenant.create({
      data: { name: input.name.trim(), slug: input.slug.trim() },
      include: { settings: true },
    });
  }

  async update(input: UpdateTenantInput) {
    const tenant = await this.prismaService.tenant.findUnique({
      where: { id: input.id },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");
    if (input.slug) {
      const dup = await this.prismaService.tenant.findUnique({
        where: { slug: input.slug },
      });
      if (dup && dup.id !== tenant.id)
        throw new BadRequestException("Slug already in use");
    }

    return this.prismaService.tenant.update({
      where: { id: input.id },
      data: {
        ...(input.name ? { name: input.name.trim() } : {}),
        ...(input.slug ? { slug: input.slug.trim() } : {}),
      },
      include: { settings: true },
    });
  }

  async archive(id: string) {
    const t = await this.prismaService.tenant.findUnique({ where: { id } });
    if (!t) throw new NotFoundException("Tenant not found");
    return this.prismaService.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string) {
    const t = await this.prismaService.tenant.findUnique({ where: { id } });
    if (!t) throw new NotFoundException("Tenant not found");
    return this.prismaService.tenant.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async byId(id: string) {
    const t = await this.prismaService.tenant.findUnique({
      where: { id },
      include: { settings: true, licenses: true, subscriptions: true },
    });
    if (!t) throw new NotFoundException("Tenant not found");
    return t;
  }

  async bySlug(slug: string) {
    const t = await this.prismaService.tenant.findUnique({
      where: { slug },
      include: { settings: true, licenses: true, subscriptions: true },
    });
    if (!t) throw new NotFoundException("Tenant not found");
    return t;
  }

  async paginate(input: TenantPageInput) {
    const { page = 1, pageSize = 20, search, includeDeleted } = input;
    const and: Prisma.TenantWhereInput[] = [];
    if (search && search.trim()) {
      and.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      });
    }
    if (!includeDeleted) and.push({ deletedAt: null });
    const where: Prisma.TenantWhereInput = and.length ? { AND: and } : {};
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.tenant.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { settings: true },
      }),
      this.prismaService.tenant.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async setSettings(input: SetTenantSettingsInput) {
    const t = await this.prismaService.tenant.findUnique({
      where: { id: input.tenantId },
    });
    if (!t) throw new NotFoundException("Tenant not found");

    return this.prismaService.tenantSettings.upsert({
      where: { tenantId: input.tenantId },
      create: {
        tenantId: input.tenantId,
        brandingJson: input.brandingJson
          ? JSON.parse(input.brandingJson)
          : undefined,
        ssoConfigJson: input.ssoConfigJson
          ? JSON.parse(input.ssoConfigJson)
          : undefined,
        webhookConfigJson: input.webhookConfigJson
          ? JSON.parse(input.webhookConfigJson)
          : undefined,
        defaultLanguage: input.defaultLanguage,
        allowedLanguages: input.allowedLanguages,
        retentionDays: input.retentionDays,
      },
      update: {
        ...(input.brandingJson !== undefined
          ? {
              brandingJson: input.brandingJson
                ? JSON.parse(input.brandingJson)
                : null,
            }
          : {}),
        ...(input.ssoConfigJson !== undefined
          ? {
              ssoConfigJson: input.ssoConfigJson
                ? JSON.parse(input.ssoConfigJson)
                : null,
            }
          : {}),
        ...(input.webhookConfigJson !== undefined
          ? {
              webhookConfigJson: input.webhookConfigJson
                ? JSON.parse(input.webhookConfigJson)
                : null,
            }
          : {}),
        ...(input.defaultLanguage !== undefined
          ? { defaultLanguage: input.defaultLanguage }
          : {}),
        ...(input.allowedLanguages !== undefined
          ? { allowedLanguages: input.allowedLanguages }
          : {}),
        ...(input.retentionDays !== undefined
          ? { retentionDays: input.retentionDays }
          : {}),
      },
      include: { tenant: false },
    });
  }

  async assignLicense(input: AssignLicenseInput) {
    const t = await this.prismaService.tenant.findUnique({
      where: { id: input.tenantId },
    });
    if (!t) throw new NotFoundException("Tenant not found");
    if (input.endsAt && input.endsAt < input.startsAt)
      throw new BadRequestException("endsAt must be after startsAt");
    return this.prismaService.license.create({
      data: {
        tenantId: input.tenantId,
        plan: input.plan,
        seats: input.seats,
        startsAt: input.startsAt,
        endsAt: input.endsAt ?? null,
      },
    });
  }

  async createSubscription(input: CreateSubscriptionInput) {
    const t = await this.prismaService.tenant.findUnique({
      where: { id: input.tenantId },
    });
    if (!t) throw new NotFoundException("Tenant not found");
    if (input.currentPeriodEnd < input.currentPeriodStart) {
      throw new BadRequestException(
        "currentPeriodEnd must be after currentPeriodStart"
      );
    }
    return this.prismaService.subscription.create({
      data: {
        tenantId: input.tenantId,
        plan: input.plan,
        status: "TRIALING",
        currentPeriodStart: input.currentPeriodStart,
        currentPeriodEnd: input.currentPeriodEnd,
        cancelAtPeriodEnd: !!input.cancelAtPeriodEnd,
      },
    });
  }
}
