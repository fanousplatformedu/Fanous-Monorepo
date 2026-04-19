import { CounselingSessionStatus, InAppNotificationType } from "@prisma/client";
import { AuditAction, Role, StudentAssignmentStatus } from "@prisma/client";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { getCareerMatchesByDominantIntelligence } from "@student/utils/career-match-map";
import { Injectable, NotFoundException } from "@nestjs/common";
import { calculateIntelligenceScores } from "@student/utils/student-assessment-scoring";
import { getDominantIntelligence } from "@student/utils/student-assessment-scoring";
import { IntelligenceKey, Prisma } from "@prisma/client";
import { getAverageOverallScore } from "@student/utils/student-assessment-scoring";
import { StudentErrorCode } from "@student/enums/student-error-code.enum";
import { StudentMessage } from "@student/enums/student-message.enum";
import { PrismaService } from "@prisma/prisma.service";
import { AuditService } from "@audit/services/audit.service";

import * as T from "@student/types/student.types";

@Injectable()
export class StudentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  private ensureStudent(actor: T.TStudentActor): string {
    if (actor.role !== Role.STUDENT)
      throw new ForbiddenException({
        code: StudentErrorCode.FORBIDDEN,
        message: StudentMessage.ONLY_STUDENTS_ALLOWED,
      });
    if (!actor.schoolId)
      throw new BadRequestException({
        code: StudentErrorCode.SCHOOL_SCOPE_MISSING,
        message: StudentMessage.SCHOOL_SCOPE_MISSING,
      });
    return actor.schoolId;
  }

  private normalizePagination(take: number, skip: number) {
    return {
      take: Math.max(1, Math.min(100, take)),
      skip: Math.max(0, skip),
    };
  }

  private normalizeQuery(query?: string | null): string | null {
    const value = query?.trim();
    return value ? value : null;
  }

  private buildScoreItems(result: {
    musical: number;
    linguistic: number;
    logicalMath: number;
    naturalistic: number;
    interpersonal: number;
    visualSpatial: number;
    intrapersonal: number;
    bodilyKinesthetic: number;
  }) {
    return [
      {
        intelligence: IntelligenceKey.LINGUISTIC,
        rawScore: result.linguistic,
        maxScore: 100,
        percentage: result.linguistic,
        level: "MEDIUM" as const,
      },
      {
        intelligence: IntelligenceKey.LOGICAL_MATHEMATICAL,
        rawScore: result.logicalMath,
        maxScore: 100,
        percentage: result.logicalMath,
        level: "MEDIUM" as const,
      },
      {
        intelligence: IntelligenceKey.MUSICAL,
        rawScore: result.musical,
        maxScore: 100,
        percentage: result.musical,
        level: "MEDIUM" as const,
      },
      {
        intelligence: IntelligenceKey.BODILY_KINESTHETIC,
        rawScore: result.bodilyKinesthetic,
        maxScore: 100,
        percentage: result.bodilyKinesthetic,
        level: "MEDIUM" as const,
      },
      {
        intelligence: IntelligenceKey.VISUAL_SPATIAL,
        rawScore: result.visualSpatial,
        maxScore: 100,
        percentage: result.visualSpatial,
        level: "MEDIUM" as const,
      },
      {
        intelligence: IntelligenceKey.NATURALISTIC,
        rawScore: result.naturalistic,
        maxScore: 100,
        percentage: result.naturalistic,
        level: "MEDIUM" as const,
      },
      {
        intelligence: IntelligenceKey.INTERPERSONAL,
        rawScore: result.interpersonal,
        maxScore: 100,
        percentage: result.interpersonal,
        level: "MEDIUM" as const,
      },
      {
        intelligence: IntelligenceKey.INTRAPERSONAL,
        rawScore: result.intrapersonal,
        maxScore: 100,
        percentage: result.intrapersonal,
        level: "MEDIUM" as const,
      },
    ];
  }

  async getDashboardSummary(actor: T.TStudentActor) {
    const schoolId = this.ensureStudent(actor);
    const [
      totalAssignments,
      notStartedAssignments,
      pendingAssignments,
      inProgressAssignments,
      submittedAssignments,
      evaluatedAssignments,
      unreadNotifications,
      pendingCounselingSessions,
      latestResultsRaw,
    ] = await this.prismaService.$transaction([
      this.prismaService.studentAssignment.count({
        where: {
          studentId: actor.id,
          assignment: { schoolId },
        },
      }),
      this.prismaService.studentAssignment.count({
        where: {
          studentId: actor.id,
          assignment: { schoolId },
          status: StudentAssignmentStatus.NOT_STARTED,
        },
      }),
      this.prismaService.studentAssignment.count({
        where: {
          studentId: actor.id,
          assignment: { schoolId },
          status: StudentAssignmentStatus.PENDING,
        },
      }),
      this.prismaService.studentAssignment.count({
        where: {
          studentId: actor.id,
          assignment: { schoolId },
          status: StudentAssignmentStatus.IN_PROGRESS,
        },
      }),
      this.prismaService.studentAssignment.count({
        where: {
          studentId: actor.id,
          assignment: { schoolId },
          status: StudentAssignmentStatus.SUBMITTED,
        },
      }),
      this.prismaService.studentAssignment.count({
        where: {
          studentId: actor.id,
          assignment: { schoolId },
          status: StudentAssignmentStatus.EVALUATED,
        },
      }),
      this.prismaService.inAppNotification.count({
        where: {
          userId: actor.id,
          schoolId,
          isRead: false,
        },
      }),
      this.prismaService.counselingSession.count({
        where: {
          studentId: actor.id,
          schoolId,
          status: {
            in: [
              CounselingSessionStatus.REQUESTED,
              CounselingSessionStatus.CONFIRMED,
            ],
          },
        },
      }),
      this.prismaService.assessmentResult.findMany({
        where: {
          studentId: actor.id,
          schoolId,
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);
    const latestResults = latestResultsRaw.slice().reverse();
    const progressTimeline = latestResults.map((result, index) => ({
      label: `#${index + 1}`,
      overall: getAverageOverallScore(this.buildScoreItems(result)),
    }));
    const latestResult = latestResults.at(-1);
    return {
      totalAssignments,
      pendingAssignments:
        notStartedAssignments + pendingAssignments + inProgressAssignments,
      inProgressAssignments,
      submittedAssignments,
      evaluatedAssignments,
      unreadNotifications,
      pendingCounselingSessions,
      dominantIntelligence: latestResult?.dominantKey ?? null,
      latestOverallScore: latestResult
        ? getAverageOverallScore(this.buildScoreItems(latestResult))
        : 0,
      progressTimeline,
    };
  }

  async listMyAssignments(args: T.TListMyAssignmentsArgs) {
    const schoolId = this.ensureStudent(args.actor);
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.StudentAssignmentWhereInput = {
      studentId: args.actor.id,
      assignment: {
        schoolId,
        ...(query
          ? {
              OR: [
                {
                  title: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            }
          : {}),
      },
      ...(args.status ? { status: args.status } : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.studentAssignment.findMany({
        where,
        include: {
          assignment: true,
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        skip,
      }),
      this.prismaService.studentAssignment.count({ where }),
    ]);
    return {
      items: items.map((item) => ({
        id: item.id,
        status: item.status,
        startedAt: item.startedAt,
        dueAt: item.assignment.dueAt,
        title: item.assignment.title,
        submittedAt: item.submittedAt,
        evaluatedAt: item.evaluatedAt,
        assignmentId: item.assignmentId,
        completionRate: item.completionRate,
        targetMode: item.assignment.targetMode,
        publishedAt: item.assignment.publishedAt,
        description: item.assignment.description,
      })),
      total,
      take,
      skip,
    };
  }

  async getMyAssignmentDetail(
    actor: T.TStudentActor,
    studentAssignmentId: string,
  ) {
    const schoolId = this.ensureStudent(actor);
    const item = await this.prismaService.studentAssignment.findFirst({
      where: {
        id: studentAssignmentId,
        studentId: actor.id,
        assignment: {
          schoolId,
        },
      },
      include: {
        assignment: {
          include: {
            assignmentQuestions: {
              orderBy: { order: "asc" },
            },
          },
        },
        answers: true,
      },
    });
    if (!item)
      throw new NotFoundException({
        code: StudentErrorCode.ASSIGNMENT_NOT_FOUND,
        message: StudentMessage.ASSIGNMENT_NOT_FOUND,
      });
    const answerMap = new Map<string, number>();
    for (const answer of item.answers) {
      answerMap.set(answer.assignmentQuestionId, answer.value);
    }
    return {
      id: item.id,
      status: item.status,
      dueAt: item.assignment.dueAt,
      title: item.assignment.title,
      assignmentId: item.assignmentId,
      description: item.assignment.description,
      publishedAt: item.assignment.publishedAt,
      questions: item.assignment.assignmentQuestions.map((question) => ({
        id: question.id,
        order: question.order,
        questionNumber: question.questionNumber,
        text: question.text,
        answerValue: answerMap.get(question.id) ?? null,
      })),
    };
  }

  async submitAssignmentAnswers(args: T.TSubmitAssignmentAnswersArgs) {
    const schoolId = this.ensureStudent(args.actor);
    const studentAssignment =
      await this.prismaService.studentAssignment.findFirst({
        where: {
          id: args.studentAssignmentId,
          studentId: args.actor.id,
          assignment: {
            schoolId,
          },
        },
        include: {
          assignment: {
            include: {
              assignmentQuestions: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });
    if (!studentAssignment)
      throw new NotFoundException({
        code: StudentErrorCode.ASSIGNMENT_NOT_FOUND,
        message: StudentMessage.ASSIGNMENT_NOT_FOUND,
      });
    if (studentAssignment.status === StudentAssignmentStatus.EVALUATED)
      throw new BadRequestException({
        code: StudentErrorCode.ASSIGNMENT_ALREADY_EVALUATED,
        message: StudentMessage.ASSIGNMENT_ALREADY_EVALUATED,
      });
    const uniqueQuestionNumbers = new Set<number>();
    for (const answer of args.answers) {
      if (uniqueQuestionNumbers.has(answer.questionNumber))
        throw new BadRequestException({
          code: StudentErrorCode.DUPLICATE_ANSWER,
          message: StudentMessage.DUPLICATE_ANSWER,
        });
      uniqueQuestionNumbers.add(answer.questionNumber);
    }
    const questionByNumber = new Map(
      studentAssignment.assignment.assignmentQuestions.map((question) => [
        question.questionNumber,
        question,
      ]),
    );
    for (const answer of args.answers) {
      if (!questionByNumber.has(answer.questionNumber))
        throw new BadRequestException({
          code: StudentErrorCode.INVALID_ASSIGNMENT_QUESTION,
          message: StudentMessage.INVALID_ASSIGNMENT_QUESTION,
        });
    }
    const scores = calculateIntelligenceScores(args.answers);
    const dominantIntelligence = getDominantIntelligence(scores);
    const careerMatches =
      getCareerMatchesByDominantIntelligence(dominantIntelligence);
    const summaryJson = {
      scores,
      dominantIntelligence,
      careerMatches,
      overall: getAverageOverallScore(scores),
    };
    const linguistic =
      scores.find((item) => item.intelligence === IntelligenceKey.LINGUISTIC)
        ?.percentage ?? 0;
    const logicalMath =
      scores.find(
        (item) => item.intelligence === IntelligenceKey.LOGICAL_MATHEMATICAL,
      )?.percentage ?? 0;
    const musical =
      scores.find((item) => item.intelligence === IntelligenceKey.MUSICAL)
        ?.percentage ?? 0;
    const bodilyKinesthetic =
      scores.find(
        (item) => item.intelligence === IntelligenceKey.BODILY_KINESTHETIC,
      )?.percentage ?? 0;
    const visualSpatial =
      scores.find(
        (item) => item.intelligence === IntelligenceKey.VISUAL_SPATIAL,
      )?.percentage ?? 0;
    const naturalistic =
      scores.find((item) => item.intelligence === IntelligenceKey.NATURALISTIC)
        ?.percentage ?? 0;
    const interpersonal =
      scores.find((item) => item.intelligence === IntelligenceKey.INTERPERSONAL)
        ?.percentage ?? 0;
    const intrapersonal =
      scores.find((item) => item.intelligence === IntelligenceKey.INTRAPERSONAL)
        ?.percentage ?? 0;
    await this.prismaService.$transaction(async (tx) => {
      for (const answer of args.answers) {
        const question = questionByNumber.get(answer.questionNumber);
        if (!question) continue;
        await tx.studentAnswer.upsert({
          where: {
            studentAssignmentId_assignmentQuestionId: {
              studentAssignmentId: studentAssignment.id,
              assignmentQuestionId: question.id,
            },
          },
          update: {
            value: answer.value,
          },
          create: {
            studentAssignmentId: studentAssignment.id,
            assignmentQuestionId: question.id,
            assessmentQuestionId: question.sourceQuestionId ?? null,
            value: answer.value,
          },
        });
      }
      await tx.studentAssignment.update({
        where: { id: studentAssignment.id },
        data: {
          status: StudentAssignmentStatus.EVALUATED,
          startedAt: studentAssignment.startedAt ?? new Date(),
          submittedAt: new Date(),
          evaluatedAt: new Date(),
          completionRate: 100,
        },
      });
      await tx.assessmentResult.upsert({
        where: {
          studentAssignmentId: studentAssignment.id,
        },
        update: {
          schoolId,
          studentId: args.actor.id,
          dominantKey: dominantIntelligence,
          linguistic,
          logicalMath,
          musical,
          bodilyKinesthetic,
          visualSpatial,
          naturalistic,
          interpersonal,
          intrapersonal,
          summaryJson,
        },
        create: {
          schoolId,
          studentId: args.actor.id,
          studentAssignmentId: studentAssignment.id,
          dominantKey: dominantIntelligence,
          linguistic,
          logicalMath,
          musical,
          bodilyKinesthetic,
          visualSpatial,
          naturalistic,
          interpersonal,
          intrapersonal,
          summaryJson,
        },
      });
      await tx.inAppNotification.create({
        data: {
          schoolId,
          userId: args.actor.id,
          type: InAppNotificationType.RESULT_READY,
          title: "Assessment Result Ready",
          body: `Your result for "${studentAssignment.assignment.title}" is ready.`,
          actionUrl: `/student/dashboard/results/${studentAssignment.id}`,
        },
      });
    });
    await this.auditService.record({
      action: AuditAction.ASSESSMENT_SUBMIT,
      actorId: args.actor.id,
      schoolId,
      entityType: "StudentAssignment",
      entityId: studentAssignment.id,
      metadata: {
        assignmentId: studentAssignment.assignmentId,
        answerCount: args.answers.length,
      },
    });
    await this.auditService.record({
      action: AuditAction.ASSESSMENT_EVALUATE,
      actorId: args.actor.id,
      schoolId,
      entityType: "AssessmentResult",
      entityId: studentAssignment.id,
      metadata: {
        assignmentId: studentAssignment.assignmentId,
        dominantIntelligence,
      },
    });
    return {
      success: true,
      message: StudentMessage.ASSIGNMENT_SUBMITTED,
    };
  }

  async listMyAssessmentResults(args: T.TListMyAssessmentResultsArgs) {
    const schoolId = this.ensureStudent(args.actor);
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.AssessmentResultWhereInput = {
      studentId: args.actor.id,
      schoolId,
      ...(args.dominantIntelligence
        ? { dominantKey: args.dominantIntelligence }
        : {}),
      ...(query
        ? {
            OR: [
              {
                studentAssignment: {
                  assignment: {
                    title: {
                      contains: query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.assessmentResult.findMany({
        where,
        include: {
          studentAssignment: {
            include: {
              assignment: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        skip,
      }),
      this.prismaService.assessmentResult.count({ where }),
    ]);
    return {
      items: items.map((item) => ({
        id: item.id,
        musical: item.musical,
        createdAt: item.createdAt,
        linguistic: item.linguistic,
        logicalMath: item.logicalMath,
        naturalistic: item.naturalistic,
        interpersonal: item.interpersonal,
        visualSpatial: item.visualSpatial,
        intrapersonal: item.intrapersonal,
        assignmentTitle: item.studentAssignment.assignment.title,
        bodilyKinesthetic: item.bodilyKinesthetic,
        studentAssignmentId: item.studentAssignmentId,
        dominantIntelligence: item.dominantKey,
      })),
      total,
      take,
      skip,
    };
  }

  async getMyAssessmentResultDetail(actor: T.TStudentActor, resultId: string) {
    const schoolId = this.ensureStudent(actor);
    const result = await this.prismaService.assessmentResult.findFirst({
      where: {
        id: resultId,
        studentId: actor.id,
        schoolId,
      },
      include: {
        studentAssignment: {
          include: {
            assignment: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });
    if (!result)
      throw new NotFoundException({
        code: StudentErrorCode.ASSESSMENT_RESULT_NOT_FOUND,
        message: StudentMessage.RESULT_NOT_FOUND,
      });
    const summary =
      result.summaryJson && typeof result.summaryJson === "object"
        ? result.summaryJson
        : null;
    const careerMatches =
      summary &&
      typeof summary === "object" &&
      "careerMatches" in summary &&
      Array.isArray((summary as { careerMatches?: unknown[] }).careerMatches)
        ? ((summary as { careerMatches: unknown[] }).careerMatches as Array<{
            title: string;
            score: number;
            description: string;
            fitReason: string;
          }>)
        : [];
    return {
      id: result.id,
      musical: result.musical,
      linguistic: result.linguistic,
      logicalMath: result.logicalMath,
      naturalistic: result.naturalistic,
      interpersonal: result.interpersonal,
      intrapersonal: result.intrapersonal,
      visualSpatial: result.visualSpatial,
      assignmentTitle: result.studentAssignment.assignment.title,
      bodilyKinesthetic: result.bodilyKinesthetic,
      studentAssignmentId: result.studentAssignmentId,
      dominantIntelligence: result.dominantKey,
      scoreSummary: JSON.stringify(summary ?? null),
      careerMatches,
      createdAt: result.createdAt,
    };
  }

  async compareResults(args: T.TCompareResultsArgs) {
    const schoolId = this.ensureStudent(args.actor);
    const [baseResult, compareWithResult] =
      await this.prismaService.$transaction([
        this.prismaService.assessmentResult.findFirst({
          where: {
            id: args.baseResultId,
            studentId: args.actor.id,
            schoolId,
          },
        }),
        this.prismaService.assessmentResult.findFirst({
          where: {
            id: args.compareWithResultId,
            studentId: args.actor.id,
            schoolId,
          },
        }),
      ]);
    if (!baseResult || !compareWithResult)
      throw new NotFoundException({
        code: StudentErrorCode.COMPARE_RESULT_NOT_FOUND,
        message: StudentMessage.COMPARE_RESULT_NOT_FOUND,
      });
    return [
      {
        intelligence: IntelligenceKey.LINGUISTIC,
        current: baseResult.linguistic,
        previous: compareWithResult.linguistic,
        delta: baseResult.linguistic - compareWithResult.linguistic,
      },
      {
        intelligence: IntelligenceKey.LOGICAL_MATHEMATICAL,
        current: baseResult.logicalMath,
        previous: compareWithResult.logicalMath,
        delta: baseResult.logicalMath - compareWithResult.logicalMath,
      },
      {
        intelligence: IntelligenceKey.MUSICAL,
        current: baseResult.musical,
        previous: compareWithResult.musical,
        delta: baseResult.musical - compareWithResult.musical,
      },
      {
        intelligence: IntelligenceKey.BODILY_KINESTHETIC,
        current: baseResult.bodilyKinesthetic,
        previous: compareWithResult.bodilyKinesthetic,
        delta:
          baseResult.bodilyKinesthetic - compareWithResult.bodilyKinesthetic,
      },
      {
        intelligence: IntelligenceKey.VISUAL_SPATIAL,
        current: baseResult.visualSpatial,
        previous: compareWithResult.visualSpatial,
        delta: baseResult.visualSpatial - compareWithResult.visualSpatial,
      },
      {
        intelligence: IntelligenceKey.NATURALISTIC,
        current: baseResult.naturalistic,
        previous: compareWithResult.naturalistic,
        delta: baseResult.naturalistic - compareWithResult.naturalistic,
      },
      {
        intelligence: IntelligenceKey.INTERPERSONAL,
        current: baseResult.interpersonal,
        previous: compareWithResult.interpersonal,
        delta: baseResult.interpersonal - compareWithResult.interpersonal,
      },
      {
        intelligence: IntelligenceKey.INTRAPERSONAL,
        current: baseResult.intrapersonal,
        previous: compareWithResult.intrapersonal,
        delta: baseResult.intrapersonal - compareWithResult.intrapersonal,
      },
    ];
  }

  async listMyNotifications(args: T.TListMyNotificationsArgs) {
    const schoolId = this.ensureStudent(args.actor);
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.InAppNotificationWhereInput = {
      userId: args.actor.id,
      schoolId,
      ...(args.unreadOnly ? { isRead: false } : {}),
      ...(query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                body: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.inAppNotification.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        skip,
      }),
      this.prismaService.inAppNotification.count({ where }),
    ]);
    return {
      items,
      total,
      take,
      skip,
    };
  }

  async markNotificationRead(args: T.TMarkNotificationReadArgs) {
    const schoolId = this.ensureStudent(args.actor);
    const notification = await this.prismaService.inAppNotification.findFirst({
      where: {
        id: args.notificationId,
        userId: args.actor.id,
        schoolId,
      },
      select: { id: true, isRead: true },
    });
    if (!notification)
      throw new NotFoundException({
        code: StudentErrorCode.NOTIFICATION_NOT_FOUND,
        message: StudentMessage.NOTIFICATION_NOT_FOUND,
      });
    if (!notification.isRead) {
      await this.prismaService.inAppNotification.update({
        where: { id: notification.id },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
      await this.auditService.record({
        action: AuditAction.INAPP_NOTIFICATION_READ,
        actorId: args.actor.id,
        schoolId,
        entityType: "InAppNotification",
        entityId: notification.id,
        metadata: {
          read: true,
        },
      });
    }
    return {
      success: true,
      message: StudentMessage.NOTIFICATION_MARKED_AS_READ,
    };
  }

  async requestCounselingSession(args: T.TRequestCounselingSessionArgs) {
    const schoolId = this.ensureStudent(args.actor);
    if (args.counselorId) {
      const counselor = await this.prismaService.user.findFirst({
        where: {
          id: args.counselorId,
          schoolId,
          role: Role.COUNSELOR,
        },
        select: { id: true },
      });
      if (!counselor)
        throw new BadRequestException({
          code: StudentErrorCode.INVALID_COUNSELOR,
          message: StudentMessage.INVALID_COUNSELOR,
        });
    }
    const session = await this.prismaService.counselingSession.create({
      data: {
        schoolId,
        studentId: args.actor.id,
        requestedById: args.actor.id,
        counselorId: args.counselorId ?? null,
        title: args.title.trim(),
        note: args.note?.trim() ?? null,
        meetingUrl: args.meetingUrl?.trim() ?? null,
        scheduledAt: args.scheduledAt ? new Date(args.scheduledAt) : null,
        status: CounselingSessionStatus.REQUESTED,
      },
    });
    return {
      id: session.id,
      note: session.note,
      title: session.title,
      status: session.status,
      createdAt: session.createdAt,
      meetingUrl: session.meetingUrl,
      canceledAt: session.canceledAt,
      scheduledAt: session.scheduledAt,
      counselorId: session.counselorId,
    };
  }

  async cancelCounselingSession(args: T.TCancelCounselingSessionArgs) {
    const schoolId = this.ensureStudent(args.actor);
    const session = await this.prismaService.counselingSession.findFirst({
      where: {
        id: args.sessionId,
        studentId: args.actor.id,
        schoolId,
      },
    });
    if (!session)
      throw new NotFoundException({
        code: StudentErrorCode.COUNSELING_SESSION_NOT_FOUND,
        message: StudentMessage.COUNSELING_SESSION_NOT_FOUND,
      });
    if (
      session.status !== CounselingSessionStatus.REQUESTED &&
      session.status !== CounselingSessionStatus.CONFIRMED
    )
      throw new BadRequestException({
        code: StudentErrorCode.COUNSELING_SESSION_NOT_CANCELABLE,
        message: StudentMessage.COUNSELING_SESSION_NOT_CANCELABLE,
      });
    await this.prismaService.counselingSession.update({
      where: { id: session.id },
      data: {
        status: CounselingSessionStatus.CANCELED,
        canceledAt: new Date(),
        note: args.reason?.trim()
          ? `${session.note ? `${session.note}\n` : ""}Cancel reason: ${args.reason.trim()}`
          : session.note,
      },
    });
    return {
      success: true,
      message: StudentMessage.COUNSELING_SESSION_CANCELED,
    };
  }

  async listMyCounselingSessions(args: T.TListMyCounselingSessionsArgs) {
    const schoolId = this.ensureStudent(args.actor);
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.CounselingSessionWhereInput = {
      studentId: args.actor.id,
      schoolId,
      ...(args.status ? { status: args.status } : {}),
      ...(query
        ? {
            OR: [
              {
                title: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                note: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.counselingSession.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        skip,
      }),
      this.prismaService.counselingSession.count({ where }),
    ]);
    return {
      items: items.map((session) => ({
        id: session.id,
        note: session.note,
        title: session.title,
        status: session.status,
        createdAt: session.createdAt,
        canceledAt: session.canceledAt,
        meetingUrl: session.meetingUrl,
        scheduledAt: session.scheduledAt,
        counselorId: session.counselorId,
      })),
      total,
      take,
      skip,
    };
  }
}
