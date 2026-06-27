import { NotificationModule } from "@modules/notif/notif.module";
import { SchoolResolver } from "@school/resolvers/school.resolver";
import { SchoolService } from "@school/services/school.service";
import { PrismaModule } from "@prisma/prisma.module";
import { AuditModule } from "@audit/audit.module";
import { Module } from "@nestjs/common";

import "@school/enums/register-school.enum";
import { SchoolController } from "./controllers/school.controller";
import { StudentModule } from "@modules/student/student.module";

@Module({
  imports: [PrismaModule, NotificationModule, AuditModule, StudentModule],
  providers: [SchoolResolver, SchoolService],
  exports: [SchoolService],
  controllers: [SchoolController],
})
export class SchoolModule {}
