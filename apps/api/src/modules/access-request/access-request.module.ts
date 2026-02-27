import { AccessRequestResolver } from "@accessRequest/resolvers/access-request.resolver";
import { AccessRequestService } from "@accessRequest/services/access-request.service";
import { NotificationModule } from "@notif/notif.module";
import { PrismaModule } from "@prisma/prisma.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [AccessRequestResolver, AccessRequestService],
  exports: [AccessRequestService],
})
export class AccessRequestModule {}
