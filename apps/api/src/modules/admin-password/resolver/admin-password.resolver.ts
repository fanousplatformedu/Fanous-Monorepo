import { AdminPasswordGqlMutationNames } from "@adminPassword/enums/gql-names.enum";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ForcePasswordChangeGuard } from "@adminPassword/guards/force-password-change.guard";
import { AllowForcePasswordChange } from "@adminPassword/decorators/allow-force-password-change.decorator";
import { ChangeAdminPasswordInput } from "@adminPassword/dtos/change-admin-password.input";
import { ResetAdminPasswordInput } from "@adminPassword/dtos/reset-admin-password.input";
import { PasswordResultEntity } from "@adminPassword/entities/password-result.entity";
import { AdminPasswordService } from "@adminPassword/services/admin-password.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class AdminPasswordResolver {
  constructor(private readonly adminPasswordService: AdminPasswordService) {}

  @UseGuards(JwtAuthGuard, ForcePasswordChangeGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  @AllowForcePasswordChange()
  @Mutation(() => PasswordResultEntity, {
    name: AdminPasswordGqlMutationNames.ChangeAdminPassword,
  })
  changeAdminPassword(
    @CurrentUser() user: any,
    @Args("input") input: ChangeAdminPasswordInput,
  ) {
    return this.adminPasswordService.changeAdminPassword({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
    });
  }

  @UseGuards(JwtAuthGuard, ForcePasswordChangeGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => PasswordResultEntity, {
    name: AdminPasswordGqlMutationNames.ResetAdminPassword,
  })
  resetAdminPassword(
    @CurrentUser() user: any,
    @Args("input") input: ResetAdminPasswordInput,
  ) {
    return this.adminPasswordService.resetAdminPassword({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      adminUserId: input.adminUserId,
    });
  }
}
