import { Resolver, Query, Mutation, Args, ID } from "@nestjs/graphql";
import { CreateAssessmentVersionInput } from "@questionnaire/dto/create-version.input";
import { PageResultQuestionnaire } from "@questionnaire/entities/page-questionnaire";
import { UpdateQuestionnaireInput } from "@questionnaire/dto/create-questionnaire.input";
import { CreateQuestionnaireInput } from "@questionnaire/dto/create-questionnaire.input";
import { AssessmentVersionEntity } from "@questionnaire/entities/assessment-version.entity";
import { QuestionnairePageInput } from "@questionnaire/dto/paginate-questionnaire.input";
import { ReorderQuestionsInput } from "@questionnaire/dto/reorder-questions.input";
import { QuestionnaireService } from "@questionnaire/services/questionnaire.service";
import { QuestionnaireEntity } from "@questionnaire/entities/questionnaire.entity";
import { PublishVersionInput } from "@questionnaire/dto/publish-version.input";
import { UpdateQuestionInput } from "@questionnaire/dto/create-question.input";
import { CreateQuestionInput } from "@questionnaire/dto/create-question.input";
import { ReorderOptionsInput } from "@questionnaire/dto/reorder-options.input";
import { UpdateOptionInput } from "@questionnaire/dto/create-option.input";
import { CreateOptionInput } from "@questionnaire/dto/create-option.input";
import { QuestionEntity } from "@questionnaire/entities/question.entity";
import { OptionEntity } from "@questionnaire/entities/option.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class QuestionnaireResolver {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  // ===== Questionnaire =====
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR, Role.TEACHER)
  @Query(() => PageResultQuestionnaire, { name: "questionnaires" })
  questionnaires(@Args("input") input: QuestionnairePageInput) {
    return this.questionnaireService.paginateQuestionnaires(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => QuestionnaireEntity, { name: "createQuestionnaire" })
  createQuestionnaire(@Args("input") input: CreateQuestionnaireInput) {
    return this.questionnaireService.createQuestionnaire(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => QuestionnaireEntity, { name: "updateQuestionnaire" })
  updateQuestionnaire(@Args("input") input: UpdateQuestionnaireInput) {
    return this.questionnaireService.updateQuestionnaire(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => Boolean, { name: "archiveQuestionnaire" })
  async archiveQuestionnaire(
    @Args("id", { type: () => ID }) id: string,
    @Args("tenantId") tenantId: string
  ) {
    await this.questionnaireService.archiveQuestionnaire(id, tenantId);
    return true;
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => Boolean, { name: "restoreQuestionnaire" })
  async restoreQuestionnaire(
    @Args("id", { type: () => ID }) id: string,
    @Args("tenantId") tenantId: string
  ) {
    await this.questionnaireService.restoreQuestionnaire(id, tenantId);
    return true;
  }

  // ===== Versioning =====
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => AssessmentVersionEntity, { name: "createAssessmentVersion" })
  createAssessmentVersion(@Args("input") input: CreateAssessmentVersionInput) {
    return this.questionnaireService.createVersion(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => AssessmentVersionEntity, { name: "publishVersion" })
  publishVersion(@Args("input") input: PublishVersionInput) {
    return this.questionnaireService.publishVersion(input);
  }

  // ===== Questions =====
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => QuestionEntity, { name: "createQuestion" })
  createQuestion(@Args("input") input: CreateQuestionInput) {
    return this.questionnaireService.createQuestion(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => QuestionEntity, { name: "updateQuestion" })
  updateQuestion(@Args("input") input: UpdateQuestionInput) {
    return this.questionnaireService.updateQuestion(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "reorderQuestions" })
  async reorderQuestions(@Args("input") input: ReorderQuestionsInput) {
    await this.questionnaireService.reorderQuestions(input);
    return true;
  }

  // ===== Options =====
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => OptionEntity, { name: "createOption" })
  createOption(@Args("input") input: CreateOptionInput) {
    return this.questionnaireService.createOption(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => OptionEntity, { name: "updateOption" })
  updateOption(@Args("input") input: UpdateOptionInput) {
    return this.questionnaireService.updateOption(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "reorderOptions" })
  async reorderOptions(@Args("input") input: ReorderOptionsInput) {
    await this.questionnaireService.reorderOptions(input);
    return true;
  }
}
