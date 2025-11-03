import { LibraryResolver } from "@library/resolvers/library.resolver";
import { LibraryService } from "@library/services/library.service";

const ctx = (user = { id: "u1", role: "ADMIN" }) => ({ req: { user } });

describe("LibraryResolver", () => {
  let resolver: LibraryResolver;
  let service: jest.Mocked<LibraryService>;

  beforeEach(() => {
    service = {
      // skills
      pageSkills: jest.fn(),
      suggestSkills: jest.fn(),
      createSkill: jest.fn(),
      updateSkill: jest.fn(),
      removeSkill: jest.fn(),
      bulkUpsertSkills: jest.fn(),
      // careers
      pageCareers: jest.fn(),
      createCareer: jest.fn(),
      updateCareer: jest.fn(),
      removeCareer: jest.fn(),
      getCareerSkills: jest.fn(),
      setCareerSkills: jest.fn(),
      // majors
      pageMajors: jest.fn(),
      createMajor: jest.fn(),
      updateMajor: jest.fn(),
      removeMajor: jest.fn(),
      getMajorSkills: jest.fn(),
      setMajorSkills: jest.fn(),
    } as any;

    resolver = new LibraryResolver(service as any);
    jest.clearAllMocks();
  });

  // ------- skills -------
  it("skills calls service.pageSkills", async () => {
    const input = { q: "A", page: 1, pageSize: 10 };
    const payload = { items: [], total: 0, page: 1, pageSize: 10 };
    service.pageSkills.mockResolvedValue(payload as any);

    const res = await resolver.skills(input as any);
    expect(service.pageSkills).toHaveBeenCalledWith(input);
    expect(res).toBe(payload);
  });

  it("suggestSkills calls service.suggestSkills with defaults", async () => {
    service.suggestSkills.mockResolvedValue([{ id: "s1" }] as any);
    const res = await resolver.suggestSkills({ q: "a" } as any);
    expect(service.suggestSkills).toHaveBeenCalledWith("a", undefined, 10);
    expect(res.length).toBe(1);
  });

  it("createSkill passes ctx.req.user and returns entity", async () => {
    service.createSkill.mockResolvedValue({ id: "s1" } as any);
    const res = await resolver.createSkill(
      { code: "A", title: JSON.stringify("T") } as any,
      ctx()
    );
    expect(service.createSkill).toHaveBeenCalledWith(
      { code: "A", title: JSON.stringify("T") },
      ctx().req.user
    );
    expect(res).toEqual({ id: "s1" });
  });

  it("updateSkill passes ctx.req.user", async () => {
    service.updateSkill.mockResolvedValue({ id: "s1" } as any);
    await resolver.updateSkill({ id: "s1" } as any, ctx());
    expect(service.updateSkill).toHaveBeenCalledWith(
      { id: "s1" },
      ctx().req.user
    );
  });

  it("removeSkill passes ctx.req.user and returns true", async () => {
    service.removeSkill.mockResolvedValue(true);
    const ok = await resolver.removeSkill("sid", ctx());
    expect(ok).toBe(true);
    expect(service.removeSkill).toHaveBeenCalledWith("sid", ctx().req.user);
  });

  it("bulkUpsertSkills returns true on success", async () => {
    service.bulkUpsertSkills.mockResolvedValue({ upserted: 2 } as any);
    const ok = await resolver.bulkUpsertSkills(
      { items: [{ code: "A", title: JSON.stringify("T") }] } as any,
      ctx()
    );
    expect(service.bulkUpsertSkills).toHaveBeenCalled();
    expect(ok).toBe(true);
  });

  // ------- careers -------
  it("careers calls service.pageCareers", async () => {
    service.pageCareers.mockResolvedValue({ items: [], total: 0 } as any);
    await resolver.careers({ page: 1, pageSize: 5 } as any);
    expect(service.pageCareers).toHaveBeenCalledWith({ page: 1, pageSize: 5 });
  });

  it("createCareer passes ctx.req.user", async () => {
    service.createCareer.mockResolvedValue({ id: "c1" } as any);
    const res = await resolver.createCareer(
      { code: "C", title: JSON.stringify("T") } as any,
      ctx()
    );
    expect(service.createCareer).toHaveBeenCalledWith(
      { code: "C", title: JSON.stringify("T") },
      ctx().req.user
    );
    expect(res).toEqual({ id: "c1" });
  });

  it("updateCareer passes ctx.req.user", async () => {
    service.updateCareer.mockResolvedValue({ id: "c1" } as any);
    await resolver.updateCareer({ id: "c1" } as any, ctx());
    expect(service.updateCareer).toHaveBeenCalledWith(
      { id: "c1" },
      ctx().req.user
    );
  });

  it("removeCareer passes ctx.req.user", async () => {
    service.removeCareer.mockResolvedValue(true);
    const ok = await resolver.removeCareer("c1", ctx());
    expect(ok).toBe(true);
    expect(service.removeCareer).toHaveBeenCalledWith("c1", ctx().req.user);
  });

  it("careerSkills calls service.getCareerSkills", async () => {
    service.getCareerSkills.mockResolvedValue([{ skillId: "s1" }] as any);
    const res = await resolver.careerSkills("c1");
    expect(service.getCareerSkills).toHaveBeenCalledWith("c1");
    expect(res.length).toBe(1);
  });

  it("setCareerSkills passes ctx.req.user", async () => {
    service.setCareerSkills.mockResolvedValue(true);
    const ok = await resolver.setCareerSkills(
      { careerId: "c1", mappingJson: "[]" } as any,
      ctx()
    );
    expect(ok).toBe(true);
    expect(service.setCareerSkills).toHaveBeenCalledWith(
      { careerId: "c1", mappingJson: "[]" },
      ctx().req.user
    );
  });

  // ------- majors -------
  it("majors calls service.pageMajors", async () => {
    service.pageMajors.mockResolvedValue({ items: [], total: 0 } as any);
    await resolver.majors({ page: 1, pageSize: 10 } as any);
    expect(service.pageMajors).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });

  it("createMajor passes ctx.req.user", async () => {
    service.createMajor.mockResolvedValue({ id: "m1" } as any);
    const res = await resolver.createMajor(
      { code: "M", title: JSON.stringify("T") } as any,
      ctx()
    );
    expect(service.createMajor).toHaveBeenCalledWith(
      { code: "M", title: JSON.stringify("T") },
      ctx().req.user
    );
    expect(res).toEqual({ id: "m1" });
  });

  it("updateMajor passes ctx.req.user", async () => {
    service.updateMajor.mockResolvedValue({ id: "m1" } as any);
    await resolver.updateMajor({ id: "m1" } as any, ctx());
    expect(service.updateMajor).toHaveBeenCalledWith(
      { id: "m1" },
      ctx().req.user
    );
  });

  it("removeMajor passes ctx.req.user", async () => {
    service.removeMajor.mockResolvedValue(true);
    const ok = await resolver.removeMajor("m1", ctx());
    expect(ok).toBe(true);
    expect(service.removeMajor).toHaveBeenCalledWith("m1", ctx().req.user);
  });

  it("majorSkills calls service.getMajorSkills", async () => {
    service.getMajorSkills.mockResolvedValue([{ skillId: "s1" }] as any);
    const res = await resolver.majorSkills("m1");
    expect(service.getMajorSkills).toHaveBeenCalledWith("m1");
    expect(res.length).toBe(1);
  });

  it("setMajorSkills passes ctx.req.user", async () => {
    service.setMajorSkills.mockResolvedValue(true);
    const ok = await resolver.setMajorSkills(
      { majorId: "m1", mappingJson: "[]" } as any,
      ctx()
    );
    expect(ok).toBe(true);
    expect(service.setMajorSkills).toHaveBeenCalledWith(
      { majorId: "m1", mappingJson: "[]" },
      ctx().req.user
    );
  });
});
