import { ConsentStatus, ConsentType, Role, TenantRole } from "@prisma/client";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { ConsentService } from "../services/consent.service";

const makePrismaMock = () => ({
  consent: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  parentLink: {
    findFirst: jest.fn(),
  },
  $transaction: jest.fn(),
});

type Actor = { id: string; role: Role };

describe("ConsentService", () => {
  let service: ConsentService;
  let prisma: ReturnType<typeof makePrismaMock>;

  const now = new Date();

  const baseConsent = {
    id: "c1",
    userId: "u1",
    tenantId: "t1",
    type: ConsentType.PRIVACY,
    status: ConsentStatus.GIVEN,
    data: { optIn: true },
    createdAt: now,
    updatedAt: now,
  };

  const admin: Actor = { id: "admin1", role: Role.SUPER_ADMIN };
  const schoolAdmin: Actor = {
    id: "sa1",
    role: TenantRole.SCHOOL_ADMIN as unknown as Role,
  };
  const counselor: Actor = { id: "co1", role: Role.COUNSELOR };
  const parent: Actor = { id: "p1", role: Role.PARENT };
  const student: Actor = { id: "s1", role: Role.STUDENT };

  beforeEach(() => {
    prisma = makePrismaMock();
    service = new ConsentService(prisma as any);
    jest.clearAllMocks();
  });

  describe("myConsents", () => {
    it("returns consents for the actor and stringifies data", async () => {
      prisma.consent.findMany.mockResolvedValueOnce([
        baseConsent,
        { ...baseConsent, id: "c2", data: null },
      ]);

      const res = await service.myConsents("t1", {
        id: "u1",
        role: Role.STUDENT,
      });

      expect(prisma.consent.findMany).toHaveBeenCalledWith({
        where: { tenantId: "t1", userId: "u1" },
        orderBy: { createdAt: "desc" },
      });
      expect(res).toEqual([
        expect.objectContaining({
          id: "c1",
          data: JSON.stringify({ optIn: true }),
        }),
        expect.objectContaining({ id: "c2", data: null }),
      ]);
    });
  });

  describe("userConsents", () => {
    it("allows self access", async () => {
      prisma.consent.findMany.mockResolvedValueOnce([baseConsent]);

      const res = await service.userConsents("t1", "s1", {
        id: "s1",
        role: Role.STUDENT,
      });
      expect(prisma.consent.findMany).toHaveBeenCalledWith({
        where: { tenantId: "t1", userId: "s1" },
        orderBy: { createdAt: "desc" },
      });
      expect(res[0].id).toBe("c1");
    });

    it("allows parent if parentLink exists", async () => {
      prisma.parentLink.findFirst.mockResolvedValueOnce({ id: "pl1" });
      prisma.consent.findMany.mockResolvedValueOnce([baseConsent]);

      const res = await service.userConsents("t1", "child1", parent);
      expect(prisma.parentLink.findFirst).toHaveBeenCalledWith({
        where: { parentId: "p1", childId: "child1", tenantId: "t1" },
        select: { id: true },
      });
      expect(res.length).toBe(1);
    });

    it("denies parent without link", async () => {
      prisma.parentLink.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.userConsents("t1", "child1", parent)
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("allows tenant readers (admin/counselor)", async () => {
      prisma.consent.findMany.mockResolvedValueOnce([baseConsent]);

      await service.userConsents("t1", "uX", counselor);
      expect(prisma.consent.findMany).toHaveBeenCalled();
    });

    it("forbids others", async () => {
      await expect(
        service.userConsents("t1", "uX", student)
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("searchConsents", () => {
    const page = 2;
    const pageSize = 10;

    it("forbids when actor cannot read tenant", async () => {
      await expect(
        service.searchConsents({ tenantId: "t1", page, pageSize }, student)
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("builds where with relation filter when q is present", async () => {
      prisma.$transaction.mockImplementation(async (ops: any[]) => {
        const [findMany, count] = ops;
        const items = await findMany;
        const total = await count;
        return [items, total];
      });

      prisma.consent.findMany.mockResolvedValueOnce([baseConsent]);
      prisma.consent.count.mockResolvedValueOnce(1);

      const res = await service.searchConsents(
        { tenantId: "t1", q: "ali", page, pageSize },
        counselor
      );

      expect(prisma.consent.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          AND: expect.arrayContaining([{ tenantId: "t1" }]),
          user: {
            is: {
              OR: [
                { name: { contains: "ali", mode: "insensitive" } },
                { email: { contains: "ali", mode: "insensitive" } },
              ],
            },
          },
        }),
        orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      expect(prisma.consent.count).toHaveBeenCalledWith({
        where: expect.any(Object),
      });
      expect(res.total).toBe(1);
      expect(res.items[0].id).toBe("c1");
    });

    it("builds where without relation filter when q is empty", async () => {
      prisma.$transaction.mockImplementation(async (ops: any[]) => [[], 0]);

      await service.searchConsents(
        {
          tenantId: "t1",
          userId: "u2",
          type: ConsentType.PRIVACY,
          status: ConsentStatus.GIVEN,
          page,
          pageSize,
        },
        admin
      );

      const call = prisma.consent.findMany.mock.calls[0][0];
      expect(call.where).toEqual({
        AND: [
          { tenantId: "t1" },
          { userId: "u2" },
          { type: ConsentType.PRIVACY },
          { status: ConsentStatus.GIVEN },
        ],
      });
    });
  });

  describe("setConsent", () => {
    const inputBase = {
      tenantId: "t1",
      type: ConsentType.PRIVACY,
      status: ConsentStatus.GIVEN,
    };

    it("updates existing consent (self)", async () => {
      prisma.consent.findFirst.mockResolvedValueOnce(baseConsent);
      prisma.consent.update.mockResolvedValueOnce({
        ...baseConsent,
        status: ConsentStatus.REVOKED,
        data: null,
      });

      const res = await service.setConsent(
        { ...inputBase, data: undefined },
        { id: "u1", role: Role.STUDENT }
      );

      expect(prisma.consent.update).toHaveBeenCalledWith({
        where: { id: "c1" },
        data: { status: ConsentStatus.GIVEN, data: null },
      });
      expect(res.status).toBe(ConsentStatus.REVOKED);
    });

    it("creates new consent if not existing", async () => {
      prisma.consent.findFirst.mockResolvedValueOnce(null);
      prisma.consent.create.mockResolvedValueOnce(baseConsent);

      const res = await service.setConsent(
        { ...inputBase, data: JSON.stringify({ foo: 1 }) },
        { id: "u1", role: Role.STUDENT }
      );
      expect(prisma.consent.create).toHaveBeenCalledWith({
        data: {
          tenantId: "t1",
          userId: "u1",
          type: ConsentType.PRIVACY,
          status: ConsentStatus.GIVEN,
          data: { foo: 1 },
        },
      });
      expect(res.id).toBe("c1");
    });

    it("throws on invalid JSON", async () => {
      await expect(
        service.setConsent(
          { ...inputBase, data: "{bad", userId: "u1" },
          { id: "u1", role: Role.STUDENT }
        )
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it("allows parent for child if link exists", async () => {
      prisma.parentLink.findFirst.mockResolvedValueOnce({ id: "pl1" });
      prisma.consent.findFirst.mockResolvedValueOnce(null);
      prisma.consent.create.mockResolvedValueOnce(baseConsent);

      await service.setConsent({ ...inputBase, userId: "child1" }, parent);

      expect(prisma.parentLink.findFirst).toHaveBeenCalledWith({
        where: { parentId: "p1", childId: "child1", tenantId: "t1" },
        select: { id: true },
      });
      expect(prisma.consent.create).toHaveBeenCalled();
    });

    it("forbids non-writer editing other users (no parent)", async () => {
      await expect(
        service.setConsent({ ...inputBase, userId: "other" }, student)
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("allows SCHOOL_ADMIN editing other users", async () => {
      prisma.consent.findFirst.mockResolvedValueOnce(null);
      prisma.consent.create.mockResolvedValueOnce({
        ...baseConsent,
        userId: "other",
      });

      await service.setConsent({ ...inputBase, userId: "other" }, schoolAdmin);
      expect(prisma.consent.create).toHaveBeenCalled();
    });
  });

  describe("revokeConsent", () => {
    it("sets status to REVOKED", async () => {
      prisma.consent.findFirst.mockResolvedValueOnce(baseConsent);
      prisma.consent.update.mockResolvedValueOnce({
        ...baseConsent,
        status: ConsentStatus.REVOKED,
      });

      const res = await service.revokeConsent(
        { tenantId: "t1", type: ConsentType.PRIVACY },
        { id: "u1", role: Role.STUDENT }
      );

      expect(prisma.consent.update).toHaveBeenCalledWith({
        where: { id: "c1" },
        data: { status: "REVOKED" as any },
      });
      expect(res.status).toBe(ConsentStatus.REVOKED);
    });

    it("throws NotFound when no consent", async () => {
      prisma.consent.findFirst.mockResolvedValueOnce(null);

      await expect(
        service.revokeConsent(
          { tenantId: "t1", type: ConsentType.PRIVACY },
          { id: "u1", role: Role.STUDENT }
        )
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it("enforces writer permissions for other users", async () => {
      await expect(
        service.revokeConsent(
          { tenantId: "t1", userId: "other", type: ConsentType.PRIVACY },
          student
        )
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe("deleteConsent", () => {
    it("forbids non-writers", async () => {
      await expect(
        service.deleteConsent("cid", student)
      ).rejects.toBeInstanceOf(ForbiddenException);
    });

    it("throws NotFound if consent not found", async () => {
      prisma.consent.findUnique.mockResolvedValueOnce(null);

      await expect(service.deleteConsent("cid", admin)).rejects.toBeInstanceOf(
        NotFoundException
      );
    });

    it("deletes and returns true", async () => {
      prisma.consent.findUnique.mockResolvedValueOnce({ id: "cid" });
      prisma.consent.delete.mockResolvedValueOnce({ id: "cid" } as any);

      const res = await service.deleteConsent("cid", schoolAdmin);
      expect(prisma.consent.delete).toHaveBeenCalledWith({
        where: { id: "cid" },
      });
      expect(res).toBe(true);
    });
  });
});
