import "jest";
import { Test, TestingModule } from "@nestjs/testing";
import { AuditResolver } from "../resolvers/audit.resolver";
import { AuditService } from "../services/audit.service";
import { Role } from "@prisma/client";

const mockAuditService = () => ({
  log: jest.fn(),
  byId: jest.fn(),
  paginate: jest.fn(),
  stats: jest.fn(),
  purge: jest.fn(),
});

const adminCtx = {
  req: {
    user: { id: "u1", role: Role.ADMIN },
    headers: { "user-agent": "Jest UA" },
    ip: "10.0.0.1",
    socket: { remoteAddress: "10.0.0.1" },
  },
};

describe("AuditResolver", () => {
  let resolver: AuditResolver;
  let service: ReturnType<typeof mockAuditService>;

  beforeEach(async () => {
    service = mockAuditService() as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditResolver, { provide: AuditService, useValue: service }],
    }).compile();

    resolver = module.get(AuditResolver);
  });

  // ===== logAudit =====
  it("logAudit: parses dataJson, picks ip/ua from ctx, and returns stringified data", async () => {
    service.log.mockResolvedValue({
      id: "ev1",
      tenantId: "t1",
      action: "LOGIN",
      data: { foo: 1 },
    });

    const res = await resolver.logAudit(
      {
        tenantId: "t1",
        action: "LOGIN",
        dataJson: '{"foo":1}',
      } as any,
      adminCtx as any
    );

    expect(service.log).toHaveBeenCalledWith(
      expect.objectContaining({
        tenantId: "t1",
        action: "LOGIN",
        actorId: "u1",
        ip: "10.0.0.1",
        userAgent: "Jest UA",
        data: { foo: 1 },
      })
    );
    expect(res.data).toBe('{"foo":1}');
  });

  // ===== auditEvent =====
  it("auditEvent: fetches by id and returns data stringified", async () => {
    service.byId.mockResolvedValue({
      id: "evX",
      data: { k: "v" },
    });

    const res = await resolver.auditEvent("evX", adminCtx as any);
    expect(service.byId).toHaveBeenCalledWith("evX", adminCtx.req.user);
    expect(res.data).toBe('{"k":"v"}');
  });

  // ===== auditEvents (paginate) =====
  it("auditEvents: normalizes page/pageSize, maps items to stringified data", async () => {
    service.paginate.mockResolvedValue({
      items: [
        { id: "a1", data: { x: 1 } },
        { id: "a2", data: null },
      ],
      total: 2,
      page: 1,
      pageSize: 20,
    });

    const res = await resolver.auditEvents(
      { tenantId: "t1", page: undefined, pageSize: undefined } as any,
      adminCtx as any
    );

    const [firstArg] = service.paginate.mock.calls[0];
    expect(firstArg.page).toBe(1);
    expect(firstArg.pageSize).toBe(20);
    expect(res.items[0].data).toBe('{"x":1}');
    expect(res.items[1].data).toBeNull();
    expect(res.total).toBe(2);
  });

  // ===== auditStats =====
  it("auditStats: maps day rows", async () => {
    service.stats.mockResolvedValue({
      groupBy: "day",
      rows: [
        { day: "2025-01-01", count: 3 },
        { day: "2025-01-02", count: 1 },
      ],
    });

    const res = await resolver.auditStats(
      { tenantId: "t1", groupBy: "day" } as any,
      adminCtx as any
    );

    expect(service.stats).toHaveBeenCalledWith(
      { tenantId: "t1", groupBy: "day" },
      adminCtx.req.user
    );
    expect(res.groupBy).toBe("day");
    expect(res.rows[0]).toEqual({ day: "2025-01-01", count: 3 });
  });

  it("auditStats: maps action rows", async () => {
    service.stats.mockResolvedValue({
      groupBy: "action",
      rows: [
        { action: "LOGIN", count: 5 },
        { action: "LOGOUT", count: 2 },
      ],
    });

    const res = await resolver.auditStats(
      { tenantId: "t1", groupBy: "action" } as any,
      adminCtx as any
    );

    expect(res.groupBy).toBe("action");
    expect(res.rows[0]).toEqual({ action: "LOGIN", count: 5 });
  });

  // ===== purgeAudit =====
  it("purgeAudit: proxies to service and returns count", async () => {
    service.purge.mockResolvedValue(17);

    const res = await resolver.purgeAudit(
      "t1",
      new Date("2025-01-01T00:00:00.000Z"),
      adminCtx as any
    );

    expect(service.purge).toHaveBeenCalledWith(
      { tenantId: "t1", before: new Date("2025-01-01T00:00:00.000Z") },
      adminCtx.req.user
    );
    expect(res).toBe(17);
  });
});
