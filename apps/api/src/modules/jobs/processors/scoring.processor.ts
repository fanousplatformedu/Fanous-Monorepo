import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { DEFAULT_CONCURRENCY, QUEUES } from "@jobs/enums/jobs.enums";
import { ScoringService } from "@scoring/services/scoring.service";
import { Inject } from "@nestjs/common";

@Processor(QUEUES.SCORING, { concurrency: DEFAULT_CONCURRENCY.SCORING })
export class ScoringProcessor extends WorkerHost {
  constructor(
    @Inject(ScoringService) private readonly scoringService: ScoringService
  ) {
    super();
  }

  async process(job: any): Promise<any> {
    const { tenantId, assessmentId, params } = job.data as {
      tenantId: string;
      assessmentId: string;
      params?: string;
    };
    const options = params ? JSON.parse(params) : {};
    return this.scoringService.scoreAssessment({
      tenantId,
      assessmentId,
      options,
    });
  }

  @OnWorkerEvent("failed")
  onFailed(job: any, err: Error) {
    console.error(`[ScoringProcessor] Job ${job.id} failed:`, err?.message);
  }
}
