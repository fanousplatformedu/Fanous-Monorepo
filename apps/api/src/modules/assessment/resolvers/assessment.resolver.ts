import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SchoolAssessmentSummaryEntity } from "@assessment/entities/assessment-summary.entity";
import { SchoolAssessmentSummaryInput } from "@assessment/dtos/school-assessment-summary.input";
import { AssessmentGqlMutationNames } from "@assessment/enums/gql-names.enum";
import { ListAssessmentResultsInput } from "@assessment/dtos/list-assessment-results.input";
import { AssessmentResultListEntity } from "@assessment/entities/assessment-result-list.entity";
import { SchoolAssignmentListEntity } from "@assessment/entities/school-assignment-list";
import { SubmitStudentAnswersInput } from "@assessment/dtos/student-answers.input";
import { AssessmentQuestionEntity } from "@assessment/entities/assessment-question.entity";
import { AssessmentGqlQueryNames } from "@assessment/enums/gql-names.enum";
import { SchoolAssignmentEntity } from "@assessment/entities/school-assignment.entity";
import { CreateAssignmentInput } from "@assessment/dtos/create-assignment.input";
import { AssignAssignmentInput } from "@assessment/dtos/assign-assignment.input";
import { ListAssignmentsInput } from "@assessment/dtos/list-assignment.input";
import { AssessmentService } from "@assessment/services/assessment.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class AssessmentResolver {
  constructor(private readonly assessmentService: AssessmentService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Query(() => [AssessmentQuestionEntity], {
    name: AssessmentGqlQueryNames.AssessmentQuestions,
  })
  assessmentQuestions() {
    return this.assessmentService.assessmentQuestions();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Mutation(() => SchoolAssignmentEntity, {
    name: AssessmentGqlMutationNames.CreateAssignment,
  })
  createAssignment(
    @CurrentUser() user: any,
    @Args("input") input: CreateAssignmentInput,
  ) {
    return this.assessmentService.createAssignment({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      title: input.title,
      description: input.description ?? null,
      dueAt: input.dueAt ?? null,
      targetMode: input.targetMode ?? null,
      targetGradeId: input.targetGradeId ?? null,
      targetClassroomId: input.targetClassroomId ?? null,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Query(() => SchoolAssignmentListEntity, {
    name: AssessmentGqlQueryNames.Assignments,
  })
  assignments(
    @CurrentUser() user: any,
    @Args("input") input: ListAssignmentsInput,
  ) {
    return this.assessmentService.listAssignments({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      status: input.status ?? null,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Mutation(() => SchoolAssignmentEntity, {
    name: AssessmentGqlMutationNames.PublishAssignment,
  })
  publishAssignment(@CurrentUser() user: any, @Args("id") id: string) {
    return this.assessmentService.publishAssignment({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      assignmentId: id,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Mutation(() => String, {
    name: AssessmentGqlMutationNames.AssignAssignmentToStudents,
  })
  async assignAssignmentToStudents(
    @CurrentUser() user: any,
    @Args("input") input: AssignAssignmentInput,
  ) {
    const res = await this.assessmentService.assignAssignmentToStudents({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      assignmentId: input.assignmentId,
      studentIds: input.studentIds ?? null,
    });

    return `ASSIGNED_${res.assignedCount}`;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => String, {
    name: AssessmentGqlMutationNames.SubmitStudentAnswers,
  })
  async submitStudentAnswers(
    @CurrentUser() user: any,
    @Args("input") input: SubmitStudentAnswersInput,
  ) {
    await this.assessmentService.submitStudentAnswers({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      studentAssignmentId: input.studentAssignmentId,
      answers: input.answers,
    });

    return "SUBMITTED";
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Query(() => AssessmentResultListEntity, {
    name: AssessmentGqlQueryNames.AssessmentResults,
  })
  assessmentResults(
    @CurrentUser() user: any,
    @Args("input") input: ListAssessmentResultsInput,
  ) {
    return this.assessmentService.listAssessmentResults({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      assignmentId: input.assignmentId ?? null,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SCHOOL_ADMIN)
  @Query(() => SchoolAssessmentSummaryEntity, {
    name: AssessmentGqlQueryNames.SchoolAssessmentSummary,
  })
  schoolAssessmentSummary(
    @CurrentUser() user: any,
    @Args("input", { nullable: true }) input?: SchoolAssessmentSummaryInput,
  ) {
    return this.assessmentService.schoolAssessmentSummary({
      actor: { id: user.id, role: user.role, schoolId: user.schoolId },
      assignmentId: input?.assignmentId ?? null,
    });
  }
}
