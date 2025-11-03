import { Processor, WorkerHost, OnWorkerEvent } from "@nestjs/bullmq";
import { DEFAULT_CONCURRENCY, QUEUES } from "@jobs/enums/jobs.enums";
import { NotificationService } from "@notification/services/notification.service";
import { Inject } from "@nestjs/common";

@Processor(QUEUES.NOTIFICATION, {
  concurrency: DEFAULT_CONCURRENCY.NOTIFICATION,
})
export class NotificationProcessor extends WorkerHost {
  constructor(
    @Inject(NotificationService)
    private readonly notifService: NotificationService
  ) {
    super();
  }

  async process(job: any): Promise<any> {
    const actor = { id: "system", role: "SUPER_ADMIN" };
    const data = job.data as
      | {
          type: "TEMPLATE";
          tenantId: string;
          templateId: string;
          userIds?: string[];
          audienceJson?: string;
          variables?: string;
        }
      | {
          type: "ADHOC";
          tenantId: string;
          channel: string;
          userIds: string[];
          payload: string;
        };

    if (data.type === "TEMPLATE") {
      return this.notifService.sendByTemplate(
        {
          tenantId: data.tenantId,
          templateId: data.templateId,
          userIds: data.userIds,
          audienceJson: data.audienceJson,
          variables: data.variables,
          queueOnly: false,
        } as any,
        actor
      );
    } else {
      return this.notifService.sendAdHoc(
        {
          tenantId: data.tenantId,
          channel: data.channel as any,
          userIds: data.userIds,
          payload: data.payload,
          queueOnly: false,
        },
        actor
      );
    }
  }

  @OnWorkerEvent("failed")
  onFailed(job: any, err: Error) {
    console.error(
      `[NotificationProcessor] Job ${job.id} failed:`,
      err?.message
    );
  }
}
