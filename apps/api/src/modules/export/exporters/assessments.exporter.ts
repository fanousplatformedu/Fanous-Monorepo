import { IExporter, ExportData } from "@export/exporters/base.exporter";
import { Prisma, PrismaClient } from "@prisma/client";

export class AssessmentsExporter implements IExporter {
  constructor(
    private prisma: PrismaClient,
    private tenantId: string,
    private params: any
  ) {}

  async fetch(): Promise<ExportData> {
    const and: Prisma.AssessmentWhereInput[] = [{ tenantId: this.tenantId }];
    if (this.params?.from)
      and.push({ startedAt: { gte: new Date(this.params.from) } });
    if (this.params?.to)
      and.push({ startedAt: { lte: new Date(this.params.to) } });
    if (this.params?.userId) and.push({ userId: this.params.userId });

    const where: Prisma.AssessmentWhereInput = { AND: and };
    const items = await this.prisma.assessment.findMany({
      where,
      select: {
        id: true,
        userId: true,
        assignmentId: true,
        versionId: true,
        language: true,
        state: true,
        startedAt: true,
        submittedAt: true,
        scoredAt: true,
      },
      orderBy: [{ startedAt: "desc" }],
    });

    const headers = [
      "id",
      "userId",
      "assignmentId",
      "versionId",
      "language",
      "state",
      "startedAt",
      "submittedAt",
      "scoredAt",
    ];
    const rows = items.map((i) => ({ ...i }));
    return { headers, rows, filenameBase: `assessments_${this.tenantId}` };
  }
}
