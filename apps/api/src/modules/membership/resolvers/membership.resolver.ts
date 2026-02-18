import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { MembershipGqlMutationNames } from "@modules/membership/enums/gql-names.enum";
import { PendingRequestsPageEntity } from "@membership/entities/pending-requests-page.entity";
import { ListPendingRequestsInput } from "@membership/dtos/list-pending.input";
import { MembershipGqlQueryNames } from "@modules/membership/enums/gql-names.enum";
import { ApproveMembershipInput } from "@membership/dtos/approve-membership.input";
import { RejectMembershipInput } from "@membership/dtos/reject-membership.input";
import { RegisterRequestInput } from "@membership/dtos/register-request.input";
import { MyMembershipsInput } from "@membership/dtos/my-memberships.input";
import { MembershipService } from "@membership/services/membership.service";
import { MembershipEntity } from "@membership/entities/membership.entity";
import { SchoolScopeGuard } from "@school/guards/school-scope.guard";
import { SchoolScope } from "@school/decorators/school-scope.decorator";
import { UserEntity } from "@membership/entities/user.entity";
import { SchoolRole } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import { Public } from "@decorators/public.decorator";
import { Roles } from "@decorators/roles.decorator";

@Resolver()
export class MembershipResolver {
  constructor(private membershipService: MembershipService) {}

  @Public()
  @Mutation(() => MembershipEntity, {
    name: MembershipGqlMutationNames.REGISTER_REQUEST,
  })
  async registerRequest(@Args("input") input: RegisterRequestInput) {
    return this.membershipService.registerRequest(input);
  }

  @Query(() => UserEntity, { name: MembershipGqlQueryNames.ME })
  async me(@Context() ctx: any) {
    const userId = ctx.req.user?.id;
    return this.membershipService.me(userId);
  }

  @UseGuards(SchoolScopeGuard)
  @SchoolScope({ requireActive: true })
  @Query(() => [MembershipEntity], {
    name: MembershipGqlQueryNames.MY_MEMBERSHIPS,
  })
  async myMemberships(
    @Args("input") input: MyMembershipsInput,
    @Context() ctx: any,
  ) {
    const userId = ctx.req.user?.id;
    return this.membershipService.myMemberships(userId, input.schoolId);
  }

  @Roles(SchoolRole.SCHOOL_ADMIN)
  @UseGuards(SchoolScopeGuard)
  @SchoolScope({ requireActive: true })
  @Query(() => PendingRequestsPageEntity, {
    name: MembershipGqlQueryNames.PENDING_REQUESTS,
  })
  async pendingRequests(@Args("input") input: ListPendingRequestsInput) {
    return this.membershipService.listPendingRequests(input);
  }

  @Roles(SchoolRole.SCHOOL_ADMIN)
  @Mutation(() => MembershipEntity, {
    name: MembershipGqlMutationNames.APPROVE_MEMBERSHIP,
  })
  async approveMembership(
    @Args("input") input: ApproveMembershipInput,
    @Context() ctx: any,
  ) {
    const adminUserId = ctx.req.user?.id;
    return this.membershipService.approveMembership(adminUserId, input);
  }

  @Roles(SchoolRole.SCHOOL_ADMIN)
  @Mutation(() => MembershipEntity, {
    name: MembershipGqlMutationNames.REJECT_MEMBERSHIP,
  })
  async rejectMembership(
    @Args("input") input: RejectMembershipInput,
    @Context() ctx: any,
  ) {
    const adminUserId = ctx.req.user?.id;
    return this.membershipService.rejectMembership(adminUserId, input);
  }
}
