import { Resolver, Mutation, Args, Query, Context } from "@nestjs/graphql";
import { CreateExportJobInput } from "@export/dto/create-export.input";
import { PreviewResultEntity } from "@export/entities/result-export";
import { PreviewExportInput } from "@export/dto/preview-export.input";
import { RunExportJobInput } from "@export/dto/run-export.input";
import { ExportPageEntity } from "@export/entities/export-page.entity";
import { ExportsPageInput } from "@export/dto/exports-page.input";
import { ExportJobEntity } from "@export/entities/export-job.entity";
import { ExportService } from "@export/services/export.service";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class ExportResolver {
  constructor(private readonly exportService: ExportService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => ExportJobEntity, { name: "createExportJob" })
  async createExportJob(
    @Args("input") input: CreateExportJobInput,
    @Context() ctx
  ) {
    const actor = ctx.req.user;
    const paramsObj = input.params ? JSON.parse(input.params) : {};
    paramsObj.kind = input.kind;
    const next = { ...input, params: JSON.stringify(paramsObj) };
    return this.exportService.createJob(next, actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => ExportJobEntity, { name: "runExportJob" })
  runExportJob(@Args("input") input: RunExportJobInput, @Context() ctx) {
    const actor = ctx.req.user;
    return this.exportService.runJob(input, actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Query(() => ExportPageEntity, { name: "exportJobs" })
  exportJobs(@Args("input") input: ExportsPageInput, @Context() ctx) {
    const actor = ctx.req.user;
    return this.exportService.page(input, actor);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Query(() => PreviewResultEntity, { name: "previewExport" })
  previewExport(@Args("input") input: PreviewExportInput, @Context() ctx) {
    const actor = ctx.req.user;
    return this.exportService.preview(input, actor);
  }
}
