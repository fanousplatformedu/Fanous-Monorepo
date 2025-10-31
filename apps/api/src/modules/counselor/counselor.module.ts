import { CounselorResolver } from "@counselor/resolvers/counselor.resolver";
import { CounselorService } from "@counselor/services/counselor.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [CounselorService, CounselorResolver],
  exports: [CounselorService],
})
export class CounselorModule {}
