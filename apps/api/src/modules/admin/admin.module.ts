import { AdminRoleApprovalService } from "@admin/services/role-approval.service";
import { AdminSuperService } from "@admin/services/admin-super.service";
import { AdminResolver } from "@admin/resolvers/admin.resolver";
import { PrismaModule } from "@modules/prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [AdminResolver, AdminRoleApprovalService, AdminSuperService],
})
export class AdminModule {}
