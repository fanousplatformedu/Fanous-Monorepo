import { StudentDashboardGqlMutationNames } from "@student/enums/gql-names.enum";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { StudentDashboardSummaryEntity } from "@student/entities/student-dashboard-summary.entity";
import { StudentDashboardGqlQueryNames } from "@student/enums/gql-names.enum";
import { StudentAssignmentDetailEntity } from "@student/entities/student-assignment-detail.entity";
import { RequestCounselingSessionInput } from "@student/dtos/request-counseling-session.input";
import { ListMyCounselingSessionsInput } from "@student/dtos/list-my-counseling-session.input";
import { SubmitAssignmentAnswersInput } from "@student/dtos/submit-assignment-answers.input";
import { ListMyAssessmentResultsInput } from "@student/dtos/list-my-assessment-results.input";
import { AssessmentResultDetailEntity } from "@student/entities/assessment-result-detail.entity";
import { CancelCounselingSessionInput } from "@student/dtos/cancel-counseling-session.input";
import { StudentAssignmentListEntity } from "@student/entities/student-assignment-list";
import { InAppNotificationListEntity } from "@student/entities/in-app-notif-list.entity";
import { CounselingSessionListEntity } from "@student/entities/counseling-session-list.entity";
import { AssessmentResultListEntity } from "@student/entities/assessment-result-list";
import { MarkNotificationReadInput } from "@student/dtos/mark-notif-read.input";
import { NotificationResultEntity } from "@student/entities/notif-result.entity";
import { ListMyNotificationsInput } from "@student/dtos/list-my-notifs.input";
import { CounselingSessionEntity } from "@student/entities/counseling-session.entity";
import { ResultCompareItemEntity } from "@student/entities/result-compare-item.entity";
import { ListMyAssignmentsInput } from "@student/dtos/list-my-assignments.input";
import { CompareResultsInput } from "@student/dtos/compare-results.input";
import { StudentService } from "@student/services/student.service";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

import * as T from "@student/types/student.types";

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.STUDENT)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query(() => StudentDashboardSummaryEntity, {
    name: StudentDashboardGqlQueryNames.StudentDashboardSummary,
  })
  studentDashboardSummary(@CurrentUser() user: T.TStudentActor) {
    return this.studentService.getDashboardSummary(user);
  }

  @Query(() => StudentAssignmentListEntity, {
    name: StudentDashboardGqlQueryNames.MyAssignments,
  })
  myAssignments(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: ListMyAssignmentsInput,
  ) {
    return this.studentService.listMyAssignments({
      actor: user,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      status: input.status ?? null,
    });
  }

  @Query(() => StudentAssignmentDetailEntity, {
    name: StudentDashboardGqlQueryNames.MyAssignmentDetail,
  })
  myAssignmentDetail(
    @CurrentUser() user: T.TStudentActor,
    @Args("studentAssignmentId") studentAssignmentId: string,
  ) {
    return this.studentService.getMyAssignmentDetail(user, studentAssignmentId);
  }

  @Mutation(() => NotificationResultEntity, {
    name: StudentDashboardGqlMutationNames.SubmitAssignmentAnswers,
  })
  submitAssignmentAnswers(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: SubmitAssignmentAnswersInput,
  ) {
    return this.studentService.submitAssignmentAnswers({
      actor: user,
      studentAssignmentId: input.studentAssignmentId,
      answers: input.answers,
    });
  }

  @Query(() => AssessmentResultListEntity, {
    name: StudentDashboardGqlQueryNames.MyAssessmentResults,
  })
  myAssessmentResults(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: ListMyAssessmentResultsInput,
  ) {
    return this.studentService.listMyAssessmentResults({
      actor: user,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      dominantIntelligence: input.dominantIntelligence ?? null,
    });
  }

  @Query(() => AssessmentResultDetailEntity, {
    name: StudentDashboardGqlQueryNames.MyAssessmentResultDetail,
  })
  myAssessmentResultDetail(
    @CurrentUser() user: T.TStudentActor,
    @Args("resultId") resultId: string,
  ) {
    return this.studentService.getMyAssessmentResultDetail(user, resultId);
  }

  @Query(() => [ResultCompareItemEntity], {
    name: StudentDashboardGqlQueryNames.CompareResults,
  })
  compareResults(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: CompareResultsInput,
  ) {
    return this.studentService.compareResults({
      actor: user,
      baseResultId: input.baseResultId,
      compareWithResultId: input.compareWithResultId,
    });
  }

  @Query(() => InAppNotificationListEntity, {
    name: StudentDashboardGqlQueryNames.MyNotifications,
  })
  myNotifications(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: ListMyNotificationsInput,
  ) {
    return this.studentService.listMyNotifications({
      actor: user,
      take: input.take,
      skip: input.skip,
      unreadOnly: input.unreadOnly ?? null,
      query: input.query ?? null,
    });
  }

  @Mutation(() => NotificationResultEntity, {
    name: StudentDashboardGqlMutationNames.MarkNotificationRead,
  })
  markNotificationRead(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: MarkNotificationReadInput,
  ) {
    return this.studentService.markNotificationRead({
      actor: user,
      notificationId: input.notificationId,
    });
  }

  @Query(() => CounselingSessionListEntity, {
    name: StudentDashboardGqlQueryNames.MyCounselingSessions,
  })
  myCounselingSessions(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: ListMyCounselingSessionsInput,
  ) {
    return this.studentService.listMyCounselingSessions({
      actor: user,
      take: input.take,
      skip: input.skip,
      query: input.query ?? null,
      status: input.status ?? null,
    });
  }

  @Mutation(() => CounselingSessionEntity, {
    name: StudentDashboardGqlMutationNames.RequestCounselingSession,
  })
  requestCounselingSession(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: RequestCounselingSessionInput,
  ) {
    return this.studentService.requestCounselingSession({
      actor: user,
      note: input.note,
      title: input.title,
      meetingUrl: input.meetingUrl,
      scheduledAt: input.scheduledAt,
      counselorId: input.counselorId,
    });
  }

  @Mutation(() => NotificationResultEntity, {
    name: StudentDashboardGqlMutationNames.CancelCounselingSession,
  })
  cancelCounselingSession(
    @CurrentUser() user: T.TStudentActor,
    @Args("input") input: CancelCounselingSessionInput,
  ) {
    return this.studentService.cancelCounselingSession({
      actor: user,
      sessionId: input.sessionId,
      reason: input.reason,
    });
  }
}
