import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, AssessmentState } from "@prisma/client";
import { SaveResponsesBulkInput } from "@assessment/dto/save-responses-bulk.input";
import { SubmitAssessmentInput } from "@assessment/dto/submit-assessment.input";
import { StartAssessmentInput } from "@assessment/dto/start-assessment.input";
import { AssessmentsPageInput } from "@assessment/dto/paginate-assessments.input";
import { AssessmentsByMeInput } from "@assessment/dto/assessments-by-user.input";
import { SaveResponseInput } from "@assessment/dto/save-response.input";
import { RunScoringInput } from "@assessment/dto/run-scoring.input";
import { PrismaService } from "@prisma/prisma.service";

@Injectable()
export class AssessmentService {
  constructor(private prismaService: PrismaService) {}

  // ===== Helpers =====
  private ensureStudentAccessOrThrow(
    resourceUserId: string,
    actorId: string,
    actorRole?: string
  ) {
    if (resourceUserId !== actorId)
      throw new ForbiddenException("Access denied");
  }

  // ===== Start / Get =====
  async start(input: StartAssessmentInput, actorUserId: string) {
    if (input.assignmentId) {
      const asg = await this.prismaService.assignment.findFirst({
        where: { id: input.assignmentId, tenantId: input.tenantId },
        select: { id: true, questionnaireId: true },
      });
      if (!asg) throw new BadRequestException("Invalid assignment for tenant");
    }

    if (input.versionId) {
      const ver = await this.prismaService.assessmentVersion.findFirst({
        where: { id: input.versionId, tenantId: input.tenantId },
        select: { id: true },
      });
      if (!ver) throw new BadRequestException("Invalid version for tenant");
    }

    return this.prismaService.assessment.create({
      data: {
        tenantId: input.tenantId,
        userId: actorUserId,
        assignmentId: input.assignmentId ?? null,
        versionId: input.versionId ?? null,
        language: input.language ?? "FA",
        state: "IN_PROGRESS",
        startedAt: new Date(),
      },
    });
  }

  async getById(tenantId: string, assessmentId: string) {
    const a = await this.prismaService.assessment.findFirst({
      where: { id: assessmentId, tenantId },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    return a;
  }

  // ===== Responses =====
  async saveResponse(input: SaveResponseInput, actorUserId: string) {
    const a = await this.prismaService.assessment.findFirst({
      where: { id: input.assessmentId, tenantId: input.tenantId },
      select: { id: true, userId: true, state: true },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    if (a.state !== AssessmentState.IN_PROGRESS)
      throw new BadRequestException("Assessment is not editable");
    this.ensureStudentAccessOrThrow(a.userId, actorUserId);
  }

  async saveResponsesBulk(input: SaveResponsesBulkInput, actorUserId: string) {
    const a = await this.prismaService.assessment.findFirst({
      where: { id: input.assessmentId, tenantId: input.tenantId },
      select: { id: true, userId: true, state: true },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    if (a.state !== AssessmentState.IN_PROGRESS)
      throw new BadRequestException("Assessment is not editable");
    this.ensureStudentAccessOrThrow(a.userId, actorUserId);
  }

  // ===== Submit =====
  async submit(input: SubmitAssessmentInput, actorUserId: string) {
    const a = await this.prismaService.assessment.findFirst({
      where: { id: input.assessmentId, tenantId: input.tenantId },
      select: { id: true, userId: true, state: true, submittedAt: true },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    this.ensureStudentAccessOrThrow(a.userId, actorUserId);
    if (a.state !== AssessmentState.IN_PROGRESS)
      throw new BadRequestException("Assessment cannot be submitted");
    return this.prismaService.assessment.update({
      where: { id: a.id },
      data: { submittedAt: new Date(), state: "SUBMITTED" },
    });
  }

  // ===== Scoring =====
  async runScoring(input: RunScoringInput) {
    const a = await this.prismaService.assessment.findFirst({
      where: { id: input.assessmentId, tenantId: input.tenantId },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    if (!a.submittedAt)
      throw new BadRequestException(
        "Assessment must be submitted before scoring"
      );
    const [responses, questions] = await this.prismaService.$transaction([
      this.prismaService.response.findMany({
        where: { assessmentId: a.id, tenantId: input.tenantId },
        select: { id: true, questionId: true, value: true },
      }),
      this.prismaService.question.findMany({
        where: { tenantId: input.tenantId, questionnaireId: undefined as any }, // ما به همهٔ سوالات نیاز نداریم؛ از questionId ها می‌خوانیم
      }),
    ]);

    const qIds = Array.from(new Set(responses.map((r) => r.questionId)));
    const qs = await this.prismaService.question.findMany({
      where: { id: { in: qIds }, tenantId: input.tenantId },
      select: { id: true, type: true, configJson: true },
    });
    const opts = await this.prismaService.option.findMany({
      where: { questionId: { in: qIds }, tenantId: input.tenantId },
      select: { id: true, questionId: true, value: true, weight: true },
    });
    const qById = new Map(qs.map((q) => [q.id, q]));
    const optByQ = new Map<
      string,
      { value: string; weight: number | null }[]
    >();
    for (const o of opts) {
      const arr = optByQ.get(o.questionId) ?? [];
      arr.push({ value: o.value, weight: o.weight ?? 0 });
      optByQ.set(o.questionId, arr);
    }

    let total = 0;
    const byQuestion: Record<string, number> = {};
    for (const r of responses) {
      const q = qById.get(r.questionId);
      if (!q) continue;
      const options = optByQ.get(r.questionId) ?? [];
      const v = r.value as any;

      let scoreQ = 0;
      switch (q.type) {
        case "SINGLE_CHOICE": {
          const chosen = v?.value ?? v;
          const found = options.find((o) => o.value === String(chosen));
          scoreQ = found?.weight ?? 0;
          break;
        }
        case "MULTIPLE_CHOICE": {
          const arr = Array.isArray(v) ? v : (v?.values ?? []);
          for (const chosen of arr) {
            const found = options.find((o) => o.value === String(chosen));
            if (found) scoreQ += found.weight ?? 0;
          }
          break;
        }
        case "SCALE": {
          const num = typeof v === "number" ? v : Number(v?.value ?? v);
          scoreQ = Number.isFinite(num) ? num : 0;
          break;
        }
        case "TEXT": {
          scoreQ = 0;
          break;
        }
        case "MATRIX": {
          const entries = Array.isArray(v) ? v : (v?.entries ?? []);
          for (const e of entries) {
            const found = options.find(
              (o) => o.value === String(e?.value ?? e)
            );
            if (found) scoreQ += found.weight ?? 0;
          }
          break;
        }
        default:
          scoreQ = 0;
      }
      byQuestion[r.questionId] = scoreQ;
      total += scoreQ;
    }
    const scoresJson = { total_weight: total, byQuestion };
    const summaryJson = {
      submittedAt: a.submittedAt,
      answeredCount: responses.length,
    };
    await this.prismaService.$transaction([
      this.prismaService.score.deleteMany({
        where: { tenantId: input.tenantId, assessmentId: a.id },
      }),
      this.prismaService.score.create({
        data: {
          tenantId: input.tenantId,
          assessmentId: a.id,
          metric: "total_weight",
          value: total,
          weight: 1,
          meta: scoresJson,
        },
      }),
    ]);

    const existing = await this.prismaService.resultSnapshot.findUnique({
      where: { assessmentId: a.id },
      select: { id: true },
    });

    if (!existing) {
      await this.prismaService.resultSnapshot.create({
        data: {
          tenantId: input.tenantId,
          assessmentId: a.id,
          userId: a.userId,
          summaryJson: summaryJson as any,
          scoresJson: scoresJson as any,
        },
      });
    } else {
      await this.prismaService.resultSnapshot.update({
        where: { assessmentId: a.id },
        data: {
          summaryJson: summaryJson as any,
          scoresJson: scoresJson as any,
        },
      });
    }
    const updated = await this.prismaService.assessment.update({
      where: { id: a.id },
      data: { state: "SCORED", scoredAt: new Date() },
    });
    return updated;
  }

  // ===== Queries =====
  async page(input: AssessmentsPageInput) {
    const { tenantId, userId, state, page = 1, pageSize = 20 } = input;
    const and: Prisma.AssessmentWhereInput[] = [{ tenantId }];
    if (userId) and.push({ userId });
    if (state) and.push({ state });
    const where: Prisma.AssessmentWhereInput = { AND: and };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.assessment.findMany({
        where,
        orderBy: [{ startedAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.assessment.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async pageByMe(input: AssessmentsByMeInput, actorUserId: string) {
    const { tenantId, page = 1, pageSize = 20 } = input;
    const where: Prisma.AssessmentWhereInput = {
      tenantId,
      userId: actorUserId,
    };
    const [items, total] = await this.prismaService.$transaction([
      this.prismaService.assessment.findMany({
        where,
        orderBy: [{ startedAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prismaService.assessment.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async getResult(tenantId: string, assessmentId: string) {
    const r = await this.prismaService.resultSnapshot.findFirst({
      where: { tenantId, assessmentId },
    });
    if (!r) throw new NotFoundException("Result not found");
    return r;
  }

  async getScores(tenantId: string, assessmentId: string) {
    return this.prismaService.score.findMany({
      where: { tenantId, assessmentId },
      orderBy: { createdAt: "asc" },
    });
  }

  async getResponses(tenantId: string, assessmentId: string) {
    return this.prismaService.response.findMany({
      where: { tenantId, assessmentId },
      orderBy: { createdAt: "asc" },
    });
  }
}
