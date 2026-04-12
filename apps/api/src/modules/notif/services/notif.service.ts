import { BadRequestException, Injectable } from "@nestjs/common";
import { TSendEmailArgs, TSendSmsArgs } from "@notif/types/notif.types";
import { ServiceUnavailableException } from "@nestjs/common";
import { NotificationResultEntity } from "@notif/entities/notif-result.entity";
import { NotificationErrorCode } from "@notif/enums/notif-error-code.enum";
import { NotificationTemplate } from "@notif/enums/notif-template.enum";
import { NotificationChannel } from "@notif/enums/notif-channel.enum";
import { TNotifyTemplateArgs } from "@notif/types/notif.types";
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

    if (!to) {
      throw new BadRequestException({
        code: NotificationErrorCode.INVALID_DESTINATION,
      });
    }

    const sender = args.sender ?? this.kavenegarSender;

    if (!sender) {
      throw new ServiceUnavailableException({
        code: NotificationErrorCode.PROVIDER_NOT_CONFIGURED,
        message: "KAVENEGAR_SENDER environment variable is missing",
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
        timeout: 12000,
      });

      const data = resp.data;
      const status = data?.return?.status;

      if (status !== 200) {
        return {
          message: NotificationMessage.FAILED,
          channel: NotificationChannel.SMS,
          destination: to,
          errorCode: NotificationErrorCode.KAVENEGAR_ERROR,
          errorMessage:
            data?.return?.message ?? "Kavenegar provider returned an error",
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
        errorMessage: e?.message ?? "Unexpected SMS provider error",
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

    if (!to) {
      throw new BadRequestException({
        code: NotificationErrorCode.INVALID_DESTINATION,
      });
    }

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
        errorMessage: e?.message ?? "SMTP provider error",
      };
    }
  }

  private createTransport() {
    const secure = this.mailPort === 465;

    return nodemailer.createTransport({
      host: this.mailHost,
      port: this.mailPort,
      secure,
      auth: {
        user: this.mailUser,
        pass: this.mailPass,
      },
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
        const text =
          `${app}\n` +
          `Your login verification code is: ${args.otpCode}\n` +
          `If you did not request this code, please ignore this message.`;

        const html =
          `<p><strong>${app}</strong></p>` +
          `<p>Your login verification code is: <strong>${args.otpCode}</strong></p>` +
          `<p>If you did not request this code, please ignore this message.</p>`;

        return {
          subject: `${app} - Login Verification Code`,
          text,
          html,
        };
      }

      case NotificationTemplate.ADMIN_CREDENTIALS: {
        const loginUrl = this.baseUrl ? `${this.baseUrl}/auth/login` : "";

        const text =
          `${app}\n` +
          `A school administrator account has been created for you.\n` +
          `School: ${args.schoolName}\n` +
          `Username: ${args.username}\n` +
          `Password: ${args.password}\n` +
          (loginUrl ? `Login: ${loginUrl}\n` : "") +
          `For security reasons, please change your password after logging in.`;

        const html =
          `<p><strong>${app}</strong></p>` +
          `<p>A school administrator account has been created for you.</p>` +
          `<p>School: <strong>${args.schoolName}</strong></p>` +
          `<p>Username: <strong>${args.username}</strong></p>` +
          `<p>Password: <strong>${args.password}</strong></p>` +
          (loginUrl
            ? `<p><a href="${loginUrl}">Login to the dashboard</a></p>`
            : "") +
          `<p>Please change your password after your first login.</p>`;

        return {
          subject: `${app} - Administrator Account Credentials`,
          text,
          html,
        };
      }

      case NotificationTemplate.ACCESS_REQUEST_APPROVED: {
        const text =
          `${app}\n` +
          `Your access request for the school "${args.schoolName}" has been approved.\n` +
          `Assigned role: ${args.roleTitle}\n` +
          `You can now log in to the system.`;

        const html =
          `<p><strong>${app}</strong></p>` +
          `<p>Your access request for the school "<strong>${args.schoolName}</strong>" has been approved.</p>` +
          `<p>Assigned role: <strong>${args.roleTitle}</strong></p>` +
          `<p>You can now log in to the system.</p>`;

        return {
          subject: `${app} - Access Request Approved`,
          text,
          html,
        };
      }

      case NotificationTemplate.ACCESS_REQUEST_REJECTED: {
        const reasonLine = args.reason ? `\nReason: ${args.reason}` : "";

        const text =
          `${app}\n` +
          `Your access request for the school "${args.schoolName}" has been rejected.` +
          reasonLine;

        const html =
          `<p><strong>${app}</strong></p>` +
          `<p>Your access request for the school "<strong>${args.schoolName}</strong>" has been rejected.</p>` +
          (args.reason ? `<p>Reason: ${args.reason}</p>` : "");

        return {
          subject: `${app} - Access Request Rejected`,
          text,
          html,
        };
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
