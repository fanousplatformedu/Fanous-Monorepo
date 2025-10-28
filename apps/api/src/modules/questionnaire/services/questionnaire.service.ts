import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateAssessmentVersionInput } from "@questionnaire/dto/create-version.input";
import { UpdateQuestionnaireInput } from "@questionnaire/dto/create-questionnaire.input";
import { CreateQuestionnaireInput } from "@questionnaire/dto/create-questionnaire.input";
import { QuestionnairePageInput } from "@questionnaire/dto/paginate-questionnaire.input";
import { Prisma, VersionStatus } from "@prisma/client";
import { ReorderQuestionsInput } from "@questionnaire/dto/reorder-questions.input";
import { UpdateQuestionInput } from "@questionnaire/dto/create-question.input";
import { BadRequestException } from "@nestjs/common";
import { ReorderOptionsInput } from "@questionnaire/dto/reorder-options.input";
import { CreateQuestionInput } from "@questionnaire/dto/create-question.input";
import { PublishVersionInput } from "@questionnaire/dto/publish-version.input";
import { UpdateOptionInput } from "@questionnaire/dto/create-option.input";
import { CreateOptionInput } from "@questionnaire/dto/create-option.input";
import { PrismaService } from "@prisma/prisma.service";

@Injectable()
export class QuestionnaireService {
  constructor(private prisma: PrismaService) {}

  // ========== Questionnaire ==========
  async createQuestionnaire(input: CreateQuestionnaireInput) {
    await this.ensureQCodeUnique(input.tenantId, input.code);
    return this.prisma.questionnaire.create({
      data: {
        tenantId: input.tenantId,
        code: input.code.trim(),
        title: JSON.parse(input.title),
        description: input.description ? JSON.parse(input.description) : null,
        defaultLang: input.defaultLang,
      },
    });
  }

  async updateQuestionnaire(input: UpdateQuestionnaireInput) {
    const q = await this.prisma.questionnaire.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!q) throw new NotFoundException("Questionnaire not found");
    if (input.code && input.code !== q.code)
      await this.ensureQCodeUnique(input.tenantId, input.code);
    return this.prisma.questionnaire.update({
      where: { id: q.id },
      data: {
        ...(input.code ? { code: input.code.trim() } : {}),
        ...(input.title !== undefined
          ? { title: input.title ? JSON.parse(input.title) : null }
          : {}),
        ...(input.description !== undefined
          ? {
              description: input.description
                ? JSON.parse(input.description)
                : null,
            }
          : {}),
        ...(input.defaultLang !== undefined
          ? { defaultLang: input.defaultLang }
          : {}),
      },
    });
  }

  async archiveQuestionnaire(id: string, tenantId: string) {
    const q = await this.prisma.questionnaire.findFirst({
      where: { id, tenantId },
    });
    if (!q) throw new NotFoundException("Questionnaire not found");
    return this.prisma.questionnaire.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restoreQuestionnaire(id: string, tenantId: string) {
    const q = await this.prisma.questionnaire.findFirst({
      where: { id, tenantId },
    });
    if (!q) throw new NotFoundException("Questionnaire not found");
    return this.prisma.questionnaire.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async paginateQuestionnaires(input: QuestionnairePageInput) {
    const { tenantId, page = 1, pageSize = 20, search, includeDeleted } = input;
    const and: Prisma.QuestionnaireWhereInput[] = [{ tenantId }];
    if (search && search.trim()) {
      and.push({
        OR: [{ code: { contains: search, mode: "insensitive" } }],
      });
    }
    if (!includeDeleted) and.push({ deletedAt: null });
    const where: Prisma.QuestionnaireWhereInput = and.length
      ? { AND: and }
      : { tenantId };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.questionnaire.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.questionnaire.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  private async ensureQCodeUnique(tenantId: string, code: string) {
    const exists = await this.prisma.questionnaire.findFirst({
      where: { tenantId, code: code.trim() },
      select: { id: true },
    });
    if (exists)
      throw new BadRequestException("Questionnaire code already exists");
  }

  // ========== Versioning ==========
  async createVersion(input: CreateAssessmentVersionInput) {
    const q = await this.prisma.questionnaire.findFirst({
      where: { id: input.questionnaireId, tenantId: input.tenantId },
      select: { id: true },
    });
    if (!q) throw new NotFoundException("Questionnaire not found");
    const last = await this.prisma.assessmentVersion.findFirst({
      where: { questionnaireId: input.questionnaireId },
      orderBy: { versionNumber: "desc" },
      select: { versionNumber: true },
    });
    const nextVersion = (last?.versionNumber ?? 0) + 1;
    return this.prisma.assessmentVersion.create({
      data: {
        tenantId: input.tenantId,
        questionnaireId: input.questionnaireId,
        versionNumber: nextVersion,
        status: "DRAFT",
        changelog: input.changelog ?? null,
        interpretationJson: input.interpretationJson
          ? JSON.parse(input.interpretationJson)
          : null,
      },
    });
  }

  async publishVersion(input: PublishVersionInput) {
    const v = await this.prisma.assessmentVersion.findFirst({
      where: { id: input.versionId, tenantId: input.tenantId },
    });
    if (!v) throw new NotFoundException("Version not found");
    if (v.status === VersionStatus.PUBLISHED) return v;
    await this.prisma.assessmentVersion.updateMany({
      where: {
        questionnaireId: v.questionnaireId,
        tenantId: input.tenantId,
        status: VersionStatus.PUBLISHED,
      },
      data: { status: VersionStatus.ARCHIVED },
    });
    return this.prisma.assessmentVersion.update({
      where: { id: v.id },
      data: { status: VersionStatus.PUBLISHED, publishedAt: new Date() },
    });
  }

  // ========== Questions ==========
  async createQuestion(input: CreateQuestionInput) {
    let order = input.order ?? 0;
    if (input.order === undefined) {
      const max = await this.prisma.question.aggregate({
        where: {
          questionnaireId: input.questionnaireId,
          tenantId: input.tenantId,
        },
        _max: { order: true },
      });
      order = (max._max.order ?? -1) + 1;
    }
    return this.prisma.question.create({
      data: {
        tenantId: input.tenantId,
        questionnaireId: input.questionnaireId,
        type: input.type,
        code: input.code?.trim() ?? null,
        text: JSON.parse(input.text),
        helpText: input.helpText ? JSON.parse(input.helpText) : null,
        order,
        required: input.required ?? true,
        configJson: input.configJson ? JSON.parse(input.configJson) : null,
      },
    });
  }

  async updateQuestion(input: UpdateQuestionInput) {
    const q = await this.prisma.question.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!q) throw new NotFoundException("Question not found");
    return this.prisma.question.update({
      where: { id: q.id },
      data: {
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.code !== undefined
          ? { code: input.code?.trim() ?? null }
          : {}),
        ...(input.text !== undefined
          ? { text: input.text ? JSON.parse(input.text) : null }
          : {}),
        ...(input.helpText !== undefined
          ? { helpText: input.helpText ? JSON.parse(input.helpText) : null }
          : {}),
        ...(input.order !== undefined ? { order: input.order } : {}),
        ...(input.required !== undefined ? { required: input.required } : {}),
        ...(input.configJson !== undefined
          ? {
              configJson: input.configJson
                ? JSON.parse(input.configJson)
                : null,
            }
          : {}),
      },
    });
  }

  async reorderQuestions(input: ReorderQuestionsInput) {
    const items: Array<{ id: string; order: number }> = JSON.parse(
      input.itemsJson
    );
    if (!Array.isArray(items))
      throw new BadRequestException("Invalid itemsJson");
    const ids = items.map((i) => i.id);
    const qs = await this.prisma.question.findMany({
      where: {
        id: { in: ids },
        tenantId: input.tenantId,
        questionnaireId: input.questionnaireId,
      },
      select: { id: true },
    });
    if (qs.length !== ids.length)
      throw new BadRequestException(
        "One or more questions not found in this questionnaire"
      );
    await this.prisma.$transaction(
      items.map(({ id, order }) =>
        this.prisma.question.update({ where: { id }, data: { order } })
      )
    );
    return true as const;
  }

  // ========== Options ==========
  async createOption(input: CreateOptionInput) {
    let order = input.order ?? 0;
    if (input.order === undefined) {
      const max = await this.prisma.option.aggregate({
        where: { questionId: input.questionId, tenantId: input.tenantId },
        _max: { order: true },
      });
      order = (max._max.order ?? -1) + 1;
    }
    const question = await this.prisma.question.findFirst({
      where: { id: input.questionId, tenantId: input.tenantId },
      select: { id: true },
    });
    if (!question)
      throw new BadRequestException("Invalid question for this tenant");
    return this.prisma.option.create({
      data: {
        tenantId: input.tenantId,
        questionId: input.questionId,
        text: JSON.parse(input.text),
        value: input.value,
        weight: input.weight ?? null,
        order,
      },
    });
  }

  async updateOption(input: UpdateOptionInput) {
    const opt = await this.prisma.option.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
    });
    if (!opt) throw new NotFoundException("Option not found");
    return this.prisma.option.update({
      where: { id: opt.id },
      data: {
        ...(input.text !== undefined
          ? { text: input.text ? JSON.parse(input.text) : null }
          : {}),
        ...(input.value !== undefined ? { value: input.value } : {}),
        ...(input.weight !== undefined ? { weight: input.weight } : {}),
        ...(input.order !== undefined ? { order: input.order } : {}),
      },
    });
  }

  async reorderOptions(input: ReorderOptionsInput) {
    const items: Array<{ id: string; order: number }> = JSON.parse(
      input.itemsJson
    );
    if (!Array.isArray(items))
      throw new BadRequestException("Invalid itemsJson");
    const ids = items.map((i) => i.id);
    const opts = await this.prisma.option.findMany({
      where: { id: { in: ids }, tenantId: input.tenantId },
      select: { id: true, questionId: true },
    });
    if (opts.length !== ids.length)
      throw new BadRequestException("One or more options not found");
    const qIds = new Set(opts.map((o) => o.questionId));
    if (qIds.size > 1)
      throw new BadRequestException("Options belong to different questions");
    await this.prisma.$transaction(
      items.map(({ id, order }) =>
        this.prisma.option.update({ where: { id }, data: { order } })
      )
    );
    return true as const;
  }
}
