import { ForcePasswordChangeGuard } from "@adminPassword/guards/force-password-change.guard";
import { AdminPasswordResolver } from "@adminPassword/resolver/admin-password.resolver";
import { AdminPasswordService } from "@adminPassword/services/admin-password.service";
import { NotificationModule } from "@notif/notif.module";
import { PrismaModule } from "@prisma/prisma.module";
import { AuditModule } from "@audit/audit.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, NotificationModule, AuditModule],
  providers: [
    AdminPasswordResolver,
    AdminPasswordService,
    ForcePasswordChangeGuard,
  ],
  exports: [AdminPasswordService, ForcePasswordChangeGuard],
})
export class AdminPasswordModule {}
