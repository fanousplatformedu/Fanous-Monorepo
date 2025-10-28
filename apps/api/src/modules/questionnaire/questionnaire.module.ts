import { QuestionnaireResolver } from "@questionnaire/resolvers/questionnaire.resolver";
import { QuestionnaireService } from "@questionnaire/services/questionnaire.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

import "@questionnaire/enums/questionnaire.enums";

@Module({
  imports: [PrismaModule],
  providers: [QuestionnaireService, QuestionnaireResolver],
  exports: [QuestionnaireService],
})
export class QuestionnaireModule {}
