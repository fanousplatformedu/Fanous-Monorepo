import { Injectable, NotFoundException } from "@nestjs/common";
import { RunScoringStrictInput } from "@scoring/dto/run-scoring.input";
import { RecomputeTenantInput } from "@scoring/dto/recompute-tenant.input";
import { Prisma, QuestionType } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";
import { PreviewScoringInput } from "@scoring/dto/preview-scoring.input";
import { PrismaService } from "@prisma/prisma.service";

type ByQuestion = Record<string, number>;
type MetricAgg = Record<string, { raw: number; totalWeight: number }>;

type InterpretationRuleSet = {
  normalization?: {
    metric?: string;
    min?: number;
    max?: number;
    scale?: number;
  };
  thresholds?: Array<{
    metric: string;
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
    label: string;
  }>;
  labels?: Record<string, Array<{ min?: number; max?: number; label: string }>>; // labels per metric
};

@Injectable()
export class ScoringService {
  constructor(private prismaService: PrismaService) {}

  private computeFromResponses(params: {
    responses: Array<{ questionId: string; value: any }>;
    questions: Array<{ id: string; type: QuestionType; configJson: any }>;
    options: Array<{
      questionId: string;
      value: string;
      weight: number | null;
    }>;
    interpretation?: InterpretationRuleSet | null;
  }) {
    const { responses, questions, options, interpretation } = params;
    const qById = new Map(questions.map((q) => [q.id, q]));
    const optMap = new Map<string, Array<{ value: string; weight: number }>>();
    for (const o of options) {
      const arr = optMap.get(o.questionId) ?? [];
      arr.push({ value: o.value, weight: o.weight ?? 0 });
      optMap.set(o.questionId, arr);
    }

    let totalWeightRaw = 0;
    const byQuestion: ByQuestion = {};
    const metrics: MetricAgg = {};
    for (const r of responses) {
      const q = qById.get(r.questionId);
      if (!q) continue;
      const cfg = (q.configJson ?? {}) as any;
      const metricKey = typeof cfg.metric === "string" ? cfg.metric : undefined;
      const metricWeight = Number.isFinite(+cfg.metricWeight)
        ? Number(cfg.metricWeight)
        : 1;
      const opts = optMap.get(r.questionId) ?? [];
      const v = r.value as any;
      let scoreQ = 0;
      switch (q.type) {
        case "SINGLE_CHOICE": {
          const chosen = v?.value ?? v;
          const found = opts.find((o) => o.value === String(chosen));
          scoreQ = found?.weight ?? 0;
          break;
        }
        case "MULTIPLE_CHOICE": {
          const arr = Array.isArray(v) ? v : (v?.values ?? []);
          for (const chosen of arr) {
            const found = opts.find((o) => o.value === String(chosen));
            if (found) scoreQ += found.weight ?? 0;
          }
          break;
        }
        case "SCALE": {
          const num = typeof v === "number" ? v : Number(v?.value ?? v);
          scoreQ = Number.isFinite(num) ? num : 0;
          break;
        }
        case "MATRIX": {
          const entries = Array.isArray(v) ? v : (v?.entries ?? []);
          for (const e of entries) {
            const found = opts.find((o) => o.value === String(e?.value ?? e));
            if (found) scoreQ += found.weight ?? 0;
          }
          break;
        }
        case "TEXT":
        default:
          scoreQ = 0;
      }

      byQuestion[r.questionId] = scoreQ;
      totalWeightRaw += scoreQ;
      if (metricKey) {
        const bucket = metrics[metricKey] ?? { raw: 0, totalWeight: 0 };
        bucket.raw += scoreQ * metricWeight;
        bucket.totalWeight += Math.max(1, metricWeight);
        metrics[metricKey] = bucket;
      }
    }

    const computedMetrics: Array<{
      key: string;
      raw: number;
      value: number;
      label?: string;
    }> = [];
    for (const [key, agg] of Object.entries(metrics)) {
      const avg = agg.raw / Math.max(1, agg.totalWeight);
      const { value, label } = this.applyInterpretation(
        key,
        avg,
        interpretation
      );
      computedMetrics.push({ key, raw: avg, value, label });
    }
    const totalInterp = this.applyInterpretation(
      "total_weight",
      totalWeightRaw,
      interpretation
    );
    computedMetrics.push({
      key: "total_weight",
      raw: totalWeightRaw,
      value: totalInterp.value,
      label: totalInterp.label,
    });
    return { byQuestion, computedMetrics };
  }

  private applyInterpretation(
    metric: string,
    raw: number,
    rules?: InterpretationRuleSet | null
  ) {
    if (!rules) return { value: raw, label: undefined as string | undefined };
    let value = raw;
    let label: string | undefined;
    const n = rules.normalization;
    if (n) {
      if (!n.metric || n.metric === metric) {
        const min = Number.isFinite(+n.min!) ? +n.min! : 0;
        const max = Number.isFinite(+n.max!) ? +n.max! : 100;
        const scale = Number.isFinite(+n.scale!) ? +n.scale! : 100;
        if (max > min) {
          const ratio = (raw - min) / (max - min);
          value = Math.max(0, Math.min(scale, ratio * scale));
        }
      }
    }
    const lm = rules.labels?.[metric];
    if (lm && Array.isArray(lm)) {
      for (const r of lm) {
        const okMin = r.min === undefined || value >= r.min;
        const okMax = r.max === undefined || value < r.max;
        if (okMin && okMax) {
          label = r.label;
          break;
        }
      }
    }
    if (!label && Array.isArray(rules.thresholds)) {
      for (const t of rules.thresholds) {
        if (t.metric !== metric) continue;
        const gt = t.gt !== undefined ? value > t.gt : true;
        const gte = t.gte !== undefined ? value >= t.gte : true;
        const lt = t.lt !== undefined ? value < t.lt : true;
        const lte = t.lte !== undefined ? value <= t.lte : true;
        if (gt && gte && lt && lte) {
          label = t.label;
          break;
        }
      }
    }
    return { value, label };
  }

  // =========== PUBLIC APIS ===========
  async preview(input: PreviewScoringInput) {
    const a = await this.prismaService.assessment.findFirst({
      where: { id: input.assessmentId, tenantId: input.tenantId },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    if (!a.submittedAt)
      throw new BadRequestException("Assessment must be submitted first");
    const { responses, version } = await this.prismaService.$transaction(
      async (tx) => {
        const responses = await tx.response.findMany({
          where: { assessmentId: a.id, tenantId: input.tenantId },
          select: { questionId: true, value: true },
        });
        const version = a.versionId
          ? await tx.assessmentVersion.findFirst({
              where: { id: a.versionId, tenantId: input.tenantId },
            })
          : null;
        return { responses, version };
      }
    );

    const qIds: string[] = Array.from(
      new Set(responses.map((r) => r.questionId))
    );

    const questions = await this.prismaService.question.findMany({
      where: { id: { in: qIds }, tenantId: input.tenantId },
      select: { id: true, type: true, configJson: true },
    });
    const options = await this.prismaService.option.findMany({
      where: { questionId: { in: qIds }, tenantId: input.tenantId },
      select: { questionId: true, value: true, weight: true },
    });
    const interpretation =
      version?.interpretationJson as any as InterpretationRuleSet | null;
    const { byQuestion, computedMetrics } = this.computeFromResponses({
      responses,
      questions,
      options,
      interpretation,
    });
    const scoresJson = {
      metrics: Object.fromEntries(
        computedMetrics.map((m) => [
          m.key,
          { value: m.value, raw: m.raw, label: m.label ?? null },
        ])
      ),
      byQuestion,
    };
    const summaryJson = {
      submittedAt: a.submittedAt,
      questionsAnswered: responses.length,
    };
    return {
      assessmentId: a.id,
      tenantId: input.tenantId,
      summaryJson: JSON.stringify(summaryJson),
      scoresJson: JSON.stringify(scoresJson),
      metrics: computedMetrics.map((m) => ({
        key: m.key,
        value: m.value,
        raw: m.raw,
        label: m.label ?? null,
      })),
    };
  }

  async runStrict(input: RunScoringStrictInput) {
    const a = await this.prismaService.assessment.findFirst({
      where: { id: input.assessmentId, tenantId: input.tenantId },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    if (!a.submittedAt)
      throw new BadRequestException("Assessment must be submitted first");
    const { responses, version } = await this.prismaService.$transaction(
      async (tx) => {
        const responses = await tx.response.findMany({
          where: { assessmentId: a.id, tenantId: input.tenantId },
          select: { questionId: true, value: true },
        });
        const version = a.versionId
          ? await tx.assessmentVersion.findFirst({
              where: { id: a.versionId, tenantId: input.tenantId },
            })
          : null;
        return { responses, version };
      }
    );

    const qIds: string[] = Array.from(
      new Set(responses.map((r) => r.questionId))
    );

    const { questions, options } = await this.prismaService.$transaction(
      async (tx) => {
        const questions = await tx.question.findMany({
          where: { id: { in: qIds }, tenantId: input.tenantId },
          select: { id: true, type: true, configJson: true },
        });
        const options = await tx.option.findMany({
          where: { questionId: { in: qIds }, tenantId: input.tenantId },
          select: { questionId: true, value: true, weight: true },
        });
        return { questions, options };
      }
    );

    const interpretation =
      version?.interpretationJson as any as InterpretationRuleSet | null;
    const { byQuestion, computedMetrics } = this.computeFromResponses({
      responses,
      questions,
      options,
      interpretation,
    });

    const scoresJson = {
      metrics: Object.fromEntries(
        computedMetrics.map((m) => [
          m.key,
          { value: m.value, raw: m.raw, label: m.label ?? null },
        ])
      ),
      byQuestion,
    };
    const summaryJson = {
      submittedAt: a.submittedAt,
      questionsAnswered: responses.length,
    };

    await this.prismaService.$transaction(async (tx) => {
      if (input.overwrite !== false) {
        await tx.score.deleteMany({
          where: { tenantId: input.tenantId, assessmentId: a.id },
        });
      }
      for (const m of computedMetrics) {
        await tx.score.create({
          data: {
            tenantId: input.tenantId,
            assessmentId: a.id,
            metric: m.key,
            value: m.value,
            weight: 1,
            meta: { raw: m.raw, label: m.label ?? null },
          },
        });
      }
      const existing = await tx.resultSnapshot.findUnique({
        where: { assessmentId: a.id },
      });
      if (!existing) {
        await tx.resultSnapshot.create({
          data: {
            tenantId: input.tenantId,
            assessmentId: a.id,
            userId: a.userId,
            summaryJson: summaryJson as any,
            scoresJson: scoresJson as any,
          },
        });
      } else {
        await tx.resultSnapshot.update({
          where: { assessmentId: a.id },
          data: {
            summaryJson: summaryJson as any,
            scoresJson: scoresJson as any,
          },
        });
      }
      await tx.assessment.update({
        where: { id: a.id },
        data: { state: "SCORED", scoredAt: new Date() },
      });
    });
    return true as const;
  }

  async recomputeTenant(input: RecomputeTenantInput) {
    const { tenantId, batchSize = 100 } = input;
    let cursor: string | undefined = undefined;
    let processed = 0;
    for (;;) {
      const items = await this.prismaService.assessment.findMany({
        where: { tenantId, submittedAt: { not: null } },
        select: { id: true },
        take: batchSize,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        orderBy: { id: "asc" },
      });
      if (!items.length) break;
      for (const a of items) {
        await this.runStrict({ tenantId, assessmentId: a.id, overwrite: true });
        processed++;
      }
      cursor = items[items.length - 1].id;
    }
    return { tenantId, processed };
  }

  async scoreAssessment({
    tenantId,
    assessmentId,
    options,
  }: {
    tenantId: string;
    assessmentId: string;
    options?: { overwrite?: boolean };
  }) {
    const overwrite = options?.overwrite ?? true;
    return this.runStrict({ tenantId, assessmentId, overwrite });
  }
}
