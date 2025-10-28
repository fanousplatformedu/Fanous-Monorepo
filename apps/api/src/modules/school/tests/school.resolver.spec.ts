import { Test, TestingModule } from "@nestjs/testing";
import { SchoolResolver } from "@school/resolvers/school.resolver";
import { SchoolService } from "@school/services/school.service";

describe("SchoolResolver", () => {
  let resolver: SchoolResolver;
  let service: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolResolver,
        {
          provide: SchoolService,
          useValue: {
            // Grades
            paginateGrades: jest.fn(),
            createGrade: jest.fn(),
            updateGrade: jest.fn(),
            archiveGrade: jest.fn(),
            restoreGrade: jest.fn(),
            // Classrooms
            paginateClassrooms: jest.fn(),
            createClassroom: jest.fn(),
            updateClassroom: jest.fn(),
            archiveClassroom: jest.fn(),
            restoreClassroom: jest.fn(),
            // Enrollments
            enrollmentsByClassroom: jest.fn(),
            enrollStudent: jest.fn(),
            closeEnrollment: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(SchoolResolver);
    service = module.get(SchoolService) as any;

    jest.clearAllMocks();
  });

  // ===== Grades =====
  it("grades → باید paginateGrades را با ورودی فراخوانی کند", async () => {
    service.paginateGrades.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });
    const input = { tenantId: "t1", page: 1, pageSize: 10 };
    const res = await resolver.grades(input as any);
    expect(res).toEqual({ items: [], total: 0, page: 1, pageSize: 10 });
    expect(service.paginateGrades).toHaveBeenCalledWith(input);
  });

  it("createGrade → باید نتیجه createGrade را برگرداند", async () => {
    service.createGrade.mockResolvedValue({ id: "g1" });
    const res = await resolver.createGrade({
      tenantId: "t1",
      name: "G1",
    } as any);
    expect(res).toEqual({ id: "g1" });
    expect(service.createGrade).toHaveBeenCalledWith({
      tenantId: "t1",
      name: "G1",
    });
  });

  it("updateGrade → باید نتیجه updateGrade را برگرداند", async () => {
    service.updateGrade.mockResolvedValue({ id: "g1", name: "New" });
    const res = await resolver.updateGrade({
      id: "g1",
      tenantId: "t1",
      name: "New",
    } as any);
    expect(res).toEqual({ id: "g1", name: "New" });
    expect(service.updateGrade).toHaveBeenCalledWith({
      id: "g1",
      tenantId: "t1",
      name: "New",
    });
  });

  it("archiveGrade → true و سرویس فراخوانی شود", async () => {
    service.archiveGrade.mockResolvedValue(true);
    const res = await resolver.archiveGrade("g1", "t1");
    expect(res).toBe(true);
    expect(service.archiveGrade).toHaveBeenCalledWith("g1", "t1");
  });

  it("restoreGrade → true و سرویس فراخوانی شود", async () => {
    service.restoreGrade.mockResolvedValue(true);
    const res = await resolver.restoreGrade("g1", "t1");
    expect(res).toBe(true);
    expect(service.restoreGrade).toHaveBeenCalledWith("g1", "t1");
  });

  // ===== Classrooms =====
  it("classrooms → باید paginateClassrooms را صدا کند", async () => {
    service.paginateClassrooms.mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });
    const input = { tenantId: "t1", page: 1, pageSize: 10 };
    const res = await resolver.classrooms(input as any);
    expect(res).toEqual({ items: [], total: 0, page: 1, pageSize: 10 });
    expect(service.paginateClassrooms).toHaveBeenCalledWith(input);
  });

  it("createClassroom → نتیجه سرویس", async () => {
    service.createClassroom.mockResolvedValue({ id: "c1" });
    const res = await resolver.createClassroom({
      tenantId: "t1",
      gradeId: "g1",
      name: "C1",
      year: 2025,
    } as any);
    expect(res).toEqual({ id: "c1" });
    expect(service.createClassroom).toHaveBeenCalled();
  });

  it("updateClassroom → نتیجه سرویس", async () => {
    service.updateClassroom.mockResolvedValue({ id: "c1", name: "New" });
    const res = await resolver.updateClassroom({
      id: "c1",
      tenantId: "t1",
      name: "New",
    } as any);
    expect(res).toEqual({ id: "c1", name: "New" });
    expect(service.updateClassroom).toHaveBeenCalled();
  });

  it("archiveClassroom → true", async () => {
    service.archiveClassroom.mockResolvedValue(true);
    const res = await resolver.archiveClassroom("c1", "t1");
    expect(res).toBe(true);
    expect(service.archiveClassroom).toHaveBeenCalledWith("c1", "t1");
  });

  it("restoreClassroom → true", async () => {
    service.restoreClassroom.mockResolvedValue(true);
    const res = await resolver.restoreClassroom("c1", "t1");
    expect(res).toBe(true);
    expect(service.restoreClassroom).toHaveBeenCalledWith("c1", "t1");
  });

  // ===== Enrollments =====
  it("enrollmentsByClassroom → نتیجه سرویس", async () => {
    service.enrollmentsByClassroom.mockResolvedValue([{ id: "e1" }]);
    const res = await resolver.enrollmentsByClassroom("t1", "c1");
    expect(res).toEqual([{ id: "e1" }]);
    expect(service.enrollmentsByClassroom).toHaveBeenCalledWith("t1", "c1");
  });

  it("enrollStudent → نتیجه سرویس", async () => {
    service.enrollStudent.mockResolvedValue({ id: "e1" });
    const res = await resolver.enrollStudent({
      tenantId: "t1",
      classroomId: "c1",
      studentId: "u1",
    } as any);
    expect(res).toEqual({ id: "e1" });
    expect(service.enrollStudent).toHaveBeenCalled();
  });

  it("closeEnrollment → نتیجه سرویس", async () => {
    service.closeEnrollment.mockResolvedValue({
      id: "e1",
      endedAt: new Date(),
    });
    const res = await resolver.closeEnrollment({
      id: "e1",
      tenantId: "t1",
    } as any);
    expect(res.id).toBe("e1");
    expect(service.closeEnrollment).toHaveBeenCalled();
  });
});
