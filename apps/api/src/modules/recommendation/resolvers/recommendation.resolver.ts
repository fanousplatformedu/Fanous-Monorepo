import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { GenerateRecommendationsInput } from "@recommendation/dto/generate-recommendations.input";
import { PreviewRecommendationsInput } from "@recommendation/dto/preview-recommendations.input";
import { DeleteRecommendationInput } from "@recommendation/dto/delete-recommendation.input";
import { RecommendationPageEntity } from "@recommendation/entities/recommendation-page.entity";
import { ListRecommendationsInput } from "@recommendation/dto/list-recommendations.input";
import { RecommendationService } from "@recommendation/services/recommendation.service";
import { PreviewPayload } from "@recommendation/entities/recommendation-result.entity";
import { GenerateResult } from "@recommendation/entities/recommendation-result.entity";
import { Roles } from "@decorators/roles.decorator";
import { Role } from "@prisma/client";

@Resolver()
export class RecommendationResolver {
  constructor(private readonly service: RecommendationService) {}

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => GenerateResult, { name: "generateRecommendations" })
  generateRecommendations(@Args("input") input: GenerateRecommendationsInput) {
    return this.service.generate(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Query(() => PreviewPayload, { name: "previewRecommendations" })
  previewRecommendations(@Args("input") input: PreviewRecommendationsInput) {
    return this.service.preview(input);
  }

  @Query(() => RecommendationPageEntity, { name: "recommendations" })
  recommendations(@Args("input") input: ListRecommendationsInput) {
    return this.service.list(input);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.COUNSELOR)
  @Mutation(() => Boolean, { name: "deleteRecommendation" })
  deleteRecommendation(@Args("input") input: DeleteRecommendationInput) {
    return this.service.deleteOne(input);
  }
}
