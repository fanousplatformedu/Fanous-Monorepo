import { TenantResolver } from "@tenant/resolvers/tenant.resolver";
import { TenantService } from "@tenant/services/tenant.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [TenantResolver, TenantService],
  exports: [TenantService],
})
export class TenantModule {}
