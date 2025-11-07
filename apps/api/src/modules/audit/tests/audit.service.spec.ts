import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@prisma/prisma.service";
import { AuditService } from "../services/audit.service";
import { Role } from "@prisma/client";

type Actor = { id?: string; role?: Role } | null | undefined;

const admin: Actor = { id: "u1", role: Role.ADMIN };
const nonAdmin: Actor = { id: "u2", role: Role.STUDENT };

const mockPrisma = () => ({
  auditEvent: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn(),
  $queryRaw: jest.fn(),
});

describe("AuditService", () => {
  let service: AuditService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    prisma = mockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(AuditService);
  });

  // ============= log ================
  it("log: creates an audit event with normalized nullable fields", async () => {
    prisma.auditEvent.create.mockResolvedValue({
      id: "ev1",
      tenantId: "t1",
      action: "LOGIN",
      entity: null,
      entityId: null,
      actorId: null,
      ip: null,
      userAgent: null,
      data: { x: 1 },
      createdAt: new Date(),
    });
    const ev = await service.log({
      tenantId: "t1",
      action: "LOGIN",
      data: { x: 1 },
    });

    expect(prisma.auditEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tenantId: "t1",
        action: "LOGIN",
        data: { x: 1 },
        ip: null,
        userAgent: null,
        entity: null,
        entityId: null,
        actorId: null,
      }),
    });
    expect(ev.id).toBe("ev1");
  });

  // ========== byId =============
  it("byId: throws NotFound when event not found", async () => {
    prisma.auditEvent.findUnique.mockResolvedValue(null);
    await expect(service.byId("nope", admin)).rejects.toBeInstanceOf(
      NotFoundException
    );
  });

  it("byId: forbids non-admin", async () => {
    prisma.auditEvent.findUnique.mockResolvedValue({ id: "ev1" });
    await expect(service.byId("ev1", nonAdmin)).rejects.toBeInstanceOf(
      ForbiddenException
    );
  });

  it("byId: returns event for admin", async () => {
    prisma.auditEvent.findUnique.mockResolvedValue({ id: "ev1", data: null });
    const ev = await service.byId("ev1", admin);
    expect(ev.id).toBe("ev1");
  });

  // ========== paginate ===============
  it("paginate: forbids non-admin", async () => {
    await expect(
      service.paginate({ tenantId: "t1", page: 1, pageSize: 10 }, nonAdmin)
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("paginate: returns items and total with filters applied", async () => {
    prisma.$transaction.mockImplementation(async (ops: any[]) => {
      const [findManyPromise, countPromise] = ops;
      const items = await findManyPromise;
      const total = await countPromise;
      return [items, total];
    });
    prisma.auditEvent.findMany.mockResolvedValue([
      { id: "a1", data: null, createdAt: new Date() },
      { id: "a2", data: { foo: "bar" }, createdAt: new Date() },
    ]);
    prisma.auditEvent.count.mockResolvedValue(2);
    const res = await service.paginate(
      {
        tenantId: "t1",
        q: "login",
        actorId: "u9",
        action: "LOGIN",
        entity: "User",
        from: new Date("2025-01-01"),
        to: new Date("2025-01-31"),
        page: 2,
        pageSize: 10,
      },
      admin
    );

    expect(prisma.auditEvent.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.any(Object),
        orderBy: { createdAt: "desc" },
        skip: 10,
        take: 10,
      })
    );
    expect(res.total).toBe(2);
    expect(res.items).toHaveLength(2);
  });

  // ========== stats (groupBy=day) ==============
  it("stats(day): builds dynamic SQL where and returns rows", async () => {
    prisma.$queryRaw.mockResolvedValue([
      { day: "2025-01-01", count: 3 },
      { day: "2025-01-02", count: 1 },
    ]);
    const res = await service.stats(
      {
        tenantId: "t1",
        from: new Date("2025-01-01"),
        to: new Date("2025-01-31"),
        groupBy: "day",
      },
      admin
    );
    expect(res.groupBy).toBe("day");
    if (res.groupBy === "day") {
      const first = res.rows[0] as { day: string; count: number };
      expect(first.count).toBe(3);
    } else {
      fail("Expected groupBy to be 'day'");
    }
  });

  // ========== stats (groupBy=action) ================
  it("stats(action): uses prisma.groupBy and orders by _count.action", async () => {
    prisma.auditEvent.groupBy.mockResolvedValue([
      { action: "LOGIN", _count: { action: 5 } },
      { action: "LOGOUT", _count: { action: 2 } },
    ]);
    const res = await service.stats(
      { tenantId: "t1", groupBy: "action" },
      admin
    );
    expect(prisma.auditEvent.groupBy).toHaveBeenCalledWith({
      by: ["action"],
      where: expect.objectContaining({ tenantId: "t1" }),
      _count: { action: true },
      orderBy: { _count: { action: "desc" } },
    });
    expect(res.groupBy).toBe("action");
    expect(res.rows).toEqual([
      { action: "LOGIN", count: 5 },
      { action: "LOGOUT", count: 2 },
    ]);
  });

  it("stats: forbids non-admin", async () => {
    await expect(
      service.stats({ tenantId: "t1" }, nonAdmin)
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  // ========== purge ============
  it("purge: forbids non-admin", async () => {
    await expect(
      service.purge({ tenantId: "t1", before: new Date() }, nonAdmin)
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it("purge: deletes and returns count", async () => {
    prisma.auditEvent.deleteMany.mockResolvedValue({ count: 42 });
    const count = await service.purge(
      { tenantId: "t1", before: new Date() },
      admin
    );
    expect(prisma.auditEvent.deleteMany).toHaveBeenCalled();
    expect(count).toBe(42);
  });
});
