import { BadRequestException, Injectable } from "@nestjs/common";
import { TSendEmailArgs, TSendSmsArgs } from "@notif/types/notif.types";
import { ServiceUnavailableException } from "@nestjs/common";
import { NotificationResultEntity } from "@notif/entities/notif-result.entity";
import { NotificationErrorCode } from "@notif/enums/notif-error-code.enum";
import { NotificationTemplate } from "@notif/enums/notif-template.enum";
import { TNotifyTemplateArgs } from "@notif/types/notif.types";
import { NotificationChannel } from "@notif/enums/notif-channel.enum";
import { NotificationMessage } from "@notif/enums/notif-message.enum";

import nodemailer from "nodemailer";
import axios from "axios";

@Injectable()
export class NotificationService {
  private readonly appName = process.env.APP_NAME ?? "App";
  private readonly baseUrl = process.env.APP_BASE_URL ?? "";
  private readonly kavenegarKey = process.env.KAVENEGAR_API_KEY ?? "";
  private readonly kavenegarSender = process.env.KAVENEGAR_SENDER ?? "";
  private readonly mailHost = process.env.MAIL_HOST ?? "";
  private readonly mailPort = parseInt(process.env.MAIL_PORT ?? "465", 10);
  private readonly mailUser = process.env.MAIL_USER ?? "";
  private readonly mailPass = process.env.MAIL_PASSWORD ?? "";
  private readonly mailFromAddress = process.env.MAIL_FROM_ADDRESS ?? "";
  private readonly mailFromName = process.env.MAIL_FROM_NAME ?? this.appName;

  private smtpTransport = this.createTransport();

  // ---------- Public methods used by other modules ----------
  async notifyByTemplate(
    args: TNotifyTemplateArgs,
  ): Promise<NotificationResultEntity> {
    const rendered = this.renderTemplate(args);
    if (args.channel === NotificationChannel.SMS) {
      return this.sendSms({
        to: this.normalizeMobile(args.destination),
        message: rendered.text,
      });
    }
    return this.sendEmail({
      to: this.normalizeEmail(args.destination),
      subject: rendered.subject ?? this.appName,
      html: rendered.html ?? `<p>${rendered.text}</p>`,
      text: rendered.text,
    });
  }

  async sendSms(args: TSendSmsArgs): Promise<NotificationResultEntity> {
    if (!this.kavenegarKey) {
      throw new ServiceUnavailableException({
        code: NotificationErrorCode.PROVIDER_NOT_CONFIGURED,
      });
    }
    const to = this.normalizeMobile(args.to);
    if (!to)
      throw new BadRequestException({
        code: NotificationErrorCode.INVALID_DESTINATION,
      });

    const sender = args.sender ?? this.kavenegarSender;
    if (!sender) {
      throw new ServiceUnavailableException({
        code: NotificationErrorCode.PROVIDER_NOT_CONFIGURED,
        message: "KAVENEGAR_SENDER missing",
      });
    }

    try {
      const url = `https://api.kavenegar.com/v1/${this.kavenegarKey}/sms/send.json`;
      const resp = await axios.get(url, {
        params: {
          receptor: to,
          sender,
          message: args.message,
        },
        timeout: 12_000,
      });

      const data = resp.data;
      const status = data?.return?.status;
      if (status !== 200) {
        return {
          message: NotificationMessage.FAILED,
          channel: NotificationChannel.SMS,
          destination: to,
          errorCode: NotificationErrorCode.KAVENEGAR_ERROR,
          errorMessage: data?.return?.message ?? "Kavenegar error",
        };
      }

      const messageId = data?.entries?.[0]?.messageid?.toString?.();
      return {
        message: NotificationMessage.SENT,
        channel: NotificationChannel.SMS,
        destination: to,
        providerMessageId: messageId,
      };
    } catch (e: any) {
      return {
        message: NotificationMessage.FAILED,
        channel: NotificationChannel.SMS,
        destination: to,
        errorCode: NotificationErrorCode.PROVIDER_ERROR,
        errorMessage: e?.message ?? "SMS provider error",
      };
    }
  }

  async sendEmail(args: TSendEmailArgs): Promise<NotificationResultEntity> {
    if (
      !this.mailHost ||
      !this.mailUser ||
      !this.mailPass ||
      !this.mailFromAddress
    ) {
      throw new ServiceUnavailableException({
        code: NotificationErrorCode.PROVIDER_NOT_CONFIGURED,
      });
    }
    const to = this.normalizeEmail(args.to);
    if (!to)
      throw new BadRequestException({
        code: NotificationErrorCode.INVALID_DESTINATION,
      });
    try {
      const info = await this.smtpTransport.sendMail({
        from: `"${this.mailFromName}" <${this.mailFromAddress}>`,
        to,
        subject: args.subject,
        text: args.text,
        html: args.html,
      });
      return {
        message: NotificationMessage.SENT,
        channel: NotificationChannel.EMAIL,
        destination: to,
        providerMessageId: info?.messageId,
      };
    } catch (e: any) {
      return {
        message: NotificationMessage.FAILED,
        channel: NotificationChannel.EMAIL,
        destination: to,
        errorCode: NotificationErrorCode.SMTP_ERROR,
        errorMessage: e?.message ?? "SMTP error",
      };
    }
  }

  // ============ Internal ============
  private createTransport() {
    const secure = this.mailPort === 465;
    return nodemailer.createTransport({
      host: this.mailHost,
      port: this.mailPort,
      secure,
      auth: { user: this.mailUser, pass: this.mailPass },
    });
  }

  private renderTemplate(args: TNotifyTemplateArgs): {
    subject?: string;
    text: string;
    html?: string;
  } {
    const app = args.appName ?? this.appName;
    switch (args.template) {
      case NotificationTemplate.OTP_LOGIN: {
        const text = `${app}\nکد ورود شما: ${args.otpCode}\nاگر شما درخواست نداده‌اید، این پیام را نادیده بگیرید.`;
        const html = `<p><b>${app}</b></p><p>کد ورود شما: <b>${args.otpCode}</b></p><p>اگر شما درخواست نداده‌اید، این پیام را نادیده بگیرید.</p>`;
        return { subject: `${app} - کد ورود`, text, html };
      }

      case NotificationTemplate.ADMIN_CREDENTIALS: {
        const loginUrl = this.baseUrl ? `${this.baseUrl}/auth/login` : "";
        const text =
          `${app}\n` +
          `حساب ادمین مدرسه برای شما ساخته شد.\n` +
          `مدرسه: ${args.schoolName}\n` +
          `Username: ${args.username}\n` +
          `Password: ${args.password}\n` +
          (loginUrl ? `Login: ${loginUrl}\n` : "") +
          `لطفاً بعد از ورود، رمز را تغییر دهید.`;

        const html =
          `<p><b>${app}</b></p>` +
          `<p>حساب ادمین مدرسه برای شما ساخته شد.</p>` +
          `<p>مدرسه: <b>${args.schoolName}</b></p>` +
          `<p>Username: <b>${args.username}</b></p>` +
          `<p>Password: <b>${args.password}</b></p>` +
          (loginUrl ? `<p><a href="${loginUrl}">ورود به پنل</a></p>` : "") +
          `<p>لطفاً بعد از ورود، رمز را تغییر دهید.</p>`;
        return { subject: `${app} - اطلاعات ورود ادمین`, text, html };
      }

      case NotificationTemplate.ACCESS_REQUEST_APPROVED: {
        const text = `${app}\nدرخواست شما در مدرسه «${args.schoolName}» تایید شد.\nنقش: ${args.roleTitle}\nاکنون می‌توانید وارد شوید.`;
        const html = `<p><b>${app}</b></p><p>درخواست شما در مدرسه «<b>${args.schoolName}</b>» تایید شد.</p><p>نقش: <b>${args.roleTitle}</b></p><p>اکنون می‌توانید وارد شوید.</p>`;
        return { subject: `${app} - تایید درخواست`, text, html };
      }

      case NotificationTemplate.ACCESS_REQUEST_REJECTED: {
        const reasonLine = args.reason ? `\nدلیل: ${args.reason}` : "";
        const text = `${app}\nدرخواست شما در مدرسه «${args.schoolName}» رد شد.${reasonLine}`;
        const html = `<p><b>${app}</b></p><p>درخواست شما در مدرسه «<b>${args.schoolName}</b>» رد شد.</p>${args.reason ? `<p>دلیل: ${args.reason}</p>` : ""}`;
        return { subject: `${app} - رد درخواست`, text, html };
      }
    }
  }

  private normalizeEmail(email: string) {
    return email?.trim()?.toLowerCase();
  }

  private normalizeMobile(mobile: string) {
    return mobile?.trim();
  }
}
