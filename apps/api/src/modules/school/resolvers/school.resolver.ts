import { Args, Context, Query, Mutation, Resolver } from "@nestjs/graphql";
import { UpdateSchoolStatusInput } from "@school/dtos/update-school-status.input";
import { SchoolGqlMutationNames } from "@school/enums/gql-names.enum";
import { SchoolGqlQueryNames } from "@school/enums/gql-names.enum";
import { CreateSchoolInput } from "@school/dtos/create-school.input";
import { SchoolPageEntity } from "@school/entities/school-page.entity";
import { ListSchoolsInput } from "@school/dtos/list-schools.input";
import { SchoolScopeGuard } from "@school/guards/school-scope.guard";
import { GetSchoolInput } from "@school/dtos/get-school.input";
import { SchoolService } from "@school/services/school.service";
import { SchoolEntity } from "@school/entities/school.entity";
import { SchoolScope } from "@school/decorators/school-scope.decorator";
import { GlobalRole } from "@prisma/client";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@decorators/roles.decorator";

@Resolver(() => SchoolEntity)
export class SchoolResolver {
  constructor(private schoolService: SchoolService) {}

  @Roles(GlobalRole.SUPER_ADMIN)
  @Query(() => SchoolPageEntity, { name: SchoolGqlQueryNames.SCHOOLS })
  async schools(@Args("input", { nullable: true }) input?: ListSchoolsInput) {
    return this.schoolService.listSchools(input ?? {});
  }

  @Roles(GlobalRole.SUPER_ADMIN)
  @Query(() => SchoolEntity, { name: SchoolGqlQueryNames.SCHOOL })
  async school(@Args("input") input: GetSchoolInput) {
    return this.schoolService.getSchool(input);
  }

  @UseGuards(SchoolScopeGuard)
  @SchoolScope({ requireActive: false, allowSuperAdminBypass: true })
  @Query(() => SchoolEntity, { name: SchoolGqlQueryNames.MY_SCHOOL })
  async mySchool(@Context() ctx: any) {
    const schoolId = ctx.req.user?.schoolId;
    return this.schoolService.getSchool({ id: schoolId });
  }

  @Roles(GlobalRole.SUPER_ADMIN)
  @Mutation(() => SchoolEntity, { name: SchoolGqlMutationNames.CREATE_SCHOOL })
  async createSchool(@Args("input") input: CreateSchoolInput) {
    return this.schoolService.createSchool(input);
  }

  @Roles(GlobalRole.SUPER_ADMIN)
  @Mutation(() => SchoolEntity, {
    name: SchoolGqlMutationNames.UPDATE_SCHOOL_STATUS,
  })
  async updateSchoolStatus(@Args("input") input: UpdateSchoolStatusInput) {
    return this.schoolService.updateSchoolStatus(input);
  }
}
