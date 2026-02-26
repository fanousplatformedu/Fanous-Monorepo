import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RemoveSchoolMemberInput } from "@user/dtos/remove-school-member.input";
import { ListSchoolMembersInput } from "@user/dtos/list-school-members.input";
import { UserGqlMutationNames } from "@user/enums/gql-names.enum";
import { UserGqlQueryNames } from "@user/enums/gql-names.enum";
import { UserListEntity } from "@user/entities/user-list.entity";
import { UpdateMeInput } from "@user/dtos/update-me.input";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { UserService } from "@user/services/user.service";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UserEntity } from "@user/entities/user.entity";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => UserEntity, { name: UserGqlQueryNames.Me })
  me(@CurrentUser() user: any) {
    return this.usersService.me(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserEntity, { name: UserGqlMutationNames.UpdateMe })
  updateMe(@CurrentUser() user: any, @Args("input") input: UpdateMeInput) {
    return this.usersService.updateMe({
      userId: user.id,
      fullName: input.fullName ?? null,
      avatarUrl: input.avatarUrl ?? null,
      email: input.email ?? null,
      mobile: input.mobile ?? null,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Query(() => UserListEntity, { name: UserGqlQueryNames.SchoolMembers })
  schoolMembers(
    @CurrentUser() user: any,
    @Args("input") input: ListSchoolMembersInput,
  ) {
    return this.usersService.listSchoolMembers({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      query: input.query ?? null,
      role: input.role ?? null,
      status: input.status ?? null,
      take: input.take,
      skip: input.skip,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Mutation(() => UserEntity, { name: UserGqlMutationNames.RemoveSchoolMember })
  async removeSchoolMember(
    @CurrentUser() user: any,
    @Args("input") input: RemoveSchoolMemberInput,
  ) {
    await this.usersService.removeSchoolMember({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      targetUserId: input.userId,
      hardDelete: input.hardDelete ?? false,
    });
    return this.usersService.me(input.userId).catch(() => ({
      id: input.userId,
      role: Role.STUDENT,
      status: "DISABLED" as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}
