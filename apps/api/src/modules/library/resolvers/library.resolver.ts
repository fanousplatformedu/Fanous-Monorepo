import { Resolver, Query, Mutation, Args, Context } from "@nestjs/graphql";
import { CreateCareerInput, UpdateCareerInput } from "@library/dto/career.dto";
import { CreateSkillInput, UpdateSkillInput } from "@library/dto/skill.dto";
import { CreateMajorInput, UpdateMajorInput } from "@library/dto/major.dto";
import { BulkUpsertSkillsInput } from "@library/dto/skill.dto";
import { SetCareerSkillsInput } from "@library/dto/mapping.dto";
import { SetMajorSkillsInput } from "@library/dto/mapping.dto";
import { SuggestSkillsInput } from "@library/dto/mapping.dto";
import { CareerPageEntity } from "@library/entities/page.entity";
import { SkillPageEntity } from "@library/entities/page.entity";
import { MajorPageEntity } from "@library/entities/page.entity";
import { LibraryService } from "@library/services/library.service";
import { CareerEntity } from "@library/entities/career.entity";
import { LibPageInput } from "@library/dto/page.input";
import { SkillEntity } from "@library/entities/skill.entity";
import { MajorEntity } from "@library/entities/major.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class LibraryResolver {
  constructor(private readonly libraryService: LibraryService) {}

  // ========= Skills =========
  @Query(() => SkillPageEntity, { name: "skills" })
  skills(@Args("input") input: LibPageInput) {
    return this.libraryService.pageSkills(input);
  }

  @Query(() => [SkillEntity], { name: "suggestSkills" })
  suggestSkills(@Args("input") input: SuggestSkillsInput) {
    return this.libraryService.suggestSkills(
      input.q,
      input.category,
      input.limit ?? 10
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => SkillEntity, { name: "createSkill" })
  createSkill(@Args("input") input: CreateSkillInput, @Context() ctx) {
    return this.libraryService.createSkill(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => SkillEntity, { name: "updateSkill" })
  updateSkill(@Args("input") input: UpdateSkillInput, @Context() ctx) {
    return this.libraryService.updateSkill(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => Boolean, { name: "removeSkill" })
  removeSkill(@Args("id") id: string, @Context() ctx) {
    return this.libraryService.removeSkill(id, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => Boolean, { name: "bulkUpsertSkills" })
  bulkUpsertSkills(
    @Args("input") input: BulkUpsertSkillsInput,
    @Context() ctx
  ) {
    return this.libraryService
      .bulkUpsertSkills(input.items, ctx.req.user)
      .then(() => true);
  }

  // ========= Careers =========
  @Query(() => CareerPageEntity, { name: "careers" })
  careers(@Args("input") input: LibPageInput) {
    return this.libraryService.pageCareers(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => CareerEntity, { name: "createCareer" })
  createCareer(@Args("input") input: CreateCareerInput, @Context() ctx) {
    return this.libraryService.createCareer(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => CareerEntity, { name: "updateCareer" })
  updateCareer(@Args("input") input: UpdateCareerInput, @Context() ctx) {
    return this.libraryService.updateCareer(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => Boolean, { name: "removeCareer" })
  removeCareer(@Args("id") id: string, @Context() ctx) {
    return this.libraryService.removeCareer(id, ctx.req.user);
  }

  @Query(() => [SkillEntity], { name: "careerSkills" })
  careerSkills(@Args("careerId") careerId: string) {
    return this.libraryService.getCareerSkills(careerId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => Boolean, { name: "setCareerSkills" })
  setCareerSkills(@Args("input") input: SetCareerSkillsInput, @Context() ctx) {
    return this.libraryService.setCareerSkills(input, ctx.req.user);
  }

  // ========= Majors =========
  @Query(() => MajorPageEntity, { name: "majors" })
  majors(@Args("input") input: LibPageInput) {
    return this.libraryService.pageMajors(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => MajorEntity, { name: "createMajor" })
  createMajor(@Args("input") input: CreateMajorInput, @Context() ctx) {
    return this.libraryService.createMajor(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => MajorEntity, { name: "updateMajor" })
  updateMajor(@Args("input") input: UpdateMajorInput, @Context() ctx) {
    return this.libraryService.updateMajor(input, ctx.req.user);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => Boolean, { name: "removeMajor" })
  removeMajor(@Args("id") id: string, @Context() ctx) {
    return this.libraryService.removeMajor(id, ctx.req.user);
  }

  @Query(() => [SkillEntity], { name: "majorSkills" })
  majorSkills(@Args("majorId") majorId: string) {
    return this.libraryService.getMajorSkills(majorId);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.CONTENT_EDITOR)
  @Mutation(() => Boolean, { name: "setMajorSkills" })
  setMajorSkills(@Args("input") input: SetMajorSkillsInput, @Context() ctx) {
    return this.libraryService.setMajorSkills(input, ctx.req.user);
  }
}
