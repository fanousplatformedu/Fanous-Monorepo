import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { SearchConsentsInput } from "@consent/dto/search-consents.input";
import { RevokeConsentInput } from "@consent/dto/revoke-consent.input";
import { ConsentPageEntity } from "@consent/entities/page.entity";
import { Role, TenantRole } from "@prisma/client";
import { SetConsentInput } from "@consent/dto/set-consent.input";
import { ConsentService } from "@consent/services/consent.service";
import { ConsentEntity } from "@consent/entities/consent.entity";
import { Roles } from "@decorators/roles.decorator";

@Resolver(() => ConsentEntity)
export class ConsentResolver {
  constructor(private readonly consentService: ConsentService) {}

  @Query(() => [ConsentEntity], { name: "myConsents" })
  myConsents(@Args("tenantId") tenantId: string, @Context() ctx) {
    return this.consentService.myConsents(tenantId, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.COUNSELOR, Role.PARENT)
  @Query(() => [ConsentEntity], { name: "userConsents" })
  userConsents(
    @Args("tenantId") tenantId: string,
    @Args("userId") userId: string,
    @Context() ctx
  ) {
    return this.consentService.userConsents(tenantId, userId, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN, Role.COUNSELOR)
  @Query(() => ConsentPageEntity, { name: "searchConsents" })
  async searchConsents(
    @Args("filters") filters: SearchConsentsInput,
    @Args("page") page: number,
    @Args("pageSize") pageSize: number,
    @Context() ctx
  ) {
    return this.consentService.searchConsents(
      {
        ...filters,
        page: Math.max(1, page ?? 1),
        pageSize: Math.min(100, Math.max(1, pageSize ?? 20)),
      },
      ctx.req.user
    );
  }

  // ========== Write: Set/Update ==============
  @Mutation(() => ConsentEntity, { name: "setConsent" })
  setConsent(@Args("input") input: SetConsentInput, @Context() ctx) {
    return this.consentService.setConsent(input, ctx.req.user);
  }

  // ========== Write: Revoke ===========
  @Mutation(() => ConsentEntity, { name: "revokeConsent" })
  revokeConsent(@Args("input") input: RevokeConsentInput, @Context() ctx) {
    return this.consentService.revokeConsent(input, ctx.req.user);
  }

  // ========== Admin Delete ============
  @Roles(Role.SUPER_ADMIN, TenantRole.SCHOOL_ADMIN)
  @Mutation(() => Boolean, { name: "deleteConsent" })
  deleteConsent(@Args("consentId") consentId: string, @Context() ctx) {
    return this.consentService.deleteConsent(consentId, ctx.req.user);
  }
}
