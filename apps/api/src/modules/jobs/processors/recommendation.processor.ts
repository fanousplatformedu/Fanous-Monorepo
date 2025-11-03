import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { DEFAULT_CONCURRENCY, QUEUES } from "@jobs/enums/jobs.enums";
import { RecommendationService } from "@recommendation/services/recommendation.service";
import { Inject } from "@nestjs/common";

@Processor(QUEUES.RECOMMENDATION, {
  concurrency: DEFAULT_CONCURRENCY.RECOMMENDATION,
})
export class RecommendationProcessor extends WorkerHost {
  constructor(
    @Inject(RecommendationService) private readonly recs: RecommendationService
  ) {
    super();
  }

  async process(job: any): Promise<any> {
    const { tenantId, userId, params } = job.data as {
      tenantId: string;
      userId?: string;
      params?: string;
    };
    const options = params ? JSON.parse(params) : {};
    if (userId)
      return this.recs.precomputeForUser({ tenantId, userId, options });
    return this.recs.precomputeForTenant({ tenantId, options });
  }

  @OnWorkerEvent("failed")
  onFailed(job: any, err: Error) {
    console.error(
      `[RecommendationProcessor] Job ${job.id} failed:`,
      err?.message
    );
  }
}
