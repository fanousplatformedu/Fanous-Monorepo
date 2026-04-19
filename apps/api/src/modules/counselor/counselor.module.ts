import { CounselorResolver } from "@counselor/resolvers/counselor.resolver";
import { CounselorService } from "@counselor/services/counselor.service";
import { PrismaModule } from "@modules/prisma/prisma.module";
import { Module } from "@nestjs/common";

import "@counselor/enums/counselor-register.enum";

@Module({
  imports: [PrismaModule],
  providers: [CounselorResolver, CounselorService],
  exports: [CounselorService],
})
export class CounselorModule {}
