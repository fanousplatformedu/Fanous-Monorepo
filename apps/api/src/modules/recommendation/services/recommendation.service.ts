import { Injectable, NotFoundException } from "@nestjs/common";
import { BadRequestException } from "@nestjs/common";
import { RecommendationType } from "@prisma/client";
import { PrismaService } from "@prisma/prisma.service";
import { PreviewRecommendationsInput } from "../dto/preview-recommendations.input";
import { GenerateRecommendationsInput } from "../dto/generate-recommendations.input";
import { ListRecommendationsInput } from "../dto/list-recommendations.input";
import { DeleteRecommendationInput } from "../dto/delete-recommendation.input";

type RankExplain = {
  skill: string;
  weight: number;
  metric: number;
  contrib: number;
};
type RankItem = { id: string; score: number; explain: RankExplain[] };
type MetricMap = Record<string, number>;
type InterpretationMap = {
  metricToSkill?: Record<string, string>;
};

@Injectable()
export class RecommendationService {
  constructor(private prisma: PrismaService) {}

  private extractMetrics(
    scoresJson: any,
    interpretation?: any
  ): { metrics: MetricMap; interp: InterpretationMap } {
    const m: MetricMap = {};
    const metricsObj = scoresJson?.metrics ?? {};
    for (const [k, v] of Object.entries(metricsObj)) {
      const val = (v as any)?.value ?? (v as any);
      const num = Number(val);
      if (Number.isFinite(num)) m[k] = num;
    }
    const interp: InterpretationMap = {
      metricToSkill: interpretation?.metricToSkill ?? undefined,
    };
    return { metrics: m, interp };
  }

  private metricForSkill(
    skillCode: string,
    metrics: MetricMap,
    map?: Record<string, string>
  ) {
    if (map) {
      for (const [metric, code] of Object.entries(map)) {
        if (code === skillCode && metrics[metric] !== undefined)
          return metrics[metric];
      }
    }
    if (metrics[skillCode] !== undefined) return metrics[skillCode];
    return 0;
  }

  private async computeCareerRankings(
    tenantId: string,
    metrics: MetricMap,
    interpretation?: InterpretationMap
  ) {
    const careers = await this.prisma.career.findMany({
      select: {
        id: true,
        title: true,
        meta: true,
        careerSkills: {
          select: {
            skillId: true,
            weight: true,
            skill: { select: { code: true } },
          },
        },
      },
    });

    const results: RankItem[] = [];
    for (const c of careers) {
      let score = 0;
      const expl: RankExplain[] = [];
      for (const cs of c.careerSkills) {
        const code = cs.skill.code;
        const mval = this.metricForSkill(
          code,
          metrics,
          interpretation?.metricToSkill
        );
        const w = cs.weight ?? 0;
        const contrib = mval * w;
        if (contrib)
          expl.push({ skill: code, weight: w, metric: mval, contrib });
        score += contrib;
      }
      results.push({ id: c.id, score, explain: expl });
    }
    const max = Math.max(1, ...results.map((r) => r.score));
    for (const r of results) r.score = r.score / max;
    results.sort((a, b) => b.score - a.score);
    return results;
  }

  private async computeMajorRankings(
    tenantId: string,
    metrics: MetricMap,
    interpretation?: InterpretationMap
  ) {
    const majors = await this.prisma.major.findMany({
      select: {
        id: true,
        title: true,
        meta: true,
        majorSkills: {
          select: {
            skillId: true,
            weight: true,
            skill: { select: { code: true } },
          },
        },
      },
    });

    const results: RankItem[] = [];
    for (const m of majors) {
      let score = 0;
      const expl: RankExplain[] = [];
      for (const ms of m.majorSkills) {
        const code = ms.skill.code;
        const mval = this.metricForSkill(
          code,
          metrics,
          interpretation?.metricToSkill
        );
        const w = ms.weight ?? 0;
        const contrib = mval * w;
        if (contrib)
          expl.push({ skill: code, weight: w, metric: mval, contrib });
        score += contrib;
      }
      results.push({ id: m.id, score, explain: expl });
    }
    const max = Math.max(1, ...results.map((r) => r.score));
    for (const r of results) r.score = r.score / max;
    results.sort((a, b) => b.score - a.score);
    return results;
  }

  private computeLearningTargets(metrics: MetricMap, topK = 5) {
    const pairs = Object.entries(metrics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK);
    return pairs.map(([skillCode, value]) => ({ skillCode, score: value }));
  }

  // =========== Public API ============
  async preview(input: PreviewRecommendationsInput) {
    const a = await this.prisma.assessment.findFirst({
      where: { id: input.assessmentId, tenantId: input.tenantId },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    const result = await this.prisma.resultSnapshot.findFirst({
      where: { tenantId: input.tenantId, assessmentId: a.id },
    });
    if (!result)
      throw new BadRequestException(
        "Run scoring first (ResultSnapshot not found)"
      );
    const version = a.versionId
      ? await this.prisma.assessmentVersion.findFirst({
          where: { id: a.versionId, tenantId: input.tenantId },
        })
      : null;

    const scoresJson = result.scoresJson as any;
    const { metrics, interp } = this.extractMetrics(
      scoresJson,
      version?.interpretationJson
    );

    const types = input.types?.length
      ? input.types
      : [RecommendationType.CAREER, RecommendationType.MAJOR];
    const topN = input.topN ?? 10;

    const payload: any = {
      assessmentId: a.id,
      resultId: result.id,
      tenantId: input.tenantId,
      items: [] as any[],
    };

    if (types.includes("CAREER" as any)) {
      const ranks = await this.computeCareerRankings(
        input.tenantId,
        metrics,
        interp
      );
      payload.items.push({
        type: "CAREER",
        top: ranks.slice(0, topN).map((r) => ({
          targetCareerId: r.id,
          confidence: r.score,
          explainabilityFactors: r.explain,
        })),
      });
    }

    if (types.includes("MAJOR" as any)) {
      const ranks = await this.computeMajorRankings(
        input.tenantId,
        metrics,
        interp
      );
      payload.items.push({
        type: "MAJOR",
        top: ranks.slice(0, topN).map((r) => ({
          targetMajorId: r.id,
          confidence: r.score,
          explainabilityFactors: r.explain,
        })),
      });
    }

    if (types.includes("LEARNING" as any)) {
      const targets = this.computeLearningTargets(metrics, Math.min(10, topN));
      payload.items.push({
        type: "LEARNING",
        top: targets.map((t) => ({
          targetJson: { kind: "skill", code: t.skillCode, score: t.score },
          confidence: t.score / 100,
          explainabilityFactors: [{ skill: t.skillCode, score: t.score }],
        })),
      });
    }

    return {
      tenantId: input.tenantId,
      assessmentId: a.id,
      resultId: result.id,
      previewJson: JSON.stringify(payload),
    };
  }

  async generate(input: GenerateRecommendationsInput) {
    const a = await this.prisma.assessment.findFirst({
      where: { id: input.assessmentId, tenantId: input.tenantId },
    });
    if (!a) throw new NotFoundException("Assessment not found");
    const result = await this.prisma.resultSnapshot.findFirst({
      where: { tenantId: input.tenantId, assessmentId: a.id },
    });
    if (!result)
      throw new BadRequestException(
        "Run scoring first (ResultSnapshot not found)"
      );
    const version = a.versionId
      ? await this.prisma.assessmentVersion.findFirst({
          where: { id: a.versionId, tenantId: input.tenantId },
        })
      : null;
    const scoresJson = result.scoresJson as any;
    const { metrics, interp } = this.extractMetrics(
      scoresJson,
      version?.interpretationJson
    );

    const types = input.types?.length
      ? input.types
      : [RecommendationType.CAREER, RecommendationType.MAJOR];
    const topN = input.topN ?? 10;
    const minConf = input.minConfidence ?? 0;

    if (input.overwrite !== false) {
      await this.prisma.recommendation.deleteMany({
        where: {
          tenantId: input.tenantId,
          resultId: result.id,
          type: { in: types as any },
        },
      });
    }

    const dataToCreate: any[] = [];
    if (types.includes("CAREER" as any)) {
      const ranks = await this.computeCareerRankings(
        input.tenantId,
        metrics,
        interp
      );
      for (const r of ranks.slice(0, topN)) {
        if (r.score < minConf) continue;
        dataToCreate.push({
          tenantId: input.tenantId,
          resultId: result.id,
          type: "CAREER",
          targetCareerId: r.id,
          confidence: r.score,
          explainabilityFactors: r.explain,
        });
      }
    }

    if (types.includes("MAJOR" as any)) {
      const ranks = await this.computeMajorRankings(
        input.tenantId,
        metrics,
        interp
      );
      for (const r of ranks.slice(0, topN)) {
        if (r.score < minConf) continue;
        dataToCreate.push({
          tenantId: input.tenantId,
          resultId: result.id,
          type: "MAJOR",
          targetMajorId: r.id,
          confidence: r.score,
          explainabilityFactors: r.explain,
        });
      }
    }

    if (types.includes("LEARNING" as any)) {
      const targets = this.computeLearningTargets(metrics, Math.min(10, topN));
      for (const t of targets) {
        const conf = t.score / 100;
        if (conf < minConf) continue;
        dataToCreate.push({
          tenantId: input.tenantId,
          resultId: result.id,
          type: "LEARNING",
          targetJson: {
            kind: "skill",
            code: t.skillCode,
            score: t.score,
          } as any,
          confidence: conf,
          explainabilityFactors: [{ skill: t.skillCode, score: t.score }],
        });
      }
    }

    if (!dataToCreate.length) return { created: 0 };

    await this.prisma.$transaction(async (tx) => {
      for (const d of dataToCreate) {
        await tx.recommendation.create({
          data: {
            tenantId: d.tenantId,
            resultId: d.resultId,
            type: d.type as any,
            targetCareerId: d.targetCareerId ?? null,
            targetMajorId: d.targetMajorId ?? null,
            targetJson: d.targetJson ?? null,
            confidence: d.confidence ?? null,
            explainabilityFactors: d.explainabilityFactors ?? null,
          },
        });
      }
    });

    return { created: dataToCreate.length };
  }

  async list(input: ListRecommendationsInput) {
    let resultId = input.resultId;
    if (!resultId && input.assessmentId) {
      const rs = await this.prisma.resultSnapshot.findFirst({
        where: { tenantId: input.tenantId, assessmentId: input.assessmentId },
        select: { id: true },
      });
      if (!rs)
        throw new NotFoundException("ResultSnapshot not found for assessment");
      resultId = rs.id;
    }
    if (!resultId)
      throw new BadRequestException("resultId or assessmentId is required");
    const where: any = { tenantId: input.tenantId, resultId };
    if (input.type) where.type = input.type;
    const page = input.page ?? 1;
    const pageSize = input.pageSize ?? 20;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.recommendation.findMany({
        where,
        orderBy: [{ confidence: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.recommendation.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async deleteOne(input: DeleteRecommendationInput) {
    const rec = await this.prisma.recommendation.findFirst({
      where: { id: input.id, tenantId: input.tenantId },
      select: { id: true },
    });
    if (!rec) throw new NotFoundException("Recommendation not found");
    await this.prisma.recommendation.delete({ where: { id: rec.id } });
    return true as const;
  }
}
