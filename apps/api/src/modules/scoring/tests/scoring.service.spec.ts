import { Test, TestingModule } from "@nestjs/testing";
import { ScoringService } from "@scoring/services/scoring.service";
import { PrismaService } from "@prisma/prisma.service";

function createTxMock(overrides: Record<string, any> = {}): any {
  return {
    response: { findMany: jest.fn() },
    assessmentVersion: { findFirst: jest.fn() },
    question: { findMany: jest.fn() },
    option: { findMany: jest.fn() },
    score: { deleteMany: jest.fn(), create: jest.fn() },
    resultSnapshot: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    assessment: { update: jest.fn(), findMany: jest.fn() },
    ...overrides,
  };
}

class PrismaMock {
  assessment = { findFirst: jest.fn(), findMany: jest.fn(), update: jest.fn() };
  response = { findMany: jest.fn() };
  assessmentVersion = { findFirst: jest.fn() };
  question = { findMany: jest.fn() };
  option = { findMany: jest.fn() };
  score = { deleteMany: jest.fn(), create: jest.fn() };
  resultSnapshot = {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  $transaction = jest.fn(async (fnOrArr: any) => {
    if (typeof fnOrArr === "function") {
      const tx: any = createTxMock({
        response: this.response,
        assessmentVersion: this.assessmentVersion,
        question: this.question,
        option: this.option,
        score: this.score,
        resultSnapshot: this.resultSnapshot,
        assessment: this.assessment,
      });
      return fnOrArr(tx);
    }
    if (Array.isArray(fnOrArr)) return Promise.all(fnOrArr);
    return fnOrArr;
  });
}

describe("ScoringService", () => {
  let service: ScoringService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = new PrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScoringService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get<ScoringService>(ScoringService);
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  describe("preview()", () => {
    it("returns computed preview with metrics and summary", async () => {
      const input = { tenantId: "t1", assessmentId: "A1" } as any;
      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A1",
        tenantId: "t1",
        userId: "U1",
        submittedAt: new Date("2025-01-01T00:00:00Z"),
        versionId: "V1",
      });

      prisma.response.findMany.mockResolvedValueOnce([
        { questionId: "Q1", value: "opt1" },
        { questionId: "Q2", value: { values: ["opt2", "opt3"] } },
        { questionId: "Q3", value: 7 },
      ]);

      prisma.assessmentVersion.findFirst.mockResolvedValueOnce({
        id: "V1",
        tenantId: "t1",
        interpretationJson: {
          normalization: {
            metric: "total_weight",
            min: 0,
            max: 10,
            scale: 100,
          },
          labels: {
            total_weight: [
              { max: 50, label: "LOW" },
              { min: 50, label: "HIGH" },
            ],
          },
        },
      });

      prisma.question.findMany.mockResolvedValueOnce([
        { id: "Q1", type: "SINGLE_CHOICE", configJson: { metric: "cat" } },
        { id: "Q2", type: "MULTIPLE_CHOICE", configJson: { metric: "cat" } },
        {
          id: "Q3",
          type: "SCALE",
          configJson: { metric: "score", metricWeight: 2 },
        },
      ]);

      prisma.option.findMany.mockResolvedValueOnce([
        { questionId: "Q1", value: "opt1", weight: 3 },
        { questionId: "Q2", value: "opt2", weight: 2 },
        { questionId: "Q2", value: "opt3", weight: 5 },
      ]);

      const result = await service.preview(input);

      expect(result).toHaveProperty("assessmentId", "A1");
      expect(result).toHaveProperty("tenantId", "t1");
      expect(result).toHaveProperty("summaryJson");
      expect(result).toHaveProperty("scoresJson");
      expect(result).toHaveProperty("metrics");

      const keys = result.metrics.map((m: any) => m.key);
      expect(keys).toContain("total_weight");

      expect(prisma.question.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            id: { in: expect.arrayContaining(["Q1", "Q2", "Q3"]) },
            tenantId: "t1",
          },
        })
      );
      expect(prisma.option.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            questionId: { in: expect.arrayContaining(["Q1", "Q2", "Q3"]) },
            tenantId: "t1",
          },
        })
      );
    });

    it("throws if assessment not found", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.preview({ tenantId: "t1", assessmentId: "X" } as any)
      ).rejects.toThrow("Assessment not found");
    });

    it("throws if not submitted", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A1",
        tenantId: "t1",
        submittedAt: null,
      });
      await expect(
        service.preview({ tenantId: "t1", assessmentId: "A1" } as any)
      ).rejects.toThrow("Assessment must be submitted first");
    });
  });

  describe("runStrict()", () => {
    it("deletes old scores (default overwrite), writes scores & snapshot, updates assessment", async () => {
      const input = { tenantId: "t1", assessmentId: "A1" } as any;

      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A1",
        tenantId: "t1",
        userId: "U1",
        submittedAt: new Date("2025-01-01T00:00:00Z"),
        versionId: "V1",
      });

      prisma.response.findMany.mockResolvedValueOnce([
        { questionId: "Q1", value: "o1" },
        { questionId: "Q2", value: { values: ["o2"] } },
      ]);

      prisma.assessmentVersion.findFirst.mockResolvedValueOnce({
        id: "V1",
        tenantId: "t1",
        interpretationJson: null,
      });

      prisma.question.findMany.mockResolvedValueOnce([
        { id: "Q1", type: "SINGLE_CHOICE", configJson: {} },
        { id: "Q2", type: "MULTIPLE_CHOICE", configJson: {} },
      ]);

      prisma.option.findMany.mockResolvedValueOnce([
        { questionId: "Q1", value: "o1", weight: 4 },
        { questionId: "Q2", value: "o2", weight: 6 },
      ]);

      prisma.resultSnapshot.findUnique.mockResolvedValueOnce(null);

      const ok = await service.runStrict(input);
      expect(ok).toBe(true);

      expect(prisma.score.deleteMany).toHaveBeenCalledWith({
        where: { tenantId: "t1", assessmentId: "A1" },
      });

      expect(prisma.score.create).toHaveBeenCalled();
      expect(prisma.resultSnapshot.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId: "t1",
            assessmentId: "A1",
            userId: "U1",
          }),
        })
      );
      expect(prisma.assessment.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "A1" },
          data: expect.objectContaining({
            state: "SCORED",
            scoredAt: expect.any(Date),
          }),
        })
      );
    });

    it("updates existing snapshot when found", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A2",
        tenantId: "t1",
        userId: "U2",
        submittedAt: new Date(),
        versionId: null,
      });

      prisma.response.findMany.mockResolvedValueOnce([
        { questionId: "Q1", value: "o1" },
      ]);
      prisma.question.findMany.mockResolvedValueOnce([
        { id: "Q1", type: "SINGLE_CHOICE", configJson: {} },
      ]);
      prisma.option.findMany.mockResolvedValueOnce([
        { questionId: "Q1", value: "o1", weight: 1 },
      ]);
      prisma.resultSnapshot.findUnique.mockResolvedValueOnce({ id: "RS1" });

      const ok = await service.runStrict({
        tenantId: "t1",
        assessmentId: "A2",
      } as any);
      expect(ok).toBe(true);
      expect(prisma.resultSnapshot.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { assessmentId: "A2" },
          data: expect.objectContaining({
            summaryJson: expect.anything(),
            scoresJson: expect.anything(),
          }),
        })
      );
    });

    it("throws when assessment not found / not submitted", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.runStrict({ tenantId: "t1", assessmentId: "X" } as any)
      ).rejects.toThrow("Assessment not found");

      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A3",
        tenantId: "t1",
        submittedAt: null,
      });
      await expect(
        service.runStrict({ tenantId: "t1", assessmentId: "A3" } as any)
      ).rejects.toThrow("Assessment must be submitted first");
    });
  });

  describe("recomputeTenant()", () => {
    it("iterates submitted assessments in batches and calls runStrict", async () => {
      const spyRun = jest
        .spyOn(service, "runStrict")
        .mockResolvedValue(true as const);

      prisma.assessment.findMany
        .mockResolvedValueOnce([{ id: "A1" }, { id: "A2" }])
        .mockResolvedValueOnce([{ id: "A3" }])
        .mockResolvedValueOnce([]); // end

      const res = await service.recomputeTenant({
        tenantId: "t1",
        batchSize: 2,
      } as any);

      expect(spyRun).toHaveBeenCalledTimes(3);
      expect(spyRun).toHaveBeenNthCalledWith(1, {
        tenantId: "t1",
        assessmentId: "A1",
        overwrite: true,
      });
      expect(spyRun).toHaveBeenNthCalledWith(2, {
        tenantId: "t1",
        assessmentId: "A2",
        overwrite: true,
      });
      expect(spyRun).toHaveBeenNthCalledWith(3, {
        tenantId: "t1",
        assessmentId: "A3",
        overwrite: true,
      });
      expect(res).toEqual({ tenantId: "t1", processed: 3 });
    });
  });
});
