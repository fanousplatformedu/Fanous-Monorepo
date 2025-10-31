import { AssessmentResolver } from "@assessment/resolvers/assessment.resolver";
import { AssessmentService } from "@assessment/services/assessment.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

import "@assessment/enums/assessment.enums";

@Module({
  imports: [PrismaModule],
  providers: [AssessmentService, AssessmentResolver],
  exports: [AssessmentService],
})
export class AssessmentModule {}
