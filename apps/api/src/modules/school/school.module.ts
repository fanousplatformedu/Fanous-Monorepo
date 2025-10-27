import { SchoolResolver } from "@school/resolvers/school.resolver";
import { SchoolService } from "@school/services/school.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [SchoolService, SchoolResolver],
  exports: [SchoolService],
})
export class SchoolModule {}
