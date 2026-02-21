import { AdminResolver } from "@superAdmin/resolvers/admin.resolver";
import { AdminService } from "@superAdmin/services/admin.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [AdminResolver, AdminService],
  exports: [AdminService],
})
export class SuperAdminModule {}
