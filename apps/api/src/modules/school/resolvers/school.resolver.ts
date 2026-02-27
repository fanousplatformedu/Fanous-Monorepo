import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateSchoolAdminResultEntity } from "@school/entities/create-school-admin-result.entity";
import { SchoolGqlMutationNames } from "@school/enums/gql-names.enum";
import { CreateSchoolAdminInput } from "@school/dtos/create-school-admin.input";
import { ListSchoolAdminsInput } from "@school/dtos/list-school-admins.input";
import { SchoolAdminListEntity } from "@school/entities/school-admin-list.entity";
import { SetSchoolStatusInput } from "@school/dtos/set-school-status.input";
import { SetAdminStatusInput } from "@school/dtos/set-admin-status.input";
import { SchoolGqlQueryNames } from "@school/enums/gql-names.enum";
import { CreateSchoolInput } from "@school/dtos/create-school.input";
import { UpdateSchoolInput } from "@school/dtos/update-school.input";
import { SchoolListEntity } from "@school/entities/school-list.entity";
import { ListSchoolsInput } from "@school/dtos/list-schools.input";
import { SchoolService } from "@school/services/school.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { SchoolEntity } from "@school/entities/school.entity";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class SchoolResolver {
  constructor(private readonly schoolsService: SchoolService) {}

  // ========= Schools (SUPER_ADMIN) =========
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SchoolEntity, { name: SchoolGqlMutationNames.CreateSchool })
  async createSchool(
    @CurrentUser() user: any,
    @Args("input") input: CreateSchoolInput,
  ) {
    const res = await this.schoolsService.createSchool({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      name: input.name,
      code: input.code ?? null,
      settings: input.settings ?? null,
    });
    return res.school;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SchoolEntity, { name: SchoolGqlMutationNames.UpdateSchool })
  async updateSchool(
    @CurrentUser() user: any,
    @Args("input") input: UpdateSchoolInput,
  ) {
    const res = await this.schoolsService.updateSchool({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId,
      name: input.name ?? null,
      code: input.code ?? null,
      settings: input.settings ?? null,
    });
    return res.school;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => SchoolEntity, {
    name: SchoolGqlMutationNames.SetSchoolStatus,
  })
  async setSchoolStatus(
    @CurrentUser() user: any,
    @Args("input") input: SetSchoolStatusInput,
  ) {
    const res = await this.schoolsService.setSchoolStatus({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId,
      status: input.status,
    });
    return res.school!;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => SchoolListEntity, { name: SchoolGqlQueryNames.Schools })
  schools(@CurrentUser() user: any, @Args("input") input: ListSchoolsInput) {
    return this.schoolsService.listSchools({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      query: input.query ?? null,
      status: input.status ?? null,
      take: input.take,
      skip: input.skip,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => SchoolEntity, { name: SchoolGqlQueryNames.SchoolById })
  schoolById(@CurrentUser() user: any, @Args("schoolId") schoolId: string) {
    return this.schoolsService.schoolById({ role: user.role }, schoolId);
  }

  // ========= School Admins (SUPER_ADMIN) ===========
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => CreateSchoolAdminResultEntity, {
    name: SchoolGqlMutationNames.CreateSchoolAdmin,
  })
  createSchoolAdmin(
    @CurrentUser() user: any,
    @Args("input") input: CreateSchoolAdminInput,
  ) {
    return this.schoolsService.createSchoolAdmin({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId,
      adminEmail: input.adminEmail,
      adminFullName: input.adminFullName ?? null,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Query(() => SchoolAdminListEntity, {
    name: SchoolGqlQueryNames.SchoolAdmins,
  })
  schoolAdmins(
    @CurrentUser() user: any,
    @Args("input") input: ListSchoolAdminsInput,
  ) {
    return this.schoolsService.listSchoolAdmins({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      schoolId: input.schoolId ?? null,
      status: input.status ?? null,
      take: input.take,
      skip: input.skip,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @Mutation(() => String, { name: SchoolGqlMutationNames.SetAdminStatus })
  async setAdminStatus(
    @CurrentUser() user: any,
    @Args("input") input: SetAdminStatusInput,
  ) {
    const res = await this.schoolsService.setAdminStatus({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      adminUserId: input.adminUserId,
      status: input.status,
    });
    return res.message;
  }
}
