import { NotificationChannel } from "@notif/enums/notif-channel.enum";
import { registerEnumType } from "@nestjs/graphql";

export const registerNotificationEnums = () => {
  registerEnumType(NotificationChannel, { name: "NotificationChannel" });
};
