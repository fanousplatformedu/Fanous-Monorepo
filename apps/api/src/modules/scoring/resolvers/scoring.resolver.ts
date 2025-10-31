import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { RecomputeTenantResult } from "@scoring/entities/tenant-result";
import { RunScoringStrictInput } from "@scoring/dto/run-scoring.input";
import { ScoringPreviewEntity } from "@scoring/entities/scoring-preview.entity";
import { RecomputeTenantInput } from "@scoring/dto/recompute-tenant.input";
import { PreviewScoringInput } from "@scoring/dto/preview-scoring.input";
import { ScoringService } from "@scoring/services/scoring.service";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class ScoringResolver {
  constructor(private readonly scoringService: ScoringService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Query(() => ScoringPreviewEntity, { name: "previewScoring" })
  previewScoring(@Args("input") input: PreviewScoringInput) {
    return this.scoringService.preview(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "runScoringStrict" })
  runScoringStrict(@Args("input") input: RunScoringStrictInput) {
    return this.scoringService.runStrict(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @Mutation(() => RecomputeTenantResult, { name: "recomputeTenantScores" })
  recomputeTenantScores(@Args("input") input: RecomputeTenantInput) {
    return this.scoringService.recomputeTenant(input);
  }
}
