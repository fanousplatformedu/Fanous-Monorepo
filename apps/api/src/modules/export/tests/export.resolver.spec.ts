import { ExportResolver } from "@export/resolvers/export.resolver";
import { ExportService } from "@export/services/export.service";
import { Test } from "@nestjs/testing";

describe("ExportResolver", () => {
  let resolver: ExportResolver;
  let exportService: {
    createJob: jest.Mock;
    runJob: jest.Mock;
    page: jest.Mock;
    preview: jest.Mock;
  };

  const ctx = { req: { user: { id: "a1", role: "ADMIN" } } };

  beforeEach(async () => {
    exportService = {
      createJob: jest.fn(),
      runJob: jest.fn(),
      page: jest.fn(),
      preview: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ExportResolver,
        { provide: ExportService, useValue: exportService },
      ],
    }).compile();

    resolver = moduleRef.get(ExportResolver);
  });

  it("createExportJob: injects kind into params and forwards actor", async () => {
    exportService.createJob.mockResolvedValue({ id: "j1" });
    const input = {
      tenantId: "t1",
      kind: "USERS",
      format: "CSV",
      params: JSON.stringify({ foo: "bar" }),
      queueOnly: true,
    } as any;

    const out = await resolver.createExportJob(input, ctx as any);
    expect(exportService.createJob).toHaveBeenCalledWith(
      {
        tenantId: "t1",
        kind: "USERS",
        format: "CSV",
        queueOnly: true,
        params: JSON.stringify({ foo: "bar", kind: "USERS" }),
      },
      ctx.req.user
    );
    expect(out).toEqual({ id: "j1" });
  });

  it("runExportJob: forwards actor", async () => {
    exportService.runJob.mockResolvedValue({ id: "j2" });
    const out = await resolver.runExportJob(
      { tenantId: "t1", id: "j2" } as any,
      ctx as any
    );
    expect(exportService.runJob).toHaveBeenCalledWith(
      { tenantId: "t1", id: "j2" },
      ctx.req.user
    );
    expect(out).toEqual({ id: "j2" });
  });

  it("exportJobs: forwards actor", async () => {
    exportService.page.mockResolvedValue({ items: [], total: 0 });
    const out = await resolver.exportJobs(
      { tenantId: "t1", page: 1, pageSize: 10 } as any,
      ctx as any
    );
    expect(exportService.page).toHaveBeenCalledWith(
      { tenantId: "t1", page: 1, pageSize: 10 },
      ctx.req.user
    );
    expect(out).toEqual({ items: [], total: 0 });
  });

  it("previewExport: forwards actor", async () => {
    exportService.preview.mockResolvedValue({
      headers: ["a"],
      rows: ['{"a":1}'],
      count: 1,
    });
    const out = await resolver.previewExport(
      { tenantId: "t1", kind: "USERS", limit: 5 } as any,
      ctx as any
    );
    expect(exportService.preview).toHaveBeenCalledWith(
      { tenantId: "t1", kind: "USERS", limit: 5 },
      ctx.req.user
    );
    expect(out).toEqual({ headers: ["a"], rows: ['{"a":1}'], count: 1 });
  });
});
