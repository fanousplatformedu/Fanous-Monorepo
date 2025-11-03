import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { DEFAULT_CONCURRENCY, QUEUES } from "@jobs/enums/jobs.enums";
import { PrismaService } from "@prisma/prisma.service";
import { Inject } from "@nestjs/common";

@Processor(QUEUES.MAINTENANCE, { concurrency: DEFAULT_CONCURRENCY.MAINTENANCE })
export class MaintenanceProcessor extends WorkerHost {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {
    super();
  }

  async process(job: any): Promise<any> {
    const { tenantId, params } = job.data as {
      tenantId: string;
      params?: string;
    };
    const opts = params ? JSON.parse(params) : {};
    const beforeDays = Number(opts.cleanupBeforeDays ?? 90);
    const threshold = new Date(Date.now() - beforeDays * 86400000);
    const [n1, n2] = await this.prisma.$transaction([
      this.prisma.notification.deleteMany({
        where: { tenantId, status: "FAILED", createdAt: { lt: threshold } },
      }),
      this.prisma.exportJob.deleteMany({
        where: { tenantId, status: "FAILED", createdAt: { lt: threshold } },
      }),
    ]);
    return { deletedNotifications: n1.count, deletedExportJobs: n2.count };
  }

  @OnWorkerEvent("failed")
  onFailed(job: any, err: Error) {
    console.error(`[MaintenanceProcessor] Job ${job.id} failed:`, err?.message);
  }
}
