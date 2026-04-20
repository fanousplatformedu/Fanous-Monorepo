import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { CounselingSessionStatus, Role } from "@prisma/client";
import { IntelligenceKey, Prisma } from "@prisma/client";
import { ParentErrorCode } from "@parent/enums/parent-error-code.enum";
import { ParentMessage } from "@parent/enums/parent-message.enum";
import { PrismaService } from "@prisma/prisma.service";
import { AuditService } from "@audit/services/audit.service";
import { AuditAction } from "@prisma/client";

import * as T from "@parent/types/parent.types";

@Injectable()
export class ParentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  private ensureParent(actor: T.TParentActor): string {
    if (actor.role !== Role.PARENT)
      throw new ForbiddenException({
        code: ParentErrorCode.FORBIDDEN,
        message: ParentMessage.ONLY_PARENTS_ALLOWED,
      });
    if (!actor.schoolId)
      throw new BadRequestException({
        code: ParentErrorCode.SCHOOL_SCOPE_MISSING,
        message: ParentMessage.SCHOOL_SCOPE_MISSING,
      });
    return actor.schoolId;
  }

  private normalizePagination(take: number, skip: number) {
    return {
      take: Math.max(1, Math.min(100, take)),
      skip: Math.max(0, skip),
    };
  }

  private normalizeQuery(query?: string | null) {
    const value = query?.trim();
    return value ? value : null;
  }

  private async ensureParentChildAccess(
    actor: T.TParentActor,
    childId: string,
  ): Promise<string> {
    const schoolId = this.ensureParent(actor);
    const link = await this.prismaService.parentStudentLink.findFirst({
      where: {
        schoolId,
        parentId: actor.id,
        studentId: childId,
      },
      select: { studentId: true },
    });
    if (!link)
      throw new ForbiddenException({
        code: ParentErrorCode.CHILD_ACCESS_DENIED,
        message: ParentMessage.CHILD_ACCESS_DENIED,
      });
    return schoolId;
  }

  async getDashboardSummary(actor: T.TParentActor) {
    const schoolId = this.ensureParent(actor);
    const childLinks = await this.prismaService.parentStudentLink.findMany({
      where: {
        schoolId,
        parentId: actor.id,
      },
      select: { studentId: true },
    });
    const childIds = childLinks.map((x) => x.studentId);
    const [
      totalChildren,
      totalResults,
      totalActivities,
      totalSessions,
      latestResults,
    ] = await this.prismaService.$transaction([
      this.prismaService.parentStudentLink.count({
        where: {
          schoolId,
          parentId: actor.id,
        },
      }),
      this.prismaService.assessmentResult.count({
        where: {
          schoolId,
          studentId: { in: childIds.length ? childIds : ["__none__"] },
        },
      }),
      this.prismaService.studentActivity.count({
        where: {
          schoolId,
          studentId: { in: childIds.length ? childIds : ["__none__"] },
        },
      }),
      this.prismaService.counselingSession.count({
        where: {
          schoolId,
          studentId: { in: childIds.length ? childIds : ["__none__"] },
        },
      }),
      this.prismaService.assessmentResult.findMany({
        where: {
          schoolId,
          studentId: { in: childIds.length ? childIds : ["__none__"] },
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);
    const progressTimeline = [...latestResults]
      .reverse()
      .map((item, index) => ({
        label: `#${index + 1}`,
        overall: Number(
          (
            (item.linguistic +
              item.logicalMath +
              item.musical +
              item.bodilyKinesthetic +
              item.visualSpatial +
              item.naturalistic +
              item.interpersonal +
              item.intrapersonal) /
            8
          ).toFixed(2),
        ),
      }));
    return {
      totalChildren,
      totalResults,
      totalActivities,
      totalSessions,
      progressTimeline,
    };
  }

  async listMyChildren(args: T.TListMyChildrenArgs) {
    const schoolId = this.ensureParent(args.actor);
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.ParentStudentLinkWhereInput = {
      schoolId,
      parentId: args.actor.id,
      ...(query
        ? {
            student: {
              OR: [
                {
                  fullName: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  email: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
                {
                  mobile: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              ],
            },
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.parentStudentLink.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              email: true,
              mobile: true,
              avatarUrl: true,
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        skip,
      }),
      this.prismaService.parentStudentLink.count({ where }),
    ]);
    return {
      items: items.map((item) => ({
        id: item.student.id,
        fullName: item.student.fullName,
        email: item.student.email,
        mobile: item.student.mobile,
        avatarUrl: item.student.avatarUrl,
        status: item.student.status,
        relation: item.relation,
        isPrimary: item.isPrimary,
        createdAt: item.student.createdAt,
      })),
      total,
      take,
      skip,
    };
  }

  async getChildDetail(args: T.TParentChildScopedArgs) {
    const schoolId = await this.ensureParentChildAccess(
      args.actor,
      args.childId,
    );
    const child = await this.prismaService.parentStudentLink.findFirst({
      where: {
        schoolId,
        parentId: args.actor.id,
        studentId: args.childId,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            mobile: true,
            avatarUrl: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!child)
      throw new NotFoundException({
        code: ParentErrorCode.CHILD_NOT_FOUND,
        message: ParentMessage.CHILD_NOT_FOUND,
      });
    return {
      id: child.student.id,
      fullName: child.student.fullName,
      email: child.student.email,
      mobile: child.student.mobile,
      avatarUrl: child.student.avatarUrl,
      status: child.student.status,
      createdAt: child.student.createdAt,
      relation: child.relation,
      isPrimary: child.isPrimary,
    };
  }

  async listChildGrades(args: T.TListParentChildGradesArgs) {
    const schoolId = await this.ensureParentChildAccess(
      args.actor,
      args.childId,
    );
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.StudentGradeRecordWhereInput = {
      schoolId,
      studentId: args.childId,
      ...(args.subject ? { subject: args.subject } : {}),
      ...(args.termLabel ? { termLabel: args.termLabel } : {}),
      ...(query
        ? {
            OR: [
              {
                subject: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
              {
                examTitle: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.studentGradeRecord.findMany({
        where,
        orderBy: [{ recordedAt: "desc" }, { id: "desc" }],
        take,
        skip,
      }),
      this.prismaService.studentGradeRecord.count({ where }),
    ]);
    return { items, total, take, skip };
  }

  async listChildResults(args: T.TListParentChildResultsArgs) {
    const schoolId = await this.ensureParentChildAccess(
      args.actor,
      args.childId,
    );
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.AssessmentResultWhereInput = {
      schoolId,
      studentId: args.childId,
      ...(args.dominantIntelligence
        ? { dominantKey: args.dominantIntelligence }
        : {}),
      ...(query
        ? {
            studentAssignment: {
              assignment: {
                title: {
                  contains: query,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
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
                select: { title: true },
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
        createdAt: item.createdAt,
        studentAssignmentId: item.studentAssignmentId,
        assignmentTitle: item.studentAssignment.assignment.title,
        dominantIntelligence: item.dominantKey,
        linguistic: item.linguistic,
        logicalMath: item.logicalMath,
        musical: item.musical,
        bodilyKinesthetic: item.bodilyKinesthetic,
        visualSpatial: item.visualSpatial,
        naturalistic: item.naturalistic,
        interpersonal: item.interpersonal,
        intrapersonal: item.intrapersonal,
      })),
      total,
      take,
      skip,
    };
  }

  async getChildResultDetail(actor: T.TParentActor, resultId: string) {
    const schoolId = this.ensureParent(actor);
    const result = await this.prismaService.assessmentResult.findFirst({
      where: {
        id: resultId,
        schoolId,
        student: {
          parentLinksAsParent: {
            some: {
              parentId: actor.id,
              schoolId,
            },
          },
        },
      },
      include: {
        studentAssignment: {
          include: {
            assignment: {
              select: { title: true },
            },
          },
        },
      },
    });

    if (!result)
      throw new NotFoundException({
        code: ParentErrorCode.RESULT_NOT_FOUND,
        message: ParentMessage.RESULT_NOT_FOUND,
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
            description?: string;
            fitReason?: string;
          }>)
        : [];
    return {
      id: result.id,
      createdAt: result.createdAt,
      studentAssignmentId: result.studentAssignmentId,
      assignmentTitle: result.studentAssignment.assignment.title,
      dominantIntelligence: result.dominantKey,
      linguistic: result.linguistic,
      logicalMath: result.logicalMath,
      musical: result.musical,
      bodilyKinesthetic: result.bodilyKinesthetic,
      visualSpatial: result.visualSpatial,
      naturalistic: result.naturalistic,
      interpersonal: result.interpersonal,
      intrapersonal: result.intrapersonal,
      summaryJson: JSON.stringify(summary ?? null),
      careerMatches,
    };
  }

  async compareChildResults(args: T.TCompareParentResultsArgs) {
    await this.ensureParentChildAccess(args.actor, args.childId);
    const [baseResult, compareWithResult] =
      await this.prismaService.$transaction([
        this.prismaService.assessmentResult.findFirst({
          where: {
            id: args.baseResultId,
            studentId: args.childId,
          },
        }),
        this.prismaService.assessmentResult.findFirst({
          where: {
            id: args.compareWithResultId,
            studentId: args.childId,
          },
        }),
      ]);
    if (!baseResult || !compareWithResult)
      throw new NotFoundException({
        code: ParentErrorCode.RESULT_NOT_FOUND,
        message: ParentMessage.RESULT_NOT_FOUND,
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

  async listResources(args: T.TListParentResourcesArgs) {
    const schoolId = this.ensureParent(args.actor);
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.ParentResourceWhereInput = {
      isPublished: true,
      OR: [{ schoolId: null }, { schoolId }],
      ...(args.category ? { category: args.category } : {}),
      ...(query
        ? {
            AND: [
              {
                OR: [
                  {
                    title: {
                      contains: query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    summary: {
                      contains: query,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.parentResource.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        skip,
      }),
      this.prismaService.parentResource.count({ where }),
    ]);
    return { items, total, take, skip };
  }

  async listChildActivities(args: T.TListParentActivitiesArgs) {
    const schoolId = await this.ensureParentChildAccess(
      args.actor,
      args.childId,
    );
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    const where: Prisma.StudentActivityWhereInput = {
      schoolId,
      studentId: args.childId,
      ...(args.type ? { type: args.type } : {}),
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
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.studentActivity.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take,
        skip,
      }),
      this.prismaService.studentActivity.count({ where }),
    ]);
    return { items, total, take, skip };
  }

  async listCounselingSessions(args: T.TListParentCounselingSessionsArgs) {
    const schoolId = this.ensureParent(args.actor);
    const { take, skip } = this.normalizePagination(args.take, args.skip);
    const query = this.normalizeQuery(args.query);
    let childIds: string[] = [];
    if (args.childId) {
      await this.ensureParentChildAccess(args.actor, args.childId);
      childIds = [args.childId];
    } else {
      const links = await this.prismaService.parentStudentLink.findMany({
        where: {
          schoolId,
          parentId: args.actor.id,
        },
        select: { studentId: true },
      });

      childIds = links.map((x) => x.studentId);
    }
    const where: Prisma.CounselingSessionWhereInput = {
      schoolId,
      studentId: { in: childIds.length ? childIds : ["__none__"] },
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
              {
                student: {
                  fullName: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
              {
                student: {
                  email: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
              {
                student: {
                  mobile: {
                    contains: query,
                    mode: Prisma.QueryMode.insensitive,
                  },
                },
              },
            ],
          }
        : {}),
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.counselingSession.findMany({
        where,
        orderBy: [
          { scheduledAt: "desc" },
          { createdAt: "desc" },
          { id: "desc" },
        ],
        take,
        skip,
        select: {
          id: true,
          title: true,
          note: true,
          meetingUrl: true,
          counselorId: true,
          studentId: true,
          createdAt: true,
          status: true,
          canceledAt: true,
          scheduledAt: true,
          student: {
            select: {
              id: true,
              fullName: true,
              email: true,
              mobile: true,
              avatarUrl: true,
            },
          },
        },
      }),
      this.prismaService.counselingSession.count({ where }),
    ]);
    return {
      items,
      total,
      take,
      skip,
    };
  }

  async requestCounselingSession(args: T.TParentRequestSessionArgs) {
    const schoolId = await this.ensureParentChildAccess(
      args.actor,
      args.childId,
    );
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
          code: ParentErrorCode.INVALID_COUNSELOR,
          message: ParentMessage.INVALID_COUNSELOR,
        });
    }
    const session = await this.prismaService.counselingSession.create({
      data: {
        schoolId,
        studentId: args.childId,
        requestedById: args.actor.id,
        counselorId: args.counselorId ?? null,
        title: args.title.trim(),
        note: args.note?.trim() ?? null,
        meetingUrl: args.meetingUrl?.trim() ?? null,
        scheduledAt: args.scheduledAt ? new Date(args.scheduledAt) : null,
        status: CounselingSessionStatus.REQUESTED,
      },
    });

    await this.auditService.record({
      action: AuditAction.INAPP_NOTIFICATION_CREATE,
      actorId: args.actor.id,
      schoolId,
      entityType: "CounselingSession",
      entityId: session.id,
      metadata: {
        requestedForStudentId: args.childId,
      },
    });
    return {
      success: true,
      message: ParentMessage.SESSION_REQUESTED,
      sessionId: session.id,
    };
  }

  async cancelCounselingSession(args: T.TCancelParentSessionArgs) {
    const schoolId = this.ensureParent(args.actor);
    const session = await this.prismaService.counselingSession.findFirst({
      where: {
        id: args.sessionId,
        schoolId,
        student: {
          parentLinksAsParent: {
            some: {
              parentId: args.actor.id,
              schoolId,
            },
          },
        },
      },
    });
    if (!session)
      throw new NotFoundException({
        code: ParentErrorCode.SESSION_NOT_FOUND,
        message: ParentMessage.SESSION_NOT_FOUND,
      });
    if (
      session.status !== CounselingSessionStatus.REQUESTED &&
      session.status !== CounselingSessionStatus.CONFIRMED
    )
      throw new BadRequestException({
        code: ParentErrorCode.SESSION_NOT_CANCELABLE,
        message: ParentMessage.SESSION_NOT_CANCELABLE,
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
      message: ParentMessage.SESSION_CANCELED,
    };
  }
}
