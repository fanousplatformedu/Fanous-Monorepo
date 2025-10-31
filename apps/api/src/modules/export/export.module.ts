import { ExportResolver } from "@export/resolvers/export.resolver";
import { ExportService } from "@export/services/export.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [ExportService, ExportResolver],
  exports: [ExportService],
})
export class ExportModule {}
