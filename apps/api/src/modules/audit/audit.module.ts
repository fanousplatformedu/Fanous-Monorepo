import { AuditResolver } from "@audit/resolvers/audit.resolver";
import { PrismaModule } from "@prisma/prisma.module";
import { AuditService } from "@audit/services/audit.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [AuditService, AuditResolver],
  exports: [AuditService],
})
export class AuditModule {}
