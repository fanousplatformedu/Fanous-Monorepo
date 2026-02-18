import { SchoolScopeGuard } from "@school/guards/school-scope.guard";
import { SchoolResolver } from "@school/resolvers/school.resolver";
import { SchoolService } from "@school/services/school.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [SchoolResolver, SchoolService, SchoolScopeGuard],
  exports: [SchoolService, SchoolScopeGuard],
})
export class SchoolModule {}
