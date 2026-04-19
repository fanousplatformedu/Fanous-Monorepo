import { ParentResolver } from "@parent/resolvers/parent.resolver";
import { ParentService } from "@parent/services/parent.service";
import { PrismaModule } from "@prisma/prisma.module";
import { AuditModule } from "@audit/audit.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, AuditModule],
  providers: [ParentResolver, ParentService],
  exports: [ParentService],
})
export class ParentModule {}
