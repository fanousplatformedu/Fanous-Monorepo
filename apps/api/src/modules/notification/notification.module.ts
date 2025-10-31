import { NotificationResolver } from "@notification/resolvers/notification.resolver";
import { NotificationService } from "@notification/services/notification.service";
import { InAppProvider } from "@notification/channels/inapp.provider";
import { EmailProvider } from "@notification/channels/email.provider";
import { PrismaModule } from "@prisma/prisma.module";
import { PushProvider } from "@notification/channels/push.provider";
import { SmsProvider } from "@notification/channels/sms.provider";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule],
  providers: [
    SmsProvider,
    PushProvider,
    InAppProvider,
    EmailProvider,
    NotificationService,
    NotificationResolver,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
