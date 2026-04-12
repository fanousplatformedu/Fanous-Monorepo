import { NotificationModule } from "@notif/notif.module";
import { AuditResolver } from "@audit/resolvers/audit.resolver";
import { PrismaModule } from "@prisma/prisma.module";
import { AuditService } from "@audit/services/audit.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, NotificationModule, AuditModule],
  providers: [AuditResolver, AuditService],
  exports: [AuditService],
})
export class AuditModule {}
