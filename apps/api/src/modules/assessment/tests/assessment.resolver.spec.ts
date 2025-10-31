import { Test, TestingModule } from "@nestjs/testing";
import { AssessmentResolver } from "@assessment/resolvers/assessment.resolver";
import { AssessmentService } from "@assessment/services/assessment.service";

describe("AssessmentResolver", () => {
  let resolver: AssessmentResolver;
  let service: jest.Mocked<AssessmentService>;

  beforeEach(async () => {
    const serviceMock: Partial<jest.Mocked<AssessmentService>> = {
      page: jest.fn(),
      pageByMe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentResolver,
        { provide: AssessmentService, useValue: serviceMock },
      ],
    }).compile();

    resolver = module.get<AssessmentResolver>(AssessmentResolver);
    service = module.get(AssessmentService) as any;
  });

  afterEach(() => jest.resetAllMocks());

  it("assessments() should call service.page with input", async () => {
    const input = { tenantId: "t1", page: 1, pageSize: 10 } as any;
    (service.page as jest.Mock).mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });

    const res = await resolver.assessments(input);

    expect(service.page).toHaveBeenCalledWith(input);
    expect(res).toEqual({ items: [], total: 0, page: 1, pageSize: 10 });
  });

  it("myAssessments() should pass ctx user id to service.pageByMe", async () => {
    const input = { tenantId: "t1", page: 2, pageSize: 5 } as any;
    const ctx = { req: { user: { id: "user-123" } } };
    (service.pageByMe as jest.Mock).mockResolvedValueOnce({
      items: [{ id: "a1" }],
      total: 1,
      page: 2,
      pageSize: 5,
    });

    const res = await resolver.myAssessments(input, ctx as any);

    expect(service.pageByMe).toHaveBeenCalledWith(input, "user-123");
    expect(res).toEqual({
      items: [{ id: "a1" }],
      total: 1,
      page: 2,
      pageSize: 5,
    });
  });
});
