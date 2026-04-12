import { ForcePasswordChangeGuard } from "@superAdmin/guards/force-password-change.guard";
import { NotificationModule } from "@notif/notif.module";
import { SuperAdminResolver } from "@superAdmin/resolver/super-admin.resolver";
import { SuperAdminService } from "@superAdmin/services/super-admin.service";
import { PrismaModule } from "@prisma/prisma.module";
import { AuditModule } from "@audit/audit.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, NotificationModule, AuditModule],
  providers: [SuperAdminResolver, SuperAdminService, ForcePasswordChangeGuard],
  exports: [SuperAdminService, ForcePasswordChangeGuard],
})
export class SuperAdminModule {}
