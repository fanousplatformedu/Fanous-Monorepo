import { NotificationTemplate } from "@notif/enums/notif-template.enum";
import { NotificationChannel } from "@notif/enums/notif-channel.enum";

export type TSendSmsArgs = {
  to: string;
  message: string;
  sender?: string;
};

export type TSendEmailArgs = {
  to: string;
  html: string;
  text?: string;
  subject: string;
};

type TNotifyBase = {
  appName?: string;
  destination: string;
};

export type TNotifyTemplateArgs =
  | (TNotifyBase & {
      otpCode: string;
      template: NotificationTemplate.OTP_LOGIN;
      channel: NotificationChannel.SMS | NotificationChannel.EMAIL;
    })
  | (TNotifyBase & {
      username: string;
      password: string;
      schoolName: string;
      template: NotificationTemplate.ADMIN_CREDENTIALS;
      channel: NotificationChannel.EMAIL;
    })
  | (TNotifyBase & {
      roleTitle: string;
      schoolName: string;
      template: NotificationTemplate.ACCESS_REQUEST_APPROVED;
      channel: NotificationChannel.SMS | NotificationChannel.EMAIL;
    })
  | (TNotifyBase & {
      reason?: string;
      schoolName: string;
      template: NotificationTemplate.ACCESS_REQUEST_REJECTED;
      channel: NotificationChannel.SMS | NotificationChannel.EMAIL;
    });

export type TKavenegarSendSmsArgs = {
  to: string;
  message: string;
  sender?: string;
};

export type TKavenegarVerifyLookupArgs = {
  token: string;
  token2?: string;
  token3?: string;
  receptor: string;
  template: string;
};
