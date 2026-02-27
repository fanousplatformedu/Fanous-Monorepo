import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AccessRequestGqlMutationNames } from "@accessRequest/enums/gql-names.enum";
import { AccessRequestGqlQueryNames } from "@accessRequest/enums/gql-names.enum";
import { SubmitAccessRequestInput } from "@accessRequest/dtos/submit-access-request.input";
import { ReviewAccessRequestInput } from "@accessRequest/dtos/review-access-request.input";
import { AccessRequestListEntity } from "@accessRequest/entities/access-request-list.entity";
import { ListAccessRequestsInput } from "@accessRequest/dtos/list-access-request.input";
import { AccessRequestService } from "@accessRequest/services/access-request.service";
import { AccessRequestEntity } from "@accessRequest/entities/access-request.entity";
import { ReviewResultEntity } from "@accessRequest/entities/review-result.entity";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Public } from "@auth/decorators/public.decorator";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class AccessRequestResolver {
  constructor(private readonly accessService: AccessRequestService) {}

  // ======= Public submit ========
  @Public()
  @Mutation(() => AccessRequestEntity, {
    name: AccessRequestGqlMutationNames.SubmitAccessRequest,
  })
  async submitAccessRequest(@Args("input") input: SubmitAccessRequestInput) {
    const res = await this.accessService.submit({
      schoolId: input.schoolId,
      requestedRole: input.requestedRole,
      email: input.email ?? null,
      mobile: input.mobile ?? null,
      fullName: input.fullName ?? null,
    });
    return res.request;
  }

  // ========= List requests: SCHOOL_ADMIN (own school) ===========
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  @Query(() => AccessRequestListEntity, {
    name: AccessRequestGqlQueryNames.AccessRequests,
  })
  accessRequests(
    @CurrentUser() user: any,
    @Args("input") input: ListAccessRequestsInput,
  ) {
    return this.accessService.list({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId ?? null,
      status: input.status ?? null,
      query: input.query ?? null,
      take: input.take,
      skip: input.skip,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  @Query(() => AccessRequestEntity, {
    name: AccessRequestGqlQueryNames.AccessRequestById,
  })
  accessRequestById(@CurrentUser() user: any, @Args("id") id: string) {
    return this.accessService.byId(
      { role: user.role, schoolId: user.schoolId },
      id,
    );
  }

  // ====== Review: SCHOOL_ADMIN only =======
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Mutation(() => ReviewResultEntity, {
    name: AccessRequestGqlMutationNames.ReviewAccessRequest,
  })
  reviewAccessRequest(
    @CurrentUser() user: any,
    @Args("input") input: ReviewAccessRequestInput,
  ) {
    return this.accessService.review({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      requestId: input.requestId,
      approve: input.approve,
      rejectReason: input.rejectReason ?? null,
      finalRole: input.finalRole ?? null,
      notifyVia: (input.notifyVia as any) ?? "AUTO",
    });
  }
}
