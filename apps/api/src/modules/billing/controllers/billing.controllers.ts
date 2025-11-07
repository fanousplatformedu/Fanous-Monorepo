import { Body, Controller, Headers, HttpCode, Post, Req } from "@nestjs/common";
import { BillingService } from "@billing/services/billing.service";

@Controller("webhooks/billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, string>,
    @Req() req: any
  ) {
    await this.billingService.applyPaymentWebhook(body);
    return { ok: true };
  }
}
