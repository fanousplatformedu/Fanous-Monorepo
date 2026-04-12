import { AssessmentResolver } from "@assessment/resolvers/assessment.resolver";
import { AssessmentService } from "@assessment/services/assessment.service";
import { PrismaModule } from "@prisma/prisma.module";
import { AuditModule } from "@audit/audit.module";
import { Module } from "@nestjs/common";

import "@assessment/enums/register-enums";

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [AssessmentService, AssessmentResolver],
  exports: [AssessmentService],
})
export class AssessmentModule {}
