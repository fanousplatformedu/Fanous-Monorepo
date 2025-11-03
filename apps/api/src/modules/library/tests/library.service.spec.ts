import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { LibraryService } from "@library/services/library.service";

const admin = { id: "u1", role: "ADMIN" };
const viewer = { id: "u2", role: "STUDENT" };

function makeTx() {
  return {
    skill: {
      upsert: jest.fn(),
    },
    careerSkill: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
    majorSkill: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
    },
  };
}

function makePrismaMock() {
  const tx = makeTx();
  const prisma: any = {
    // skills
    skill: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    // careers
    career: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    // majors
    major: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    careerSkill: tx.careerSkill,
    majorSkill: tx.majorSkill,

    // $transaction can be array or callback
    $transaction: jest.fn(async (arg: any) => {
      if (Array.isArray(arg)) {
        // parallel
        return Promise.all(arg.map((p: any) => p));
      }
      if (typeof arg === "function") {
        return arg({
          ...tx,
          skill: { ...prisma.skill, ...tx.skill },
          career: prisma.career,
          major: prisma.major,
        });
      }
    }),
  };
  return prisma;
}

describe("LibraryService", () => {
  let prisma: any;
  let service: LibraryService;

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new LibraryService(prisma);
    jest.clearAllMocks();
  });

  // ------------ permissions ------------
  it("throws ForbiddenException for write ops when role is not allowed", async () => {
    await expect(
      service.createSkill(
        { code: "s1", title: JSON.stringify("Title") },
        viewer as any
      )
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  // ------------ skills ------------
  it("createSkill creates new skill and maps output", async () => {
    prisma.skill.findUnique.mockResolvedValue(null);
    prisma.skill.create.mockResolvedValue({
      id: "sid",
      code: "s1",
      title: "json title",
      category: "cat",
      meta: { a: 1 },
    });

    const res = await service.createSkill(
      {
        code: "s1",
        title: JSON.stringify({ en: "Title" }),
        category: "cat",
        meta: JSON.stringify({ a: 1 }),
      },
      admin as any
    );

    expect(prisma.skill.findUnique).toHaveBeenCalledWith({
      where: { code: "s1" },
    });
    expect(prisma.skill.create).toHaveBeenCalled();
    expect(res).toEqual({
      id: "sid",
      code: "s1",
      title: JSON.stringify("json title"),
      category: "cat",
      meta: JSON.stringify({ a: 1 }),
    });
  });

  it("createSkill rejects duplicate code", async () => {
    prisma.skill.findUnique.mockResolvedValue({ id: "sid" });
    await expect(
      service.createSkill(
        { code: "s1", title: JSON.stringify("T") },
        admin as any
      )
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("updateSkill updates selective fields and returns mapped", async () => {
    prisma.skill.findUnique.mockResolvedValueOnce({ id: "sid", code: "s1" }); // old
    prisma.skill.update.mockResolvedValue({
      id: "sid",
      code: "s1",
      title: { en: "New" },
      category: "newCat",
      meta: { m: 1 },
    });

    const res = await service.updateSkill(
      {
        id: "sid",
        title: JSON.stringify({ en: "New" }),
        category: "newCat",
        meta: JSON.stringify({ m: 1 }),
      },
      admin as any
    );

    expect(prisma.skill.update).toHaveBeenCalled();
    expect(res.id).toBe("sid");
    expect(res.title).toBe(JSON.stringify({ en: "New" }));
    expect(res.category).toBe("newCat");
    expect(res.meta).toBe(JSON.stringify({ m: 1 }));
  });

  it("removeSkill deletes and returns true", async () => {
    prisma.skill.delete.mockResolvedValue({ id: "sid" });
    const ok = await service.removeSkill("sid", admin as any);
    expect(ok).toBe(true);
    expect(prisma.skill.delete).toHaveBeenCalledWith({ where: { id: "sid" } });
  });

  it("bulkUpsertSkills upserts all items in a transaction", async () => {
    const items = [
      { code: "A", title: JSON.stringify("A") },
      {
        code: "B",
        title: JSON.stringify({ en: "B" }),
        meta: JSON.stringify({ w: 2 }),
      },
    ];
    const res = await service.bulkUpsertSkills(items, admin as any);
    // upsert called twice
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    // @ts-ignore access tx mock
    const upserts = prisma.$transaction.mock.calls[0];
    expect(res).toEqual({ upserted: 2 });
  });

  it("pageSkills returns paginated result", async () => {
    prisma.skill.findMany.mockResolvedValue([
      { id: "1", code: "A", title: "T1", category: null, meta: null },
    ]);
    prisma.skill.count.mockResolvedValue(21);

    const res = await service.pageSkills({ q: "A", page: 2, pageSize: 10 });
    expect(res.page).toBe(2);
    expect(res.pageSize).toBe(10);
    expect(res.total).toBe(21);
    expect(res.items.length).toBe(1);
  });

  it("suggestSkills applies filters and limit", async () => {
    prisma.skill.findMany.mockResolvedValue([
      { id: "1", code: "A1", title: "T", category: "cat", meta: null },
      { id: "2", code: "A2", title: "T", category: "cat", meta: null },
    ]);
    const res = await service.suggestSkills("A", "cat", 5);
    expect(prisma.skill.findMany).toHaveBeenCalled();
    expect(res.length).toBe(2);
  });

  // ------------ careers ------------
  it("createCareer rejects duplicate code", async () => {
    prisma.career.findUnique.mockResolvedValue({ id: "c1" });
    await expect(
      service.createCareer(
        { code: "C", title: JSON.stringify("T") },
        admin as any
      )
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("createCareer creates and returns mapped", async () => {
    prisma.career.findUnique.mockResolvedValue(null);
    prisma.career.create.mockResolvedValue({
      id: "c1",
      code: "C",
      title: { en: "Career" },
      summary: { s: 1 },
      meta: null,
    });
    const res = await service.createCareer(
      {
        code: "C",
        title: JSON.stringify({ en: "Career" }),
        summary: JSON.stringify({ s: 1 }),
      },
      admin as any
    );
    expect(res.id).toBe("c1");
    expect(res.title).toBe(JSON.stringify({ en: "Career" }));
    expect(res.summary).toBe(JSON.stringify({ s: 1 }));
  });

  it("updateCareer calculates skillsCount", async () => {
    prisma.career.findUnique.mockResolvedValueOnce({ id: "c1", code: "C" }); // old
    prisma.career.update.mockResolvedValue({
      id: "c1",
      code: "C",
      title: { en: "New" },
      summary: null,
      meta: null,
    });
    prisma.careerSkill.count.mockResolvedValue(3);

    const res = await service.updateCareer(
      { id: "c1", title: JSON.stringify({ en: "New" }) },
      admin as any
    );
    expect(res.skillsCount).toBe(3);
  });

  it("removeCareer deletes mappings then career", async () => {
    await expect(service.removeCareer("c1", admin as any)).resolves.toBe(true);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  it("pageCareers returns mapped with counts", async () => {
    prisma.career.findMany.mockResolvedValue([
      { id: "c1", code: "C", title: "T", summary: null, meta: null },
    ]);
    prisma.career.count.mockResolvedValue(1);
    prisma.careerSkill.groupBy.mockResolvedValue([
      { careerId: "c1", _count: 4 },
    ]);

    const res = await service.pageCareers({ page: 1, pageSize: 10 });
    expect(res.items[0].skillsCount).toBe(4);
  });

  // ------------ majors ------------
  it("createMajor duplicate check", async () => {
    prisma.major.findUnique.mockResolvedValue({ id: "m1" });
    await expect(
      service.createMajor(
        { code: "M", title: JSON.stringify("T") },
        admin as any
      )
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("updateMajor returns mapped with skillsCount", async () => {
    prisma.major.findUnique.mockResolvedValueOnce({ id: "m1", code: "M" });
    prisma.major.update.mockResolvedValue({
      id: "m1",
      code: "M",
      title: { en: "NM" },
      summary: null,
      meta: null,
    });
    prisma.majorSkill.count.mockResolvedValue(2);
    const res = await service.updateMajor(
      { id: "m1", title: JSON.stringify({ en: "NM" }) },
      admin as any
    );
    expect(res.skillsCount).toBe(2);
  });

  it("removeMajor deletes mappings then major", async () => {
    await expect(service.removeMajor("m1", admin as any)).resolves.toBe(true);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  // ------------ mappings ------------
  it("setCareerSkills validates career existence and mapping format", async () => {
    prisma.career.findUnique.mockResolvedValue({ id: "c1" });
    const mapping = JSON.stringify([{ skillId: "s1", weight: 0.7 }]);
    await expect(
      service.setCareerSkills(
        { careerId: "c1", mappingJson: mapping },
        admin as any
      )
    ).resolves.toBe(true);
  });

  it("setCareerSkills throws NotFound when career missing", async () => {
    prisma.career.findUnique.mockResolvedValue(null);
    await expect(
      service.setCareerSkills(
        { careerId: "cX", mappingJson: "[]" },
        admin as any
      )
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("setMajorSkills validates major existence", async () => {
    prisma.major.findUnique.mockResolvedValue({ id: "m1" });
    await expect(
      service.setMajorSkills({ majorId: "m1", mappingJson: "[]" }, admin as any)
    ).resolves.toBe(true);
  });

  it("getCareerSkills maps rows", async () => {
    prisma.careerSkill.findMany.mockResolvedValue([
      {
        skillId: "s1",
        weight: 0.5,
        skill: { id: "s1", code: "S1", title: "T", category: null },
      },
    ]);
    const res = await service.getCareerSkills("c1");
    expect(res[0]).toMatchObject({ skillId: "s1", weight: 0.5, code: "S1" });
  });

  it("getMajorSkills maps rows", async () => {
    prisma.majorSkill.findMany.mockResolvedValue([
      {
        skillId: "s1",
        weight: null,
        skill: { id: "s1", code: "S1", title: "T", category: "cat" },
      },
    ]);
    const res = await service.getMajorSkills("m1");
    expect(res[0]).toMatchObject({
      skillId: "s1",
      code: "S1",
      category: "cat",
    });
  });
});
