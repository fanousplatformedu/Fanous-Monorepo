import { SuperAdminGqlMutationNames } from "@superAdmin/enums/gql-names.enum";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { ForcePasswordChangeGuard } from "@superAdmin/guards/force-password-change.guard";
import { AllowForcePasswordChange } from "@superAdmin/decorators/allow-force-password-change.decorator";
import { ChangeAdminPasswordInput } from "@superAdmin/dtos/change-admin-password.input";
import { AdminProfileResultEntity } from "@superAdmin/entities/profile-result.entity";
import { ResetAdminPasswordInput } from "@superAdmin/dtos/reset-admin-password.input";
import { UpdateAdminProfileInput } from "@superAdmin/dtos/update-profile.input";
import { PasswordResultEntity } from "@superAdmin/entities/password-result.entity";
import { SuperAdminService } from "@superAdmin/services/super-admin.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class SuperAdminResolver {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @UseGuards(JwtAuthGuard, ForcePasswordChangeGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  @AllowForcePasswordChange()
  @Mutation(() => PasswordResultEntity, {
    name: SuperAdminGqlMutationNames.ChangeAdminPassword,
  })
  changeAdminPassword(
    @CurrentUser() user: any,
    @Args("input") input: ChangeAdminPasswordInput,
  ) {
    return this.superAdminService.changeAdminPassword({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      currentPassword: input.currentPassword,
      newPassword: input.newPassword,
    });
  }

  @UseGuards(JwtAuthGuard, ForcePasswordChangeGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => PasswordResultEntity, {
    name: SuperAdminGqlMutationNames.ResetAdminPassword,
  })
  resetAdminPassword(
    @CurrentUser() user: any,
    @Args("input") input: ResetAdminPasswordInput,
  ) {
    return this.superAdminService.resetAdminPassword({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      adminUserId: input.adminUserId,
    });
  }

  @UseGuards(JwtAuthGuard, ForcePasswordChangeGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN, Role.SUPER_ADMIN)
  @AllowForcePasswordChange()
  @Mutation(() => AdminProfileResultEntity, {
    name: "updateAdminProfile",
  })
  updateAdminProfile(
    @CurrentUser() user: any,
    @Args("input") input: UpdateAdminProfileInput,
  ) {
    return this.superAdminService.updateAdminProfile({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      fullName: input.fullName ?? null,
      email: input.email ?? null,
    });
  }
}
