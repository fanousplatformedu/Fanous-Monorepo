import { ParentPortalResolver } from "@parent-portal/resolvers/parent-portal.resolver";
import { ParentPortalService } from "@parent-portal/services/parent-portal.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [ParentPortalService, ParentPortalResolver],
  exports: [ParentPortalService],
})
export class ParentPortalModule {}
