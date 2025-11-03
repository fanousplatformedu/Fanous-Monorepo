import { QUEUES, JOB_NAMES, DEFAULT_BACKOFF } from "@jobs/enums/jobs.enums";
import { ForbiddenException } from "@nestjs/common";
import { DEFAULT_ATTEMPTS } from "@jobs/enums/jobs.enums";
import { createMockQueue } from "@common/utils/mock-queue";
import { getQueueToken } from "@nestjs/bullmq";
import { JobsService } from "@jobs/services/jobs.service";
import { TMockQueue } from "../types/jobs.types";
import { Test } from "@nestjs/testing";

describe("JobsService", () => {
  let service: JobsService;
  let exportQueue: TMockQueue;
  let notificationQueue: TMockQueue;
  let scoringQueue: TMockQueue;
  let recommendationQueue: TMockQueue;
  let maintenanceQueue: TMockQueue;

  beforeEach(async () => {
    exportQueue = createMockQueue();
    notificationQueue = createMockQueue();
    scoringQueue = createMockQueue();
    recommendationQueue = createMockQueue();
    maintenanceQueue = createMockQueue();

    const moduleRef = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: getQueueToken(QUEUES.EXPORT), useValue: exportQueue },
        {
          provide: getQueueToken(QUEUES.NOTIFICATION),
          useValue: notificationQueue,
        },
        { provide: getQueueToken(QUEUES.SCORING), useValue: scoringQueue },
        {
          provide: getQueueToken(QUEUES.RECOMMENDATION),
          useValue: recommendationQueue,
        },
        {
          provide: getQueueToken(QUEUES.MAINTENANCE),
          useValue: maintenanceQueue,
        },
      ],
    }).compile();

    service = moduleRef.get(JobsService);
  });

  describe("permissions", () => {
    const allowed = [
      { role: "SUPER_ADMIN" },
      { role: "ADMIN" },
      { role: "COUNSELOR" },
    ];
    const denied = [
      { role: "STUDENT" },
      { role: "TEACHER" },
      { role: "" },
      {} as any,
    ];

    test.each(allowed)(
      "allowed roles can enqueue scoring (%p)",
      async (actor) => {
        await service.enqueueScoring(
          { tenantId: "t1", assessmentId: "a1", params: "{}", delayMs: 123 },
          actor as any
        );
        expect(scoringQueue.add).toHaveBeenCalledWith(
          JOB_NAMES.SCORING_RUN,
          { tenantId: "t1", assessmentId: "a1", params: "{}", delayMs: 123 },
          { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: 123 }
        );
      }
    );

    test.each(denied)(
      "denied roles cannot enqueue scoring (%p)",
      async (actor) => {
        await expect(
          service.enqueueScoring(
            { tenantId: "t1", assessmentId: "a1" } as any,
            actor as any
          )
        ).rejects.toBeInstanceOf(ForbiddenException);
        expect(scoringQueue.add).not.toHaveBeenCalled();
      }
    );
  });

  describe("enqueueExportRun", () => {
    it("adds a job to export queue with correct payload/options", async () => {
      await service.enqueueExportRun("tenant-1", "job-42", 500);
      expect(exportQueue.add).toHaveBeenCalledWith(
        JOB_NAMES.EXPORT_RUN,
        { tenantId: "tenant-1", jobId: "job-42" },
        { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: 500 }
      );
    });

    it("defaults delay to 0", async () => {
      await service.enqueueExportRun("t", "j");
      expect(exportQueue.add).toHaveBeenCalledWith(
        JOB_NAMES.EXPORT_RUN,
        { tenantId: "t", jobId: "j" },
        { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: 0 }
      );
    });
  });

  describe("enqueueNotificationTemplate", () => {
    it("enqueues with TEMPLATE payload", async () => {
      await service.enqueueNotificationTemplate(
        {
          tenantId: "t1",
          templateId: "tpl-1",
          audienceJson: '{"all":true}',
          variables: '{"x":1}',
          delayMs: 250,
        },
        { id: "u", role: "ADMIN" }
      );
      expect(notificationQueue.add).toHaveBeenCalledWith(
        "notification.sendTemplate",
        {
          type: "TEMPLATE",
          tenantId: "t1",
          templateId: "tpl-1",
          audienceJson: '{"all":true}',
          variables: '{"x":1}',
          delayMs: 250,
        },
        { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: 250 }
      );
    });
  });

  describe("enqueueNotificationAdHoc", () => {
    it("enqueues with ADHOC payload", async () => {
      await service.enqueueNotificationAdHoc(
        {
          tenantId: "t1",
          channel: "EMAIL",
          userIds: ["u1", "u2"],
          payload: '{"subject":"Hi"}',
          delayMs: 50,
        },
        { id: "u", role: "SUPER_ADMIN" }
      );
      expect(notificationQueue.add).toHaveBeenCalledWith(
        "notification.sendAdHoc",
        {
          type: "ADHOC",
          tenantId: "t1",
          channel: "EMAIL",
          userIds: ["u1", "u2"],
          payload: '{"subject":"Hi"}',
          delayMs: 50,
        },
        { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: 50 }
      );
    });
  });

  describe("enqueueScoring", () => {
    it("adds scoring job with defaults", async () => {
      await service.enqueueScoring(
        { tenantId: "t1", assessmentId: "a1" },
        { id: "x", role: "COUNSELOR" }
      );
      expect(scoringQueue.add).toHaveBeenCalledWith(
        JOB_NAMES.SCORING_RUN,
        { tenantId: "t1", assessmentId: "a1" },
        { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: 0 }
      );
    });
  });

  describe("enqueueRecommendation", () => {
    it("adds recommendation precompute job", async () => {
      await service.enqueueRecommendation(
        { tenantId: "t1", userId: "u1", params: '{"k":2}', delayMs: 10 },
        { id: "x", role: "ADMIN" }
      );
      expect(recommendationQueue.add).toHaveBeenCalledWith(
        JOB_NAMES.RECOMMENDATION_PRECOMPUTE,
        { tenantId: "t1", userId: "u1", params: '{"k":2}', delayMs: 10 },
        { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: 10 }
      );
    });
  });

  describe("enqueueMaintenance", () => {
    it("adds maintenance cleanup job", async () => {
      await service.enqueueMaintenance(
        { tenantId: "t1", params: "{}", delayMs: 777 },
        { id: "x", role: "ADMIN" }
      );
      expect(maintenanceQueue.add).toHaveBeenCalledWith(
        JOB_NAMES.MAINTENANCE_CLEANUP,
        { tenantId: "t1", params: "{}", delayMs: 777 },
        { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: 777 }
      );
    });
  });

  describe("health", () => {
    it("returns waiting counts from all queues", async () => {
      exportQueue.getWaitingCount.mockResolvedValueOnce(1);
      notificationQueue.getWaitingCount.mockResolvedValueOnce(2);
      scoringQueue.getWaitingCount.mockResolvedValueOnce(3);
      recommendationQueue.getWaitingCount.mockResolvedValueOnce(4);
      maintenanceQueue.getWaitingCount.mockResolvedValueOnce(5);

      const res = await service.health();
      expect(res).toEqual({
        exportWaiting: 1,
        notificationWaiting: 2,
        scoringWaiting: 3,
        recommendationWaiting: 4,
        maintenanceWaiting: 5,
      });
    });
  });
});
