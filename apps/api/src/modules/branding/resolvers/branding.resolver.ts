import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { UpsertBrandingAssetInput } from "@branding/dto/upsert-branding.input";
import { GetBrandingBySlugInput } from "@branding/dto/get-branding-by-slug.input";
import { Role, TenantRole } from "@prisma/client";
import { SetBrandingInput } from "@branding/dto/set-branding.input";
import { BrandingService } from "@branding/services/branding.service";
import { BrandingEntity } from "@branding/entities/branding.entity";
import { Roles } from "@decorators/roles.decorator";

@Resolver(() => BrandingEntity)
export class BrandingResolver {
  constructor(private readonly brandingService: BrandingService) {}

  // ============== Public ================
  @Query(() => BrandingEntity, { name: "branding" })
  branding(@Args("tenantId") tenantId: string) {
    return this.brandingService.getBranding(tenantId);
  }

  @Query(() => BrandingEntity, { name: "brandingBySlug" })
  brandingBySlug(@Args("input") input: GetBrandingBySlugInput) {
    return this.brandingService.getBrandingBySlug(input.slug);
  }

  // =============== Admin ===============
  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => BrandingEntity, { name: "setBranding" })
  setBranding(@Args("input") input: SetBrandingInput, @Context() ctx) {
    return this.brandingService.setBranding(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.ADMIN)
  @Mutation(() => BrandingEntity, { name: "upsertBrandingAsset" })
  upsertBrandingAsset(
    @Args("input") input: UpsertBrandingAssetInput,
    @Context() ctx
  ) {
    return this.brandingService.upsertBrandingAsset(input, ctx.req.user);
  }
}
