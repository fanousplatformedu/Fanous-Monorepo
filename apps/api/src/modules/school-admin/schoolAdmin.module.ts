import { SchoolAdminResolver } from "@schoolAdmin/resolvers/school-admin.resolver";
import { SchoolAdminService } from "@schoolAdmin/services/school-admin.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [SchoolAdminResolver, SchoolAdminService],
  exports: [SchoolAdminService],
})
export class SchoolAdminModule {}
