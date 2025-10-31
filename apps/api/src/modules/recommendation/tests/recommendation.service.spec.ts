import { NotFoundException, BadRequestException } from "@nestjs/common";
import { RecommendationService } from "@recommendation/services/recommendation.service";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@prisma/prisma.service";

class PrismaMock {
  assessment = { findFirst: jest.fn() };
  resultSnapshot = { findFirst: jest.fn() };
  assessmentVersion = { findFirst: jest.fn() };
  career = { findMany: jest.fn() };
  major = { findMany: jest.fn() };
  recommendation = {
    deleteMany: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  };
  $transaction = jest.fn(async (arg: any) => {
    if (Array.isArray(arg)) return Promise.all(arg);
    if (typeof arg === "function") {
      return arg({
        recommendation: this.recommendation,
      } as any);
    }
    return arg;
  });
}

describe("RecommendationService", () => {
  let service: RecommendationService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = new PrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get(RecommendationService);
    jest.resetAllMocks();
  });

  describe("preview()", () => {
    it("throws NotFound when assessment missing", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.preview({ tenantId: "t1", assessmentId: "A1" } as any)
      ).rejects.toThrow(NotFoundException);
    });

    it("throws BadRequest when no ResultSnapshot", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A1",
        tenantId: "t1",
        versionId: null,
      });
      prisma.resultSnapshot.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.preview({ tenantId: "t1", assessmentId: "A1" } as any)
      ).rejects.toThrow(BadRequestException);
    });

    it("returns preview payload (CAREER/MAJOR default) with empty ranks", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A1",
        tenantId: "t1",
        versionId: null,
      });
      prisma.resultSnapshot.findFirst.mockResolvedValueOnce({
        id: "R1",
        scoresJson: { metrics: { skillA: 80 } },
      });
      prisma.assessmentVersion.findFirst.mockResolvedValueOnce(null);

      // No careers/majors -> empty ranks
      prisma.career.findMany.mockResolvedValueOnce([]);
      prisma.major.findMany.mockResolvedValueOnce([]);

      const res = await service.preview({
        tenantId: "t1",
        assessmentId: "A1",
      } as any);

      expect(res).toMatchObject({
        tenantId: "t1",
        assessmentId: "A1",
        resultId: "R1",
      });
      expect(typeof res.previewJson).toBe("string");
      const parsed = JSON.parse(res.previewJson);
      expect(parsed.items).toEqual([
        { type: "CAREER", top: [] },
        { type: "MAJOR", top: [] },
      ]);
    });
  });

  describe("generate()", () => {
    it("throws when assessment not found", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.generate({ tenantId: "t1", assessmentId: "AX" } as any)
      ).rejects.toThrow(NotFoundException);
    });

    it("throws when no ResultSnapshot", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A1",
        tenantId: "t1",
        versionId: null,
      });
      prisma.resultSnapshot.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.generate({ tenantId: "t1", assessmentId: "A1" } as any)
      ).rejects.toThrow(BadRequestException);
    });

    it("returns created:0 when ranks/targets empty", async () => {
      prisma.assessment.findFirst.mockResolvedValueOnce({
        id: "A1",
        tenantId: "t1",
        versionId: null,
      });
      prisma.resultSnapshot.findFirst.mockResolvedValueOnce({
        id: "R1",
        scoresJson: { metrics: {} },
      });
      prisma.assessmentVersion.findFirst.mockResolvedValueOnce(null);

      // Empty data => no recommendations generated
      prisma.career.findMany.mockResolvedValueOnce([]);
      prisma.major.findMany.mockResolvedValueOnce([]);

      prisma.recommendation.deleteMany.mockResolvedValueOnce({ count: 0 });

      const out = await service.generate({
        tenantId: "t1",
        assessmentId: "A1",
        overwrite: true,
      } as any);

      expect(prisma.recommendation.deleteMany).toHaveBeenCalled();
      expect(out).toEqual({ created: 0 });
    });
  });

  describe("list()", () => {
    it("resolves resultId via assessmentId and returns page", async () => {
      prisma.resultSnapshot.findFirst.mockResolvedValueOnce({ id: "R1" });
      prisma.$transaction.mockResolvedValueOnce([[{ id: "rec1" }], 1] as any);

      const out = await service.list({
        tenantId: "t1",
        assessmentId: "A1",
        page: 2,
        pageSize: 5,
      } as any);

      expect(out).toEqual({
        items: [{ id: "rec1" }],
        total: 1,
        page: 2,
        pageSize: 5,
      });
    });

    it("throws when neither resultId nor resolvable assessmentId provided", async () => {
      prisma.resultSnapshot.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.list({ tenantId: "t1", assessmentId: "A1" } as any)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("deleteOne()", () => {
    it("deletes when found", async () => {
      prisma.recommendation.findFirst.mockResolvedValueOnce({ id: "rec_1" });
      prisma.recommendation.delete.mockResolvedValueOnce({});

      const ok = await service.deleteOne({
        tenantId: "t1",
        id: "rec_1",
      } as any);
      expect(prisma.recommendation.delete).toHaveBeenCalledWith({
        where: { id: "rec_1" },
      });
      expect(ok).toBe(true);
    });

    it("throws NotFound when missing", async () => {
      prisma.recommendation.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.deleteOne({ tenantId: "t1", id: "rec_X" } as any)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
