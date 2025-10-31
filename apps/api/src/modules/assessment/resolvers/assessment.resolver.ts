import { Resolver, Mutation, Args, Query, ID, Context } from "@nestjs/graphql";
import { SaveResponsesBulkInput } from "@assessment/dto/save-responses-bulk.input";
import { SubmitAssessmentInput } from "@assessment/dto/submit-assessment.input";
import { PageResultAssessments } from "@assessment/entities/page-assessment";
import { StartAssessmentInput } from "@assessment/dto/start-assessment.input";
import { ResultSnapshotEntity } from "@assessment/entities/result-snapshot.entity";
import { AssessmentsByMeInput } from "@assessment/dto/assessments-by-user.input";
import { AssessmentsPageInput } from "@assessment/dto/paginate-assessments.input";
import { AssessmentService } from "@assessment/services/assessment.service";
import { SaveResponseInput } from "@assessment/dto/save-response.input";
import { AssessmentEntity } from "@assessment/entities/assessment.entity";
import { RunScoringInput } from "@assessment/dto/run-scoring.input";
import { ResponseEntity } from "@assessment/entities/response.entity";
import { ScoreEntity } from "@assessment/entities/score.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class AssessmentResolver {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Mutation(() => AssessmentEntity, { name: "startAssessment" })
  startAssessment(@Args("input") input: StartAssessmentInput, @Context() ctx) {
    const userId: string = ctx.req.user.id;
    return this.assessmentService.start(input, userId);
  }

  @Mutation(() => ResponseEntity, { name: "saveResponse" })
  saveResponse(@Args("input") input: SaveResponseInput, @Context() ctx) {
    const userId: string = ctx.req.user.id;
    return this.assessmentService.saveResponse(input, userId);
  }

  @Mutation(() => Boolean, { name: "saveResponsesBulk" })
  async saveResponsesBulk(
    @Args("input") input: SaveResponsesBulkInput,
    @Context() ctx
  ) {
    const userId: string = ctx.req.user.id;
    await this.assessmentService.saveResponsesBulk(input, userId);
    return true;
  }

  @Mutation(() => AssessmentEntity, { name: "submitAssessment" })
  submitAssessment(
    @Args("input") input: SubmitAssessmentInput,
    @Context() ctx
  ) {
    const userId: string = ctx.req.user.id;
    return this.assessmentService.submit(input, userId);
  }

  // ===== Scoring (Admin/Counselor)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => AssessmentEntity, { name: "runScoring" })
  runScoring(@Args("input") input: RunScoringInput) {
    return this.assessmentService.runScoring(input);
  }

  // ===== Queries =====
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Query(() => PageResultAssessments, { name: "assessments" })
  assessments(@Args("input") input: AssessmentsPageInput) {
    return this.assessmentService.page(input);
  }

  @Query(() => PageResultAssessments, { name: "myAssessments" })
  myAssessments(@Args("input") input: AssessmentsByMeInput, @Context() ctx) {
    const userId: string = ctx.req.user.id;
    return this.assessmentService.pageByMe(input, userId);
  }

  @Query(() => AssessmentEntity, { name: "assessmentById" })
  assessmentById(
    @Args("tenantId") tenantId: string,
    @Args("assessmentId", { type: () => ID }) assessmentId: string
  ) {
    return this.assessmentService.getById(tenantId, assessmentId);
  }

  @Query(() => ResultSnapshotEntity, { name: "assessmentResult" })
  assessmentResult(
    @Args("tenantId") tenantId: string,
    @Args("assessmentId", { type: () => ID }) assessmentId: string
  ) {
    return this.assessmentService.getResult(tenantId, assessmentId);
  }

  @Query(() => [ScoreEntity], { name: "assessmentScores" })
  assessmentScores(
    @Args("tenantId") tenantId: string,
    @Args("assessmentId", { type: () => ID }) assessmentId: string
  ) {
    return this.assessmentService.getScores(tenantId, assessmentId);
  }

  @Query(() => [ResponseEntity], { name: "assessmentResponses" })
  assessmentResponses(
    @Args("tenantId") tenantId: string,
    @Args("assessmentId", { type: () => ID }) assessmentId: string
  ) {
    return this.assessmentService.getResponses(tenantId, assessmentId);
  }
}
