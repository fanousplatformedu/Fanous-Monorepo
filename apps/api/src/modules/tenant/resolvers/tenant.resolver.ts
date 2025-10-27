import { Resolver, Mutation, Args, Query, ID } from "@nestjs/graphql";
import { CreateSubscriptionInput } from "@tenant/dto/create-subscription.input";
import { SetTenantSettingsInput } from "@tenant/dto/set-tenant-settings.input";
import { TenantSettingsEntity } from "@tenant/entities/tenant-settings.entity";
import { AssignLicenseInput } from "@tenant/dto/assign-license";
import { SubscriptionEntity } from "@tenant/entities/subscription.entity";
import { UpdateTenantInput } from "@tenant/dto/create-tenant.input";
import { CreateTenantInput } from "@tenant/dto/create-tenant.input";
import { TenantPageResult } from "@tenant/entities/tenant-page.entity";
import { TenantPageInput } from "@tenant/dto/paginate-tenants.input";
import { TenantService } from "@tenant/services/tenant.service";
import { LicenseEntity } from "@tenant/entities/license.entity";
import { TenantEntity } from "@tenant/entities/tenant.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver(() => TenantEntity)
export class TenantResolver {
  constructor(private readonly tenantService: TenantService) {}

  @Roles(Role.SUPER_ADMIN)
  @Query(() => TenantEntity, { name: "tenantById" })
  tenantById(@Args("id", { type: () => ID }) id: string) {
    return this.tenantService.byId(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Query(() => TenantEntity, { name: "tenantBySlug" })
  tenantBySlug(@Args("slug") slug: string) {
    return this.tenantService.bySlug(slug);
  }

  @Roles(Role.SUPER_ADMIN)
  @Query(() => TenantPageResult, { name: "tenants" })
  tenants(
    @Args("input", { type: () => TenantPageInput }) input: TenantPageInput
  ) {
    return this.tenantService.paginate(input);
  }

  // ==== Mutations ====
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => TenantEntity, { name: "createTenant" })
  createTenant(@Args("input") input: CreateTenantInput) {
    return this.tenantService.create(input);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => TenantEntity, { name: "updateTenant" })
  updateTenant(@Args("input") input: UpdateTenantInput) {
    return this.tenantService.update(input);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: "archiveTenant" })
  async archiveTenant(@Args("id", { type: () => ID }) id: string) {
    await this.tenantService.archive(id);
    return true;
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => Boolean, { name: "restoreTenant" })
  async restoreTenant(@Args("id", { type: () => ID }) id: string) {
    await this.tenantService.restore(id);
    return true;
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => TenantSettingsEntity, { name: "setTenantSettings" })
  setTenantSettings(@Args("input") input: SetTenantSettingsInput) {
    return this.tenantService.setSettings(input);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => LicenseEntity, { name: "assignLicense" })
  assignLicense(@Args("input") input: AssignLicenseInput) {
    return this.tenantService.assignLicense(input);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SubscriptionEntity, { name: "createSubscription" })
  createSubscription(@Args("input") input: CreateSubscriptionInput) {
    return this.tenantService.createSubscription(input);
  }
}
