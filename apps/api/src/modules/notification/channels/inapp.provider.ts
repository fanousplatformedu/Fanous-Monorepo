import { Injectable } from "@nestjs/common";

@Injectable()
export class InAppProvider {
  async send(toUserId: string, payload: any) {
    // برای IN_APP صرفاً ذخیرهٔ Notification در DB کافی‌ست؛ این متد جهت استانداردسازی mock است.
    return { stored: true, toUserId, payload };
  }
}
