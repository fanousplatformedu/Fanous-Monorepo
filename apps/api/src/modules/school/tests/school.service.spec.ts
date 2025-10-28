import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { SchoolService } from "@school/services/school.service";
import { PrismaService } from "@prisma/prisma.service";

const makeTransaction = () =>
  jest.fn(async (promises: any[]) => {
    const results = await Promise.all(promises);
    return results;
  });

describe("SchoolService", () => {
  let service: SchoolService;
  let prisma: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: makeTransaction(),
            grade: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
            classroom: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
            user: {
              findFirst: jest.fn(),
            },
            enrollment: {
              create: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(SchoolService);
    prisma = module.get(PrismaService) as any;

    jest.clearAllMocks();
  });

  // ===== Grades =====
  describe("Grades", () => {
    it("createGrade: باید گرید را با trim و null برای code ذخیره کند", async () => {
      prisma.grade.create.mockResolvedValue({
        id: "g1",
        tenantId: "t1",
        name: "Grade 1",
        code: null,
      });
      const res = await service.createGrade({
        tenantId: "t1",
        name: "  Grade 1  ",
      } as any);
      expect(res).toEqual({
        id: "g1",
        tenantId: "t1",
        name: "Grade 1",
        code: null,
      });
      expect(prisma.grade.create).toHaveBeenCalledWith({
        data: { tenantId: "t1", name: "Grade 1", code: null },
      });
    });

    it("updateGrade: وقتی پیدا نشود باید NotFound بدهد", async () => {
      prisma.grade.findFirst.mockResolvedValue(null);
      await expect(
        service.updateGrade({ id: "gX", tenantId: "t1", name: "New" } as any)
      ).rejects.toThrow(new NotFoundException("Grade not found"));
    });

    it("updateGrade: وقتی پیدا شود باید بروزرسانی کند (trim و null code)", async () => {
      prisma.grade.findFirst.mockResolvedValue({ id: "g1" });
      prisma.grade.update.mockResolvedValue({
        id: "g1",
        name: "New",
        code: null,
      });
      const res = await service.updateGrade({
        id: "g1",
        tenantId: "t1",
        name: "  New  ",
        code: undefined,
      } as any);
      expect(res).toEqual({ id: "g1", name: "New", code: null });
      expect(prisma.grade.update).toHaveBeenCalledWith({
        where: { id: "g1" },
        data: { name: "New" },
      });
    });

    it("archiveGrade: پیدا نشدن → NotFound", async () => {
      prisma.grade.findFirst.mockResolvedValue(null);
      await expect(service.archiveGrade("g1", "t1")).rejects.toThrow(
        new NotFoundException("Grade not found")
      );
    });

    it("archiveGrade: موفق", async () => {
      prisma.grade.findFirst.mockResolvedValue({ id: "g1" });
      prisma.grade.update.mockResolvedValue({
        id: "g1",
        deletedAt: new Date(),
      });
      const res = await service.archiveGrade("g1", "t1");
      expect(res.id).toBe("g1");
      expect(prisma.grade.update).toHaveBeenCalledWith({
        where: { id: "g1" },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it("restoreGrade: پیدا نشدن → NotFound", async () => {
      prisma.grade.findFirst.mockResolvedValue(null);
      await expect(service.restoreGrade("g1", "t1")).rejects.toThrow(
        new NotFoundException("Grade not found")
      );
    });

    it("restoreGrade: موفق", async () => {
      prisma.grade.findFirst.mockResolvedValue({ id: "g1" });
      prisma.grade.update.mockResolvedValue({ id: "g1", deletedAt: null });
      const res = await service.restoreGrade("g1", "t1");
      expect(res).toEqual({ id: "g1", deletedAt: null });
    });

    it("paginateGrades: بازگشت items/total/page/pageSize", async () => {
      prisma.grade.findMany.mockResolvedValue([{ id: "g1" }, { id: "g2" }]);
      prisma.grade.count.mockResolvedValue(2);
      const res = await service.paginateGrades({
        tenantId: "t1",
        page: 1,
        pageSize: 2,
        search: "gr",
        includeDeleted: false,
      } as any);
      expect(res).toEqual({
        items: [{ id: "g1" }, { id: "g2" }],
        total: 2,
        page: 1,
        pageSize: 2,
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.grade.findMany).toHaveBeenCalled();
      expect(prisma.grade.count).toHaveBeenCalled();
    });
  });

  // ===== Classrooms =====
  describe("Classrooms", () => {
    it("createClassroom: گرید نامعتبر → BadRequest", async () => {
      prisma.grade.findFirst.mockResolvedValue(null);
      await expect(
        service.createClassroom({
          tenantId: "t1",
          gradeId: "g1",
          name: "C1",
          year: 2025,
        } as any)
      ).rejects.toThrow(
        new BadRequestException("Invalid grade for this tenant")
      );
    });

    it("createClassroom: موفق", async () => {
      prisma.grade.findFirst.mockResolvedValue({ id: "g1" });
      prisma.classroom.create.mockResolvedValue({
        id: "c1",
        tenantId: "t1",
        gradeId: "g1",
        name: "C1",
        code: null,
        year: 2025,
      });
      const res = await service.createClassroom({
        tenantId: "t1",
        gradeId: "g1",
        name: "  C1 ",
        year: 2025,
      } as any);
      expect(res).toMatchObject({
        id: "c1",
        tenantId: "t1",
        gradeId: "g1",
        name: "C1",
        year: 2025,
      });
    });

    it("updateClassroom: پیدا نشدن → NotFound", async () => {
      prisma.classroom.findFirst.mockResolvedValue(null);
      await expect(
        service.updateClassroom({ id: "c1", tenantId: "t1" } as any)
      ).rejects.toThrow(new NotFoundException("Classroom not found"));
    });

    it("updateClassroom: gradeId نامعتبر → BadRequest", async () => {
      prisma.classroom.findFirst.mockResolvedValue({ id: "c1" });
      prisma.grade.findFirst.mockResolvedValue(null);
      await expect(
        service.updateClassroom({
          id: "c1",
          tenantId: "t1",
          gradeId: "gX",
        } as any)
      ).rejects.toThrow(
        new BadRequestException("Invalid grade for this tenant")
      );
    });

    it("updateClassroom: موفق", async () => {
      prisma.classroom.findFirst.mockResolvedValue({ id: "c1" });
      prisma.grade.findFirst.mockResolvedValue({ id: "g1" }); // اگر gradeId ست شده
      prisma.classroom.update.mockResolvedValue({
        id: "c1",
        gradeId: "g1",
        name: "New Name",
        code: "NC",
        year: 2026,
      });
      const res = await service.updateClassroom({
        id: "c1",
        tenantId: "t1",
        gradeId: "g1",
        name: "  New Name ",
        code: "  NC ",
        year: 2026,
      } as any);
      expect(res).toEqual({
        id: "c1",
        gradeId: "g1",
        name: "New Name",
        code: "NC",
        year: 2026,
      });
    });

    it("archiveClassroom: پیدا نشدن → NotFound", async () => {
      prisma.classroom.findFirst.mockResolvedValue(null);
      await expect(service.archiveClassroom("c1", "t1")).rejects.toThrow(
        new NotFoundException("Classroom not found")
      );
    });

    it("archiveClassroom: موفق", async () => {
      prisma.classroom.findFirst.mockResolvedValue({ id: "c1" });
      prisma.classroom.update.mockResolvedValue({
        id: "c1",
        deletedAt: new Date(),
      });
      const res = await service.archiveClassroom("c1", "t1");
      expect(res.id).toBe("c1");
    });

    it("restoreClassroom: پیدا نشدن → NotFound", async () => {
      prisma.classroom.findFirst.mockResolvedValue(null);
      await expect(service.restoreClassroom("c1", "t1")).rejects.toThrow(
        new NotFoundException("Classroom not found")
      );
    });

    it("restoreClassroom: موفق", async () => {
      prisma.classroom.findFirst.mockResolvedValue({ id: "c1" });
      prisma.classroom.update.mockResolvedValue({ id: "c1", deletedAt: null });
      const res = await service.restoreClassroom("c1", "t1");
      expect(res).toEqual({ id: "c1", deletedAt: null });
    });

    it("paginateClassrooms: بازگشت items/total/page/pageSize", async () => {
      prisma.classroom.findMany.mockResolvedValue([{ id: "c1" }]);
      prisma.classroom.count.mockResolvedValue(1);
      const res = await service.paginateClassrooms({
        tenantId: "t1",
        page: 2,
        pageSize: 10,
        search: "c",
        gradeId: "g1",
        includeDeleted: false,
      } as any);
      expect(res).toEqual({
        items: [{ id: "c1" }],
        total: 1,
        page: 2,
        pageSize: 10,
      });
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  // ===== Enrollment =====
  describe("Enrollment", () => {
    it("enrollStudent: کلاس نامعتبر → BadRequest", async () => {
      prisma.$transaction.mockImplementationOnce(async (promises: any[]) => {
        // اولی classroom.findFirst → null
        // دومی user.findFirst → هر چی
        const results = await Promise.all([
          Promise.resolve(null),
          Promise.resolve({ id: "u1" }),
        ]);
        return results;
      });
      await expect(
        service.enrollStudent({
          tenantId: "t1",
          classroomId: "c1",
          studentId: "u1",
        } as any)
      ).rejects.toThrow(
        new BadRequestException("Invalid classroom for this tenant")
      );
    });

    it("enrollStudent: دانش‌آموز در این tenant نیست → BadRequest", async () => {
      prisma.$transaction.mockImplementationOnce(async (promises: any[]) => {
        const results = await Promise.all([
          Promise.resolve({ id: "c1" }),
          Promise.resolve(null),
        ]);
        return results;
      });
      await expect(
        service.enrollStudent({
          tenantId: "t1",
          classroomId: "c1",
          studentId: "uX",
        } as any)
      ).rejects.toThrow(
        new BadRequestException("Student not found in this tenant")
      );
    });

    it("enrollStudent: موفقیت و ساخت enrollment", async () => {
      prisma.$transaction.mockImplementationOnce(async () => [
        { id: "c1" },
        { id: "u1" },
      ]);
      prisma.enrollment.create.mockResolvedValue({
        id: "e1",
        tenantId: "t1",
        classroomId: "c1",
        studentId: "u1",
        startedAt: expect.any(Date),
      });
      const res = await service.enrollStudent({
        tenantId: "t1",
        classroomId: "c1",
        studentId: "u1",
      } as any);
      expect(res.id).toBe("e1");
      expect(prisma.enrollment.create).toHaveBeenCalled();
    });

    it("closeEnrollment: پیدا نشدن → NotFound", async () => {
      prisma.enrollment.findFirst.mockResolvedValue(null);
      await expect(
        service.closeEnrollment({ id: "eX", tenantId: "t1" } as any)
      ).rejects.toThrow(new NotFoundException("Enrollment not found"));
    });

    it("closeEnrollment: endedAt قبل از startedAt → BadRequest", async () => {
      const startedAt = new Date("2025-01-10T00:00:00Z");
      prisma.enrollment.findFirst.mockResolvedValue({ id: "e1", startedAt });
      await expect(
        service.closeEnrollment({
          id: "e1",
          tenantId: "t1",
          endedAt: new Date("2025-01-01T00:00:00Z"),
        } as any)
      ).rejects.toThrow(
        new BadRequestException("endedAt must be after startedAt")
      );
    });

    it("closeEnrollment: موفق", async () => {
      const startedAt = new Date("2025-01-01T00:00:00Z");
      prisma.enrollment.findFirst.mockResolvedValue({ id: "e1", startedAt });
      prisma.enrollment.update.mockResolvedValue({
        id: "e1",
        endedAt: new Date("2025-02-01T00:00:00Z"),
      });
      const res = await service.closeEnrollment({
        id: "e1",
        tenantId: "t1",
        endedAt: new Date("2025-02-01T00:00:00Z"),
      } as any);
      expect(res.id).toBe("e1");
      expect(res.endedAt).toEqual(new Date("2025-02-01T00:00:00Z"));
    });

    it("enrollmentsByClassroom: کلاس ناموجود → NotFound", async () => {
      prisma.classroom.findFirst.mockResolvedValue(null);
      await expect(service.enrollmentsByClassroom("t1", "cX")).rejects.toThrow(
        new NotFoundException("Classroom not found")
      );
    });

    it("enrollmentsByClassroom: موفق → لیست", async () => {
      prisma.classroom.findFirst.mockResolvedValue({ id: "c1" });
      prisma.enrollment.findMany.mockResolvedValue([
        { id: "e1" },
        { id: "e2" },
      ]);
      const res = await service.enrollmentsByClassroom("t1", "c1");
      expect(res).toEqual([{ id: "e1" }, { id: "e2" }]);
      expect(prisma.enrollment.findMany).toHaveBeenCalledWith({
        where: { tenantId: "t1", classroomId: "c1" },
        orderBy: { startedAt: "desc" },
      });
    });
  });
});
