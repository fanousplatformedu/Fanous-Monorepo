import { IExporter, ExportData } from "@export/exporters/base.exporter";
import { PrismaClient } from "@prisma/client";

export class ResultsExporter implements IExporter {
  constructor(
    private prisma: PrismaClient,
    private tenantId: string,
    private params: any
  ) {}

  async fetch(): Promise<ExportData> {
    const items = await this.prisma.resultSnapshot.findMany({
      where: { tenantId: this.tenantId },
      select: {
        id: true,
        assessmentId: true,
        userId: true,
        createdAt: true,
        scoresJson: true,
        summaryJson: true,
      },
      orderBy: [{ createdAt: "desc" }],
    });

    const headers = [
      "id",
      "assessmentId",
      "userId",
      "createdAt",
      "scoresJson",
      "summaryJson",
    ];
    const rows = items.map((i) => ({
      ...i,
      scoresJson: JSON.stringify(i.scoresJson),
      summaryJson: JSON.stringify(i.summaryJson),
    }));

    return { headers, rows, filenameBase: `results_${this.tenantId}` };
  }
}
