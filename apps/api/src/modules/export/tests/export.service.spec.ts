import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { ExportService } from "@export/services/export.service";
import { PrismaService } from "@prisma/prisma.service";

// ========== Lightweight stubs so TypeScript ===========
jest.mock("fs", () => {
  const actual = jest.requireActual("fs") as typeof import("fs");
  return {
    ...actual,
    promises: {
      ...actual.promises,
      writeFile: jest.fn(),
    },
  };
});

jest.mock("fs-extra", () => ({
  ensureDir: jest.fn(),
  stat: jest.fn().mockResolvedValue({ size: 123 }),
  createWriteStream: () => {
    const handlers: Record<string, Function> = {};
    return {
      on: (evt: string, cb: Function) => (handlers[evt] = cb),
      _emitFinish: () => handlers["finish"]?.(),
      _emitError: (e: any) => handlers["error"]?.(e),
    };
  },
}));
jest.mock("path", () => {
  const actual = jest.requireActual("path") as typeof import("path");
  return {
    ...actual,
    join: (...a: string[]) => a.join("/"),
    posix: {
      ...actual.posix,
      join: (...a: string[]) => a.join("/"),
    },
  };
});

const createPrismaMock = () => {
  const self: any = {
    $transaction: jest.fn(async (arg: any) => {
      if (typeof arg === "function") return arg(self);
      if (Array.isArray(arg)) return Promise.all(arg);
      throw new Error("$transaction mock: unsupported argument");
    }),
    exportJob: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    fileAsset: {
      create: jest.fn(),
    },
  };
  return self;
};

let prisma: ReturnType<typeof createPrismaMock>;
let service: ExportService;

beforeEach(() => {
  prisma = createPrismaMock();
  service = new ExportService(prisma as unknown as PrismaService);
  jest.clearAllMocks();
});

describe("ExportService", () => {
  const admin = { id: "a1", role: "ADMIN" };
  const student = { id: "u1", role: "STUDENT" };

  const stubExporter = (data: any) =>
    jest.spyOn<any, any>(service as any, "exporter").mockImplementation(() => ({
      fetch: jest.fn().mockResolvedValue(data),
    }));

  const stubWriteFile = () =>
    jest
      .spyOn<any, any>(service as any, "writeFile")
      .mockResolvedValue(undefined);

  // ========== RBAC ==========
  it("rejects non-privileged role", async () => {
    await expect(
      service.preview(
        { tenantId: "t1", kind: "USERS", limit: 1 } as any,
        student as any
      )
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  // ============ createJob ==========
  it("createJob: queueOnly returns mapped job without running", async () => {
    prisma.exportJob.create.mockResolvedValue({
      id: "j1",
      tenantId: "t1",
      format: "CSV",
      status: "PENDING",
      params: { a: 1 },
      createdAt: new Date("2025-01-01"),
      finishedAt: null,
      fileId: null,
      file: null,
    });
    const out = await service.createJob(
      {
        tenantId: "t1",
        format: "CSV",
        params: JSON.stringify({ a: 1 }),
        queueOnly: true,
      } as any,
      admin as any
    );
    expect(prisma.exportJob.create).toHaveBeenCalled();
    expect(out).toMatchObject({
      id: "j1",
      tenantId: "t1",
      format: "CSV",
      status: "PENDING",
      params: '{"a":1}',
      fileId: null,
      fileKey: null,
      fileUrl: null,
    });
  });

  it("createJob: immediate run calls runJob with created id", async () => {
    prisma.exportJob.create.mockResolvedValue({
      id: "j1",
      tenantId: "t1",
      format: "CSV",
      status: "PENDING",
    });
    jest.spyOn(service, "runJob").mockResolvedValue({ id: "j1" } as any);
    const out = await service.createJob(
      { tenantId: "t1", format: "CSV" } as any,
      admin as any
    );
    expect(service.runJob).toHaveBeenCalledWith(
      { tenantId: "t1", id: "j1" },
      admin
    );
    expect(out).toEqual({ id: "j1" });
  });

  // =========== runJob ============
  it("runJob: throws NotFound if job missing", async () => {
    prisma.exportJob.findFirst.mockResolvedValue(null);
    await expect(
      service.runJob({ tenantId: "t1", id: "no" } as any, admin as any)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("runJob: throws if already processing", async () => {
    prisma.exportJob.findFirst.mockResolvedValue({
      id: "j1",
      tenantId: "t1",
      status: "PROCESSING",
    });
    await expect(
      service.runJob({ tenantId: "t1", id: "j1" } as any, admin as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("runJob: returns mapped job if READY", async () => {
    prisma.exportJob.findFirst.mockResolvedValue({
      id: "j1",
      tenantId: "t1",
      status: "READY",
      format: "CSV",
      params: { x: 1 },
      fileId: "f1",
      file: { key: "k", url: "/u" },
      createdAt: new Date("2025-01-01"),
      finishedAt: new Date("2025-01-02"),
    });
    const out = await service.runJob(
      { tenantId: "t1", id: "j1" } as any,
      admin as any
    );
    expect(out).toMatchObject({
      id: "j1",
      fileId: "f1",
      fileKey: "k",
      fileUrl: "/u",
      status: "READY",
      params: '{"x":1}',
    });
  });

  it("runJob: processes and succeeds (CSV path)", async () => {
    prisma.exportJob.findFirst.mockResolvedValue({
      id: "j1",
      tenantId: "t1",
      status: "PENDING",
      format: "CSV",
      params: { kind: "USERS" },
    });
    prisma.exportJob.update.mockResolvedValue({});
    stubExporter({
      filenameBase: "users",
      headers: ["id", "name"],
      rows: [{ id: "u1", name: "Pouya" }],
    });
    stubWriteFile();
    prisma.fileAsset.create.mockResolvedValue({
      id: "f1",
    });
    prisma.exportJob.update.mockResolvedValueOnce({});
    prisma.exportJob.update.mockResolvedValueOnce({
      id: "j1",
      tenantId: "t1",
      status: "READY",
      fileId: "f1",
      file: {
        key: "exports/t1/users_j1.csv",
        url: "/uploads/exports/t1/users_j1.csv",
      },
    });

    const out = await service.runJob(
      { tenantId: "t1", id: "j1" } as any,
      admin as any
    );

    expect(prisma.exportJob.update).toHaveBeenCalled();
    expect(prisma.fileAsset.create).toHaveBeenCalled();
    expect(out).toMatchObject({
      id: "j1",
      status: "READY",
      fileId: "f1",
      fileKey: "exports/t1/users_j1.csv",
    });
  });

  it("runJob: failure path returns FAILED", async () => {
    prisma.exportJob.findFirst.mockResolvedValue({
      id: "j1",
      tenantId: "t1",
      status: "PENDING",
      format: "CSV",
      params: { kind: "USERS" },
    });
    prisma.exportJob.update.mockResolvedValue({});
    jest.spyOn<any, any>(service as any, "exporter").mockImplementation(() => {
      throw new Error("boom");
    });

    prisma.exportJob.update.mockResolvedValueOnce({});
    prisma.exportJob.update.mockResolvedValueOnce({
      id: "j1",
      tenantId: "t1",
      status: "FAILED",
      fileId: null,
      file: null,
    });

    const out = await service.runJob(
      { tenantId: "t1", id: "j1" } as any,
      admin as any
    );

    expect(out).toMatchObject({ id: "j1", status: "FAILED" });
  });

  it("runJob: unsupported kind throws BadRequest -> returns FAILED", async () => {
    prisma.exportJob.findFirst.mockResolvedValue({
      id: "j1",
      tenantId: "t1",
      status: "PENDING",
      format: "CSV",
      params: { kind: "UNKNOWN" },
    });

    prisma.exportJob.update
      .mockResolvedValueOnce({ id: "j1", status: "PROCESSING" })
      .mockResolvedValueOnce({
        id: "j1",
        tenantId: "t1",
        status: "FAILED",
        format: "CSV",
        params: { kind: "UNKNOWN" },
        fileId: null,
        file: null,
        createdAt: new Date("2025-01-01"),
        finishedAt: new Date("2025-01-02"),
      });

    const out = await service.runJob(
      { tenantId: "t1", id: "j1" } as any,
      admin as any
    );

    expect(out).toMatchObject({ id: "j1", status: "FAILED" });
    expect(prisma.exportJob.update).toHaveBeenCalledTimes(2);
  });

  it("page: returns paginated and mapped items; uses $transaction array form", async () => {
    prisma.exportJob.findMany.mockResolvedValue([
      {
        id: "j1",
        tenantId: "t1",
        format: "CSV",
        status: "READY",
        params: { k: 1 },
        fileId: "f1",
        file: { key: "k", url: "/u" },
        createdAt: new Date("2025-01-01"),
        finishedAt: new Date("2025-01-02"),
      },
    ]);
    prisma.exportJob.count.mockResolvedValue(1);

    const res = await service.page(
      { tenantId: "t1", page: 1, pageSize: 20 } as any,
      admin as any
    );
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Array));
    expect(res.total).toBe(1);
    expect(res.items[0]).toMatchObject({
      id: "j1",
      params: '{"k":1}',
      fileKey: "k",
      fileUrl: "/u",
    });
  });

  // ---------- preview ----------
  it("preview: calls exporter.fetch, limits rows, stringifies rows", async () => {
    stubExporter({
      filenameBase: "x",
      headers: ["a", "b"],
      rows: [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ],
    });
    const out = await service.preview(
      { tenantId: "t1", kind: "USERS", limit: 1 } as any,
      admin as any
    );
    expect(out.headers).toEqual(["a", "b"]);
    expect(out.rows).toEqual(['{"a":1,"b":2}']);
    expect(out.count).toBe(1);
  });
});
