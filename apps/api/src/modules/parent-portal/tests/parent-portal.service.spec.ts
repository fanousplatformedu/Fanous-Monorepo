import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { ParentPortalService } from "@parent-portal/services/parent-portal.service";

// Minimal PrismaService mock shape used by service
const prisma = {
  parentLink: {
    findUnique: jest.fn(),
    upsert: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
  resultSnapshot: {
    findFirst: jest.fn(),
  },
  assessment: {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
  },
  recommendation: {
    findMany: jest.fn(),
  },
  consent: {
    upsert: jest.fn(),
    findMany: jest.fn(),
  },
  notification: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
  auditEvent: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
} as any;

const svc = new ParentPortalService(prisma);
const parentActor = { id: "p1", role: "PARENT" };
const tenantId = "t1";
const childUserId = "u_child";

describe("ParentPortalService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- linkChild ----------
  it("linkChild: creates link when child is STUDENT", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: childUserId,
      role: "STUDENT",
    });
    prisma.parentLink.upsert.mockResolvedValue({});

    const ok = await svc.linkChild({ tenantId, childUserId }, parentActor);
    expect(ok).toBe(true);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: childUserId },
      select: { id: true, role: true },
    });
    expect(prisma.parentLink.upsert).toHaveBeenCalledWith({
      where: {
        parentId_childId_tenantId: {
          parentId: parentActor.id,
          childId: childUserId,
          tenantId,
        },
      },
      update: {},
      create: { parentId: parentActor.id, childId: childUserId, tenantId },
    });
  });

  it("linkChild: forbids non-parent actor", async () => {
    await expect(
      svc.linkChild({ tenantId, childUserId }, { id: "x", role: "ADMIN" })
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("linkChild: errors if child not found", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(
      svc.linkChild({ tenantId, childUserId }, parentActor)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("linkChild: errors if child is not STUDENT", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: childUserId,
      role: "TEACHER",
    });
    await expect(
      svc.linkChild({ tenantId, childUserId }, parentActor)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  // helper: ensureLink positive path
  function mockEnsureLinkOK() {
    prisma.parentLink.findUnique.mockResolvedValue({ id: "link1" });
  }

  // ---------- unlinkChild ----------
  it("unlinkChild: deletes link after ensureLink", async () => {
    mockEnsureLinkOK();
    prisma.parentLink.delete.mockResolvedValue({});

    const ok = await svc.unlinkChild({ tenantId, childUserId }, parentActor);
    expect(ok).toBe(true);
    expect(prisma.parentLink.findUnique).toHaveBeenCalledWith({
      where: {
        parentId_childId_tenantId: {
          parentId: parentActor.id,
          childId: childUserId,
          tenantId,
        },
      },
      select: { id: true },
    });
    expect(prisma.parentLink.delete).toHaveBeenCalledWith({
      where: {
        parentId_childId_tenantId: {
          parentId: parentActor.id,
          childId: childUserId,
          tenantId,
        },
      },
    });
  });

  it("unlinkChild: throws if ensureLink fails", async () => {
    prisma.parentLink.findUnique.mockResolvedValue(null);
    await expect(
      svc.unlinkChild({ tenantId, childUserId }, parentActor)
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  // ---------- myChildren ----------
  it("myChildren: maps classroom/grade safely", async () => {
    prisma.parentLink.findMany.mockResolvedValue([
      {
        tenantId,
        child: {
          id: childUserId,
          name: "Kid",
          avatar: "A.png",
          enrollments: [
            { classroom: { name: "A-1", grade: { name: "Grade 3" } } },
          ],
        },
      },
      {
        tenantId,
        child: { id: "c2", name: "Kid2", avatar: null, enrollments: [] },
      },
    ]);

    const rows = await svc.myChildren(parentActor);
    expect(rows).toEqual([
      {
        id: childUserId,
        name: "Kid",
        avatar: "A.png",
        classroomName: "A-1",
        gradeName: "Grade 3",
      },
      {
        id: "c2",
        name: "Kid2",
        avatar: null,
        classroomName: null,
        gradeName: null,
      },
    ]);
    expect(prisma.parentLink.findMany).toHaveBeenCalled();
  });

  it("myChildren: forbids non-parent", async () => {
    await expect(
      svc.myChildren({ id: "x", role: "ADMIN" })
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  // ---------- childSummary ----------
  it("childSummary: returns combined snapshot", async () => {
    mockEnsureLinkOK();
    prisma.$transaction.mockImplementation(async (ops: any[]) => {
      const [u, last, cnt, lastA] = ops;
      const user = await u;
      const l = await last;
      const c = await cnt;
      const la = await lastA;
      return [user, l, c, la];
    });
    prisma.user.findUnique.mockResolvedValue({
      id: childUserId,
      learningHours: 42,
      certificatesEarned: 3,
    });
    prisma.resultSnapshot.findFirst.mockResolvedValue({
      summaryJson: { a: 1 },
      scoresJson: { s: 2 },
      createdAt: new Date(),
    });
    prisma.assessment.count.mockResolvedValue(7);
    prisma.assessment.findFirst.mockResolvedValue({
      submittedAt: new Date("2025-01-02"),
    });

    const out = await svc.childSummary(tenantId, childUserId, parentActor);
    expect(out.userId).toBe(childUserId);
    expect(out.learningHours).toBe(42);
    expect(out.certificatesEarned).toBe(3);
    expect(out.assessmentsCount).toBe(7);
    expect(out.lastResultSummary).toBe(JSON.stringify({ a: 1 }));
    expect(out.lastScores).toBe(JSON.stringify({ s: 2 }));
    expect(out.lastAssessmentAt?.toISOString()).toBe(
      "2025-01-02T00:00:00.000Z"
    );
  });

  it("childSummary: throws if user not found", async () => {
    mockEnsureLinkOK();
    prisma.$transaction.mockImplementation(async (ops: any[]) => {
      const [u, l, c, la] = ops;
      const user = await u;
      const last = await l;
      const cnt = await c;
      const lastA = await la;
      return [user, last, cnt, lastA];
    });
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(
      svc.childSummary(tenantId, childUserId, parentActor)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  // ---------- childAssessments ----------
  it("childAssessments: maps rows and paginates", async () => {
    mockEnsureLinkOK();
    prisma.$transaction.mockImplementation(async (ops: any[]) => {
      const [list, cnt] = ops;
      return [await list, await cnt];
    });
    prisma.assessment.findMany.mockResolvedValue([
      {
        id: "a1",
        state: "SUBMITTED",
        submittedAt: new Date("2025-02-02"),
        scoredAt: new Date("2025-02-03"),
        version: { versionNumber: 2, questionnaire: { code: "Q1" } },
        assignment: null,
      },
      {
        id: "a2",
        state: "DRAFT",
        submittedAt: null,
        scoredAt: null,
        version: null,
        assignment: { questionnaire: { code: "QX" } },
      },
    ]);
    prisma.assessment.count.mockResolvedValue(2);

    const out = await svc.childAssessments(
      tenantId,
      childUserId,
      2,
      10,
      parentActor
    );
    expect(out.page).toBe(2);
    expect(out.pageSize).toBe(10);
    expect(out.total).toBe(2);
    expect(out.items[0]).toMatchObject({
      id: "a1",
      code: "Q1",
      state: "SUBMITTED",
      version: 2,
    });
    expect(out.items[1]).toMatchObject({
      id: "a2",
      code: "QX",
      state: "DRAFT",
      version: null,
    });
  });

  // ---------- childRecommendations ----------
  it("childRecommendations: empty when no resultSnapshot", async () => {
    mockEnsureLinkOK();
    prisma.resultSnapshot.findFirst.mockResolvedValue(null);
    const out = await svc.childRecommendations(
      tenantId,
      childUserId,
      undefined,
      10,
      parentActor
    );
    expect(out).toEqual([]);
  });

  it("childRecommendations: maps results w/ target codes and JSON strings", async () => {
    mockEnsureLinkOK();
    prisma.resultSnapshot.findFirst.mockResolvedValue({ id: "res1" });
    prisma.recommendation.findMany.mockResolvedValue([
      {
        id: "r1",
        type: "CAREER",
        targetJson: { code: "C1" },
        confidence: 0.9,
        rank: 1,
        explainabilityFactors: { a: 1 },
        createdAt: new Date("2025-03-01"),
        targetCareer: { code: "C1" },
        targetMajor: null,
      },
    ]);
    const out = await svc.childRecommendations(
      tenantId,
      childUserId,
      "CAREER",
      5,
      parentActor
    );
    expect(prisma.recommendation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ resultId: "res1", type: "CAREER" }),
      })
    );
    expect(out[0]).toMatchObject({
      id: "r1",
      type: "CAREER",
      targetCareerCode: "C1",
      targetMajorCode: null,
      targetJson: JSON.stringify({ code: "C1" }),
      confidence: 0.9,
      rank: 1,
    });
  });

  // ---------- setConsent ----------
  it("setConsent: upserts and maps JSON fields", async () => {
    mockEnsureLinkOK();
    const now = new Date("2025-04-04");
    prisma.consent.upsert.mockResolvedValue({
      id: "cons1",
      type: "EMAIL",
      status: "GRANTED",
      data: { foo: 1 },
      createdAt: now,
      updatedAt: now,
    });

    const out = await svc.setConsent(
      {
        tenantId,
        childUserId,
        type: "EMAIL",
        status: "GRANTED",
        data: JSON.stringify({ foo: 1 }),
      },
      parentActor
    );
    expect(prisma.consent.upsert).toHaveBeenCalled();
    expect(out).toEqual({
      id: "cons1",
      type: "EMAIL",
      status: "GRANTED",
      data: JSON.stringify({ foo: 1 }),
      createdAt: now,
      updatedAt: now,
    });
  });

  // ---------- childConsents ----------
  it("childConsents: maps JSON data to string", async () => {
    mockEnsureLinkOK();
    prisma.consent.findMany.mockResolvedValue([
      {
        id: "c1",
        type: "EMAIL",
        status: "GRANTED",
        data: { a: 1 },
        createdAt: new Date("2025-05-01"),
        updatedAt: new Date("2025-05-02"),
      },
    ]);
    const out = await svc.childConsents(tenantId, childUserId, parentActor);
    expect(out[0]).toMatchObject({
      id: "c1",
      type: "EMAIL",
      status: "GRANTED",
      data: JSON.stringify({ a: 1 }),
    });
  });

  // ---------- childNotifications ----------
  it("childNotifications: paginates and maps payload/templateCode", async () => {
    mockEnsureLinkOK();
    prisma.$transaction.mockImplementation(async (ops: any[]) => {
      const [list, cnt] = ops;
      return [await list, await cnt];
    });
    prisma.notification.findMany.mockResolvedValue([
      {
        id: "n1",
        channel: "EMAIL",
        status: "SENT",
        payload: { x: 1 },
        sentAt: new Date("2025-06-01"),
        createdAt: new Date("2025-06-01T10:00:00Z"),
        template: { code: "WELCOME" },
      },
    ]);
    prisma.notification.count.mockResolvedValue(1);

    const out = await svc.childNotifications(
      tenantId,
      childUserId,
      1,
      20,
      parentActor
    );
    expect(out.page).toBe(1);
    expect(out.pageSize).toBe(20);
    expect(out.total).toBe(1);
    expect(out.items[0]).toMatchObject({
      id: "n1",
      channel: "EMAIL",
      status: "SENT",
      payload: JSON.stringify({ x: 1 }),
      templateCode: "WELCOME",
    });
  });

  // ---------- updateNotificationPrefs ----------
  it("updateNotificationPrefs: writes audit event and returns true", async () => {
    mockEnsureLinkOK();
    prisma.user.findUnique.mockResolvedValue({ id: parentActor.id, bio: null });
    prisma.auditEvent.create.mockResolvedValue({});

    const ok = await svc.updateNotificationPrefs(
      { tenantId, childUserId, prefsJson: JSON.stringify({ email: true }) },
      parentActor
    );
    expect(ok).toBe(true);
    expect(prisma.auditEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tenantId,
        actorId: parentActor.id,
        action: "PARENT_PREFS_UPDATED",
        entity: "User",
        entityId: parentActor.id,
        data: { email: true },
      }),
    });
  });
});
