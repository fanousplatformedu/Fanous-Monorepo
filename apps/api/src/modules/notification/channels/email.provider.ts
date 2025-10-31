import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailProvider {
  async send(toEmail: string, subject: string, bodyHtmlOrText: string) {
    // TODO: اتصال واقعی به SendGrid/SMTP
    return {
      messageId: `dev-${Date.now()}`,
      toEmail,
      subject,
      size: bodyHtmlOrText?.length ?? 0,
    };
  }
}
