import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AssignSchoolAdminResultEntity } from "@superAdmin/entities/assign-school-result.entity";
import { AssignSchoolAdminInput } from "@superAdmin/dtos/assign-school.input";
import { RemoveSchoolAdminInput } from "@superAdmin/dtos/remove-school.input";
import { ListSchoolAdminsInput } from "@superAdmin/dtos/list-school.input";
import { SchoolAdminPageEntity } from "@superAdmin/entities/school-admin-page.entity";
import { AdminGqlMutationNames } from "@superAdmin/enums/gql-names.enum";
import { AdminGqlQueryNames } from "@superAdmin/enums/gql-names.enum";
import { SchoolAdminEntity } from "@superAdmin/entities/school-admin.entity";
import { AdminMessages } from "@superAdmin/enums/admin-message.enum";
import { AdminService } from "@superAdmin/services/admin.service";
import { GlobalRole } from "@prisma/client";
import { Roles } from "@decorators/roles.decorator";

import * as H from "@utils/super-admin-helper";

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
    const membership = await this.adminService.assignSchoolAdmin({
      superAdminUserId: superAdminId,
      input,
    });
    const admin: SchoolAdminEntity = H.mapToSchoolAdminEntity(membership);
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
    const membership = await this.adminService.removeSchoolAdmin({
      superAdminUserId: superAdminId,
      input,
    });
    return H.mapToSchoolAdminEntity(membership);
  }

  @Roles(GlobalRole.SUPER_ADMIN)
  @Query(() => SchoolAdminPageEntity, {
    name: AdminGqlQueryNames.SCHOOL_ADMINS,
  })
  async schoolAdmins(@Args("input") input: ListSchoolAdminsInput) {
    const { items, total } = await this.adminService.listSchoolAdmins({
      input,
    });
    return {
      total,
      items: items.map(H.mapToSchoolAdminEntity),
    };
  }
}
