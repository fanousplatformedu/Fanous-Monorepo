import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { EnqueueNotificationByTemplateInput } from "@jobs/dto/enqueu-notification.input";
import { EnqueueNotificationAdHocInput } from "@jobs/dto/enqueu-notification.input";
import { EnqueueRecommendationInput } from "@jobs/dto/enqueue-recommendation.input";
import { EnqueueMaintenanceInput } from "@jobs/dto/enqueue-maintenance.input";
import { EnqueueScoringInput } from "@jobs/dto/enqueue-scoring.input";
import { JobsHealthEntity } from "@jobs/entities/job-health.entity";
import { JobsService } from "@jobs/services/jobs.service";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class JobsResolver {
  constructor(private readonly jobsService: JobsService) {}

  // ========= Export Query ============
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "enqueueExportRun" })
  async enqueueExportRun(
    @Args("tenantId") tenantId: string,
    @Args("jobId") jobId: string,
    @Args("delayMs", { nullable: true }) delayMs: number,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    await this.jobsService.enqueueExportRun(tenantId, jobId, delayMs ?? 0);
    return true;
  }

  // ========= Notification Query ============
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "enqueueNotificationByTemplate" })
  async enqueueNotificationByTemplate(
    @Args("input") input: EnqueueNotificationByTemplateInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    await this.jobsService.enqueueNotificationTemplate(input as any, actor);
    return true;
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "enqueueNotificationAdHoc" })
  async enqueueNotificationAdHoc(
    @Args("input") input: EnqueueNotificationAdHocInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    await this.jobsService.enqueueNotificationAdHoc(input as any, actor);
    return true;
  }

  // ========== Scoring ============
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "enqueueScoring" })
  async enqueueScoring(
    @Args("input") input: EnqueueScoringInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    await this.jobsService.enqueueScoring(input as any, actor);
    return true;
  }

  // ============= Recommendation ============
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "enqueueRecommendation" })
  async enqueueRecommendation(
    @Args("input") input: EnqueueRecommendationInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    await this.jobsService.enqueueRecommendation(input as any, actor);
    return true;
  }

  // ============= Maintenance ============
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => Boolean, { name: "enqueueMaintenance" })
  async enqueueMaintenance(
    @Args("input") input: EnqueueMaintenanceInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    await this.jobsService.enqueueMaintenance(input as any, actor);
    return true;
  }

  // ============= Health Check ============
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Query(() => JobsHealthEntity, { name: "jobsHealth" })
  jobsHealth() {
    return this.jobsService.health();
  }
}
