import { Injectable } from "@nestjs/common";

@Injectable()
export class PushProvider {
  async send(toUserId: string, title: string, body: string) {
    // TODO: اتصال به FCM/APNs/OneSignal
    return { messageId: `push-${Date.now()}`, toUserId, title };
  }
}
