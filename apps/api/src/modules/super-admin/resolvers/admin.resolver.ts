import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AssignSchoolAdminResultEntity } from "@superAdmin/entities/assign-school-result.entity";
import { RemoveSchoolAdminInput } from "@superAdmin/dtos/remove-school.input";
import { AssignSchoolAdminInput } from "@superAdmin/dtos/assign-school.input";
import { AdminGqlMutationNames } from "@superAdmin/enums/gql-names.enum";
import { SchoolAdminPageEntity } from "@superAdmin/entities/school-admin-page.entity";
import { ListSchoolAdminsInput } from "@superAdmin/dtos/list-school.input";
import { AdminGqlQueryNames } from "@superAdmin/enums/gql-names.enum";
import { SchoolAdminEntity } from "@superAdmin/entities/school-admin.entity";
import { AdminMessages } from "@superAdmin/enums/admin-message.enum";
import { AdminService } from "@superAdmin/services/admin.service";
import { GlobalRole } from "@prisma/client";
import { AdminCodes } from "@superAdmin/enums/admin-codes.enum";
import { AppError } from "@ctypes/app-error";
import { Roles } from "@decorators/roles.decorator";

@Resolver()
export class AdminResolver {
  constructor(private adminService: AdminService) {}

  @Roles(GlobalRole.SUPER_ADMIN)
  @Mutation(() => AssignSchoolAdminResultEntity, {
    name: AdminGqlMutationNames.ASSIGN_SCHOOL_ADMIN,
  })
  async assignSchoolAdmin(
    @Args("input") input: AssignSchoolAdminInput,
    @Context() ctx: any,
  ) {
    const superAdminId = ctx.req.user?.id;
    if (!superAdminId)
      throw new AppError(AdminCodes.UNAUTHORIZED as any, "UNAUTHORIZED", 401);
    const { membership } = await this.adminService.assignSchoolAdmin(
      superAdminId,
      input,
    );
    const admin: SchoolAdminEntity = {
      membershipId: membership.id,
      schoolId: membership.schoolId,
      role: membership.role,
      status: membership.status,
      userId: membership.userId,
      email: membership.user.email ?? undefined,
      phone: membership.user.phone ?? undefined,
      firstName: membership.firstName ?? undefined,
      lastName: membership.lastName ?? undefined,
      reviewedById: membership.reviewedById ?? undefined,
      reviewedAt: membership.reviewedAt ?? undefined,
      createdAt: membership.createdAt,
    };
    return { message: AdminMessages.ADMIN_ASSIGNED, admin };
  }

  @Roles(GlobalRole.SUPER_ADMIN)
  @Mutation(() => SchoolAdminEntity, {
    name: AdminGqlMutationNames.REMOVE_SCHOOL_ADMIN,
  })
  async removeSchoolAdmin(
    @Args("input") input: RemoveSchoolAdminInput,
    @Context() ctx: any,
  ) {
    const superAdminId = ctx.req.user?.id;
    if (!superAdminId)
      throw new AppError(AdminCodes.UNAUTHORIZED as any, "UNAUTHORIZED", 401);
    const membership = await this.adminService.removeSchoolAdmin(
      superAdminId,
      input,
    );
    return {
      membershipId: membership.id,
      schoolId: membership.schoolId,
      role: membership.role,
      status: membership.status,
      userId: membership.userId,
      email: membership.user.email ?? undefined,
      phone: membership.user.phone ?? undefined,
      firstName: membership.firstName ?? undefined,
      lastName: membership.lastName ?? undefined,
      reviewedById: membership.reviewedById ?? undefined,
      reviewedAt: membership.reviewedAt ?? undefined,
      createdAt: membership.createdAt,
    };
  }

  @Roles(GlobalRole.SUPER_ADMIN)
  @Query(() => SchoolAdminPageEntity, {
    name: AdminGqlQueryNames.SCHOOL_ADMINS,
  })
  async schoolAdmins(@Args("input") input: ListSchoolAdminsInput) {
    const { items, total } = await this.adminService.listSchoolAdmins(input);
    return {
      total,
      items: items.map((m) => ({
        membershipId: m.id,
        schoolId: m.schoolId,
        role: m.role,
        status: m.status,
        userId: m.userId,
        email: m.user.email ?? undefined,
        phone: m.user.phone ?? undefined,
        firstName: m.firstName ?? undefined,
        lastName: m.lastName ?? undefined,
        reviewedById: m.reviewedById ?? undefined,
        reviewedAt: m.reviewedAt ?? undefined,
        createdAt: m.createdAt,
      })),
    };
  }
}
