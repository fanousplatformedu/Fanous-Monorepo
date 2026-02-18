import { AdminResolver } from "@superAdmin/resolvers/admin.resolver";
import { AdminService } from "@superAdmin/services/admin.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [AdminResolver, AdminService],
  exports: [AdminService],
})
export class SuperAdminModule {}
