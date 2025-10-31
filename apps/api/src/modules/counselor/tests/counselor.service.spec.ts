import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CounselorService } from "@counselor/services/counselor.service";
import { PrismaService } from "@prisma/prisma.service";

class PrismaMock {
  user = { findUnique: jest.fn() };
  counselingSession = {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  };
  $transaction = jest.fn(async (arr: any[]) => Promise.all(arr));
}

describe("CounselorService", () => {
  let service: CounselorService;
  let prisma: PrismaMock;

  const actorCounselor = { id: "C1", role: "COUNSELOR" };
  const actorAdmin = { id: "A1", role: "ADMIN" };
  const tenantId = "t1";

  beforeEach(async () => {
    prisma = new PrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CounselorService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();
    service = module.get<CounselorService>(CounselorService);

    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T10:00:00Z"));
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("schedule()", () => {
    it("creates a session (happy path)", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "any" }); // counselor
      // ensureTenantUser called twice (counselor + student)
      prisma.counselingSession.findFirst.mockResolvedValue(null); // no conflict
      prisma.counselingSession.create.mockResolvedValue({ id: "S1" });

      const input = {
        tenantId,
        counselorId: "C1",
        studentId: "U1",
        scheduledAt: new Date("2025-01-02T09:00:00Z"),
        durationMin: 45,
        notes: JSON.stringify({ a: 1 }),
      } as any;

      const res = await service.schedule(input, actorCounselor);
      expect(res).toEqual({ id: "S1" });
      expect(prisma.counselingSession.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            tenantId,
            counselorId: "C1",
            studentId: "U1",
            durationMin: 45,
          }),
        })
      );
    });

    it("throws on invalid duration", async () => {
      await expect(
        service.schedule(
          {
            tenantId,
            counselorId: "C1",
            studentId: "U1",
            scheduledAt: new Date(),
            durationMin: 0,
          } as any,
          actorCounselor
        )
      ).rejects.toThrow(BadRequestException);
    });

    it("checks conflict and throws", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "any" });
      prisma.counselingSession.findFirst.mockResolvedValue({ id: "exists" });

      await expect(
        service.schedule(
          {
            tenantId,
            counselorId: "C1",
            studentId: "U1",
            scheduledAt: new Date("2025-01-02T09:00:00Z"),
          } as any,
          actorCounselor
        )
      ).rejects.toThrow("Time conflict");
    });

    it("forbids non-owner counselor to write", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "any" });
      await expect(
        service.schedule(
          {
            tenantId,
            counselorId: "OTHER",
            studentId: "U1",
            scheduledAt: new Date(),
          } as any,
          actorCounselor
        )
      ).rejects.toThrow(ForbiddenException);
    });

    it("admin can schedule for any counselor", async () => {
      prisma.user.findUnique.mockResolvedValue({ id: "any" });
      prisma.counselingSession.findFirst.mockResolvedValue(null);
      prisma.counselingSession.create.mockResolvedValue({ id: "S2" });

      const res = await service.schedule(
        {
          tenantId,
          counselorId: "OTHER",
          studentId: "U1",
          scheduledAt: new Date(),
        } as any,
        actorAdmin
      );
      expect(res).toEqual({ id: "S2" });
    });
  });

  describe("reschedule()", () => {
    it("updates time and duration (happy path)", async () => {
      prisma.counselingSession.findFirst
        .mockResolvedValueOnce({ id: "S1", counselorId: "C1" })
        .mockResolvedValueOnce(null);

      prisma.counselingSession.update.mockResolvedValue({ id: "S1" });

      const res = await service.reschedule(
        {
          tenantId,
          id: "S1",
          scheduledAt: new Date("2025-01-05T08:00:00Z"),
          durationMin: 60,
        } as any,
        actorCounselor
      );

      expect(res).toEqual({ id: "S1" });
      expect(prisma.counselingSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "S1" },
          data: expect.objectContaining({
            scheduledAt: expect.any(Date),
            durationMin: 60,
          }),
        })
      );
    });

    it("throws if session not found", async () => {
      prisma.counselingSession.findFirst.mockResolvedValue(null);
      await expect(
        service.reschedule(
          {
            tenantId,
            id: "X",
            scheduledAt: new Date(),
          } as any,
          actorAdmin
        )
      ).rejects.toThrow(NotFoundException);
    });

    it("forbids non-owner counselor", async () => {
      prisma.counselingSession.findFirst.mockResolvedValue({
        id: "S1",
        counselorId: "OTHER",
      });
      await expect(
        service.reschedule(
          {
            tenantId,
            id: "S1",
            scheduledAt: new Date(),
          } as any,
          actorCounselor
        )
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe("updateNotes()", () => {
    it("updates notes", async () => {
      prisma.counselingSession.findFirst.mockResolvedValue({
        id: "S1",
        counselorId: "C1",
      });
      prisma.counselingSession.update.mockResolvedValue({ id: "S1" });

      const res = await service.updateNotes(
        { tenantId, id: "S1", notes: JSON.stringify({ n: 1 }) } as any,
        actorCounselor
      );
      expect(res).toEqual({ id: "S1" });
      expect(prisma.counselingSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { notes: { n: 1 } },
        })
      );
    });
  });

  describe("delete()", () => {
    it("deletes existing", async () => {
      prisma.counselingSession.findFirst.mockResolvedValue({
        id: "S1",
        counselorId: "C1",
      });
      prisma.counselingSession.delete.mockResolvedValue({ id: "S1" });

      const ok = await service.delete(
        { tenantId, id: "S1" } as any,
        actorCounselor
      );
      expect(ok).toBe(true);
      expect(prisma.counselingSession.delete).toHaveBeenCalled();
    });

    it("throws if not found", async () => {
      prisma.counselingSession.findFirst.mockResolvedValue(null);
      await expect(
        service.delete({ tenantId, id: "X" } as any, actorAdmin)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("page()", () => {
    it("returns mapped page (notes stringified)", async () => {
      prisma.counselingSession.findMany.mockResolvedValue([
        { id: "S1", notes: { a: 1 } },
        { id: "S2", notes: null },
      ]);
      prisma.counselingSession.count.mockResolvedValue(2);

      const res = await service.page(
        { tenantId, page: 1, pageSize: 20 } as any,
        actorAdmin
      );
      expect(res.total).toBe(2);
      expect(res.items[0].notes).toBe(JSON.stringify({ a: 1 }));
      expect(res.items[1].notes).toBeNull();
    });

    it("non-privileged user gets filtered to own studentId", async () => {
      const actorStudent = { id: "U1", role: "STUDENT" };
      prisma.counselingSession.findMany.mockResolvedValue([]);
      prisma.counselingSession.count.mockResolvedValue(0);

      await service.page(
        { tenantId, page: 1, pageSize: 10 } as any,
        actorStudent
      );
      expect(prisma.counselingSession.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([
              { tenantId },
              { studentId: actorStudent.id },
            ]),
          }),
        })
      );
    });
  });

  describe("myPage()", () => {
    it("counselor sees own sessions", async () => {
      prisma.counselingSession.findMany.mockResolvedValue([]);
      prisma.counselingSession.count.mockResolvedValue(0);
      await service.myPage({ tenantId } as any, actorCounselor);
      expect(prisma.counselingSession.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            AND: expect.arrayContaining([{ tenantId }, { counselorId: "C1" }]),
          }),
        })
      );
    });

    it("student sees own sessions; supports scope filters", async () => {
      const actorStudent = { id: "U1", role: "STUDENT" };
      prisma.counselingSession.findMany.mockResolvedValue([]);
      prisma.counselingSession.count.mockResolvedValue(0);
      await service.myPage({ tenantId, scope: "past" } as any, actorStudent);
      expect(prisma.counselingSession.findMany).toHaveBeenCalled();
    });
  });

  describe("byId()", () => {
    it("returns session if actor can read", async () => {
      prisma.counselingSession.findFirst.mockResolvedValue({
        id: "S1",
        tenantId,
        counselorId: "C1",
        studentId: "U9",
        notes: { z: 1 },
      });
      const res = await service.byId(tenantId, "S1", actorCounselor);
      expect(res).toEqual(
        expect.objectContaining({ id: "S1", notes: JSON.stringify({ z: 1 }) })
      );
    });

    it("forbids unrelated student", async () => {
      prisma.counselingSession.findFirst.mockResolvedValue({
        id: "S1",
        tenantId,
        counselorId: "C1",
        studentId: "U9",
        notes: null,
      });
      await expect(
        service.byId(tenantId, "S1", { id: "U2", role: "STUDENT" })
      ).rejects.toThrow(ForbiddenException);
    });

    it("throws if not found", async () => {
      prisma.counselingSession.findFirst.mockResolvedValue(null);
      await expect(service.byId(tenantId, "X", actorAdmin)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
