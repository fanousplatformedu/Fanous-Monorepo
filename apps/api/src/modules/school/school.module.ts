import { NotificationModule } from "@modules/notif/notif.module";
import { SchoolResolver } from "@school/resolvers/school.resolver";
import { SchoolService } from "@school/services/school.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

import "@school/enums/register-school.enum";

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [SchoolResolver, SchoolService],
  exports: [SchoolService],
})
export class SchoolModule {}
