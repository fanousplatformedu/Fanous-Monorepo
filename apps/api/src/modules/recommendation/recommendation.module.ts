import { RecommendationResolver } from "./resolvers/recommendation.resolver";
import { RecommendationService } from "./services/recommendation.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

import "@recommendation/enums/recommendation.enums";

@Module({
  imports: [PrismaModule],
  providers: [RecommendationService, RecommendationResolver],
  exports: [RecommendationService],
})
export class RecommendationModule {}
