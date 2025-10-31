import { Test, TestingModule } from "@nestjs/testing";
import { CounselorResolver } from "@counselor/resolvers/counselor.resolver";
import { CounselorService } from "@counselor/services/counselor.service";

describe("CounselorResolver", () => {
  let resolver: CounselorResolver;
  const service = {
    schedule: jest.fn(),
    reschedule: jest.fn(),
    updateNotes: jest.fn(),
    delete: jest.fn(),
    page: jest.fn(),
    myPage: jest.fn(),
    byId: jest.fn(),
  };

  const ctx = { req: { user: { id: "U1", role: "COUNSELOR" } } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounselorResolver,
        { provide: CounselorService, useValue: service },
      ],
    }).compile();

    resolver = module.get<CounselorResolver>(CounselorResolver);
    jest.clearAllMocks();
  });

  it("scheduleCounselingSession passes actor from ctx", async () => {
    service.schedule.mockResolvedValue({ id: "S1" });
    const res = await resolver.scheduleCounselingSession(
      { tenantId: "t1" } as any,
      ctx as any
    );
    expect(res).toEqual({ id: "S1" });
    expect(service.schedule).toHaveBeenCalledWith(
      { tenantId: "t1" },
      ctx.req.user
    );
  });

  it("rescheduleCounselingSession delegates", async () => {
    service.reschedule.mockResolvedValue({ id: "S1" });
    await resolver.rescheduleCounselingSession({ id: "S1" } as any, ctx as any);
    expect(service.reschedule).toHaveBeenCalledWith({ id: "S1" }, ctx.req.user);
  });

  it("updateCounselingSessionNotes delegates", async () => {
    service.updateNotes.mockResolvedValue({ id: "S1" });
    await resolver.updateCounselingSessionNotes(
      { id: "S1" } as any,
      ctx as any
    );
    expect(service.updateNotes).toHaveBeenCalledWith(
      { id: "S1" },
      ctx.req.user
    );
  });

  it("deleteCounselingSession delegates", async () => {
    service.delete.mockResolvedValue(true);
    const ok = await resolver.deleteCounselingSession(
      { id: "S1" } as any,
      ctx as any
    );
    expect(ok).toBe(true);
    expect(service.delete).toHaveBeenCalledWith({ id: "S1" }, ctx.req.user);
  });

  it("counselingSessions delegates", async () => {
    service.page.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    const res = await resolver.counselingSessions(
      { tenantId: "t1" } as any,
      ctx as any
    );
    expect(res).toEqual({ items: [], total: 0, page: 1, pageSize: 20 });
    expect(service.page).toHaveBeenCalledWith({ tenantId: "t1" }, ctx.req.user);
  });

  it("myCounselingSessions delegates", async () => {
    service.myPage.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 20,
    });
    await resolver.myCounselingSessions({ tenantId: "t1" } as any, ctx as any);
    expect(service.myPage).toHaveBeenCalledWith(
      { tenantId: "t1" },
      ctx.req.user
    );
  });

  it("counselingSessionById delegates", async () => {
    service.byId.mockResolvedValue({ id: "S1" });
    const res = await resolver.counselingSessionById("t1", "S1", ctx as any);
    expect(res).toEqual({ id: "S1" });
    expect(service.byId).toHaveBeenCalledWith("t1", "S1", ctx.req.user);
  });
});
