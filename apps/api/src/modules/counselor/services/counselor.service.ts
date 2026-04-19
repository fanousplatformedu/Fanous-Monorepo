import { CounselorReviewStatus, CounselingSessionStatus } from "@prisma/client";
import { InAppNotificationType, Prisma, Role } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CounselorStudentLinkStatus } from "@prisma/client";
import { CounselorMessageEnum } from "@counselor/enums/counselor-message.enum";
import { ForbiddenException } from "@nestjs/common";
import { CounselorErrorEnum } from "@counselor/enums/counselor-error.enum";
import { PrismaService } from "@prisma/prisma.service";

import * as T from "@counselor/types/counselor.types";

@Injectable()
export class CounselorService {
  constructor(private readonly prismaService: PrismaService) {}

  private ensureCounselor(user: T.TCurrentCounselorUser): string {
    if (user.role !== Role.COUNSELOR)
      throw new ForbiddenException(CounselorErrorEnum.COUNSELOR_ONLY);
    if (!user.schoolId)
      throw new ForbiddenException(CounselorErrorEnum.SCHOOL_CONTEXT_REQUIRED);
    return user.schoolId;
  }

  private normalizePagination(page = 1, limit = 10) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(100, Math.max(1, limit));
    return {
      page: safePage,
      limit: safeLimit,
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    };
  }

  private buildStudentSearch(
    search?: string,
  ): Prisma.UserWhereInput | undefined {
    if (!search?.trim()) return undefined;
    return {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  private calculateAverageResult(result: {
    linguistic: number;
    logicalMath: number;
    musical: number;
    bodilyKinesthetic: number;
    visualSpatial: number;
    naturalistic: number;
    interpersonal: number;
    intrapersonal: number;
  }): number {
    const values = [
      result.linguistic,
      result.logicalMath,
      result.musical,
      result.bodilyKinesthetic,
      result.visualSpatial,
      result.naturalistic,
      result.interpersonal,
      result.intrapersonal,
    ];
    const total = values.reduce((sum, item) => sum + Number(item || 0), 0);
    return Number((total / values.length).toFixed(2));
  }

  private async ensureStudentAssigned(
    schoolId: string,
    counselorId: string,
    studentId: string,
  ) {
    const link = await this.prismaService.counselorStudentLink.findFirst({
      where: {
        schoolId,
        counselorId,
        studentId,
        status: CounselorStudentLinkStatus.ACTIVE,
      },
    });
    if (!link)
      throw new ForbiddenException(CounselorErrorEnum.STUDENT_NOT_ASSIGNED);
    return link;
  }

  async getDashboardSummary(user: T.TCurrentCounselorUser) {
    const schoolId = this.ensureCounselor(user);
    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(now);
    dayEnd.setHours(23, 59, 59, 999);
    const [
      totalStudents,
      activeStudents,
      pendingReviews,
      sessionsToday,
      upcomingSessions,
      unreadNotifications,
    ] = await Promise.all([
      this.prismaService.counselorStudentLink.count({
        where: {
          schoolId,
          counselorId: user.id,
        },
      }),
      this.prismaService.counselorStudentLink.count({
        where: {
          schoolId,
          counselorId: user.id,
          status: CounselorStudentLinkStatus.ACTIVE,
        },
      }),
      this.prismaService.counselorReview.count({
        where: {
          schoolId,
          counselorId: user.id,
          status: {
            in: [
              CounselorReviewStatus.PENDING,
              CounselorReviewStatus.IN_REVIEW,
            ],
          },
        },
      }),
      this.prismaService.counselingSession.count({
        where: {
          schoolId,
          counselorId: user.id,
          scheduledAt: {
            gte: dayStart,
            lte: dayEnd,
          },
          status: {
            in: [
              CounselingSessionStatus.CONFIRMED,
              CounselingSessionStatus.RESCHEDULED,
            ],
          },
        },
      }),
      this.prismaService.counselingSession.count({
        where: {
          schoolId,
          counselorId: user.id,
          scheduledAt: { gt: now },
          status: {
            in: [
              CounselingSessionStatus.CONFIRMED,
              CounselingSessionStatus.RESCHEDULED,
            ],
          },
        },
      }),
      this.prismaService.inAppNotification.count({
        where: {
          schoolId,
          userId: user.id,
          isRead: false,
        },
      }),
    ]);
    return {
      totalStudents,
      activeStudents,
      pendingReviews,
      sessionsToday,
      upcomingSessions,
      unreadNotifications,
    };
  }

  async myStudents(
    input: T.MyStudentsServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    const { page, limit, skip, take } = this.normalizePagination(
      input.page,
      input.limit,
    );
    const where: Prisma.CounselorStudentLinkWhereInput = {
      schoolId,
      counselorId: user.id,
      ...(input.status ? { status: input.status } : {}),
      ...(input.search
        ? {
            student: this.buildStudentSearch(input.search),
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      this.prismaService.counselorStudentLink.count({ where }),
      this.prismaService.counselorStudentLink.findMany({
        where,
        skip,
        take,
        orderBy: { assignedAt: "desc" },
        include: {
          student: true,
        },
      }),
    ]);

    const items = await Promise.all(
      rows.map(async (row) => {
        const [pendingReviews, latestResult, upcomingSession] =
          await Promise.all([
            this.prismaService.counselorReview.count({
              where: {
                schoolId,
                counselorId: user.id,
                studentId: row.studentId,
                status: {
                  in: [
                    CounselorReviewStatus.PENDING,
                    CounselorReviewStatus.IN_REVIEW,
                  ],
                },
              },
            }),
            this.prismaService.assessmentResult.findFirst({
              where: {
                schoolId,
                studentId: row.studentId,
              },
              orderBy: { createdAt: "desc" },
            }),
            this.prismaService.counselingSession.findFirst({
              where: {
                schoolId,
                counselorId: user.id,
                studentId: row.studentId,
                scheduledAt: { gt: new Date() },
                status: {
                  in: [
                    CounselingSessionStatus.CONFIRMED,
                    CounselingSessionStatus.RESCHEDULED,
                  ],
                },
              },
              orderBy: { scheduledAt: "asc" },
            }),
          ]);
        return {
          pendingReviews,
          id: row.student.id,
          linkStatus: row.status,
          email: row.student.email,
          mobile: row.student.mobile,
          assignedAt: row.assignedAt,
          latestResultAt: latestResult?.createdAt ?? null,
          fullName: row.student.fullName ?? "Unknown Student",
          upcomingSessionAt: upcomingSession?.scheduledAt ?? null,
        };
      }),
    );
    return {
      page,
      items,
      total,
      limit,
      hasNext: skip + items.length < total,
    };
  }

  async counselorStudentDetail(
    studentId: string,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    await this.ensureStudentAssigned(schoolId, user.id, studentId);
    const student = await this.prismaService.user.findFirst({
      where: {
        id: studentId,
        schoolId,
        role: Role.STUDENT,
      },
    });
    if (!student)
      throw new NotFoundException(CounselorErrorEnum.STUDENT_NOT_FOUND);
    const [
      pendingReviews,
      totalSessions,
      totalResults,
      latestSession,
      latestResult,
    ] = await Promise.all([
      this.prismaService.counselorReview.count({
        where: {
          schoolId,
          counselorId: user.id,
          studentId,
          status: {
            in: [
              CounselorReviewStatus.PENDING,
              CounselorReviewStatus.IN_REVIEW,
            ],
          },
        },
      }),
      this.prismaService.counselingSession.count({
        where: {
          schoolId,
          counselorId: user.id,
          studentId,
        },
      }),
      this.prismaService.assessmentResult.count({
        where: {
          schoolId,
          studentId,
        },
      }),
      this.prismaService.counselingSession.findFirst({
        where: {
          schoolId,
          counselorId: user.id,
          studentId,
        },
        orderBy: { createdAt: "desc" },
      }),
      this.prismaService.assessmentResult.findFirst({
        where: {
          schoolId,
          studentId,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      totalResults,
      totalSessions,
      id: student.id,
      pendingReviews,
      email: student.email,
      mobile: student.mobile,
      latestResultAt: latestResult?.createdAt ?? null,
      fullName: student.fullName ?? "Unknown Student",
      latestSessionAt: latestSession?.scheduledAt ?? null,
    };
  }

  async studentAssessmentQueue(
    input: T.StudentAssessmentQueueServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    const { page, limit, skip, take } = this.normalizePagination(
      input.page,
      input.limit,
    );
    const where: Prisma.CounselorReviewWhereInput = {
      schoolId,
      counselorId: user.id,
      ...(input.status ? { status: input.status } : {}),
      ...(input.studentId ? { studentId: input.studentId } : {}),
      ...(input.assignmentId ? { assignmentId: input.assignmentId } : {}),
      ...(input.search
        ? {
            OR: [
              {
                student: this.buildStudentSearch(input.search),
              },
              {
                assignment: {
                  title: {
                    contains: input.search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      this.prismaService.counselorReview.count({ where }),
      this.prismaService.counselorReview.findMany({
        where,
        skip,
        take,
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        include: {
          student: true,
          assignment: true,
        },
      }),
    ]);
    return {
      items: rows.map((row) => ({
        reviewId: row.id,
        status: row.status,
        resultId: row.resultId,
        studentId: row.studentId,
        createdAt: row.createdAt,
        reviewedAt: row.reviewedAt,
        assignmentId: row.assignmentId,
        assignmentTitle: row.assignment.title,
        studentName: row.student.fullName ?? "Unknown Student",
      })),
      total,
      page,
      limit,
      hasNext: skip + rows.length < total,
    };
  }

  async counselorReviewDetail(reviewId: string, user: T.TCurrentCounselorUser) {
    const schoolId = this.ensureCounselor(user);
    const review = await this.prismaService.counselorReview.findFirst({
      where: {
        id: reviewId,
        schoolId,
        counselorId: user.id,
      },
      include: {
        student: true,
        assignment: true,
        result: true,
      },
    });
    if (!review)
      throw new NotFoundException(CounselorErrorEnum.REVIEW_NOT_FOUND);
    return {
      id: review.id,
      status: review.status,
      feedback: review.feedback,
      resultId: review.resultId,
      createdAt: review.createdAt,
      studentId: review.studentId,
      reviewedAt: review.reviewedAt,
      assignmentId: review.assignmentId,
      assignmentTitle: review.assignment.title,
      dominantKey: review.result?.dominantKey ?? null,
      studentName: review.student.fullName ?? "Unknown Student",
    };
  }

  async reviewStudentAssessment(
    input: T.ReviewStudentAssessmentServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    const review = await this.prismaService.counselorReview.findFirst({
      where: {
        id: input.reviewId,
        schoolId,
        counselorId: user.id,
      },
      include: {
        student: true,
        assignment: true,
      },
    });
    if (!review)
      throw new NotFoundException(CounselorErrorEnum.REVIEW_NOT_FOUND);
    await this.prismaService.counselorReview.update({
      where: { id: review.id },
      data: {
        status: input.status,
        feedback: input.feedback,
        reviewedAt:
          input.status === CounselorReviewStatus.REVIEWED ? new Date() : null,
      },
    });
    await this.prismaService.inAppNotification.create({
      data: {
        schoolId,
        userId: review.studentId,
        type: InAppNotificationType.RESULT_READY,
        title: "Assessment review updated",
        body:
          input.feedback?.trim() ||
          `Your assessment review for "${review.assignment.title}" has been updated.`,
      },
    });

    return {
      success: true,
      message: CounselorMessageEnum.REVIEW_SAVED,
    };
  }

  async counselorAssignments(
    input: T.CounselorAssignmentsServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    const { page, limit, skip, take } = this.normalizePagination(
      input.page,
      input.limit,
    );

    const links = await this.prismaService.counselorStudentLink.findMany({
      where: {
        schoolId,
        counselorId: user.id,
        status: CounselorStudentLinkStatus.ACTIVE,
      },
      select: { studentId: true },
    });
    const linkedStudentIds = links.map((item) => item.studentId);
    if (!linkedStudentIds.length)
      return {
        items: [],
        total: 0,
        page,
        limit,
        hasNext: false,
      };
    const where: Prisma.SchoolAssignmentWhereInput = {
      schoolId,
      ...(input.search
        ? {
            title: {
              contains: input.search,
              mode: "insensitive",
            },
          }
        : {}),
      ...(input.studentId
        ? {
            studentAssignments: {
              some: {
                studentId: input.studentId,
              },
            },
          }
        : {}),
      studentAssignments: {
        some: {
          studentId: {
            in: linkedStudentIds,
          },
        },
      },
    };
    const [total, assignments] = await Promise.all([
      this.prismaService.schoolAssignment.count({ where }),
      this.prismaService.schoolAssignment.findMany({
        where,
        skip,
        take,
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      }),
    ]);

    const items = await Promise.all(
      assignments.map(async (assignment) => {
        const [totalAssignedStudents, pendingReviews, reviewedCount] =
          await Promise.all([
            this.prismaService.studentAssignment.count({
              where: {
                assignmentId: assignment.id,
                studentId: { in: linkedStudentIds },
              },
            }),
            this.prismaService.counselorReview.count({
              where: {
                schoolId,
                counselorId: user.id,
                assignmentId: assignment.id,
                status: {
                  in: [
                    CounselorReviewStatus.PENDING,
                    CounselorReviewStatus.IN_REVIEW,
                  ],
                },
              },
            }),
            this.prismaService.counselorReview.count({
              where: {
                schoolId,
                counselorId: user.id,
                assignmentId: assignment.id,
                status: CounselorReviewStatus.REVIEWED,
              },
            }),
          ]);
        return {
          reviewedCount,
          pendingReviews,
          totalAssignedStudents,
          title: assignment.title,
          dueAt: assignment.dueAt,
          status: assignment.status,
          assignmentId: assignment.id,
          publishedAt: assignment.publishedAt,
        };
      }),
    );
    return {
      items,
      total,
      page,
      limit,
      hasNext: skip + items.length < total,
    };
  }

  async studentProgressTimeline(
    input: T.TStudentProgressTimelineServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    await this.ensureStudentAssigned(schoolId, user.id, input.studentId);
    const results = await this.prismaService.assessmentResult.findMany({
      where: {
        schoolId,
        studentId: input.studentId,
      },
      include: {
        studentAssignment: {
          include: {
            assignment: true,
          },
        },
      },
      take: input.limit ?? 12,
      orderBy: { createdAt: "desc" },
    });

    return results.reverse().map((result, index) => ({
      label:
        result.studentAssignment?.assignment?.title ||
        result.dominantKey ||
        `Assessment ${index + 1}`,
      date: result.createdAt,
      value: this.calculateAverageResult(result),
    }));
  }

  async scheduleCounselorSession(
    input: T.TScheduleCounselorSessionServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    await this.ensureStudentAssigned(schoolId, user.id, input.studentId);
    const created = await this.prismaService.counselingSession.create({
      data: {
        schoolId,
        note: input.note,
        title: input.title,
        counselorId: user.id,
        requestedById: user.id,
        studentId: input.studentId,
        meetingUrl: input.meetingUrl,
        scheduledAt: input.scheduledAt,
        status: CounselingSessionStatus.CONFIRMED,
      },
      include: {
        student: true,
      },
    });
    await this.prismaService.inAppNotification.create({
      data: {
        schoolId,
        userId: input.studentId,
        type: InAppNotificationType.GENERAL,
        title: "Counseling session scheduled",
        body: `A counseling session titled "${created.title}" has been scheduled.`,
      },
    });
    return {
      id: created.id,
      note: created.note,
      title: created.title,
      status: created.status,
      createdAt: created.createdAt,
      studentId: created.studentId,
      meetingUrl: created.meetingUrl,
      scheduledAt: created.scheduledAt,
      studentName: created.student.fullName ?? "Unknown Student",
    };
  }

  async myCounselorSessions(
    input: T.MyCounselorSessionsServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    const { page, limit, skip, take } = this.normalizePagination(
      input.page,
      input.limit,
    );
    const where: Prisma.CounselingSessionWhereInput = {
      schoolId,
      counselorId: user.id,
      ...(input.status ? { status: input.status } : {}),
      ...(input.studentId ? { studentId: input.studentId } : {}),
      ...(input.from || input.to
        ? {
            scheduledAt: {
              ...(input.from ? { gte: input.from } : {}),
              ...(input.to ? { lte: input.to } : {}),
            },
          }
        : {}),
      ...(input.search
        ? {
            OR: [
              { title: { contains: input.search, mode: "insensitive" } },
              { note: { contains: input.search, mode: "insensitive" } },
              { student: this.buildStudentSearch(input.search) },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      this.prismaService.counselingSession.count({ where }),
      this.prismaService.counselingSession.findMany({
        where,
        skip,
        take,
        orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
        include: {
          student: true,
        },
      }),
    ]);

    return {
      items: rows.map((row) => ({
        id: row.id,
        note: row.note,
        title: row.title,
        status: row.status,
        createdAt: row.createdAt,
        studentId: row.studentId,
        meetingUrl: row.meetingUrl,
        scheduledAt: row.scheduledAt,
        studentName: row.student.fullName ?? "Unknown Student",
      })),
      total,
      page,
      limit,
      hasNext: skip + rows.length < total,
    };
  }

  async myCounselorNotifications(
    input: T.MyCounselorNotificationsServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    const { page, limit, skip, take } = this.normalizePagination(
      input.page,
      input.limit,
    );
    const where: Prisma.InAppNotificationWhereInput = {
      schoolId,
      userId: user.id,
      ...(input.unreadOnly ? { isRead: false } : {}),
      ...(input.search
        ? {
            OR: [
              { title: { contains: input.search, mode: "insensitive" } },
              { body: { contains: input.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [total, rows] = await Promise.all([
      this.prismaService.inAppNotification.count({ where }),
      this.prismaService.inAppNotification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      items: rows.map((row) => ({
        id: row.id,
        type: row.type,
        body: row.body,
        title: row.title,
        isRead: row.isRead,
        readAt: row.readAt,
        actionUrl: row.actionUrl,
        createdAt: row.createdAt,
      })),
      total,
      page,
      limit,
      hasNext: skip + rows.length < total,
    };
  }

  async markCounselorNotificationRead(
    input: T.MarkCounselorNotificationReadServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    await this.prismaService.inAppNotification.updateMany({
      where: {
        id: input.notificationId,
        schoolId,
        userId: user.id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    return {
      success: true,
      message: CounselorMessageEnum.NOTIFICATION_MARKED,
    };
  }

  async exportCounselorStudentReport(
    input: T.ExportCounselorStudentReportServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    await this.ensureStudentAssigned(schoolId, user.id, input.studentId);
    const student = await this.prismaService.user.findFirst({
      where: {
        id: input.studentId,
        schoolId,
        role: Role.STUDENT,
      },
    });
    if (!student)
      throw new NotFoundException(CounselorErrorEnum.STUDENT_NOT_FOUND);
    const now = new Date();
    const ext = input.format === "PDF" ? "pdf" : "xlsx";
    const safeStudentId = student.id;
    const fileName = `counselor-student-report-${safeStudentId}-${now.getTime()}.${ext}`;
    const filePath = `/exports/counselor/${schoolId}/${fileName}`;
    return {
      id: `export_${now.getTime()}`,
      format: input.format,
      fileName,
      filePath,
      createdAt: now,
    };
  }

  async compareStudentResults(
    input: T.CompareStudentResultsServiceInput,
    user: T.TCurrentCounselorUser,
  ) {
    const schoolId = this.ensureCounselor(user);
    const assignedLinks =
      await this.prismaService.counselorStudentLink.findMany({
        where: {
          schoolId,
          counselorId: user.id,
          studentId: { in: input.studentIds },
          status: CounselorStudentLinkStatus.ACTIVE,
        },
        include: {
          student: true,
        },
      });
    if (assignedLinks.length !== input.studentIds.length)
      throw new ForbiddenException(CounselorErrorEnum.INVALID_STUDENT_IDS);
    const items = await Promise.all(
      assignedLinks.map(async (link) => {
        const latest = await this.prismaService.assessmentResult.findFirst({
          where: {
            schoolId,
            studentId: link.studentId,
          },
          orderBy: { createdAt: "desc" },
        });
        return {
          studentId: link.studentId,
          studentName: link.student.fullName ?? "Unknown Student",
          latestScore: latest ? this.calculateAverageResult(latest) : null,
          dominantKey: latest?.dominantKey ?? null,
          latestDate: latest?.createdAt ?? null,
        };
      }),
    );
    return { items };
  }
}
