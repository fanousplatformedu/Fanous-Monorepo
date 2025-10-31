import { Injectable } from "@nestjs/common";

@Injectable()
export class SmsProvider {
  async send(toPhone: string, text: string) {
    // TODO: اتصال به درگاه پیامک
    return {
      messageId: `sms-${Date.now()}`,
      toPhone,
      length: text?.length ?? 0,
    };
  }
}
