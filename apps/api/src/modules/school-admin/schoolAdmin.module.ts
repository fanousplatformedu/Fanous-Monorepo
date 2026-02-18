import { SchoolAdminResolver } from "@schoolAdmin/resolvers/school-admin.resolver";
import { SchoolAdminService } from "@schoolAdmin/services/school-admin.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [SchoolAdminResolver, SchoolAdminService],
  exports: [SchoolAdminService],
})
export class SchoolAdminModule {}
