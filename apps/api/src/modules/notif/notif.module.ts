import { NotificationResolver } from "@notif/resolvers/notif.resolver";
import { NotificationService } from "@notif/services/notif.service";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

import "@notif/enums/register-notif.enum";

@Module({
  imports: [PrismaModule],
  providers: [NotificationResolver, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
