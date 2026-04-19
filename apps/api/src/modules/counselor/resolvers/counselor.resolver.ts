import { MarkCounselorNotificationReadInput } from "@counselor/dtos/mark-counselor-notif-read.input";
import { CounselorAssessmentQueueListEntity } from "@counselor/entities/counselor-assessment-queue-list.entity";
import { ExportCounselorStudentReportInput } from "@counselor/dtos/export-counselor-student-report.input";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CounselorDashboardSummaryEntity } from "@counselor/entities/counselor-dashboard-summary.entity";
import { CounselorNotificationListEntity } from "@counselor/entities/counselor-notif-list.entity";
import { CounselorAssignmentListEntity } from "@counselor/entities/counselor-assignment-list.entity";
import { ScheduleCounselorSessionInput } from "@counselor/dtos/schedule-counselor-session.input";
import { MyCounselorNotificationsInput } from "@counselor/dtos/my-counselor-notifs.input";
import { CounselorStudentDetailEntity } from "@counselor/entities/counselor-student-detail.entity";
import { ReviewStudentAssessmentInput } from "@counselor/dtos/review-student-assessment.input";
import { CounselorProgressPointEntity } from "@counselor/entities/counselor-progress-point.entity";
import { StudentProgressTimelineInput } from "@counselor/dtos/student-progress-timeline.input";
import { StudentAssessmentQueueInput } from "@counselor/dtos/student-assessment-queue.input";
import { CounselorReviewDetailEntity } from "@counselor/entities/counselor-reveiw-detail.entity";
import { CounselorReviewResultEntity } from "@counselor/entities/counselor-review-result.entity";
import { CompareStudentResultsEntity } from "@counselor/entities/compare-student-results.entity";
import { CounselorExportResultEntity } from "@counselor/entities/counselor-export-result.entity";
import { CounselorStudentListEntity } from "@counselor/entities/counselor-student-list.entity";
import { CompareStudentResultsInput } from "@counselor/dtos/compare-student-results.input";
import { CounselorSessionListEntity } from "@counselor/entities/counselor-session-list.entity";
import { CounselorAssignmentsInput } from "@counselor/dtos/counselor-assignments.input";
import { MyCounselorSessionsInput } from "@counselor/dtos/my-counselor-sessions.input";
import { CounselorSessionEntity } from "@counselor/entities/counselor-session.entity";
import { CounselorService } from "@counselor/services/counselor.service";
import { MyStudentsInput } from "@counselor/dtos/my-students.input";
import { JwtAuthGuard } from "@auth/guards/jwt-auth.guard";
import { CurrentUser } from "@auth/decorators/current-user.decorator";
import { RolesGuard } from "@auth/guards/roles.guard";
import { UseGuards } from "@nestjs/common";
import { Roles } from "@auth/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.COUNSELOR)
export class CounselorResolver {
  constructor(private readonly counselorService: CounselorService) {}

  @Query(() => CounselorDashboardSummaryEntity, {
    name: "counselorDashboardSummary",
  })
  counselorDashboardSummary(@CurrentUser() user: any) {
    return this.counselorService.getDashboardSummary(user);
  }

  @Query(() => CounselorStudentListEntity, {
    name: "myStudents",
  })
  myStudents(
    @Args("input", { type: () => MyStudentsInput }) input: MyStudentsInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.myStudents(input, user);
  }

  @Query(() => CounselorStudentDetailEntity, {
    name: "counselorStudentDetail",
  })
  counselorStudentDetail(
    @Args("studentId") studentId: string,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.counselorStudentDetail(studentId, user);
  }

  @Query(() => CounselorAssessmentQueueListEntity, {
    name: "studentAssessmentQueue",
  })
  studentAssessmentQueue(
    @Args("input", { type: () => StudentAssessmentQueueInput })
    input: StudentAssessmentQueueInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.studentAssessmentQueue(input, user);
  }

  @Query(() => CounselorReviewDetailEntity, {
    name: "counselorReviewDetail",
  })
  counselorReviewDetail(
    @Args("reviewId") reviewId: string,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.counselorReviewDetail(reviewId, user);
  }

  @Mutation(() => CounselorReviewResultEntity, {
    name: "reviewStudentAssessment",
  })
  reviewStudentAssessment(
    @Args("input", { type: () => ReviewStudentAssessmentInput })
    input: ReviewStudentAssessmentInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.reviewStudentAssessment(input, user);
  }

  @Query(() => CounselorAssignmentListEntity, {
    name: "counselorAssignments",
  })
  counselorAssignments(
    @Args("input", { type: () => CounselorAssignmentsInput })
    input: CounselorAssignmentsInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.counselorAssignments(input, user);
  }

  @Query(() => [CounselorProgressPointEntity], {
    name: "studentProgressTimeline",
  })
  studentProgressTimeline(
    @Args("input", { type: () => StudentProgressTimelineInput })
    input: StudentProgressTimelineInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.studentProgressTimeline(input, user);
  }

  @Mutation(() => CounselorSessionEntity, {
    name: "scheduleCounselorSession",
  })
  scheduleCounselorSession(
    @Args("input", { type: () => ScheduleCounselorSessionInput })
    input: ScheduleCounselorSessionInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.scheduleCounselorSession(
      {
        ...input,
        scheduledAt: new Date(input.scheduledAt),
      },
      user,
    );
  }

  @Query(() => CounselorSessionListEntity, {
    name: "myCounselorSessions",
  })
  myCounselorSessions(
    @Args("input", { type: () => MyCounselorSessionsInput })
    input: MyCounselorSessionsInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.myCounselorSessions(
      {
        ...input,
        from: input.from ? new Date(input.from) : undefined,
        to: input.to ? new Date(input.to) : undefined,
      },
      user,
    );
  }

  @Query(() => CounselorNotificationListEntity, {
    name: "myCounselorNotifications",
  })
  myCounselorNotifications(
    @Args("input", { type: () => MyCounselorNotificationsInput })
    input: MyCounselorNotificationsInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.myCounselorNotifications(input, user);
  }

  @Mutation(() => CounselorReviewResultEntity, {
    name: "markCounselorNotificationRead",
  })
  markCounselorNotificationRead(
    @Args("input", { type: () => MarkCounselorNotificationReadInput })
    input: MarkCounselorNotificationReadInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.markCounselorNotificationRead(input, user);
  }

  @Mutation(() => CounselorExportResultEntity, {
    name: "exportCounselorStudentReport",
  })
  exportCounselorStudentReport(
    @Args("input", { type: () => ExportCounselorStudentReportInput })
    input: ExportCounselorStudentReportInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.exportCounselorStudentReport(input, user);
  }

  @Query(() => CompareStudentResultsEntity, {
    name: "compareStudentResults",
  })
  compareStudentResults(
    @Args("input", { type: () => CompareStudentResultsInput })
    input: CompareStudentResultsInput,
    @CurrentUser() user: any,
  ) {
    return this.counselorService.compareStudentResults(input, user);
  }
}
