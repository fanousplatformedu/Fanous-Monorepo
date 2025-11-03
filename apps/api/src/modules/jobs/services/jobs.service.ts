import { Injectable, ForbiddenException } from "@nestjs/common";
import { DEFAULT_BACKOFF, JOB_NAMES } from "@jobs/enums/jobs.enums";
import { DEFAULT_ATTEMPTS, QUEUES } from "@jobs/enums/jobs.enums";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { Actor } from "@jobs/types/jobs.types";

@Injectable()
export class JobsService {
  constructor(
    @InjectQueue(QUEUES.EXPORT) private exportQueue: Queue,
    @InjectQueue(QUEUES.NOTIFICATION) private notificationQueue: Queue,
    @InjectQueue(QUEUES.SCORING) private scoringQueue: Queue,
    @InjectQueue(QUEUES.RECOMMENDATION) private recommendationQueue: Queue,
    @InjectQueue(QUEUES.MAINTENANCE) private maintenanceQueue: Queue
  ) {}

  private ensurePermission(actor: Actor) {
    const r = (actor.role ?? "").toUpperCase();
    if (!["SUPER_ADMIN", "ADMIN", "COUNSELOR"].includes(r))
      throw new ForbiddenException("Access denied");
  }

  // ============ Export ===========
  async enqueueExport(
    params: {
      tenantId: string;
      kind: string;
      format: string;
      params?: string;
      delayMs?: number;
    },
    actor: Actor
  ) {
    this.ensurePermission(actor);
    throw new Error(
      "Use createExportJob(queueOnly:true) to get jobId, then enqueue via jobs.resolver 'enqueueExportRun'"
    );
  }

  async enqueueExportRun(tenantId: string, jobId: string, delayMs = 0) {
    return this.exportQueue.add(
      JOB_NAMES.EXPORT_RUN,
      { tenantId, jobId },
      { attempts: DEFAULT_ATTEMPTS, backoff: DEFAULT_BACKOFF, delay: delayMs }
    );
  }

  // =============== Notifications ===============
  async enqueueNotificationTemplate(
    payload: {
      tenantId: string;
      templateId: string;
      userIds?: string[];
      audienceJson?: string;
      variables?: string;
      delayMs?: number;
    },
    actor: Actor
  ) {
    this.ensurePermission(actor);
    return this.notificationQueue.add(
      "notification.sendTemplate",
      { type: "TEMPLATE", ...payload },
      {
        attempts: DEFAULT_ATTEMPTS,
        backoff: DEFAULT_BACKOFF,
        delay: payload.delayMs ?? 0,
      }
    );
  }

  async enqueueNotificationAdHoc(
    payload: {
      tenantId: string;
      channel: string;
      userIds: string[];
      payload: string;
      delayMs?: number;
    },
    actor: Actor
  ) {
    this.ensurePermission(actor);
    return this.notificationQueue.add(
      "notification.sendAdHoc",
      { type: "ADHOC", ...payload },
      {
        attempts: DEFAULT_ATTEMPTS,
        backoff: DEFAULT_BACKOFF,
        delay: payload.delayMs ?? 0,
      }
    );
  }

  // ============== Scoring ==============
  async enqueueScoring(
    payload: {
      tenantId: string;
      assessmentId: string;
      params?: string;
      delayMs?: number;
    },
    actor: Actor
  ) {
    this.ensurePermission(actor);
    return this.scoringQueue.add(JOB_NAMES.SCORING_RUN, payload, {
      attempts: DEFAULT_ATTEMPTS,
      backoff: DEFAULT_BACKOFF,
      delay: payload.delayMs ?? 0,
    });
  }

  // ========= Recommendation =========
  async enqueueRecommendation(
    payload: {
      tenantId: string;
      userId?: string;
      params?: string;
      delayMs?: number;
    },
    actor: Actor
  ) {
    this.ensurePermission(actor);
    return this.recommendationQueue.add(
      JOB_NAMES.RECOMMENDATION_PRECOMPUTE,
      payload,
      {
        attempts: DEFAULT_ATTEMPTS,
        backoff: DEFAULT_BACKOFF,
        delay: payload.delayMs ?? 0,
      }
    );
  }

  // ========== Maintenance ===========
  async enqueueMaintenance(
    payload: { tenantId: string; params?: string; delayMs?: number },
    actor: Actor
  ) {
    this.ensurePermission(actor);
    return this.maintenanceQueue.add(JOB_NAMES.MAINTENANCE_CLEANUP, payload, {
      attempts: DEFAULT_ATTEMPTS,
      backoff: DEFAULT_BACKOFF,
      delay: payload.delayMs ?? 0,
    });
  }

  async health() {
    const [e, n, s, r, m] = await Promise.all([
      this.exportQueue.getWaitingCount(),
      this.notificationQueue.getWaitingCount(),
      this.scoringQueue.getWaitingCount(),
      this.recommendationQueue.getWaitingCount(),
      this.maintenanceQueue.getWaitingCount(),
    ]);
    return {
      exportWaiting: e,
      notificationWaiting: n,
      scoringWaiting: s,
      recommendationWaiting: r,
      maintenanceWaiting: m,
    };
  }
}
