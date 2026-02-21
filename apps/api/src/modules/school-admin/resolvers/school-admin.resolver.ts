import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { MembershipRequestsPageEntity } from "@schoolAdmin/entities/membership-requests-page.enitity";
import { SchoolAdminGqlMutationNames } from "@schoolAdmin/enums/gql-names.enum";
import { ListMembershipRequestsInput } from "@schoolAdmin/dtos/list-requests.input";
import { SchoolAdminGqlQueryNames } from "@schoolAdmin/enums/gql-names.enum";
import { ReviewMembershipInput } from "@schoolAdmin/dtos/review-membership.input";
import { SchoolAdminService } from "@schoolAdmin/services/school-admin.service";
import { ReviewResultEntity } from "@schoolAdmin/entities/review-result.entity";
import { SchoolScopeGuard } from "@school/guards/school-scope.guard";
import { SchoolScope } from "@school/decorators/school-scope.decorator";
import { SchoolRole } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@decorators/roles.decorator";

type GqlCtx = { req: any; res: any };

@Resolver()
export class SchoolAdminResolver {
  constructor(private schoolService: SchoolAdminService) {}

  @Roles(SchoolRole.SCHOOL_ADMIN)
  @UseGuards(SchoolScopeGuard)
  @SchoolScope({ requireActive: true })
  @Query(() => MembershipRequestsPageEntity, {
    name: SchoolAdminGqlQueryNames.MEMBERSHIP_REQUESTS,
  })
  async membershipRequests(
    @Args("input") input: ListMembershipRequestsInput,
    @Context() ctx: GqlCtx,
  ) {
    const adminUserId = ctx.req.user?.id;
    const adminSchoolId = ctx.req.user?.schoolId;
    return this.schoolService.listMembershipRequests({
      adminUserId,
      adminSchoolId,
      input,
    });
  }

  @Roles(SchoolRole.SCHOOL_ADMIN)
  @UseGuards(SchoolScopeGuard)
  @SchoolScope({ requireActive: true })
  @Mutation(() => ReviewResultEntity, {
    name: SchoolAdminGqlMutationNames.REVIEW_MEMBERSHIP,
  })
  async reviewMembership(
    @Args("input") input: ReviewMembershipInput,
    @Context() ctx: GqlCtx,
  ) {
    const adminUserId = ctx.req.user?.id;
    const adminSchoolId = ctx.req.user?.schoolId;
    return this.schoolService.reviewMembership({
      adminUserId,
      adminSchoolId,
      input,
    });
  }
}
