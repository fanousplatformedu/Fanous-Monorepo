import { Test, TestingModule } from "@nestjs/testing";
import { ScoringResolver } from "@scoring/resolvers/scoring.resolver";
import { ScoringService } from "@scoring/services/scoring.service";

describe("ScoringResolver", () => {
  let resolver: ScoringResolver;
  let service: jest.Mocked<ScoringService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<ScoringService>> = {
      preview: jest.fn(),
      runStrict: jest.fn(),
      recomputeTenant: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoringResolver,
        { provide: ScoringService, useValue: serviceMock },
      ],
    }).compile();
    resolver = module.get<ScoringResolver>(ScoringResolver);
    service = module.get(ScoringService) as any;
  });
  afterEach(() => jest.resetAllMocks());
  it("previewScoring -> calls service.preview", async () => {
    const input: any = { tenantId: "t1", assessmentId: "A1" };
    (service.preview as jest.Mock).mockResolvedValueOnce({ ok: true });
    const res = await resolver.previewScoring(input);
    expect(service.preview).toHaveBeenCalledWith(input);
    expect(res).toEqual({ ok: true });
  });

  it("runScoringStrict -> calls service.runStrict", async () => {
    const input: any = { tenantId: "t1", assessmentId: "A1" };
    (service.runStrict as jest.Mock).mockResolvedValueOnce(true);
    const res = await resolver.runScoringStrict(input);
    expect(service.runStrict).toHaveBeenCalledWith(input);
    expect(res).toBe(true);
  });

  it("recomputeTenantScores -> calls service.recomputeTenant", async () => {
    const input: any = { tenantId: "t1" };
    (service.recomputeTenant as jest.Mock).mockResolvedValueOnce({
      tenantId: "t1",
      processed: 5,
    });
    const res = await resolver.recomputeTenantScores(input);
    expect(service.recomputeTenant).toHaveBeenCalledWith(input);
    expect(res).toEqual({ tenantId: "t1", processed: 5 });
  });
});
