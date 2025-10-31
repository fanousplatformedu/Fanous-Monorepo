import { Test, TestingModule } from "@nestjs/testing";
import { AssessmentService } from "@assessment/services/assessment.service";
import { PrismaService } from "@prisma/prisma.service";

class PrismaMock {
  assessment = {
    findMany: jest.fn(),
    count: jest.fn(),
  };

  $transaction = jest.fn((arg: any) => {
    if (Array.isArray(arg)) return Promise.all(arg);
    if (typeof arg === "function") return Promise.resolve(arg(this));
    return Promise.resolve(arg);
  });
}

describe("AssessmentService", () => {
  let service: AssessmentService;
  let prisma: PrismaMock;

  beforeEach(async () => {
    prisma = new PrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssessmentService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AssessmentService>(AssessmentService);
  });

  afterEach(() => jest.resetAllMocks());

  it("page() should order by startedAt desc and return paginated result", async () => {
    const input = { tenantId: "t1", page: 2, pageSize: 10 } as any;
    const dummyItems = [{ id: "a1" }, { id: "a2" }];
    prisma.assessment.findMany.mockResolvedValueOnce(dummyItems);
    prisma.assessment.count.mockResolvedValueOnce(42);
    const res = await service.page(input);
    expect(prisma.assessment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { AND: [{ tenantId: "t1" }] },
        orderBy: [{ startedAt: "desc" }],
        skip: 10,
        take: 10,
      })
    );
    expect(prisma.assessment.count).toHaveBeenCalledWith({
      where: { AND: [{ tenantId: "t1" }] },
    });
    expect(res).toEqual({
      items: dummyItems,
      total: 42,
      page: 2,
      pageSize: 10,
    });
  });

  it("page() should include optional userId and state filters", async () => {
    prisma.assessment.findMany.mockResolvedValueOnce([]);
    prisma.assessment.count.mockResolvedValueOnce(0);
    await service.page({
      tenantId: "t1",
      userId: "u1",
      state: "IN_PROGRESS" as any,
      page: 1,
      pageSize: 20,
    } as any);
    expect(prisma.assessment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [{ tenantId: "t1" }, { userId: "u1" }, { state: "IN_PROGRESS" }],
        },
        orderBy: [{ startedAt: "desc" }],
        skip: 0,
        take: 20,
      })
    );
  });

  it("pageByMe() should force userId = actorUserId and order by startedAt desc", async () => {
    prisma.assessment.findMany.mockResolvedValueOnce([{ id: "a3" }]);
    prisma.assessment.count.mockResolvedValueOnce(1);
    const res = await service.pageByMe(
      { tenantId: "t1", page: 1, pageSize: 5 } as any,
      "u-actor"
    );
    expect(prisma.assessment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { tenantId: "t1", userId: "u-actor" },
        orderBy: [{ startedAt: "desc" }],
        skip: 0,
        take: 5,
      })
    );
    expect(res).toEqual({
      items: [{ id: "a3" }],
      total: 1,
      page: 1,
      pageSize: 5,
    });
  });
});
