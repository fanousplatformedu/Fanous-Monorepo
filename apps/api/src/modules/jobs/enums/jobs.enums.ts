export const QUEUES = {
  EXPORT: "export_queue",
  NOTIFICATION: "notification_queue",
  SCORING: "scoring_queue",
  RECOMMENDATION: "recommendation_queue",
  MAINTENANCE: "maintenance_queue",
} as const;

export const JOB_NAMES = {
  EXPORT_RUN: "export.run",
  NOTIF_SEND_TEMPLATE: "notification.sendTemplate",
  NOTIF_SEND_ADHOC: "notification.sendAdHoc",
  SCORING_RUN: "scoring.run",
  RECOMMENDATION_PRECOMPUTE: "recommendation.precompute",
  MAINTENANCE_CLEANUP: "maintenance.cleanup",
} as const;

export const DEFAULT_CONCURRENCY = {
  EXPORT: 2,
  NOTIFICATION: 5,
  SCORING: 4,
  RECOMMENDATION: 2,
  MAINTENANCE: 1,
} as const;

export const DEFAULT_ATTEMPTS = 3;
export const DEFAULT_BACKOFF = { type: "exponential", delay: 1500 } as const;
