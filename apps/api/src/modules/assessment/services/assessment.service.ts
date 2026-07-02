import {
  AssignmentStatus,
  AssignmentTargetMode,
  AuditAction,
  UserStatus,
} from "@prisma/client";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { IntelligenceKey, Prisma, Role } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { StudentAssignmentStatus } from "@prisma/client";
import { AssessmentErrorCode } from "@assessment/enums/assessment-error-code";
import { PrismaService } from "@prisma/prisma.service";
import { AuditService } from "@audit/services/audit.service";
import { buildUserNameSearch } from "@common/utils/person-name.util";

import * as T from "../types";

@Injectable()
export class AssessmentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  private ensureSchoolAdminScope(actor: T.TAssessmentActor) {
    if (actor.role !== Role.SCHOOL_ADMIN)
      throw new ForbiddenException({ code: AssessmentErrorCode.FORBIDDEN });
    if (!actor?.schoolId)
      throw new ForbiddenException({
        code: AssessmentErrorCode.SCHOOL_SCOPE_REQUIRED,
      });
  }

  private ensureAssignmentDueAtIsNotInPast(
    dueAt: string | null | undefined,
    currentDueAt?: Date | null,
  ) {
    if (!dueAt) return;

    const parsedDueAt = new Date(dueAt);
    if (Number.isNaN(parsedDueAt.getTime())) {
      throw new BadRequestException({
        code: AssessmentErrorCode.ASSIGNMENT_DUE_IN_PAST,
      });
    }

    const parsedDueAtTime = parsedDueAt.getTime();
    const currentDueAtTime = currentDueAt?.getTime();
    if (parsedDueAtTime < Date.now() && parsedDueAtTime !== currentDueAtTime) {
      throw new BadRequestException({
        code: AssessmentErrorCode.ASSIGNMENT_DUE_IN_PAST,
      });
    }
  }

  private getBand(value: number) {
    if (value >= 80) return "VERY_STRONG";
    if (value >= 60) return "STRONG";
    if (value >= 40) return "MODERATE";
    return "NEEDS_SUPPORT";
  }

  private async ensureAssignmentQuestions(
    assignmentId: string,
    tx: Prisma.TransactionClient = this.prismaService,
  ) {
    const existingCount = await tx.assignmentQuestion.count({
      where: { assignmentId },
    });

    if (existingCount > 0) return;
    const sourceQuestions = await tx.assessmentQuestion.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { code: "asc" }],
      select: {
        id: true,
        text: true,
        order: true,
        code: true,
      },
    });
    if (!sourceQuestions.length)
      throw new BadRequestException({
        code: "ASSESSMENT_QUESTION_NOT_FOUND",
        message: "No active assessment questions found.",
      });

    await tx.assignmentQuestion.createMany({
      data: sourceQuestions.map((question, index) => ({
        assignmentId,
        sourceQuestionId: question.id,
        order: question.order ?? index + 1,
        questionNumber: index + 1,
        text: question.text,
        isActive: true,
      })),
      skipDuplicates: true,
    });
  }

  async assessmentQuestions() {
    const items = await this.prismaService.assessmentQuestion.findMany({
      where: { isActive: true },
      include: {
        intelligences: {
          select: { intelligenceKey: true },
          orderBy: { intelligenceKey: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
    return items.map((item) => ({
      ...item,
      intelligenceKeys: item.intelligences.map(
        (entry) => entry.intelligenceKey,
      ),
    }));
  }

  async createAssignment(args: T.TCreateAssignmentArgs) {
    this.ensureSchoolAdminScope(args.actor);
    const schoolId = args.actor.schoolId!;
    if (!args.title?.trim()) throw new BadRequestException("TITLE_REQUIRED");
    if (args.targetMode === "BY_GRADE" && !args.targetGradeId)
      throw new BadRequestException("TARGET_GRADE_REQUIRED");
    if (args.targetMode === "BY_CLASSROOM" && !args.targetClassroomId)
      throw new BadRequestException("TARGET_CLASSROOM_REQUIRED");
    this.ensureAssignmentDueAtIsNotInPast(args.dueAt);
    const publishedAt = new Date();
    let assignedCount = 0;
    const assignment = await this.prismaService.$transaction(async (tx) => {
      const created = await tx.schoolAssignment.create({
        data: {
          schoolId,
          title: args.title.trim(),
          description: args.description?.trim() ?? null,
          status: AssignmentStatus.PUBLISHED,
          targetMode: args.targetMode ?? "ALL_STUDENTS",
          targetGradeId: args.targetGradeId ?? null,
          targetClassroomId: args.targetClassroomId ?? null,
          dueAt: args.dueAt ? new Date(args.dueAt) : null,
          publishedAt,
          createdById: args.actor.id,
        },
      });
      await this.ensureAssignmentQuestions(created.id, tx);
      const studentIds = await this.resolveAssignmentTargetStudentIds(schoolId, {
        targetMode: created.targetMode,
        targetGradeId: created.targetGradeId,
        targetClassroomId: created.targetClassroomId,
      });
      if (studentIds.length) {
        await this.syncDraftTargetStudents(created.id, studentIds, tx);
        assignedCount = studentIds.length;
      }
      return created;
    });
    await this.auditService.record({
      action: AuditAction.ASSIGNMENT_CREATE,
      actorId: args.actor.id,
      schoolId,
      entityType: "SchoolAssignment",
      entityId: assignment.id,
      metadata: {
        title: assignment.title,
        targetMode: assignment.targetMode,
        targetGradeId: assignment.targetGradeId,
        targetClassroomId: assignment.targetClassroomId,
        status: assignment.status,
        publishedAt: assignment.publishedAt,
      },
    });
    await this.auditService.record({
      action: AuditAction.ASSIGNMENT_PUBLISH,
      actorId: args.actor.id,
      schoolId,
      entityType: "SchoolAssignment",
      entityId: assignment.id,
      metadata: {
        status: assignment.status,
      },
    });
    if (assignedCount > 0) {
      await this.auditService.record({
        action: AuditAction.ASSIGNMENT_ASSIGN,
        actorId: args.actor.id,
        schoolId,
        entityType: "SchoolAssignment",
        entityId: assignment.id,
        metadata: {
          assignedCount,
          targetMode: assignment.targetMode,
        },
      });
    }
    return assignment;
  }

  private async resolveAssignmentTargetStudentIds(
    schoolId: string,
    target: {
      targetMode: AssignmentTargetMode;
      targetGradeId: string | null;
      targetClassroomId: string | null;
    },
    explicitStudentIds?: string[],
  ): Promise<string[]> {
    switch (target.targetMode) {
      case "ALL_STUDENTS": {
        const students = await this.prismaService.user.findMany({
          where: {
            schoolId,
            role: Role.STUDENT,
            status: UserStatus.ACTIVE,
          },
          select: { id: true },
        });
        return students.map((student) => student.id);
      }
      case "BY_STUDENT_IDS": {
        if (!explicitStudentIds?.length) {
          throw new BadRequestException({
            code: AssessmentErrorCode.STUDENT_IDS_REQUIRED,
          });
        }
        return this.resolveActiveSchoolStudentIds(schoolId, explicitStudentIds);
      }
      case "BY_GRADE": {
        if (!target.targetGradeId) {
          throw new BadRequestException({
            code: AssessmentErrorCode.INVALID_TARGET_MODE,
          });
        }
        const enrollments = await this.prismaService.enrollment.findMany({
          where: {
            classroom: {
              schoolId,
              gradeId: target.targetGradeId,
              deletedAt: null,
            },
            student: {
              role: Role.STUDENT,
              status: UserStatus.ACTIVE,
            },
            endedAt: null,
          },
          select: { studentId: true },
          distinct: ["studentId"],
        });
        return enrollments.map((item) => item.studentId);
      }
      case "BY_CLASSROOM": {
        if (!target.targetClassroomId) {
          throw new BadRequestException({
            code: AssessmentErrorCode.INVALID_TARGET_MODE,
          });
        }
        const enrollments = await this.prismaService.enrollment.findMany({
          where: {
            classroomId: target.targetClassroomId,
            classroom: {
              schoolId,
              deletedAt: null,
            },
            student: {
              role: Role.STUDENT,
              status: UserStatus.ACTIVE,
            },
            endedAt: null,
          },
          select: { studentId: true },
          distinct: ["studentId"],
        });
        return enrollments.map((item) => item.studentId);
      }
      default:
        throw new BadRequestException({
          code: AssessmentErrorCode.INVALID_TARGET_MODE,
        });
    }
  }

  private async resolveActiveSchoolStudentIds(
    schoolId: string,
    studentIds: string[],
  ) {
    if (!studentIds.length) {
      throw new BadRequestException({
        code: AssessmentErrorCode.STUDENT_IDS_REQUIRED,
      });
    }
    const students = await this.prismaService.user.findMany({
      where: {
        id: { in: studentIds },
        schoolId,
        role: Role.STUDENT,
        status: UserStatus.ACTIVE,
      },
      select: { id: true },
    });
    if (students.length !== studentIds.length) {
      throw new BadRequestException({
        code: AssessmentErrorCode.STUDENT_IDS_REQUIRED,
      });
    }
    return students.map((student) => student.id);
  }

  private async syncDraftTargetStudents(
    assignmentId: string,
    studentIds: string[],
    tx: Prisma.TransactionClient,
  ) {
    await tx.studentAssignment.deleteMany({
      where: {
        assignmentId,
        studentId: { notIn: studentIds },
        status: StudentAssignmentStatus.PENDING,
      },
    });
    await Promise.all(
      studentIds.map((studentId) =>
        tx.studentAssignment.upsert({
          where: {
            assignmentId_studentId: {
              assignmentId,
              studentId,
            },
          },
          update: {},
          create: {
            assignmentId,
            studentId,
            status: StudentAssignmentStatus.PENDING,
          },
        }),
      ),
    );
  }

  async updateAssignment(args: T.TUpdateAssignmentArgs) {
    this.ensureSchoolAdminScope(args.actor);
    const schoolId = args.actor.schoolId!;
    const assignment = await this.prismaService.schoolAssignment.findFirst({
      where: {
        id: args.assignmentId,
        schoolId,
      },
    });
    if (!assignment) {
      throw new NotFoundException({
        code: AssessmentErrorCode.ASSIGNMENT_NOT_FOUND,
      });
    }
    const targetFieldsTouchedForStatusCheck =
      args.title !== undefined ||
      args.description !== undefined ||
      args.dueAt !== undefined ||
      args.targetMode !== undefined ||
      args.targetGradeId !== undefined ||
      args.targetClassroomId !== undefined ||
      args.targetStudentIds !== undefined;

    if (
      assignment.status === AssignmentStatus.CLOSED &&
      (targetFieldsTouchedForStatusCheck ||
        args.status === undefined ||
        args.status === AssignmentStatus.CLOSED)
    ) {
      throw new BadRequestException({
        code: AssessmentErrorCode.ASSIGNMENT_NOT_DRAFT,
      });
    }
    if (args.title !== undefined && !args.title?.trim()) {
      throw new BadRequestException("TITLE_REQUIRED");
    }

    const targetFieldsTouched =
      args.targetMode !== undefined ||
      args.targetGradeId !== undefined ||
      args.targetClassroomId !== undefined ||
      args.targetStudentIds !== undefined;

    const nextTargetMode = args.targetMode ?? assignment.targetMode;
    let nextTargetGradeId = assignment.targetGradeId;
    let nextTargetClassroomId = assignment.targetClassroomId;
    let nextTargetStudentIds: string[] | null = null;
    let shouldSyncTargetStudents = false;
    const shouldClearTargetStudents =
      assignment.targetMode === "BY_STUDENT_IDS" &&
      nextTargetMode !== "BY_STUDENT_IDS" &&
      targetFieldsTouched;

    if (targetFieldsTouched) {
      if (args.targetMode !== undefined) {
        switch (nextTargetMode) {
          case "BY_GRADE":
            nextTargetGradeId =
              args.targetGradeId !== undefined ? args.targetGradeId : null;
            nextTargetClassroomId = null;
            break;
          case "BY_CLASSROOM":
            nextTargetClassroomId =
              args.targetClassroomId !== undefined
                ? args.targetClassroomId
                : null;
            nextTargetGradeId = null;
            break;
          case "BY_STUDENT_IDS":
            nextTargetGradeId = null;
            nextTargetClassroomId = null;
            break;
          default:
            nextTargetGradeId = null;
            nextTargetClassroomId = null;
        }
      } else {
        if (nextTargetMode === "BY_GRADE") {
          nextTargetGradeId =
            args.targetGradeId !== undefined
              ? args.targetGradeId
              : assignment.targetGradeId;
          nextTargetClassroomId = null;
        } else if (nextTargetMode === "BY_CLASSROOM") {
          nextTargetClassroomId =
            args.targetClassroomId !== undefined
              ? args.targetClassroomId
              : assignment.targetClassroomId;
          nextTargetGradeId = null;
        } else if (nextTargetMode !== "BY_STUDENT_IDS") {
          nextTargetGradeId = null;
          nextTargetClassroomId = null;
        }
      }
    }

    if (nextTargetMode === "BY_STUDENT_IDS") {
      if (args.targetStudentIds !== undefined) {
        nextTargetStudentIds = await this.resolveActiveSchoolStudentIds(
          schoolId,
          args.targetStudentIds ?? [],
        );
        shouldSyncTargetStudents = true;
      } else if (
        args.targetMode === "BY_STUDENT_IDS" ||
        assignment.targetMode !== "BY_STUDENT_IDS"
      ) {
        throw new BadRequestException({
          code: AssessmentErrorCode.STUDENT_IDS_REQUIRED,
        });
      }
    } else if (targetFieldsTouched) {
      nextTargetStudentIds = await this.resolveAssignmentTargetStudentIds(
        schoolId,
        {
          targetMode: nextTargetMode,
          targetGradeId: nextTargetGradeId,
          targetClassroomId: nextTargetClassroomId,
        },
      );
      shouldSyncTargetStudents = true;
    }

    if (nextTargetMode === "BY_GRADE" && !nextTargetGradeId) {
      throw new BadRequestException("TARGET_GRADE_REQUIRED");
    }
    if (nextTargetMode === "BY_CLASSROOM" && !nextTargetClassroomId) {
      throw new BadRequestException("TARGET_CLASSROOM_REQUIRED");
    }

    const data: Prisma.SchoolAssignmentUpdateInput = {};
    if (args.title !== undefined) data.title = args.title.trim();
    if (args.description !== undefined) {
      data.description = args.description?.trim() ?? null;
    }
    if (args.dueAt !== undefined) {
      this.ensureAssignmentDueAtIsNotInPast(args.dueAt, assignment.dueAt);
      data.dueAt = args.dueAt ? new Date(args.dueAt) : null;
    }
    if (args.status !== undefined && args.status !== null) {
      data.status = args.status;
      if (
        args.status === AssignmentStatus.PUBLISHED &&
        !assignment.publishedAt
      ) {
        data.publishedAt = new Date();
      }
    }
    if (targetFieldsTouched) {
      data.targetMode = nextTargetMode;
      data.targetGrade =
        nextTargetGradeId === null
          ? { disconnect: true }
          : { connect: { id: nextTargetGradeId } };
      data.targetClassroom =
        nextTargetClassroomId === null
          ? { disconnect: true }
          : { connect: { id: nextTargetClassroomId } };
    }

    const updated = await this.prismaService.$transaction(async (tx) => {
      if (shouldClearTargetStudents) {
        await tx.studentAssignment.deleteMany({
          where: {
            assignmentId: assignment.id,
            status: StudentAssignmentStatus.PENDING,
          },
        });
      }

      const assignmentUpdate = await tx.schoolAssignment.update({
        where: { id: assignment.id },
        data,
      });

      if (shouldSyncTargetStudents && nextTargetStudentIds) {
        await this.syncDraftTargetStudents(
          assignment.id,
          nextTargetStudentIds,
          tx,
        );
      }

      return assignmentUpdate;
    });
    await this.auditService.record({
      action: AuditAction.ASSIGNMENT_UPDATE,
      actorId: args.actor.id,
      schoolId,
      entityType: "SchoolAssignment",
      entityId: updated.id,
      metadata: {
        before: {
          title: assignment.title,
          description: assignment.description,
          dueAt: assignment.dueAt,
          status: assignment.status,
          targetMode: assignment.targetMode,
          targetGradeId: assignment.targetGradeId,
          targetClassroomId: assignment.targetClassroomId,
        },
        after: {
          title: updated.title,
          description: updated.description,
          dueAt: updated.dueAt,
          status: updated.status,
          targetMode: updated.targetMode,
          targetGradeId: updated.targetGradeId,
          targetClassroomId: updated.targetClassroomId,
          ...(nextTargetStudentIds
            ? { targetStudentIds: nextTargetStudentIds }
            : {}),
        },
      },
    });
    if (
      args.status === AssignmentStatus.PUBLISHED &&
      assignment.status !== AssignmentStatus.PUBLISHED
    ) {
      await this.auditService.record({
        action: AuditAction.ASSIGNMENT_PUBLISH,
        actorId: args.actor.id,
        schoolId,
        entityType: "SchoolAssignment",
        entityId: updated.id,
        metadata: {
          status: updated.status,
        },
      });
    }
    if (shouldSyncTargetStudents && nextTargetStudentIds?.length) {
      await this.auditService.record({
        action: AuditAction.ASSIGNMENT_ASSIGN,
        actorId: args.actor.id,
        schoolId,
        entityType: "SchoolAssignment",
        entityId: updated.id,
        metadata: {
          assignedCount: nextTargetStudentIds.length,
          targetMode: updated.targetMode,
        },
      });
    }
    return updated;
  }

  async listAssignments(args: T.TListAssignmentsArgs) {
    this.ensureSchoolAdminScope(args.actor);
    const schoolId = args.actor.schoolId!;
    const where: Prisma.SchoolAssignmentWhereInput = {
      schoolId,
      status: args.status ?? undefined,
      ...(args.query?.trim()
        ? {
            OR: [
              {
                title: {
                  contains: args.query.trim(),
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                description: {
                  contains: args.query.trim(),
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.schoolAssignment.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.schoolAssignment.count({ where }),
    ]);
    return {
      items,
      total,
      take: args.take,
      skip: args.skip,
    };
  }

  async assignAssignmentToStudents(
    args: T.TAssignAssignmentArgs,
  ): Promise<{ success: boolean; assignedCount: number }> {
    this.ensureSchoolAdminScope(args.actor);
    const schoolId = args.actor.schoolId!;
    const assignment = await this.prismaService.schoolAssignment.findFirst({
      where: {
        id: args.assignmentId,
        schoolId,
      },
    });
    if (!assignment) {
      throw new NotFoundException({
        code: AssessmentErrorCode.ASSIGNMENT_NOT_FOUND,
      });
    }
    const studentIds = await this.resolveAssignmentTargetStudentIds(
      schoolId,
      {
        targetMode: assignment.targetMode,
        targetGradeId: assignment.targetGradeId,
        targetClassroomId: assignment.targetClassroomId,
      },
      args.studentIds ?? undefined,
    );
    await this.prismaService.$transaction(
      studentIds.map((studentId) =>
        this.prismaService.studentAssignment.upsert({
          where: {
            assignmentId_studentId: {
              assignmentId: assignment.id,
              studentId,
            },
          },
          update: {},
          create: {
            assignmentId: assignment.id,
            studentId,
            status: StudentAssignmentStatus.PENDING,
          },
        }),
      ),
    );
    await this.auditService.record({
      action: AuditAction.ASSIGNMENT_ASSIGN,
      actorId: args.actor.id,
      schoolId,
      entityType: "SchoolAssignment",
      entityId: assignment.id,
      metadata: {
        assignedCount: studentIds.length,
        targetMode: assignment.targetMode,
      },
    });
    return {
      success: true,
      assignedCount: studentIds.length,
    };
  }

  async submitStudentAnswers(args: T.TSubmitStudentAnswersArgs) {
    const submittedAssignmentQuestionIds = args.answers.map(
      (answer) => answer.questionId,
    );
    if (
      new Set(submittedAssignmentQuestionIds).size !==
      submittedAssignmentQuestionIds.length
    )
      throw new BadRequestException({
        code: AssessmentErrorCode.DUPLICATE_QUESTION_IN_INPUT,
      });

    for (const answer of args.answers) {
      if (answer.value < 1 || answer.value > 5)
        throw new BadRequestException({
          code: AssessmentErrorCode.INVALID_ANSWER_VALUE,
        });
    }
    const studentAssignment =
      await this.prismaService.studentAssignment.findFirst({
        where: {
          id: args.studentAssignmentId,
          studentId: args.actor.id,
        },
        include: {
          assignment: true,
        },
      });

    if (!studentAssignment)
      throw new NotFoundException({
        code: AssessmentErrorCode.STUDENT_ASSIGNMENT_NOT_FOUND,
      });
    if (studentAssignment.assignment.status !== AssignmentStatus.PUBLISHED)
      throw new BadRequestException({
        code: AssessmentErrorCode.ASSIGNMENT_NOT_PUBLISHED,
      });

    if (
      studentAssignment.assignment.dueAt &&
      new Date(studentAssignment.assignment.dueAt).getTime() < Date.now()
    )
      throw new BadRequestException({
        code: AssessmentErrorCode.ASSIGNMENT_DUE_PASSED,
      });

    const assignmentQuestions =
      await this.prismaService.assignmentQuestion.findMany({
        where: {
          id: { in: submittedAssignmentQuestionIds },
          assignmentId: studentAssignment.assignmentId,
          isActive: true,
        },
        select: {
          id: true,
          sourceQuestionId: true,
        },
      });
    if (assignmentQuestions.length !== submittedAssignmentQuestionIds.length)
      throw new NotFoundException({
        code: AssessmentErrorCode.QUESTION_NOT_FOUND,
      });
    const assignmentQuestionMap = new Map(
      assignmentQuestions.map((question) => [question.id, question]),
    );
    await this.prismaService.$transaction(async (tx) => {
      for (const answer of args.answers) {
        const linkedQuestion = assignmentQuestionMap.get(answer.questionId);
        await tx.studentAnswer.upsert({
          where: {
            studentAssignmentId_assignmentQuestionId: {
              studentAssignmentId: args.studentAssignmentId,
              assignmentQuestionId: answer.questionId,
            },
          },
          update: {
            value: answer.value,
          },
          create: {
            studentAssignmentId: args.studentAssignmentId,
            assignmentQuestionId: answer.questionId,
            assessmentQuestionId: linkedQuestion?.sourceQuestionId ?? null,
            value: answer.value,
          },
        });
      }
      const totalQuestions = await tx.assignmentQuestion.count({
        where: {
          assignmentId: studentAssignment.assignmentId,
          isActive: true,
        },
      });
      const answeredCount = await tx.studentAnswer.count({
        where: {
          studentAssignmentId: args.studentAssignmentId,
        },
      });
      const completionRate =
        totalQuestions > 0
          ? Number(((answeredCount / totalQuestions) * 100).toFixed(2))
          : 0;
      await tx.studentAssignment.update({
        where: { id: args.studentAssignmentId },
        data: {
          status: StudentAssignmentStatus.SUBMITTED,
          startedAt: studentAssignment.startedAt ?? new Date(),
          submittedAt: new Date(),
          completionRate,
        },
      });
    });
    await this.evaluateStudentAssignment(args.studentAssignmentId);
    await this.auditService.record({
      action: AuditAction.ASSESSMENT_SUBMIT,
      actorId: args.actor.id,
      schoolId: studentAssignment.assignment.schoolId,
      entityType: "StudentAssignment",
      entityId: studentAssignment.id,
      metadata: {
        submitted: true,
        answerCount: args.answers.length,
      },
    });
    return { success: true };
  }

  async evaluateStudentAssignment(studentAssignmentId: string) {
    const studentAssignment =
      await this.prismaService.studentAssignment.findUnique({
        where: { id: studentAssignmentId },
        include: {
          assignment: true,
          answers: {
            include: {
              assignmentQuestion: {
                select: {
                  id: true,
                  sourceQuestionId: true,
                },
              },
            },
          },
        },
      });

    if (!studentAssignment)
      throw new NotFoundException({
        code: AssessmentErrorCode.STUDENT_ASSIGNMENT_NOT_FOUND,
      });
    const activeQuestions =
      await this.prismaService.assessmentQuestion.findMany({
        where: { isActive: true },
        include: {
          intelligences: true,
        },
      });
    const assessmentQuestionMap = new Map(
      activeQuestions.map((question) => [question.id, question]),
    );
    const scoreMap: Record<IntelligenceKey, number> = {
      MUSICAL: 0,
      LINGUISTIC: 0,
      NATURALISTIC: 0,
      INTERPERSONAL: 0,
      INTRAPERSONAL: 0,
      VISUAL_SPATIAL: 0,
      BODILY_KINESTHETIC: 0,
      LOGICAL_MATHEMATICAL: 0,
    };
    const questionCountMap: Record<IntelligenceKey, number> = {
      MUSICAL: 0,
      LINGUISTIC: 0,
      NATURALISTIC: 0,
      INTERPERSONAL: 0,
      INTRAPERSONAL: 0,
      VISUAL_SPATIAL: 0,
      BODILY_KINESTHETIC: 0,
      LOGICAL_MATHEMATICAL: 0,
    };

    for (const question of activeQuestions) {
      for (const relation of question.intelligences) {
        questionCountMap[relation.intelligenceKey] += 1;
      }
    }

    for (const answer of studentAssignment.answers) {
      const sourceQuestionId =
        answer.assessmentQuestionId ??
        answer.assignmentQuestion.sourceQuestionId;
      if (!sourceQuestionId) continue;
      const sourceQuestion = assessmentQuestionMap.get(sourceQuestionId);
      if (!sourceQuestion) continue;
      for (const relation of sourceQuestion.intelligences) {
        scoreMap[relation.intelligenceKey] += answer.value;
      }
    }
    const percentage = (key: IntelligenceKey) => {
      const maxScore = questionCountMap[key] * 5;
      return maxScore > 0
        ? Number(((scoreMap[key] / maxScore) * 100).toFixed(2))
        : 0;
    };
    const resultPayload = {
      musical: percentage(IntelligenceKey.MUSICAL),
      linguistic: percentage(IntelligenceKey.LINGUISTIC),
      naturalistic: percentage(IntelligenceKey.NATURALISTIC),
      interpersonal: percentage(IntelligenceKey.INTERPERSONAL),
      intrapersonal: percentage(IntelligenceKey.INTRAPERSONAL),
      visualSpatial: percentage(IntelligenceKey.VISUAL_SPATIAL),
      logicalMath: percentage(IntelligenceKey.LOGICAL_MATHEMATICAL),
      bodilyKinesthetic: percentage(IntelligenceKey.BODILY_KINESTHETIC),
    };
    const dominantMap: Record<IntelligenceKey, number> = {
      MUSICAL: resultPayload.musical,
      LINGUISTIC: resultPayload.linguistic,
      NATURALISTIC: resultPayload.naturalistic,
      INTERPERSONAL: resultPayload.interpersonal,
      INTRAPERSONAL: resultPayload.intrapersonal,
      VISUAL_SPATIAL: resultPayload.visualSpatial,
      LOGICAL_MATHEMATICAL: resultPayload.logicalMath,
      BODILY_KINESTHETIC: resultPayload.bodilyKinesthetic,
    };
    const dominantKey = Object.entries(dominantMap).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0] as IntelligenceKey | undefined;
    const summaryJson = {
      bands: {
        musical: this.getBand(resultPayload.musical),
        linguistic: this.getBand(resultPayload.linguistic),
        logicalMath: this.getBand(resultPayload.logicalMath),
        naturalistic: this.getBand(resultPayload.naturalistic),
        interpersonal: this.getBand(resultPayload.interpersonal),
        visualSpatial: this.getBand(resultPayload.visualSpatial),
        intrapersonal: this.getBand(resultPayload.intrapersonal),
        bodilyKinesthetic: this.getBand(resultPayload.bodilyKinesthetic),
      },
    };
    await this.prismaService.assessmentResult.upsert({
      where: { studentAssignmentId },
      update: {
        ...resultPayload,
        dominantKey: dominantKey ?? null,
        summaryJson,
      },
      create: {
        studentAssignmentId,
        schoolId: studentAssignment.assignment.schoolId,
        studentId: studentAssignment.studentId,
        ...resultPayload,
        dominantKey: dominantKey ?? null,
        summaryJson,
      },
    });
    await this.prismaService.studentAssignment.update({
      where: { id: studentAssignmentId },
      data: {
        status: StudentAssignmentStatus.EVALUATED,
        evaluatedAt: new Date(),
        submittedAt: studentAssignment.submittedAt ?? new Date(),
        startedAt: studentAssignment.startedAt ?? new Date(),
        completionRate: 100,
      },
    });
    await this.auditService.record({
      action: AuditAction.ASSESSMENT_EVALUATE,
      actorId: null,
      schoolId: studentAssignment.assignment.schoolId,
      entityType: "StudentAssignment",
      entityId: studentAssignmentId,
      metadata: {
        dominantKey: dominantKey ?? null,
      },
    });
  }

  async listAssessmentResults(args: T.TListAssessmentResultsArgs) {
    this.ensureSchoolAdminScope(args.actor);
    const schoolId = args.actor.schoolId!;
    const where: Prisma.AssessmentResultWhereInput = {
      schoolId,
      ...(args.assignmentId
        ? {
            studentAssignment: {
              assignmentId: args.assignmentId,
            },
          }
        : {}),
      ...(args.query?.trim()
        ? {
            OR: [
              ...buildUserNameSearch(args.query.trim()).map((clause) => ({
                student: clause,
              })),
              {
                student: {
                  email: {
                    contains: args.query.trim(),
                    mode: Prisma.QueryMode.insensitive,
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
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          studentAssignment: {
            select: {
              id: true,
              studentId: true,
              assignmentId: true,
              status: true,
              startedAt: true,
              submittedAt: true,
              evaluatedAt: true,
              completionRate: true,
              assignment: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: args.take,
        skip: args.skip,
      }),
      this.prismaService.assessmentResult.count({ where }),
    ]);
    return {
      items,
      total,
      take: args.take,
      skip: args.skip,
    };
  }

  async assessmentResult(args: T.TAssessmentResultArgs) {
    this.ensureSchoolAdminScope(args.actor);
    const schoolId = args.actor.schoolId!;

    const assessment = await this.prismaService.assessmentResult.findFirst({
      where: {
        schoolId,
        studentAssignment: {
          assignmentId: args.assignmentId,
        },

        studentId: args.studentId,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        studentAssignment: {
          select: {
            id: true,
            studentId: true,
            assignmentId: true,
            status: true,
            startedAt: true,
            submittedAt: true,
            evaluatedAt: true,
            completionRate: true,
            assignment: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
    // const assessment = await this.prismaService.assessmentResult.findFirst({
    //   where: {
    //     schoolId,

    //     studentId: args.studentId,
    //   },
    //   include: {
    //     student: {
    //       select: {
    //         id: true,
    //         email: true,
    //       },
    //     },
    //     studentAssignment: {
    //       select: {
    //         id: true,
    //         studentId: true,
    //         assignmentId: true,
    //         status: true,
    //         startedAt: true,
    //         submittedAt: true,
    //         evaluatedAt: true,
    //         completionRate: true,
    //         assignment: {
    //           select: {
    //             id: true,
    //             title: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    return assessment;
  }

  async schoolAssessmentSummary(args: T.TSchoolAssessmentSummaryArgs) {
    this.ensureSchoolAdminScope(args.actor);
    const schoolId = args.actor.schoolId!;
    const assignmentWhere: Prisma.SchoolAssignmentWhereInput = {
      schoolId,
      ...(args.assignmentId ? { id: args.assignmentId } : {}),
    };
    const studentAssignmentWhereBase: Prisma.StudentAssignmentWhereInput = {
      assignment: assignmentWhere,
    };
    const [
      totalAssignments,
      publishedAssignments,
      totalStudents,
      pendingStudentAssignments,
      submittedStudentAssignments,
      evaluatedStudentAssignments,
      results,
    ] = await this.prismaService.$transaction([
      this.prismaService.schoolAssignment.count({
        where: assignmentWhere,
      }),
      this.prismaService.schoolAssignment.count({
        where: {
          ...assignmentWhere,
          status: AssignmentStatus.PUBLISHED,
        },
      }),
      this.prismaService.user.count({
        where: {
          schoolId,
          role: Role.STUDENT,
          status: UserStatus.ACTIVE,
        },
      }),
      this.prismaService.studentAssignment.count({
        where: {
          ...studentAssignmentWhereBase,
          status: StudentAssignmentStatus.PENDING,
        },
      }),
      this.prismaService.studentAssignment.count({
        where: {
          ...studentAssignmentWhereBase,
          status: StudentAssignmentStatus.SUBMITTED,
        },
      }),
      this.prismaService.studentAssignment.count({
        where: {
          ...studentAssignmentWhereBase,
          status: StudentAssignmentStatus.EVALUATED,
        },
      }),
      this.prismaService.assessmentResult.findMany({
        where: {
          schoolId,
          ...(args.assignmentId
            ? {
                studentAssignment: {
                  assignmentId: args.assignmentId,
                },
              }
            : {}),
        },
        select: {
          linguistic: true,
          logicalMath: true,
          musical: true,
          bodilyKinesthetic: true,
          visualSpatial: true,
          naturalistic: true,
          interpersonal: true,
          intrapersonal: true,
        },
      }),
    ]);

    const avg = (key: keyof (typeof results)[number]) =>
      results.length > 0
        ? Number(
            (
              results.reduce((sum, item) => sum + Number(item[key] ?? 0), 0) /
              results.length
            ).toFixed(2),
          )
        : 0;

    const totalTracked =
      pendingStudentAssignments +
      submittedStudentAssignments +
      evaluatedStudentAssignments;

    const completionRate =
      totalTracked > 0
        ? Number(
            (
              ((submittedStudentAssignments + evaluatedStudentAssignments) /
                totalTracked) *
              100
            ).toFixed(2),
          )
        : 0;

    return {
      totalStudents,
      completionRate,
      totalAssignments,
      publishedAssignments,
      pendingStudentAssignments,
      submittedStudentAssignments,
      evaluatedStudentAssignments,
      avgMusical: avg("musical"),
      avgLinguistic: avg("linguistic"),
      avgLogicalMath: avg("logicalMath"),
      avgNaturalistic: avg("naturalistic"),
      avgInterpersonal: avg("interpersonal"),
      avgIntrapersonal: avg("intrapersonal"),
      avgVisualSpatial: avg("visualSpatial"),
      avgBodilyKinesthetic: avg("bodilyKinesthetic"),
    };
  }

  async assignmentDetail(args: T.TSchoolAssignemntDetailArgs) {
    this.ensureSchoolAdminScope(args.actor);
    if (!args.actor?.schoolId)
      throw new BadRequestException("Missing school ID");
    const assignment = await this.prismaService.schoolAssignment.findFirst({
      where: {
        id: args.assignmentId,
        schoolId: args.actor.schoolId,
      },
      include: {
        counselorReviews: true,
        studentAssignments: {
          take: args.take,
          skip: args.skip,
          orderBy: { evaluatedAt: "desc" },
          include: {
            student: {
              select: {
                id: true,
                firstName: true,
              lastName: true,
              },
            },
            result: true,
          },
        },
      },
    });

    if (!assignment) return null;

    return {
      ...assignment,
      targetStudentIds:
        assignment.targetMode === "BY_STUDENT_IDS"
          ? assignment.studentAssignments.map((item) => item.studentId)
          : null,
    };
  }
}
