import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { DEFAULT_CONCURRENCY, QUEUES } from "@jobs/enums/jobs.enums";
import { ExportService } from "@export/services/export.service";
import { Inject } from "@nestjs/common";

@Processor(QUEUES.EXPORT, { concurrency: DEFAULT_CONCURRENCY.EXPORT })
export class ExportProcessor extends WorkerHost {
  constructor(
    @Inject(ExportService) private readonly exportService: ExportService
  ) {
    super();
  }

  async process(job: any): Promise<any> {
    const { tenantId, jobId } = job.data as { tenantId: string; jobId: string };
    const actor = { id: "system", role: "SUPER_ADMIN" };
    return this.exportService.runJob({ tenantId, id: jobId }, actor);
  }

  @OnWorkerEvent("failed")
  onFailed(job: any, err: Error) {
    console.error(`[ExportProcessor] Job ${job.id} failed:`, err?.message);
  }
}
