import { NotFoundException, BadRequestException } from "@nestjs/common";
import { Injectable, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";

type Actor = { id: string; role: string };

@Injectable()
export class ParentPortalService {
  constructor(private prismaService: PrismaService) {}

  // ===== Helpers =====
  private async ensureLink(
    parentId: string,
    childUserId: string,
    tenantId: string
  ) {
    const link = await this.prismaService.parentLink.findUnique({
      where: {
        parentId_childId_tenantId: { parentId, childId: childUserId, tenantId },
      },
      select: { id: true },
    });
    if (!link) throw new ForbiddenException("No access to this child");
  }

  private jstr(x: any) {
    return x == null ? null : JSON.stringify(x);
  }

  // ===== Link / Unlink =====
  async linkChild(
    input: { tenantId: string; childUserId: string },
    actor: Actor
  ) {
    if ((actor.role ?? "").toUpperCase() !== "PARENT")
      throw new ForbiddenException("Access denied");
    const child = await this.prismaService.user.findUnique({
      where: { id: input.childUserId },
      select: { id: true, role: true },
    });
    if (!child) throw new NotFoundException("Child not found");
    if ((child.role as string).toUpperCase() !== "STUDENT")
      throw new BadRequestException("Target user is not a STUDENT");

    await this.prismaService.parentLink.upsert({
      where: {
        parentId_childId_tenantId: {
          parentId: actor.id,
          childId: input.childUserId,
          tenantId: input.tenantId,
        },
      },
      update: {},
      create: {
        parentId: actor.id,
        childId: input.childUserId,
        tenantId: input.tenantId,
      },
    });
    return true;
  }

  async unlinkChild(
    input: { tenantId: string; childUserId: string },
    actor: Actor
  ) {
    await this.ensureLink(actor.id, input.childUserId, input.tenantId);
    await this.prismaService.parentLink.delete({
      where: {
        parentId_childId_tenantId: {
          parentId: actor.id,
          childId: input.childUserId,
          tenantId: input.tenantId,
        },
      },
    });
    return true;
  }

  // ===== My Children =====
  async myChildren(actor: Actor) {
    if ((actor.role ?? "").toUpperCase() !== "PARENT")
      throw new ForbiddenException("Access denied");
    const links = await this.prismaService.parentLink.findMany({
      where: { parentId: actor.id },
      select: {
        tenantId: true,
        child: {
          select: {
            id: true,
            name: true,
            avatar: true,
            enrollments: {
              where: { endedAt: null },
              select: {
                classroom: {
                  select: { name: true, grade: { select: { name: true } } },
                },
              },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return links.map((l) => ({
      id: l.child.id,
      name: l.child.name,
      avatar: l.child.avatar ?? null,
      classroomName: l.child.enrollments[0]?.classroom?.name ?? null,
      gradeName: l.child.enrollments[0]?.classroom?.grade?.name ?? null,
    }));
  }

  // ===== Child Overview =====
  async childSummary(tenantId: string, childUserId: string, actor: Actor) {
    await this.ensureLink(actor.id, childUserId, tenantId);
    const [user, lastResult, assessmentsCount, lastAssessment] =
      await this.prismaService.$transaction([
        this.prismaService.user.findUnique({
          where: { id: childUserId },
          select: {
            id: true,
            learningHours: true,
            certificatesEarned: true,
          },
        }),
        this.prismaService.resultSnapshot.findFirst({
          where: { tenantId, userId: childUserId },
          orderBy: { createdAt: "desc" },
          select: { summaryJson: true, scoresJson: true, createdAt: true },
        }),
        this.prismaService.assessment.count({
          where: { tenantId, userId: childUserId },
        }),
        this.prismaService.assessment.findFirst({
          where: { tenantId, userId: childUserId },
          orderBy: [{ submittedAt: "desc" }, { startedAt: "desc" }],
          select: { submittedAt: true },
        }),
      ]);
    if (!user) throw new NotFoundException("Child not found");
    return {
      userId: user.id,
      lastResultSummary: this.jstr(lastResult?.summaryJson ?? null),
      lastScores: this.jstr(lastResult?.scoresJson ?? null),
      learningHours: user.learningHours,
      certificatesEarned: user.certificatesEarned,
      assessmentsCount,
      lastAssessmentAt: lastAssessment?.submittedAt ?? null,
    };
  }

  // ===== Assessments List (brief) =====
  async childAssessments(
    tenantId: string,
    childUserId: string,
    page: number,
    pageSize: number,
    actor: Actor
  ) {
    await this.ensureLink(actor.id, childUserId, tenantId);
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.assessment.findMany({
        where: { tenantId, userId: childUserId },
        select: {
          id: true,
          state: true,
          submittedAt: true,
          scoredAt: true,
          version: {
            select: {
              versionNumber: true,
              questionnaire: { select: { code: true } },
            },
          },
          assignment: { select: { questionnaire: { select: { code: true } } } },
        },
        orderBy: [{ submittedAt: "desc" }, { startedAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.assessment.count({
        where: { tenantId, userId: childUserId },
      }),
    ]);
    const mapped = items.map((a) => ({
      id: a.id,
      code:
        a.version?.questionnaire?.code ??
        a.assignment?.questionnaire?.code ??
        "N/A",
      state: a.state,
      submittedAt: a.submittedAt ?? null,
      scoredAt: a.scoredAt ?? null,
      version: a.version?.versionNumber ?? null,
    }));
    return { items: mapped, total, page, pageSize };
  }

  // ===== Recommendations =====
  async childRecommendations(
    tenantId: string,
    childUserId: string,
    type: string | undefined,
    limit: number | undefined,
    actor: Actor
  ) {
    await this.ensureLink(actor.id, childUserId, tenantId);
    const last = await this.prismaService.resultSnapshot.findFirst({
      where: { tenantId, userId: childUserId },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (!last) return [];
    const where: any = { resultId: last.id, ...(type ? { type } : {}) };
    const recs = await this.prismaService.recommendation.findMany({
      where,
      orderBy: [{ rank: "asc" }, { createdAt: "desc" }],
      take: Math.min(100, Math.max(1, limit ?? 20)),
      select: {
        id: true,
        type: true,
        targetJson: true,
        confidence: true,
        rank: true,
        explainabilityFactors: true,
        createdAt: true,
        targetCareer: { select: { code: true } },
        targetMajor: { select: { code: true } },
      },
    });
    return recs.map((r) => ({
      id: r.id,
      type: r.type,
      targetCareerCode: r.targetCareer?.code ?? null,
      targetMajorCode: r.targetMajor?.code ?? null,
      targetJson: this.jstr(r.targetJson),
      confidence: r.confidence ?? null,
      explainabilityFactors: this.jstr(r.explainabilityFactors),
      rank: r.rank ?? null,
      createdAt: r.createdAt,
    }));
  }

  // ===== Consents =====
  async setConsent(
    input: {
      tenantId: string;
      childUserId: string;
      type: string;
      status: string;
      data?: string;
    },
    actor: Actor
  ) {
    await this.ensureLink(actor.id, input.childUserId, input.tenantId);
    const c = await this.prismaService.consent.upsert({
      where: {
        userId_tenantId_type: {
          userId: input.childUserId,
          tenantId: input.tenantId,
          type: input.type as any,
        },
      },
      update: {
        status: input.status as any,
        data: input.data ? JSON.parse(input.data) : null,
      },
      create: {
        userId: input.childUserId,
        tenantId: input.tenantId,
        type: input.type as any,
        status: input.status as any,
        data: input.data ? JSON.parse(input.data) : undefined,
      },
      select: {
        id: true,
        type: true,
        status: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      id: c.id,
      type: c.type,
      status: c.status,
      data: this.jstr(c.data),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }

  async childConsents(tenantId: string, childUserId: string, actor: Actor) {
    await this.ensureLink(actor.id, childUserId, tenantId);
    const items = await this.prismaService.consent.findMany({
      where: { tenantId, userId: childUserId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        status: true,
        data: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return items.map((c) => ({
      id: c.id,
      type: c.type,
      status: c.status,
      data: this.jstr(c.data),
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
  }

  // ===== Notifications  =====
  async childNotifications(
    tenantId: string,
    childUserId: string,
    page: number,
    pageSize: number,
    actor: Actor
  ) {
    await this.ensureLink(actor.id, childUserId, tenantId);
    const where = { tenantId, userId: actor.id };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          channel: true,
          status: true,
          payload: true,
          sentAt: true,
          createdAt: true,
          template: { select: { code: true } },
        },
      }),
      this.prismaService.notification.count({ where }),
    ]);
    return {
      items: items.map((n) => ({
        id: n.id,
        channel: n.channel,
        status: n.status,
        payload: this.jstr(n.payload),
        templateCode: n.template?.code ?? null,
        sentAt: n.sentAt ?? null,
        createdAt: n.createdAt,
      })),
      total,
      page,
      pageSize,
    };
  }

  // ===== Notification Prefs =====
  async updateNotificationPrefs(
    input: { tenantId: string; childUserId: string; prefsJson: string },
    actor: Actor
  ) {
    await this.ensureLink(actor.id, input.childUserId, input.tenantId);
    const parent = await this.prismaService.user.findUnique({
      where: { id: actor.id },
      select: { id: true, bio: true },
    });
    const prefs = JSON.parse(input.prefsJson || "{}");
    await this.prismaService.auditEvent.create({
      data: {
        tenantId: input.tenantId,
        actorId: actor.id,
        action: "PARENT_PREFS_UPDATED",
        entity: "User",
        entityId: actor.id,
        data: prefs,
      },
    });
    return true;
  }
}
