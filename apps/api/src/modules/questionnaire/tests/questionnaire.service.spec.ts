import { BadRequestException, NotFoundException } from "@nestjs/common";
import { QuestionnaireService } from "@questionnaire/services/questionnaire.service";
import { PrismaService } from "@prisma/prisma.service";
import { VersionStatus } from "@prisma/client";

const mkPrisma = () => {
  const prisma: any = {
    questionnaire: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    assessmentVersion: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    question: {
      aggregate: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    option: {
      aggregate: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn((ops: any[]) => {
      if (Array.isArray(ops)) {
        return Promise.all(
          ops.map((op) => (typeof op === "function" ? op() : op))
        );
      }
      return Promise.resolve([]);
    }),
  };
  return prisma as PrismaService;
};

describe("QuestionnaireService", () => {
  let service: QuestionnaireService;
  let prisma: any;

  beforeEach(() => {
    jest.resetAllMocks();
    prisma = mkPrisma();
    service = new QuestionnaireService(prisma);
  });

  // ========== Questionnaire ==========
  it("createQuestionnaire: باید JSONها را parse کند و یکتایی کد را چک کند", async () => {
    prisma.questionnaire.findFirst.mockResolvedValue(null);
    prisma.questionnaire.create.mockResolvedValue({
      id: "q1",
      tenantId: "t1",
      code: "CODE-1",
      title: { fa: "عنوان" },
      description: { fa: "توضیح" },
      defaultLang: "FA",
    } as any);

    const res = await service.createQuestionnaire({
      tenantId: "t1",
      code: "CODE-1",
      title: JSON.stringify({ fa: "عنوان" }),
      description: JSON.stringify({ fa: "توضیح" }),
      defaultLang: "FA",
    } as any);

    expect(res).toMatchObject({ id: "q1", code: "CODE-1" });
    expect(prisma.questionnaire.findFirst).toHaveBeenCalledWith({
      where: { tenantId: "t1", code: "CODE-1" },
      select: { id: true },
    });
    expect(prisma.questionnaire.create).toHaveBeenCalledWith({
      data: {
        tenantId: "t1",
        code: "CODE-1",
        title: { fa: "عنوان" },
        description: { fa: "توضیح" },
        defaultLang: "FA",
      },
    });
  });

  it("createQuestionnaire: اگر کد موجود باشد خطا می‌دهد", async () => {
    prisma.questionnaire.findFirst.mockResolvedValue({ id: "dup" } as any);
    await expect(
      service.createQuestionnaire({
        tenantId: "t1",
        code: "CODE-1",
        title: "{}",
        defaultLang: "FA",
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("updateQuestionnaire: پیدا نکند → NotFound", async () => {
    prisma.questionnaire.findFirst.mockResolvedValue(null);
    await expect(
      service.updateQuestionnaire({
        id: "q1",
        tenantId: "t1",
        code: "NEW",
      } as any)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updateQuestionnaire: تغییر کد → بررسی یکتا و بروزرسانی فیلدها", async () => {
    prisma.questionnaire.findFirst
      .mockResolvedValueOnce({ id: "q1", code: "OLD" } as any) // query by id+tenant
      .mockResolvedValueOnce(null); // ensure unique for NEW
    prisma.questionnaire.update.mockResolvedValue({
      id: "q1",
      code: "NEW",
      title: { a: 1 },
      description: null,
      defaultLang: "EN",
    } as any);

    const res = await service.updateQuestionnaire({
      id: "q1",
      tenantId: "t1",
      code: "NEW",
      title: JSON.stringify({ a: 1 }),
      description: null,
      defaultLang: "EN",
    } as any);

    expect(res).toMatchObject({ id: "q1", code: "NEW" });
    expect(prisma.questionnaire.update).toHaveBeenCalledWith({
      where: { id: "q1" },
      data: {
        code: "NEW",
        title: { a: 1 },
        description: null,
        defaultLang: "EN",
      },
    });
  });

  it("archive/restore Questionnaire: مسیر صحیح و NotFound", async () => {
    prisma.questionnaire.findFirst.mockResolvedValueOnce({ id: "q1" } as any);
    prisma.questionnaire.update.mockResolvedValue({ id: "q1" } as any);
    await service.archiveQuestionnaire("q1", "t1");
    expect(prisma.questionnaire.update).toHaveBeenCalledWith({
      where: { id: "q1" },
      data: { deletedAt: expect.any(Date) },
    });

    prisma.questionnaire.findFirst.mockResolvedValueOnce({ id: "q1" } as any);
    prisma.questionnaire.update.mockResolvedValue({ id: "q1" } as any);
    await service.restoreQuestionnaire("q1", "t1");
    expect(prisma.questionnaire.update).toHaveBeenCalledWith({
      where: { id: "q1" },
      data: { deletedAt: null },
    });

    prisma.questionnaire.findFirst.mockResolvedValueOnce(null as any);
    await expect(
      service.archiveQuestionnaire("x", "t1")
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("paginateQuestionnaires: برگرداندن آیتم‌ها و total از تراکنش", async () => {
    prisma.questionnaire.findMany.mockResolvedValue([{ id: "q1" }] as any);
    prisma.questionnaire.count.mockResolvedValue(1 as any);

    const res = await service.paginateQuestionnaires({
      tenantId: "t1",
      page: 2,
      pageSize: 10,
      search: "code",
      includeDeleted: false,
    } as any);

    expect(res).toEqual({
      items: [{ id: "q1" }],
      total: 1,
      page: 2,
      pageSize: 10,
    });
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  // ========== Versioning ==========
  it("createVersion: اگر پرسشنامه نباشد NotFound", async () => {
    prisma.questionnaire.findFirst.mockResolvedValue(null as any);
    await expect(
      service.createVersion({
        tenantId: "t1",
        questionnaireId: "q1",
      } as any)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("createVersion: شماره نسخه بعدی و create", async () => {
    prisma.questionnaire.findFirst.mockResolvedValue({ id: "q1" } as any);
    prisma.assessmentVersion.findFirst.mockResolvedValue({
      versionNumber: 2,
    } as any);
    prisma.assessmentVersion.create.mockResolvedValue({
      id: "v3",
      versionNumber: 3,
      status: "DRAFT",
    } as any);

    const res = await service.createVersion({
      tenantId: "t1",
      questionnaireId: "q1",
      changelog: "log",
      interpretationJson: JSON.stringify({ k: 1 }),
    } as any);

    expect(res).toMatchObject({ id: "v3", versionNumber: 3 });
    expect(prisma.assessmentVersion.create).toHaveBeenCalledWith({
      data: {
        tenantId: "t1",
        questionnaireId: "q1",
        versionNumber: 3,
        status: "DRAFT",
        changelog: "log",
        interpretationJson: { k: 1 },
      },
    });
  });

  it("publishVersion: اگر نسخه منتشر شده باشد همان را برگرداند؛ در غیر اینصورت آرشیو قبلی‌ها و publish", async () => {
    prisma.assessmentVersion.findFirst.mockResolvedValueOnce({
      id: "v1",
      questionnaireId: "q1",
      tenantId: "t1",
      status: VersionStatus.PUBLISHED,
    } as any);
    const same = await service.publishVersion({
      tenantId: "t1",
      versionId: "v1",
    } as any);
    expect(same.status).toBe(VersionStatus.PUBLISHED);
    prisma.assessmentVersion.findFirst.mockResolvedValueOnce({
      id: "v2",
      questionnaireId: "q1",
      tenantId: "t1",
      status: VersionStatus.DRAFT,
    } as any);
    prisma.assessmentVersion.updateMany.mockResolvedValue({} as any);
    prisma.assessmentVersion.update.mockResolvedValue({
      id: "v2",
      status: VersionStatus.PUBLISHED,
    } as any);

    const res = await service.publishVersion({
      tenantId: "t1",
      versionId: "v2",
    } as any);

    expect(prisma.assessmentVersion.updateMany).toHaveBeenCalledWith({
      where: {
        questionnaireId: "q1",
        tenantId: "t1",
        status: VersionStatus.PUBLISHED,
      },
      data: { status: VersionStatus.ARCHIVED },
    });
    expect(res).toMatchObject({ id: "v2", status: VersionStatus.PUBLISHED });
  });

  it("publishVersion: نسخه پیدا نشود → NotFound", async () => {
    prisma.assessmentVersion.findFirst.mockResolvedValue(null as any);
    await expect(
      service.publishVersion({ tenantId: "t1", versionId: "x" } as any)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  // ========== Questions ==========
  it("createQuestion: وقتی order داده نشود از max+1 استفاده کند", async () => {
    prisma.question.aggregate.mockResolvedValue({ _max: { order: 4 } } as any);
    prisma.question.create.mockResolvedValue({
      id: "qq1",
      order: 5,
    } as any);
    const res = await service.createQuestion({
      tenantId: "t1",
      questionnaireId: "q1",
      type: "TEXT",
      text: JSON.stringify({ fa: "سؤال" }),
    } as any);
    expect(res).toMatchObject({ id: "qq1", order: 5 });
    expect(prisma.question.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ order: 5, required: true }),
    });
  });

  it("updateQuestion: اگر پیدا نشود NotFound", async () => {
    prisma.question.findFirst.mockResolvedValue(null as any);
    await expect(
      service.updateQuestion({ id: "qq1", tenantId: "t1" } as any)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updateQuestion: پارس JSON اختیاری و trim کد", async () => {
    prisma.question.findFirst.mockResolvedValue({ id: "qq1" } as any);
    prisma.question.update.mockResolvedValue({
      id: "qq1",
      code: "C",
      text: { fa: "t" },
      helpText: null,
      order: 3,
      required: false,
    } as any);

    const res = await service.updateQuestion({
      id: "qq1",
      tenantId: "t1",
      code: "  C ",
      text: JSON.stringify({ fa: "t" }),
      helpText: null,
      order: 3,
      required: false,
    } as any);

    expect(res).toMatchObject({ id: "qq1", code: "C", required: false });
    expect(prisma.question.update).toHaveBeenCalledWith({
      where: { id: "qq1" },
      data: expect.objectContaining({
        code: "C",
        text: { fa: "t" },
        helpText: null,
        order: 3,
        required: false,
      }),
    });
  });

  it("reorderQuestions: اعتبارسنجی itemsJson و مالکیت سؤالات", async () => {
    await expect(
      service.reorderQuestions({
        tenantId: "t1",
        questionnaireId: "q1",
        itemsJson: JSON.stringify({ bad: true }),
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);

    const items = [
      { id: "a", order: 1 },
      { id: "b", order: 2 },
    ];
    prisma.question.findMany.mockResolvedValue([{ id: "a" }] as any);
    await expect(
      service.reorderQuestions({
        tenantId: "t1",
        questionnaireId: "q1",
        itemsJson: JSON.stringify(items),
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);

    prisma.question.findMany.mockResolvedValue([
      { id: "a" },
      { id: "b" },
    ] as any);
    prisma.$transaction.mockResolvedValue([{}, {}] as any);
    await expect(
      service.reorderQuestions({
        tenantId: "t1",
        questionnaireId: "q1",
        itemsJson: JSON.stringify(items),
      } as any)
    ).resolves.toBe(true);
  });

  // ========== Options ==========
  it("createOption: اگر order داده نشود از max+1 و سؤال معتبر باشد", async () => {
    prisma.option.aggregate.mockResolvedValue({ _max: { order: 0 } } as any);
    prisma.question.findFirst.mockResolvedValue({ id: "qq1" } as any);
    prisma.option.create.mockResolvedValue({ id: "opt1", order: 1 } as any);

    const res = await service.createOption({
      tenantId: "t1",
      questionId: "qq1",
      text: JSON.stringify({ fa: "گزینه" }),
      value: "V",
      weight: 0.5,
    } as any);

    expect(res).toMatchObject({ id: "opt1", order: 1 });
    expect(prisma.option.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        text: { fa: "گزینه" },
        value: "V",
        weight: 0.5,
        order: 1,
      }),
    });
  });

  it("createOption: سؤال معتبر نباشد → BadRequest", async () => {
    prisma.option.aggregate.mockResolvedValue({ _max: { order: null } } as any);
    prisma.question.findFirst.mockResolvedValue(null as any);
    await expect(
      service.createOption({
        tenantId: "t1",
        questionId: "bad",
        text: "{}",
        value: "v",
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("updateOption: پیدا نشود → NotFound", async () => {
    prisma.option.findFirst.mockResolvedValue(null as any);
    await expect(
      service.updateOption({ id: "o1", tenantId: "t1" } as any)
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updateOption: تغییر فیلدهای اختیاری و JSON", async () => {
    prisma.option.findFirst.mockResolvedValue({ id: "o1" } as any);
    prisma.option.update.mockResolvedValue({
      id: "o1",
      value: "NV",
      text: { t: 1 },
      weight: 1,
      order: 3,
    } as any);

    const res = await service.updateOption({
      id: "o1",
      tenantId: "t1",
      value: "NV",
      text: JSON.stringify({ t: 1 }),
      weight: 1,
      order: 3,
    } as any);

    expect(res).toMatchObject({ id: "o1", value: "NV", order: 3 });
    expect(prisma.option.update).toHaveBeenCalledWith({
      where: { id: "o1" },
      data: expect.objectContaining({
        value: "NV",
        text: { t: 1 },
        weight: 1,
        order: 3,
      }),
    });
  });

  it("reorderOptions: باید همه متعلق به یک سؤال باشند و همه پیدا شوند", async () => {
    // bad json
    await expect(
      service.reorderOptions({
        tenantId: "t1",
        itemsJson: JSON.stringify({ bad: true }),
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);

    const items = [
      { id: "o1", order: 1 },
      { id: "o2", order: 2 },
    ];

    // missing one option
    prisma.option.findMany.mockResolvedValue([
      { id: "o1", questionId: "qq1" },
    ] as any);
    await expect(
      service.reorderOptions({
        tenantId: "t1",
        itemsJson: JSON.stringify(items),
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);

    // different questionIds
    prisma.option.findMany.mockResolvedValue([
      { id: "o1", questionId: "qA" },
      { id: "o2", questionId: "qB" },
    ] as any);
    await expect(
      service.reorderOptions({
        tenantId: "t1",
        itemsJson: JSON.stringify(items),
      } as any)
    ).rejects.toBeInstanceOf(BadRequestException);

    // ok
    prisma.option.findMany.mockResolvedValue([
      { id: "o1", questionId: "qA" },
      { id: "o2", questionId: "qA" },
    ] as any);
    prisma.$transaction.mockResolvedValue([{}, {}] as any);
    await expect(
      service.reorderOptions({
        tenantId: "t1",
        itemsJson: JSON.stringify(items),
      } as any)
    ).resolves.toBe(true);
  });
});
