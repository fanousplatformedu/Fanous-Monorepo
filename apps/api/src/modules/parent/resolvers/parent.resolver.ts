import { ListParentCounselingSessionsInput } from "@parent/dtos/list-parent-counseling-sessions.input";
import { ParentCounselingSessionListEntity } from "@parent/entities/parent-counseling-session-list";
import { ParentAssessmentResultListEntity } from "@parent/entities/parent-assessment-result-list.entity";
import { ParentSessionRequestResultEntity } from "@parent/entities/parent-session-request-result.entity";
import { ParentDashboardGqlMutationNames } from "@parent/enums/gql-names.enum";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ListParentChildActivitiesInput } from "@parent/dtos/list-parent-child-activities.input";
import { ParentCompareResultItemEntity } from "@parent/entities/parent-compare-result-item.entity";
import { ParentDashboardGqlQueryNames } from "@parent/enums/gql-names.enum";
import { StudentGradeRecordListEntity } from "@parent/entities/student-grade-record-list.entity";
import { ParentAssessmentResultEntity } from "@parent/entities/parent-assessment-result.entity";
import { ParentDashboardSummaryEntity } from "@parent/entities/parent-dashboard-summary";
import { ListParentChildResultsInput } from "@parent/dtos/list-parent-child-results.input";
import { ListParentChildGradesInput } from "@parent/dtos/list-parent-child-grades.input";
import { StudentActivityListEntity } from "@parent/entities/student-activity-list.entity";
import { CompareParentResultsInput } from "@parent/dtos/compare-parent-results.input";
import { ParentRequestSessionInput } from "@parent/dtos/parent-request-session.input";
import { ParentResourceListEntity } from "@parent/entities/parent-resource-list.entity";
import { ListParentResourcesInput } from "@parent/dtos/list-parent-resources.input";
import { CancelParentSessionInput } from "@parent/dtos/cancel-parent-session.input";
import { ParentChildDetailEntity } from "@parent/entities/parent-child-detail.entity";
import { ParentChildDetailInput } from "@parent/dtos/parent-child-detail.input";
import { ParentChildListEntity } from "@parent/entities/parent-child-list.entity";
import { ListMyChildrenInput } from "@parent/dtos/list-my-children.input";
import { ParentService } from "@parent/services/parent.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

import * as T from "@parent/types/parent.types";

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARENT)
export class ParentResolver {
  constructor(private readonly parentService: ParentService) {}

  @Query(() => ParentDashboardSummaryEntity, {
    name: ParentDashboardGqlQueryNames.ParentDashboardSummary,
  })
  parentDashboardSummary(@CurrentUser() user: T.TParentActor) {
    return this.parentService.getDashboardSummary(user);
  }

  @Query(() => ParentChildListEntity, {
    name: ParentDashboardGqlQueryNames.MyChildren,
  })
  myChildren(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: ListMyChildrenInput,
  ) {
    return this.parentService.listMyChildren({
      actor: user,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
    });
  }

  @Query(() => ParentChildDetailEntity, {
    name: ParentDashboardGqlQueryNames.ParentChildDetail,
  })
  parentChildDetail(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: ParentChildDetailInput,
  ) {
    return this.parentService.getChildDetail({
      actor: user,
      childId: input.childId,
    });
  }

  @Query(() => StudentGradeRecordListEntity, {
    name: ParentDashboardGqlQueryNames.ParentChildGrades,
  })
  parentChildGrades(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: ListParentChildGradesInput,
  ) {
    return this.parentService.listChildGrades({
      actor: user,
      childId: input.childId,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      subject: input.subject ?? null,
      termLabel: input.termLabel ?? null,
    });
  }

  @Query(() => ParentAssessmentResultListEntity, {
    name: ParentDashboardGqlQueryNames.ParentChildResults,
  })
  parentChildResults(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: ListParentChildResultsInput,
  ) {
    return this.parentService.listChildResults({
      actor: user,
      childId: input.childId,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      dominantIntelligence: input.dominantIntelligence ?? null,
    });
  }

  @Query(() => ParentAssessmentResultEntity, {
    name: ParentDashboardGqlQueryNames.ParentResultDetail,
  })
  parentResultDetail(
    @CurrentUser() user: T.TParentActor,
    @Args("resultId") resultId: string,
  ) {
    return this.parentService.getChildResultDetail(user, resultId);
  }

  @Query(() => [ParentCompareResultItemEntity], {
    name: ParentDashboardGqlQueryNames.CompareParentResults,
  })
  compareParentResults(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: CompareParentResultsInput,
  ) {
    return this.parentService.compareChildResults({
      actor: user,
      childId: input.childId,
      baseResultId: input.baseResultId,
      compareWithResultId: input.compareWithResultId,
    });
  }

  @Query(() => ParentResourceListEntity, {
    name: ParentDashboardGqlQueryNames.ParentResources,
  })
  parentResources(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: ListParentResourcesInput,
  ) {
    return this.parentService.listResources({
      actor: user,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      category: input.category ?? null,
    });
  }

  @Query(() => StudentActivityListEntity, {
    name: ParentDashboardGqlQueryNames.ParentChildActivities,
  })
  parentChildActivities(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: ListParentChildActivitiesInput,
  ) {
    return this.parentService.listChildActivities({
      actor: user,
      childId: input.childId,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      type: input.type ?? null,
    });
  }

  @Query(() => ParentCounselingSessionListEntity, {
    name: ParentDashboardGqlQueryNames.ParentCounselingSessions,
  })
  parentCounselingSessions(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: ListParentCounselingSessionsInput,
  ) {
    return this.parentService.listCounselingSessions({
      actor: user,
      childId: input.childId ?? null,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      status: input.status ?? null,
    });
  }

  @Mutation(() => ParentSessionRequestResultEntity, {
    name: ParentDashboardGqlMutationNames.ParentRequestCounselingSession,
  })
  parentRequestCounselingSession(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: ParentRequestSessionInput,
  ) {
    return this.parentService.requestCounselingSession({
      actor: user,
      childId: input.childId,
      title: input.title,
      note: input.note ?? null,
      counselorId: input.counselorId ?? null,
      meetingUrl: input.meetingUrl ?? null,
      scheduledAt: input.scheduledAt ?? null,
    });
  }

  @Mutation(() => ParentSessionRequestResultEntity, {
    name: ParentDashboardGqlMutationNames.ParentCancelCounselingSession,
  })
  parentCancelCounselingSession(
    @CurrentUser() user: T.TParentActor,
    @Args("input") input: CancelParentSessionInput,
  ) {
    return this.parentService.cancelCounselingSession({
      actor: user,
      sessionId: input.sessionId,
      reason: input.reason ?? null,
    });
  }
}
