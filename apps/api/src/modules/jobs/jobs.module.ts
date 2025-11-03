import { RecommendationProcessor } from "@jobs/processors/recommendation.processor";
import { NotificationProcessor } from "@jobs/processors/notification.processor";
import { RecommendationModule } from "@recommendation/recommendation.module";
import { MaintenanceProcessor } from "@jobs/processors/maintenance.processor";
import { NotificationModule } from "@notification/notification.module";
import { ScoringProcessor } from "@jobs/processors/scoring.processor";
import { ExportProcessor } from "@jobs/processors/export.processor";
import { Module, Global, Provider } from "@nestjs/common";
import { ScoringModule } from "@scoring/scoring.module";
import { ExportModule } from "@export/export.module";
import { PrismaModule } from "@prisma/prisma.module";
import { JobsResolver } from "@jobs/resolvers/jobs.resolver";
import { JobsService } from "@jobs/services/jobs.service";
import { BullModule, getQueueToken } from "@nestjs/bullmq";
import { QUEUES } from "@jobs/enums/jobs.enums";

const QUEUES_EXPLICITLY_DISABLED =
  String(process.env.QUEUES_DISABLED ?? "").toLowerCase() === "true";

const HAS_REDIS_CFG = !!(process.env.REDIS_URL || process.env.REDIS_HOST);
const QUEUES_ENABLED = HAS_REDIS_CFG && !QUEUES_EXPLICITLY_DISABLED;

class NoopQueue {
  async add(_name: string, _data?: any, _opts?: any) {
    return { id: "noop" };
  }
  async getWaitingCount() {
    return 0;
  }
}

const noopQueueProviders: Provider[] = Object.values(QUEUES).map((q) => ({
  provide: getQueueToken(q),
  useValue: new NoopQueue(),
}));

const bullImports = QUEUES_ENABLED
  ? [
      BullModule.forRootAsync({
        useFactory: () => {
          const redisUrl = process.env.REDIS_URL;
          const base = redisUrl
            ? { url: redisUrl }
            : {
                host: process.env.REDIS_HOST ?? "127.0.0.1",
                port: +(process.env.REDIS_PORT ?? "6379"),
                password: process.env.REDIS_PASSWORD || undefined,
              };
          return {
            connection: base as any,
            defaultJobOptions: {
              attempts: 3,
              backoff: { type: "exponential", delay: 1500 },
              removeOnComplete: { age: 3600, count: 1000 },
              removeOnFail: { age: 24 * 3600, count: 500 },
            },
          };
        },
      }),
      BullModule.registerQueue(
        { name: QUEUES.EXPORT },
        { name: QUEUES.NOTIFICATION },
        { name: QUEUES.SCORING },
        { name: QUEUES.RECOMMENDATION },
        { name: QUEUES.MAINTENANCE }
      ),
    ]
  : [];

const processorsWhenEnabled = QUEUES_ENABLED
  ? [
      ExportProcessor,
      ScoringProcessor,
      MaintenanceProcessor,
      NotificationProcessor,
      RecommendationProcessor,
    ]
  : [];

@Global()
@Module({
  imports: [
    PrismaModule,
    ExportModule,
    NotificationModule,
    ScoringModule,
    RecommendationModule,
    ...bullImports,
  ],
  providers: [
    JobsService,
    JobsResolver,
    ...processorsWhenEnabled,
    ...(!QUEUES_ENABLED ? noopQueueProviders : []),
  ],
  exports: [JobsService],
})
export class JobsModule {}
