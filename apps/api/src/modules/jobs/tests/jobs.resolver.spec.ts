import { JobsResolver } from "@jobs/resolvers/jobs.resolver";
import { JobsService } from "@jobs/services/jobs.service";
import { Test } from "@nestjs/testing";

describe("JobsResolver", () => {
  let resolver: JobsResolver;
  let service: jest.Mocked<JobsService>;

  const mockService = (): jest.Mocked<JobsService> =>
    ({
      enqueueExportRun: jest.fn(),
      enqueueNotificationTemplate: jest.fn(),
      enqueueNotificationAdHoc: jest.fn(),
      enqueueScoring: jest.fn(),
      enqueueRecommendation: jest.fn(),
      enqueueMaintenance: jest.fn(),
      health: jest.fn().mockResolvedValue({
        exportWaiting: 0,
        scoringWaiting: 0,
        maintenanceWaiting: 0,
        notificationWaiting: 0,
        recommendationWaiting: 0,
      }),
    }) as any;

  const ctx = (role = "ADMIN") => ({ req: { user: { id: "u1", role } } });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JobsResolver,
        { provide: JobsService, useValue: mockService() },
      ],
    }).compile();

    resolver = moduleRef.get(JobsResolver);
    service = moduleRef.get(JobsService) as any;
  });

  it("enqueueExportRun calls service and returns true", async () => {
    await expect(
      resolver.enqueueExportRun("t1", "job-1", 100, ctx())
    ).resolves.toBe(true);
    expect(service.enqueueExportRun).toHaveBeenCalledWith("t1", "job-1", 100);
  });

  it("enqueueNotificationByTemplate forwards input & actor", async () => {
    const input = {
      tenantId: "t1",
      templateId: "tpl-1",
      variables: "{}",
    } as any;
    await expect(
      resolver.enqueueNotificationByTemplate(input, ctx())
    ).resolves.toBe(true);
    expect(service.enqueueNotificationTemplate).toHaveBeenCalledWith(
      input,
      ctx().req.user
    );
  });

  it("enqueueNotificationAdHoc forwards input & actor", async () => {
    const input = {
      tenantId: "t1",
      channel: "EMAIL",
      userIds: ["u"],
      payload: "{}",
    } as any;
    await expect(resolver.enqueueNotificationAdHoc(input, ctx())).resolves.toBe(
      true
    );
    expect(service.enqueueNotificationAdHoc).toHaveBeenCalledWith(
      input,
      ctx().req.user
    );
  });

  it("enqueueScoring forwards input & actor", async () => {
    const input = { tenantId: "t1", assessmentId: "a1" } as any;
    await expect(resolver.enqueueScoring(input, ctx())).resolves.toBe(true);
    expect(service.enqueueScoring).toHaveBeenCalledWith(input, ctx().req.user);
  });

  it("enqueueRecommendation forwards input & actor", async () => {
    const input = { tenantId: "t1", userId: "u1" } as any;
    await expect(resolver.enqueueRecommendation(input, ctx())).resolves.toBe(
      true
    );
    expect(service.enqueueRecommendation).toHaveBeenCalledWith(
      input,
      ctx().req.user
    );
  });

  it("enqueueMaintenance forwards input & actor", async () => {
    const input = { tenantId: "t1", params: "{}" } as any;
    await expect(
      resolver.enqueueMaintenance(input, ctx("SUPER_ADMIN"))
    ).resolves.toBe(true);
    expect(service.enqueueMaintenance).toHaveBeenCalledWith(input, {
      id: "u1",
      role: "SUPER_ADMIN",
    });
  });

  it("jobsHealth returns service.health()", async () => {
    const health = await resolver.jobsHealth();
    expect(health).toEqual({
      exportWaiting: 0,
      scoringWaiting: 0,
      maintenanceWaiting: 0,
      notificationWaiting: 0,
      recommendationWaiting: 0,
    });
    expect(service.health).toHaveBeenCalled();
  });
});
