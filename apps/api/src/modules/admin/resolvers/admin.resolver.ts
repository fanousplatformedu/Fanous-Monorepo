import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { PagedRoleApprovalRequestsEntity } from "@admin/entities/role-approvals.entity";
import { AdminListRoleApprovalsInput } from "@admin/dtos/admin-list-approvals.input";
import { AdminReviewRoleRequestInput } from "@admin/dtos/review-role-request.input";
import { AdminAssignSchoolAdminInput } from "@admin/dtos/assign-school-admin.input";
import { RoleApprovalRequestEntity } from "@admin/entities/approval-request.entity";
import { AdminRoleApprovalService } from "@admin/services/role-approval.service";
import { AdminSuperService } from "@admin/services/admin-super.service";
import { SchoolMiniEntity } from "@modules/user/entities/school-mini.entity";
import { GqlQueryNames } from "@admin/enums/gql-names.enum";
import { UserEntity } from "@modules/user/entities/user.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class AdminResolver {
  constructor(
    private approvalsService: AdminRoleApprovalService,
    private superAdminService: AdminSuperService,
  ) {}

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => PagedRoleApprovalRequestsEntity, {
    name: GqlQueryNames.ADMIN_LIST_ROLE_APPROVALS,
  })
  async adminListRoleApprovals(
    @Context() ctx,
    @Args("input") input: AdminListRoleApprovalsInput,
  ) {
    const actorId: string = ctx.req.user.id;
    return this.approvalsService.listRoleApprovals(actorId, input);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Query(() => RoleApprovalRequestEntity, {
    name: GqlQueryNames.ADMIN_GET_ROLE_APPROVAL,
  })
  adminGetRoleApproval(@Context() ctx, @Args("requestId") requestId: string) {
    const actorId: string = ctx.req.user.id;
    return this.approvalsService.getRoleApproval(actorId, requestId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Mutation(() => RoleApprovalRequestEntity, {
    name: GqlQueryNames.ADMIN_APPROVE_ROLE,
  })
  adminApproveRole(
    @Context() ctx,
    @Args("input") input: AdminReviewRoleRequestInput,
  ) {
    const actorId: string = ctx.req.user.id;
    return this.approvalsService.approve(actorId, input);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Mutation(() => RoleApprovalRequestEntity, {
    name: GqlQueryNames.ADMIN_REJECT_ROLE,
  })
  adminRejectRole(
    @Context() ctx,
    @Args("input") input: AdminReviewRoleRequestInput,
  ) {
    const actorId: string = ctx.req.user.id;
    return this.approvalsService.reject(actorId, input);
  }

  // SUPER ADMIN ONLY
  @Roles(Role.SUPER_ADMIN)
  @Query(() => [SchoolMiniEntity], { name: GqlQueryNames.ADMIN_LIST_SCHOOLS })
  adminListSchools(@Context() ctx) {
    const actorId: string = ctx.req.user.id;
    return this.superAdminService.listSchools(actorId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => UserEntity, { name: GqlQueryNames.ADMIN_ASSIGN_SCHOOL_ADMIN })
  async adminAssignSchoolAdmin(
    @Context() ctx,
    @Args("input") input: AdminAssignSchoolAdminInput,
  ) {
    const actorId: string = ctx.req.user.id;
    const updated = await this.superAdminService.assignSchoolAdmin(
      actorId,
      input,
    );
    return {
      id: updated.id,
      role: updated.role,
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
      joinDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      coursesEnrolled: 0,
      certificatesEarned: 0,
      learningHours: 0,
      school: updated.schoolId
        ? { id: updated.schoolId, name: "", slug: "", isActive: true }
        : null,
    } as any;
  }
}
