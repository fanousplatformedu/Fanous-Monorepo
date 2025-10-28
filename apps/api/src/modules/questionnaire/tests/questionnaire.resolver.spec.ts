import { QuestionnaireResolver } from "@questionnaire/resolvers/questionnaire.resolver";
import { QuestionnaireService } from "@questionnaire/services/questionnaire.service";
import { Test, TestingModule } from "@nestjs/testing";

describe("QuestionnaireResolver", () => {
  let resolver: QuestionnaireResolver;
  let service: jest.Mocked<QuestionnaireService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionnaireResolver,
        {
          provide: QuestionnaireService,
          useValue: {
            paginateQuestionnaires: jest.fn(),
            createQuestionnaire: jest.fn(),
            updateQuestionnaire: jest.fn(),
            archiveQuestionnaire: jest.fn(),
            restoreQuestionnaire: jest.fn(),
            createVersion: jest.fn(),
            publishVersion: jest.fn(),
            createQuestion: jest.fn(),
            updateQuestion: jest.fn(),
            reorderQuestions: jest.fn(),
            createOption: jest.fn(),
            updateOption: jest.fn(),
            reorderOptions: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get(QuestionnaireResolver);
    service = module.get(QuestionnaireService) as any;
  });

  it("questionnaires → paginateQuestionnaires", async () => {
    (service.paginateQuestionnaires as jest.Mock).mockResolvedValue({
      items: [{ id: "q1" }],
      total: 1,
      page: 1,
      pageSize: 20,
    });
    const res = await resolver.questionnaires({ tenantId: "t1" } as any);
    expect(res).toMatchObject({ total: 1 });
    expect(service.paginateQuestionnaires).toHaveBeenCalledWith({
      tenantId: "t1",
    });
  });

  it("createQuestionnaire → service call", async () => {
    service.createQuestionnaire.mockResolvedValue({ id: "q1" } as any);
    const res = await resolver.createQuestionnaire({ tenantId: "t1" } as any);
    expect(res).toMatchObject({ id: "q1" });
    expect(service.createQuestionnaire).toHaveBeenCalled();
  });

  it("updateQuestionnaire → service call", async () => {
    service.updateQuestionnaire.mockResolvedValue({ id: "q1" } as any);
    const res = await resolver.updateQuestionnaire({ id: "q1" } as any);
    expect(res).toMatchObject({ id: "q1" });
  });

  it("archive/restore Questionnaire → true", async () => {
    service.archiveQuestionnaire.mockResolvedValue({} as any);
    expect(await resolver.archiveQuestionnaire("q1", "t1")).toBe(true);
    expect(service.archiveQuestionnaire).toHaveBeenCalledWith("q1", "t1");

    service.restoreQuestionnaire.mockResolvedValue({} as any);
    expect(await resolver.restoreQuestionnaire("q1", "t1")).toBe(true);
    expect(service.restoreQuestionnaire).toHaveBeenCalledWith("q1", "t1");
  });

  it("create/publish Version → service call", async () => {
    service.createVersion.mockResolvedValue({ id: "v1" } as any);
    const v = await resolver.createAssessmentVersion({} as any);
    expect(v).toMatchObject({ id: "v1" });

    service.publishVersion.mockResolvedValue({
      id: "v1",
      status: "PUBLISHED",
    } as any);
    const pv = await resolver.publishVersion({} as any);
    expect(pv).toMatchObject({ status: "PUBLISHED" });
  });

  it("questions: create/update/reorder → service call/true", async () => {
    service.createQuestion.mockResolvedValue({ id: "qq1" } as any);
    const cq = await resolver.createQuestion({} as any);
    expect(cq).toMatchObject({ id: "qq1" });

    service.updateQuestion.mockResolvedValue({ id: "qq1" } as any);
    const uq = await resolver.updateQuestion({} as any);
    expect(uq).toMatchObject({ id: "qq1" });

    service.reorderQuestions.mockResolvedValue(true as any);
    expect(await resolver.reorderQuestions({} as any)).toBe(true);
  });

  it("options: create/update/reorder → service call/true", async () => {
    service.createOption.mockResolvedValue({ id: "o1" } as any);
    const co = await resolver.createOption({} as any);
    expect(co).toMatchObject({ id: "o1" });

    service.updateOption.mockResolvedValue({ id: "o1" } as any);
    const uo = await resolver.updateOption({} as any);
    expect(uo).toMatchObject({ id: "o1" });

    service.reorderOptions.mockResolvedValue(true as any);
    expect(await resolver.reorderOptions({} as any)).toBe(true);
  });
});
