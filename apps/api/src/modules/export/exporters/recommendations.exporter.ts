import { IExporter, ExportData } from "@export/exporters/base.exporter";
import { Prisma, PrismaClient } from "@prisma/client";

export class RecommendationsExporter implements IExporter {
  constructor(
    private prisma: PrismaClient,
    private tenantId: string,
    private params: any
  ) {}

  async fetch(): Promise<ExportData> {
    const and: Prisma.RecommendationWhereInput[] = [
      { tenantId: this.tenantId },
    ];
    if (this.params?.type) and.push({ type: this.params.type });

    const where: Prisma.RecommendationWhereInput = { AND: and };
    const items = await this.prisma.recommendation.findMany({
      where,
      select: {
        id: true,
        resultId: true,
        type: true,
        targetCareerId: true,
        targetMajorId: true,
        confidence: true,
        explainabilityFactors: true,
        rank: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    const headers = [
      "id",
      "resultId",
      "type",
      "targetCareerId",
      "targetMajorId",
      "confidence",
      "rank",
      "explainabilityFactors",
      "createdAt",
    ];
    const rows = items.map((i) => ({
      ...i,
      explainabilityFactors: i.explainabilityFactors
        ? JSON.stringify(i.explainabilityFactors)
        : null,
    }));
    return { headers, rows, filenameBase: `recs_${this.tenantId}` };
  }
}
