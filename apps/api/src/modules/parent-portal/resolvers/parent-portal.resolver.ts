import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { ParentPortalRecommendationEntity } from "@parent-portal/entities/recommendation.entity";
import { UpdateNotificationPrefsInput } from "@parent-portal/dto/update-notif-prefs.input";
import { ChildRecommendationsInput } from "@parent-portal/dto/child-recommendations.input";
import { NotificationPageEntity } from "@parent-portal/entities/notif-page.entity";
import { AssessmentPageEntity } from "@parent-portal/entities/assessment-page.entity";
import { ParentPortalService } from "@parent-portal/services/parent-portal.service";
import { ChildSummaryEntity } from "@parent-portal/entities/child-summary.entity";
import { ChildBasicEntity } from "@parent-portal/entities/child-basic.entity";
import { UnlinkChildInput } from "@parent-portal/dto/link-child.input";
import { ParentPageInput } from "@parent-portal/dto/page.input";
import { SetConsentInput } from "@parent-portal/dto/set-consent.input";
import { LinkChildInput } from "@parent-portal/dto/link-child.input";
import { ConsentEntity } from "@parent-portal/entities/consent.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class ParentPortalResolver {
  constructor(private readonly parentService: ParentPortalService) {}

  // ---- My children
  @Roles(Role.PARENT)
  @Query(() => [ChildBasicEntity], { name: "myChildren" })
  myChildren(@Context() ctx) {
    return this.parentService.myChildren(ctx.req.user);
  }

  // ---- Child overview
  @Roles(Role.PARENT)
  @Query(() => ChildSummaryEntity, { name: "childSummary" })
  childSummary(
    @Args("tenantId") tenantId: string,
    @Args("childUserId") childUserId: string,
    @Context() ctx,
  ) {
    return this.parentService.childSummary(tenantId, childUserId, ctx.req.user);
  }

  // ---- Assessments
  @Roles(Role.PARENT)
  @Query(() => AssessmentPageEntity, { name: "childAssessments" })
  childAssessments(
    @Args("tenantId") tenantId: string,
    @Args("childUserId") childUserId: string,
    @Args("input") input: ParentPageInput,
    @Context() ctx,
  ) {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 20));
    return this.parentService.childAssessments(
      tenantId,
      childUserId,
      page,
      pageSize,
      ctx.req.user,
    );
  }

  // ---- Recommendations
  @Roles(Role.PARENT)
  @Query(() => [ParentPortalRecommendationEntity], {
    name: "childRecommendations",
  })
  childRecommendations(
    @Args("input") input: ChildRecommendationsInput,
    @Context() ctx,
  ) {
    return this.parentService.childRecommendations(
      input.tenantId,
      input.childUserId,
      input.type,
      input.limit ?? 20,
      ctx.req.user,
    );
  }

  // ---- Consents
  @Roles(Role.PARENT)
  @Query(() => [ConsentEntity], { name: "childConsents" })
  childConsents(
    @Args("tenantId") tenantId: string,
    @Args("childUserId") childUserId: string,
    @Context() ctx,
  ) {
    return this.parentService.childConsents(
      tenantId,
      childUserId,
      ctx.req.user,
    );
  }

  @Roles(Role.PARENT)
  @Mutation(() => ConsentEntity, { name: "setChildConsent" })
  setChildConsent(@Args("input") input: SetConsentInput, @Context() ctx) {
    return this.parentService.setConsent(input, ctx.req.user);
  }

  // ---- Notifications (for parent)
  @Roles(Role.PARENT)
  @Query(() => NotificationPageEntity, { name: "childNotifications" })
  childNotifications(
    @Args("tenantId") tenantId: string,
    @Args("childUserId") childUserId: string,
    @Args("input") input: ParentPageInput,
    @Context() ctx,
  ) {
    const page = Math.max(1, input.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.pageSize ?? 20));
    return this.parentService.childNotifications(
      tenantId,
      childUserId,
      page,
      pageSize,
      ctx.req.user,
    );
  }

  // ---- Link / Unlink
  @Roles(Role.PARENT)
  @Mutation(() => Boolean, { name: "linkChild" })
  linkChild(@Args("input") input: LinkChildInput, @Context() ctx) {
    return this.parentService.linkChild(input, ctx.req.user);
  }

  @Roles(Role.PARENT)
  @Mutation(() => Boolean, { name: "unlinkChild" })
  unlinkChild(@Args("input") input: UnlinkChildInput, @Context() ctx) {
    return this.parentService.unlinkChild(input, ctx.req.user);
  }

  // ---- Notification Prefs
  @Roles(Role.PARENT)
  @Mutation(() => Boolean, { name: "updateNotificationPrefs" })
  updateNotificationPrefs(
    @Args("input") input: UpdateNotificationPrefsInput,
    @Context() ctx,
  ) {
    return this.parentService.updateNotificationPrefs(input, ctx.req.user);
  }
}
