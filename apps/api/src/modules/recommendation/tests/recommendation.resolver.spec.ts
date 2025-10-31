import { RecommendationResolver } from "@recommendation/resolvers/recommendation.resolver";
import { RecommendationService } from "@recommendation/services/recommendation.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("RecommendationResolver", () => {
  let resolver: RecommendationResolver;
  const service = {
    generate: jest.fn(),
    preview: jest.fn(),
    list: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationResolver,
        { provide: RecommendationService, useValue: service },
      ],
    }).compile();

    resolver = module.get(RecommendationResolver);
  });

  it("generateRecommendations → delegates to service.generate with input", async () => {
    const input = {
      tenantId: "t1",
      assessmentId: "A1",
      types: ["CAREER"],
    } as any;
    service.generate.mockResolvedValueOnce({ created: 3 });

    const res = await resolver.generateRecommendations(input);
    expect(service.generate).toHaveBeenCalledWith(input);
    expect(res).toEqual({ created: 3 });
  });

  it("previewRecommendations → delegates to service.preview with input", async () => {
    const input = { tenantId: "t1", assessmentId: "A1", topN: 5 } as any;
    const payload = {
      tenantId: "t1",
      assessmentId: "A1",
      resultId: "R1",
      previewJson: "{}",
    };
    service.preview.mockResolvedValueOnce(payload);

    const res = await resolver.previewRecommendations(input);
    expect(service.preview).toHaveBeenCalledWith(input);
    expect(res).toBe(payload);
  });

  it("recommendations → delegates to service.list with input", async () => {
    const input = {
      tenantId: "t1",
      resultId: "R1",
      page: 2,
      pageSize: 10,
    } as any;
    const page = { items: [{ id: "rec1" }], total: 1, page: 2, pageSize: 10 };
    service.list.mockResolvedValueOnce(page);

    const res = await resolver.recommendations(input);
    expect(service.list).toHaveBeenCalledWith(input);
    expect(res).toBe(page);
  });

  it("deleteRecommendation → delegates to service.deleteOne with input", async () => {
    const input = { tenantId: "t1", id: "rec_1" } as any;
    service.deleteOne.mockResolvedValueOnce(true);

    const ok = await resolver.deleteRecommendation(input);
    expect(service.deleteOne).toHaveBeenCalledWith(input);
    expect(ok).toBe(true);
  });
});
