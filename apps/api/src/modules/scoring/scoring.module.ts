import { ScoringResolver } from "@scoring/resolvers/scoring.resolver";
import { ScoringService } from "@scoring/services/scoring.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

import "@scoring/enums/scoring.enums";

@Module({
  imports: [PrismaModule],
  providers: [ScoringService, ScoringResolver],
  exports: [ScoringService],
})
export class ScoringModule {}
